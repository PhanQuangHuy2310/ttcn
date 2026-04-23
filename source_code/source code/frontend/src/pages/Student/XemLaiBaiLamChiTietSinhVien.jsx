// src/pages/Student/XemLaiBaiLamChiTietSinhVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const XemLaiBaiLamChiTietSinhVien = () => {
  const [sp]           = useSearchParams();
  const submissionId   = sp.get('submissionId');
  const examId         = sp.get('examId');

  const [submission,  setSubmission]  = useState(null);
  const [exam,        setExam]        = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    async function init() {
      try {
        let subData, examData;

        if (submissionId) {
          const { data } = await supabase
            .from('submissions')
            .select('*, exams(id, title, duration, start_time, courses(name, subject), classes(name))')
            .eq('id', submissionId)
            .single();
          subData  = data;
          examData = data?.exams;
        } else if (examId) {
          const { data: { user } } = await supabase.auth.getUser();
          const [sub, ex] = await Promise.all([
            supabase.from('submissions').select('*').eq('exam_id', examId).eq('student_id', user.id).maybeSingle(),
            supabase.from('exams').select('*, courses(name, subject), classes(name)').eq('id', examId).single(),
          ]);
          subData  = sub.data;
          examData = ex.data;
        }

        if (!examData) throw new Error('Không tìm thấy bài thi');
        setSubmission(subData);
        setExam(examData);

        const { data: qs } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', examData.id)
          .order('created_at');
        setQuestions(qs ?? []);
      } catch (err) {
        setError(err?.message ?? 'Lỗi tải dữ liệu');
      }
      setLoading(false);
    }
    init();
  }, [submissionId, examId]);

  const answers    = submission?.answers ?? {};
  const fmtDate    = (iso) => iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const fmtTime    = (secs) => secs ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` : '—';

  const mcqTotal   = questions.filter(q => q.type === 'MCQ').length;
  const mcqCorrect = questions.filter(q => q.type === 'MCQ' && answers[q.id] === q.correct_answer).length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="flex min-h-screen">
        <StudentSidebar />
        <main className="flex-1 lg:ml-72 bg-surface min-h-screen pb-24">

          {/* Top banner */}
          <div className="bg-white px-8 py-10 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Hệ thống DHDedu
                  </span>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">
                      {exam?.title ?? '—'}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-tertiary">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base" data-icon="schedule">schedule</span>
                        {exam?.duration} phút
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">school</span>
                        {exam?.classes?.name ?? '—'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">event</span>
                        {fmtDate(submission?.submitted_at)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Score card */}
              {!loading && submission?.score !== null && (
                <div className="bg-gradient-to-br from-primary to-primary-container text-white p-5 rounded-2xl text-center shadow-lg shadow-primary/20 min-w-[120px]">
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wide mb-1">Điểm số</p>
                  <p className="text-4xl font-black">{submission.score}</p>
                  <p className="text-xs opacity-70 mt-0.5">/10</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="max-w-4xl mx-auto px-8 py-6">
            {loading ? (
              <div className="grid grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Đúng / Tổng',     value: `${mcqCorrect}/${mcqTotal}`,          icon: 'check_circle' },
                  { label: 'Tỷ lệ đúng',       value: mcqTotal > 0 ? `${Math.round(mcqCorrect / mcqTotal * 100)}%` : '—', icon: 'percent' },
                  { label: 'Thời gian làm',    value: fmtTime(submission?.time_spent),       icon: 'timer'        },
                  { label: 'Điểm',             value: submission?.score !== null ? `${submission.score}/10` : '—', icon: 'grade' },
                ].map((c, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">{c.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400">{c.label}</p>
                      <p className="font-black text-on-surface">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

            {/* Question review */}
            <h2 className="font-bold text-lg mb-4">Xem lại từng câu</h2>
            {loading ? (
              <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
            ) : questions.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl text-center text-slate-400">Không có câu hỏi</div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const studentAns = answers[q.id];
                  const isCorrect  = q.type === 'MCQ' && studentAns === q.correct_answer;
                  const hasAnswer  = !!studentAns;

                  return (
                    <div key={q.id} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${
                      q.type === 'MCQ'
                        ? isCorrect ? 'border-green-400' : hasAnswer ? 'border-red-300' : 'border-slate-200'
                        : 'border-blue-200'
                    }`}>
                      <div className="flex items-start gap-3 mb-4">
                        {q.type === 'MCQ' && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isCorrect ? 'bg-green-100' : hasAnswer ? 'bg-red-50' : 'bg-slate-100'
                          }`}>
                            <span className={`material-symbols-outlined text-sm ${
                              isCorrect ? 'text-green-600' : hasAnswer ? 'text-red-400' : 'text-slate-400'
                            }`}>
                              {isCorrect ? 'check' : hasAnswer ? 'close' : 'remove'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-on-surface">
                            <span className="text-primary font-black mr-1">Câu {idx + 1}.</span>
                            {q.content}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{q.points} điểm</span>
                      </div>

                      {q.type === 'MCQ' && Array.isArray(q.options) && (
                        <div className="space-y-2 ml-9">
                          {q.options.map(opt => {
                            const isStudentChoice = String(opt.id) === studentAns;
                            const isCorrectOpt    = String(opt.id) === q.correct_answer;
                            let cls = 'text-slate-500';
                            if (isCorrectOpt)                       cls = 'bg-green-50 text-green-700 font-semibold';
                            else if (isStudentChoice && !isCorrectOpt) cls = 'bg-red-50 text-red-600 line-through';
                            return (
                              <div key={opt.id} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${cls}`}>
                                {isCorrectOpt   && <span className="material-symbols-outlined text-green-500 text-sm shrink-0">check_circle</span>}
                                {isStudentChoice && !isCorrectOpt && <span className="material-symbols-outlined text-red-400 text-sm shrink-0">cancel</span>}
                                <span className="font-bold mr-1">{String.fromCharCode(64 + opt.id)}.</span>
                                {opt.text}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'ESSAY' && (
                        <div className="ml-9 mt-2">
                          <p className="text-xs font-semibold text-slate-400 mb-1">Bài làm của bạn:</p>
                          <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                            {studentAns ?? <span className="italic text-slate-300">Không có câu trả lời</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default XemLaiBaiLamChiTietSinhVien;
