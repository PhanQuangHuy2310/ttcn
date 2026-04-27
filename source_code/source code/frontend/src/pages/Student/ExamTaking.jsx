// src/pages/Student/ExamTaking.jsx
// Replaces LamBaiTrucTuyenSinhVien + LamBaiTrucTuyenDhdeduVietHoa (both hardcoded).
// Loads real questions from DB, saves answers to submissions table.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import { examsService, questionsService, submissionsService } from '../../services/supabaseService';
import { ErrorBanner, Sk } from '../../components/ui';

const ExamTaking = () => {
  const [params]   = useSearchParams();
  const examId     = params.get('id');
  const profile    = useSelector(selectProfile);
  const navigate   = useNavigate();

  const [exam,       setExam]       = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [answers,    setAnswers]    = useState({});     // { questionId: selectedOption }
  const [current,    setCurrent]    = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(null);  // seconds
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState(null);
  const timerRef = useRef(null);

  // ── Load exam + questions ────────────────────────────────
  useEffect(() => {
    if (!examId || !profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [examRes, qRes] = await Promise.all([
        examsService.getById(examId),
        questionsService.getByExam(examId),
      ]);
      if (examRes.error || !examRes.data) {
        setError('Không tìm thấy đề thi. Vui lòng kiểm tra lại.');
        setLoading(false);
        return;
      }
      const e  = examRes.data;
      const qs = qRes.data ?? [];
      setExam(e);
      setQuestions(qs);
      setTimeLeft((e.duration ?? 60) * 60);

      // Check existing submission
      const { data: sub } = await submissionsService.upsert({
        exam_id:    examId,
        student_id: profile.id,
        status:     'IN_PROGRESS',
        started_at: new Date().toISOString(),
      });
      if (sub?.answers) setAnswers(sub.answers);
      if (sub?.status === 'SUBMITTED') setSubmitted(true);

      setLoading(false);
    };
    load();
  }, [examId, profile?.id]);

  // ── Countdown timer ──────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted]);

  const fmtTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Auto-save answers every 30s ──────────────────────────
  const saveProgress = useCallback(async (currentAnswers) => {
    if (!examId || !profile?.id) return;
    await submissionsService.upsert({
      exam_id:    examId,
      student_id: profile.id,
      status:     'IN_PROGRESS',
      answers:    currentAnswers,
    });
  }, [examId, profile?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!submitted && Object.keys(answers).length > 0) saveProgress(answers);
    }, 30000);
    return () => clearInterval(interval);
  }, [answers, submitted, saveProgress]);

  // ── Select answer ────────────────────────────────────────
  const handleAnswer = (questionId, choice) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  };

  // ── Submit exam ──────────────────────────────────────────
  const handleSubmit = async () => {
    clearTimeout(timerRef.current);
    setSubmitting(true);

    // Auto-score MCQ
    let score = 0;
    const totalPoints = questions.reduce((a, q) => a + (q.points ?? 1), 0);
    questions.forEach(q => {
      if (q.type === 'MCQ' && answers[q.id] === q.correct_answer) {
        score += (q.points ?? 1);
      }
    });
    const finalScore = totalPoints > 0 ? parseFloat(((score / totalPoints) * 10).toFixed(2)) : null;

    const { error: err } = await submissionsService.upsert({
      exam_id:      examId,
      student_id:   profile.id,
      status:       'SUBMITTED',
      answers,
      score:        finalScore,
      submitted_at: new Date().toISOString(),
    });

    if (err) { setError('Nộp bài thất bại. Vui lòng thử lại.'); setSubmitting(false); return; }
    setSubmitted(true);
    setSubmitting(false);
  };

  // ─────────────────────────────────────────────────────────
  if (!examId) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-slate-300 text-6xl">quiz</span>
        <p className="text-slate-500 mt-4">Không tìm thấy mã đề thi.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-semibold hover:underline">Quay lại</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-3xl px-6 space-y-4">
        <Sk className="h-16 w-full" />
        <Sk className="h-64 w-full" />
        <Sk className="h-40 w-full" />
      </div>
    </div>
  );

  // ── Submitted result screen ──────────────────────────────
  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-600 text-4xl">task_alt</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Nộp bài thành công!</h2>
        <p className="text-slate-500 mb-6">Bài thi của bạn đã được ghi nhận. Kết quả sẽ được thông báo sau khi giảng viên chấm điểm.</p>
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Đề thi</span>
            <span className="font-semibold text-slate-800">{exam?.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Số câu đã trả lời</span>
            <span className="font-semibold text-slate-800">{Object.keys(answers).length} / {questions.length}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/student/history')}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Lịch sử bài thi
          </button>
          <button onClick={() => navigate('/student/dashboard')}
            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isUrgent = timeLeft !== null && timeLeft < 300; // < 5 minutes

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xl font-black">
              <span className="text-primary">DHD</span><span className="text-orange-500">edu</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{exam?.title}</p>
              <p className="text-xs text-slate-400">{questions.length} câu hỏi · {exam?.duration} phút</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
            isUrgent ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'
          }`}>
            <span className="material-symbols-outlined text-base">{isUrgent ? 'timer_off' : 'timer'}</span>
            {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2"
          >
            {submitting && <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>}
            {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 gap-6 py-6">
        {/* Question panel */}
        <main className="flex-1 min-w-0">
          {!q ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
              <span className="material-symbols-outlined text-slate-300 text-5xl">quiz</span>
              <p className="text-slate-500 mt-3">Đề thi này chưa có câu hỏi nào.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Question header */}
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                  Câu {current + 1} / {questions.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">{q.points ?? 1} điểm</span>
              </div>

              {/* Question content */}
              <div className="px-8 py-6">
                <p className="text-base font-semibold text-slate-800 leading-relaxed mb-6">{q.content}</p>

                {/* MCQ choices */}
                {q.type === 'MCQ' && (
                  <div className="space-y-3">
                    {(q.choices ?? []).map((choice, idx) => {
                      const letter  = String.fromCharCode(65 + idx);
                      const picked  = answers[q.id] === choice;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(q.id, choice)}
                          className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-150 ${
                            picked
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                            picked ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                          }`}>{letter}</span>
                          <span className="text-sm leading-relaxed">{choice}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay */}
                {q.type === 'ESSAY' && (
                  <textarea
                    value={answers[q.id] ?? ''}
                    onChange={e => handleAnswer(q.id, e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                )}

                {/* True/False */}
                {q.type === 'TRUE_FALSE' && (
                  <div className="flex gap-4">
                    {['Đúng', 'Sai'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, opt)}
                        className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                          answers[q.id] === opt
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >{opt}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nav */}
              <div className="px-8 py-4 border-t border-slate-100 flex justify-between gap-3">
                <button
                  onClick={() => setCurrent(c => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Câu trước
                </button>
                <span className="text-xs text-slate-400 self-center">
                  {answeredCount} / {questions.length} câu đã trả lời
                </span>
                <button
                  onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                  disabled={current === questions.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Câu tiếp
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Question navigator sidebar */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-28">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách câu hỏi</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, idx) => {
                const answered = !!answers[questions[idx]?.id];
                const isCurrent = idx === current;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-primary text-white ring-2 ring-primary/30'
                        : answered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >{idx + 1}</button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-4 h-4 bg-green-100 rounded inline-block" />
                Đã trả lời ({answeredCount})
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-4 h-4 bg-slate-100 rounded inline-block" />
                Chưa trả lời ({questions.length - answeredCount})
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExamTaking;
