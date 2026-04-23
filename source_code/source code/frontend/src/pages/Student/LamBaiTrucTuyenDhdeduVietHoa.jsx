// src/pages/Student/LamBaiTrucTuyenDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const LamBaiTrucTuyenDhdeduVietHoa = () => {
  const [searchParams]   = useSearchParams();
  const examId           = searchParams.get('examId');

  const [examData,      setExamData]      = useState(null);    // { exam, submission }
  const [answers,       setAnswers]       = useState({});      // { questionId: optionIndex }
  const [phase,         setPhase]         = useState('loading'); // loading | preview | taking | submitted | error
  const [timeLeft,      setTimeLeft]      = useState(0);       // seconds
  const [submitting,    setSubmitting]    = useState(false);
  const [userId,        setUserId]        = useState(null);
  const [error,         setError]         = useState(null);
  const timerRef        = useRef(null);

  // Load exam + existing submission
  useEffect(() => {
    if (!examId) { setPhase('error'); setError('Không tìm thấy ID kỳ thi'); return; }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setPhase('error'); setError('Bạn chưa đăng nhập'); return; }
      setUserId(user.id);

      const { data, error: err } = await studentService.getExamDetail(examId, user.id);
      if (err) { setPhase('error'); setError(err); return; }

      setExamData(data);

      if (data.submission?.status === 'SUBMITTED') {
        setPhase('submitted');
      } else if (data.submission?.status === 'IN_PROGRESS') {
        const elapsed = data.submission.time_spent ?? 0;
        setTimeLeft(Math.max(0, data.exam.duration * 60 - elapsed));
        if (data.submission.answers) setAnswers(data.submission.answers);
        setPhase('taking');
      } else {
        setPhase('preview');
      }
    }
    load();
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'taking') return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleStart = async () => {
    const { error: err } = await studentService.startExam(examId, userId);
    if (err) { setError(err); return; }
    setTimeLeft(examData.exam.duration * 60);
    setPhase('taking');
  };

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: String(optionId) }));
  };

  const calcScore = useCallback(() => {
    const questions = examData?.exam?.questions ?? [];
    let correct = 0;
    let total   = 0;
    questions.forEach(q => {
      if (q.type === 'MCQ') {
        total++;
        if (answers[q.id] === q.correct_answer) correct++;
      }
    });
    return total > 0 ? parseFloat(((correct / total) * 10).toFixed(1)) : 0;
  }, [answers, examData]);

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const score     = calcScore();
    const duration  = examData?.exam?.duration ?? 0;
    const timeSpent = duration * 60 - timeLeft;

    const { error: err } = await studentService.submitExam(examId, userId, answers, score, timeSpent);
    if (err) { setError(String(err)); setSubmitting(false); return; }

    setExamData(prev => ({ ...prev, submission: { ...prev?.submission, status: 'SUBMITTED', score } }));
    setPhase('submitted');
    setSubmitting(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const exam       = examData?.exam;
  const submission = examData?.submission;
  const questions  = exam?.questions ?? [];
  const answered   = Object.keys(answers).length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64 min-h-screen p-8">
        <StudentHeader />

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <div className="max-w-3xl mx-auto space-y-4 mt-4">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <div className="max-w-lg mx-auto mt-16 text-center">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">error</span>
            <h2 className="text-xl font-bold text-on-surface mb-2">Đã xảy ra lỗi</h2>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}

        {/* ── Preview ── */}
        {phase === 'preview' && exam && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h1 className="text-2xl font-black text-on-surface mb-2">{exam.title}</h1>
              <p className="text-slate-500 text-sm mb-6">
                {exam.courses?.name} · {exam.classes?.name}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Thời gian', value: `${exam.duration} phút`, icon: 'timer' },
                  { label: 'Số câu hỏi', value: `${questions.length} câu`, icon: 'quiz' },
                  { label: 'Bắt đầu', value: exam.start_time ? new Date(exam.start_time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—', icon: 'event' },
                  { label: 'Trộn câu', value: exam.shuffle_questions ? 'Có' : 'Không', icon: 'shuffle' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <span className="material-symbols-outlined text-primary">{c.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400">{c.label}</p>
                      <p className="font-bold text-sm text-on-surface">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleStart}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        )}

        {/* ── Taking exam ── */}
        {phase === 'taking' && exam && (
          <div className="max-w-3xl mx-auto">
            {/* Timer bar */}
            <div className={`sticky top-4 z-10 flex items-center justify-between p-4 rounded-2xl shadow-md mb-6 ${
              timeLeft < 300 ? 'bg-red-600 text-white' : 'bg-primary text-white'
            }`}>
              <div>
                <p className="text-xs opacity-80 font-medium">{exam.title}</p>
                <p className="font-bold text-sm">{answered}/{questions.length} câu đã trả lời</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">timer</span>
                <span className="text-xl font-black font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="font-semibold text-sm mb-4">
                    <span className="text-primary font-black mr-2">Câu {idx + 1}.</span>
                    {q.content}
                  </p>
                  {q.type === 'MCQ' && Array.isArray(q.options) && (
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        const selected = answers[q.id] === String(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleAnswer(q.id, opt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm ${
                              selected
                                ? 'border-primary bg-primary/5 font-semibold text-primary'
                                : 'border-slate-100 hover:border-primary/30 text-on-surface'
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(64 + opt.id)}.</span>
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {q.type === 'ESSAY' && (
                    <textarea
                      rows={4}
                      value={answers[q.id] ?? ''}
                      onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        )}

        {/* ── Submitted ── */}
        {phase === 'submitted' && (
          <div className="max-w-lg mx-auto mt-16 text-center">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-black text-on-surface mb-2">Đã nộp bài!</h2>
              <p className="text-slate-500 text-sm mb-6">{exam?.title}</p>
              {submission?.score !== null && (
                <div className="p-4 bg-primary/5 rounded-2xl mb-6">
                  <p className="text-xs text-slate-400 mb-1">Điểm của bạn</p>
                  <p className="text-4xl font-black text-primary">{submission?.score ?? calcScore()}<span className="text-lg text-slate-400">/10</span></p>
                </div>
              )}
              <a href="/student/history-chi-tietstudent" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                Xem lịch sử làm bài
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LamBaiTrucTuyenDhdeduVietHoa;
