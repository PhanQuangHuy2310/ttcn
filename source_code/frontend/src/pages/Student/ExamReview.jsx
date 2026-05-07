// src/pages/Student/ExamReview.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, ErrorBanner, Sk, PageHeader, fmtDateTime } from '../../components/ui';
import { examsService, questionsService, submissionsService } from '../../services/supabaseService';

// ── Hàm hỗ trợ parse mảng options an toàn chống sập màn hình ──────────
const getOptionsArray = (opts) => {
  if (Array.isArray(opts)) return opts;
  if (typeof opts === 'string') {
    try {
      const parsed = JSON.parse(opts);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
  }
  return [];
};

const ExamReview = () => {
  const [params] = useSearchParams();
  const examId = params.get('id');
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!examId || !profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [examRes, qRes, subRes] = await Promise.all([
        examsService.getById(examId),
        questionsService.getByExam(examId),
        submissionsService.getByStudent(profile.id),
      ]);
      setExam(examRes.data);
      setQuestions(qRes.data ?? []);
      setSubmission((subRes.data ?? []).find(s => s.exam_id === examId) ?? null);
      if (examRes.error) setError('Không tìm thấy đề thi.');
      setLoading(false);
    };
    load();
  }, [examId, profile?.id]);

  const answers = submission?.answers ?? {};

  if (!examId) return <AppLayout role="STUDENT"><ErrorBanner message="Không tìm thấy mã đề thi." /></AppLayout>;

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Xem lại bài làm"
        subtitle={exam?.title ?? ''}
        actions={<button onClick={() => navigate(-1)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">Quay lại</button>}
      />
      {error && <ErrorBanner message={error} />}

      {/* Hiển thị Điểm và Nhận xét của giáo viên */}
      {submission && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-3xl font-black text-primary">
                {submission.score !== null && submission.score !== undefined ? parseFloat(submission.score).toFixed(1) : '—'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-lg">Kết quả bài thi</p>
              <p className="text-sm text-slate-500">{exam?.title}</p>
              <p className="text-xs text-slate-400 mt-1">Nộp lúc: {fmtDateTime(submission.submitted_at)}</p>
            </div>
          </div>

          {/* Khung hiển thị nhận xét tự luận */}
          {submission.teacher_comment && (
            <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm">
              <p className="font-bold text-blue-800 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">rate_review</span>
                Nhận xét từ giảng viên:
              </p>
              <p className="text-blue-700 whitespace-pre-wrap leading-relaxed">{submission.teacher_comment}</p>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <Sk key={i} className="h-32 w-full" />)}</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const chosen = answers[q.id];
            const correct = q.correct_answer;
            const optionsArray = getOptionsArray(q.options); // Lấy mảng an toàn

            return (
              <Card key={q.id}>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Câu {idx + 1}</span>
                  <span className="text-xs text-slate-400">{q.points ?? 1} điểm</span>
                </div>
                <div className="px-6 py-5">
                  <p className="font-semibold text-slate-800 mb-4">{q.content}</p>

                  {/* SỬ DỤNG MẢNG AN TOÀN Ở ĐÂY */}
                  {q.type === 'MCQ' && (
                    <div className="space-y-2">
                      {optionsArray.map((choice, i) => {
                        const isChosen = choice === chosen;
                        const isCorrect = choice === correct;
                        return (
                          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isCorrect ? 'border-green-300 bg-green-50' : isChosen && !isCorrect ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCorrect ? 'bg-green-500 text-white' : isChosen && !isCorrect ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{String.fromCharCode(65 + i)}</span>
                            <span className="text-sm">{choice}</span>
                            {isCorrect && <span className="ml-auto text-xs text-green-600 font-bold">Đúng</span>}
                            {isChosen && !isCorrect && <span className="ml-auto text-xs text-red-500 font-bold">Sai</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Hiển thị bài làm tự luận */}
                  {q.type === 'ESSAY' && (
                    <div className="mt-2">
                      {chosen ? (
                        <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-200 whitespace-pre-wrap leading-relaxed">
                          {chosen}
                        </div>
                      ) : (
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-600 text-sm italic">
                          Bạn đã không trả lời câu hỏi này.
                        </div>
                      )}
                    </div>
                  )}

                  {q.type !== 'ESSAY' && !chosen && <p className="text-sm text-slate-400 italic">Không có câu trả lời</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default ExamReview;