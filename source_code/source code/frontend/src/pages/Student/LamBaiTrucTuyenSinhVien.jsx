// src/pages/Student/LamBaiTrucTuyenSinhVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Variant of LamBaiTrucTuyenDhdeduVietHoa with different layout (ml-80 + pt-16)
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const LamBaiTrucTuyenSinhVien = () => {
  const [sp]       = useSearchParams();
  const examId     = sp.get('examId');
  const [examData, setExamData] = useState(null);
  const [answers,  setAnswers]  = useState({});
  const [phase,    setPhase]    = useState('loading');
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userId,   setUserId]   = useState(null);
  const timerRef   = useRef(null);

  useEffect(() => {
    if (!examId) { setPhase('error'); return; }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setPhase('error'); return; }
      setUserId(user.id);
      const { data, error } = await studentService.getExamDetail(examId, user.id);
      if (error) { setPhase('error'); return; }
      setExamData(data);
      if (data.submission?.status === 'SUBMITTED') setPhase('submitted');
      else if (data.submission?.status === 'IN_PROGRESS') {
        setTimeLeft(Math.max(0, data.exam.duration * 60 - (data.submission.time_spent ?? 0)));
        if (data.submission.answers) setAnswers(data.submission.answers);
        setPhase('taking');
      } else setPhase('preview');
    }
    load();
  }, [examId]);

  useEffect(() => {
    if (phase !== 'taking') return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleStart = async () => {
    await studentService.startExam(examId, userId);
    setTimeLeft(examData.exam.duration * 60);
    setPhase('taking');
  };

  const handleAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: String(val) }));

  const calcScore = () => {
    const qs = examData?.exam?.questions ?? [];
    let correct = 0, total = 0;
    qs.forEach(q => { if (q.type === 'MCQ') { total++; if (answers[q.id] === q.correct_answer) correct++; } });
    return total > 0 ? parseFloat(((correct / total) * 10).toFixed(1)) : 0;
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    const score     = calcScore();
    const timeSpent = (examData?.exam?.duration ?? 0) * 60 - timeLeft;
    await studentService.submitExam(examId, userId, answers, score, timeSpent);
    setPhase('submitted');
    setSubmitting(false);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const exam = examData?.exam;
  const questions = exam?.questions ?? [];
  const answered  = Object.keys(answers).length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentHeader />
      <StudentSidebar />
      <main className="ml-80 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto p-8 lg:p-12">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">

            {/* Phase: loading */}
            {phase === 'loading' && (
              <div className="p-10 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-40 rounded-2xl" />
              </div>
            )}

            {/* Phase: error */}
            {phase === 'error' && (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3">error</span>
                <p>Không thể tải đề thi. Vui lòng thử lại.</p>
              </div>
            )}

            {/* Phase: preview */}
            {phase === 'preview' && exam && (
              <div className="bg-slate-50 p-8 border-b border-slate-100">
                <h1 className="text-2xl font-black text-on-surface mb-2">{exam.title}</h1>
                <p className="text-slate-500 text-sm mb-6">{exam.courses?.name} · {exam.classes?.name}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Số câu', value: `${questions.length} câu`, icon: 'quiz' },
                    { label: 'Thời gian', value: `${exam.duration} phút`, icon: 'timer' },
                    { label: 'Bắt đầu', value: exam.start_time ? new Date(exam.start_time).toLocaleDateString('vi-VN') : 'Ngay bây giờ', icon: 'event' },
                    { label: 'Trộn câu', value: exam.shuffle_questions ? 'Có' : 'Không', icon: 'shuffle' },
                  ].map((c, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                      <span className="material-symbols-outlined text-primary">{c.icon}</span>
                      <div>
                        <p className="text-xs text-slate-400">{c.label}</p>
                        <p className="font-bold text-sm">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleStart}
                  className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Bắt đầu làm bài
                </button>
              </div>
            )}

            {/* Phase: taking */}
            {phase === 'taking' && exam && (
              <>
                {/* Timer bar */}
                <div className={`flex items-center justify-between px-8 py-4 border-b ${timeLeft < 300 ? 'bg-red-600 text-white' : 'bg-slate-50'}`}>
                  <div>
                    <p className="font-bold text-sm">{exam.title}</p>
                    <p className="text-xs opacity-70">{answered}/{questions.length} câu đã trả lời</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">timer</span>
                    <span className="text-xl font-black font-mono">{fmt(timeLeft)}</span>
                  </div>
                </div>
                <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                  {questions.map((q, i) => (
                    <div key={q.id} className="border border-slate-100 rounded-2xl p-5">
                      <p className="font-semibold text-sm mb-4">
                        <span className="text-primary font-black mr-2">Câu {i + 1}.</span>{q.content}
                      </p>
                      {q.type === 'MCQ' && Array.isArray(q.options) && (
                        <div className="space-y-2">
                          {q.options.map(opt => {
                            const sel = answers[q.id] === String(opt.id);
                            return (
                              <button key={opt.id} onClick={() => handleAnswer(q.id, opt.id)}
                                className={`w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all ${sel ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-slate-100 hover:border-primary/30'}`}>
                                <span className="font-bold mr-2">{String.fromCharCode(64 + opt.id)}.</span>{opt.text}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {q.type === 'ESSAY' && (
                        <textarea rows={4} value={answers[q.id] ?? ''} onChange={e => handleAnswer(q.id, e.target.value)}
                          placeholder="Nhập câu trả lời..." className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end">
                  <button onClick={() => handleSubmit(false)} disabled={submitting}
                    className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-60">
                    {submitting ? 'Đang nộp...' : 'Nộp bài'}
                  </button>
                </div>
              </>
            )}

            {/* Phase: submitted */}
            {phase === 'submitted' && (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                </div>
                <h2 className="text-2xl font-black mb-2">Đã nộp bài!</h2>
                <p className="text-slate-400 text-sm mb-6">{exam?.title}</p>
                {examData?.submission?.score !== null && (
                  <div className="p-5 bg-primary/5 rounded-2xl mb-6">
                    <p className="text-xs text-slate-400 mb-1">Điểm của bạn</p>
                    <p className="text-4xl font-black text-primary">
                      {examData?.submission?.score ?? calcScore()}<span className="text-lg text-slate-400">/10</span>
                    </p>
                  </div>
                )}
                <a href="/student/history-chi-tietstudent"
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90">
                  Xem lịch sử làm bài
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LamBaiTrucTuyenSinhVien;
