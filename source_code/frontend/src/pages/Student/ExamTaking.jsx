// src/pages/Student/ExamTaking.jsx
/**
 * FILE: ExamTaking.jsx
 * MÔ TẢ: Giao diện làm bài thi trực tuyến dành cho Sinh viên.
 * CHỨC NĂNG: Hiển thị câu hỏi, quản lý thời gian, chống gian lận (tab switch), tự động lưu bài và nộp bài kèm ảnh tự luận.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import { examsService, questionsService, submissionsService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { ErrorBanner, Sk, Input, Btn } from '../../components/ui';

// ── LocalStorage helpers ──────────────────────────────────────
const LS_KEY = (examId) => `exam_answers_${examId}`;
const saveToLS = (examId, answers) => {
  try { localStorage.setItem(LS_KEY(examId), JSON.stringify(answers)); } catch {}
};
const loadFromLS = (examId) => {
  try {
    const raw = localStorage.getItem(LS_KEY(examId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
const clearLS = (examId) => {
  try { localStorage.removeItem(LS_KEY(examId)); } catch {}
};

// ── Exam Password Gate ────────────────────────────────────────
const PasswordGate = ({ onPass }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (!pw.trim()) { setErr('Vui lòng nhập mật khẩu phòng thi.'); return; }
    onPass(pw.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-orange-600 text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Phòng thi có mật khẩu</h2>
        <p className="text-slate-500 text-sm mb-6">Nhập mật khẩu do giảng viên cung cấp để vào phòng thi.</p>
        {err && <p className="text-sm text-red-600 mb-4">{err}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="password" placeholder="Mật khẩu phòng thi" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
          <Btn type="submit" className="w-full">Vào phòng thi</Btn>
        </form>
      </div>
    </div>
  );
};

// ── Tab switch warning overlay ────────────────────────────────
const TabSwitchWarning = ({ count, onDismiss }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Cảnh báo!</h2>
      <p className="text-slate-600 text-sm mb-2">Bạn đã rời khỏi tab thi. Hành động này bị ghi lại.</p>
      <p className="text-slate-400 text-xs mb-6">Số lần thoát tab: <span className="font-black text-red-600">{count}</span></p>
      <Btn onClick={onDismiss} className="w-full">Tiếp tục làm bài</Btn>
    </div>
  </div>
);

// ── Hàm hỗ trợ parse mảng options an toàn ─────────────────────
const getOptionsArray = (opts) => {
  if (Array.isArray(opts)) return opts;
  if (typeof opts === 'string') {
    try { return JSON.parse(opts); } catch (e) { return []; }
  }
  return [];
};

// ── Main component ────────────────────────────────────────────
const ExamTaking = () => {
  const [params] = useSearchParams();
  const examId = params.get('id');
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(false);

  const timerRef = useRef(null);
  const answersRef = useRef({});

  useEffect(() => {
    if (submitted) return;
    const handleVisibility = () => {
      if (document.hidden) { setTabSwitches(n => n + 1); setShowWarning(true); }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [submitted]);

  useEffect(() => {
    const block = e => { if (!submitted) e.preventDefault(); };
    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
    };
  }, [submitted]);

  useEffect(() => {
    if (!examId || examId === 'undefined' || !profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [examRes, qRes] = await Promise.all([
        examsService.getById(examId),
        questionsService.getByExam(examId),
      ]);
      if (examRes.error || !examRes.data) {
        setError('Không tìm thấy đề thi. Vui lòng kiểm tra lại.');
        setLoading(false); return;
      }
      const e = examRes.data;
      const qs = qRes.data ?? [];
      const orderedQs = e.shuffle_questions ? [...qs].sort(() => Math.random() - 0.5) : qs;

      setExam(e);
      setQuestions(orderedQs);
      setTimeLeft((e.duration ?? 60) * 60);

      if (e.has_password && !passwordPassed) {
        setNeedsPassword(true); setLoading(false); return;
      }

      const { data: sub } = await submissionsService.startExam(examId, profile.id);
      // Khôi phục answers từ DB hoặc localStorage
      const lsAnswers = loadFromLS(examId);
      const dbAnswers = sub?.answers && Object.keys(sub.answers).length > 0 ? sub.answers : null;
      const restored = dbAnswers || lsAnswers || {};
      if (Object.keys(restored).length > 0) {
        setAnswers(restored); answersRef.current = restored;
      }
      if (sub?.status === 'SUBMITTED' || sub?.status === 'GRADED' || sub?.status === 'PENDING_ESSAY_GRADING') setSubmitted(true);
      setLoading(false);
    };
    load();
  }, [examId, profile?.id, passwordPassed]);

  useEffect(() => {
    if (timeLeft === null || submitted || loading) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted, loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!submitted && Object.keys(answersRef.current).length > 0 && examId && profile?.id) {
        submissionsService.saveProgress(examId, profile.id, answersRef.current);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [examId, profile?.id, submitted]);

  const fmtTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswer = (questionId, choice) => {
    const next = { ...answersRef.current, [questionId]: choice };
    answersRef.current = next; setAnswers(next);
    // Lưu vào localStorage chống mất dữ liệu
    if (examId) saveToLS(examId, next);
  };

  // ── Upload ảnh tự luận ────────────────────────────────────────
  const [essayImages, setEssayImages] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (questionId, file) => {
    if (!file || !examId || !profile?.id) return;
    setUploading(true);
    const path = `essay-images/${examId}/${profile.id}/${questionId}_${Date.now()}_${file.name}`;
    const { data, error: upErr } = await supabase.storage.from('materials').upload(path, file);
    if (!upErr && data?.path) {
      const { data: urlData } = supabase.storage.from('materials').getPublicUrl(data.path);
      const url = urlData?.publicUrl;
      if (url) {
        setEssayImages(prev => ({
          ...prev,
          [questionId]: [...(prev[questionId] || []), url]
        }));
      }
    }
    setUploading(false);
  };

  const handleSubmit = useCallback(async () => {
    if (submitted || submitting) return;
    clearTimeout(timerRef.current);
    setSubmitting(true);

    const { data, error: err } = await submissionsService.submitWithScore(examId, profile.id, answersRef.current, tabSwitches);
    if (err) { setError('Nộp bài thất bại. Vui lòng thử lại.'); setSubmitting(false); return; }

    // Xóa localStorage sau khi nộp thành công
    clearLS(examId);

    // Lưu ảnh tự luận (nếu có)
    if (Object.keys(essayImages).length > 0) {
      try {
        await supabase.from('submissions').update({ essay_images: essayImages }).eq('exam_id', examId).eq('student_id', profile.id);
      } catch {}
    }

    // GỬI THÔNG BÁO CHO GIÁO VIÊN
    try {
      if (exam?.course_id) {
        const { data: courseData } = await supabase.from('courses').select('teacher_id').eq('id', exam.course_id).single();
        if (courseData?.teacher_id) {
          await supabase.from('notifications').insert({
            user_id: courseData.teacher_id,
            title: data?.hasEssay ? '📝 Bài thi cần chấm tự luận' : '📝 Sinh viên nộp bài',
            message: `Sinh viên ${profile?.full_name || 'ẩn danh'} vừa nộp bài thi "${exam.title}".${data?.hasEssay ? ' Bài có phần tự luận cần chấm.' : ` Điểm: ${data?.mcqScore}`}`,
            type: 'SUBMISSION',
            action_url: `/teacher/essay-grading?examId=${exam.id}`,
            read_status: false
          });
        }
      }
    } catch (e) {
      console.error('Lỗi gửi thông báo cho GV', e);
    }

    setSubmitResult(data);
    setSubmitted(true);
    setSubmitting(false);
  }, [submitted, submitting, examId, profile, tabSwitches, exam, essayImages]);

  if (needsPassword && !passwordPassed) return <PasswordGate onPass={() => { setNeedsPassword(false); setPasswordPassed(true); }} />;
  if (!examId || examId === 'undefined') return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Mã đề thi không hợp lệ</div>;
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Sk className="h-64 w-full max-w-3xl" /></div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><ErrorBanner message={error} /></div>;

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${submitResult?.hasEssay ? 'bg-amber-100' : 'bg-green-100'}`}>
          <span className={`material-symbols-outlined text-4xl ${submitResult?.hasEssay ? 'text-amber-600' : 'text-green-600'}`}>
            {submitResult?.hasEssay ? 'pending' : 'task_alt'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Nộp bài thành công!</h2>
        <p className="text-slate-500 mb-6">
          {submitResult?.hasEssay
            ? 'Phần trắc nghiệm đã được chấm tự động. Phần tự luận sẽ được giảng viên chấm và thông báo kết quả.'
            : 'Bài thi đã được chấm điểm tự động.'}
        </p>
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Đề thi</span><span className="font-semibold">{exam?.title}</span></div>
          {submitResult?.totalMcq > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trắc nghiệm</span>
              <span className="font-bold text-primary">{submitResult.correctMcq}/{submitResult.totalMcq} câu đúng</span>
            </div>
          )}
          {submitResult?.mcqScore !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{submitResult?.hasEssay ? 'Điểm TN (tạm)' : 'Điểm số'}</span>
              <span className="text-2xl font-black text-primary">{submitResult.mcqScore}</span>
            </div>
          )}
          {submitResult?.hasEssay && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trạng thái</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">Chờ chấm tự luận</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" onClick={() => navigate('/student/history')} className="flex-1">Lịch sử bài thi</Btn>
          <Btn onClick={() => navigate('/student/dashboard')} className="flex-1">Về trang chủ</Btn>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isUrgent = timeLeft !== null && timeLeft < 300;

  // Lấy danh sách options một cách an toàn
  const optionsArray = getOptionsArray(q?.options);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      {showWarning && <TabSwitchWarning count={tabSwitches} onDismiss={() => setShowWarning(false)} />}

      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xl font-black"><span className="text-primary">DHD</span><span className="text-orange-500">edu</span></div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{exam?.title}</p>
              <p className="text-xs text-slate-400">{questions.length} câu · {exam?.duration} phút</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono font-bold text-lg ${isUrgent ? 'bg-red-50 text-red-600 animate-pulse border border-red-200' : 'bg-slate-100 text-slate-700'}`}>
              <span className="material-symbols-outlined text-base">{isUrgent ? 'timer_off' : 'timer'}</span>
              {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
            </div>
            <Btn onClick={handleSubmit} loading={submitting}>Nộp bài</Btn>
          </div>
        </div>
        <div className="h-1 bg-slate-100"><div className="h-1 bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} /></div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 gap-6 py-6">
        <main className="flex-1 min-w-0">
          {!q ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
              <span className="material-symbols-outlined text-slate-300 text-5xl">quiz</span>
              <p className="text-slate-500 mt-3">Đề thi này chưa có câu hỏi nào.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">Câu {current + 1} / {questions.length}</span>
                <span className="text-xs text-slate-400 font-medium">{q.points ?? 1} điểm</span>
              </div>
              <div className="px-8 py-6">
                <p className="text-base font-semibold text-slate-800 leading-relaxed mb-6">{q.content}</p>

                {/* SỬA LỖI Ở ĐÂY: Sử dụng mảng optionsArray đã được chuẩn hóa */}
                {q.type === 'MCQ' && (
                  <div className="space-y-3">
                    {optionsArray.map((choice, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const picked = answers[q.id] === choice;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(q.id, choice)}
                          className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-150 ${picked ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${picked ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{letter}</span>
                          <span className="text-sm leading-relaxed">{choice}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {q.type === 'ESSAY' && (
                  <div className="space-y-3">
                    <textarea
                      value={answers[q.id] ?? ''}
                      onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                    {/* Upload ảnh cho tự luận */}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-base">image</span>
                        Đính kèm ảnh
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(q.id, e.target.files[0])} />
                      </label>
                      {uploading && <span className="text-xs text-slate-400">Đang tải ảnh...</span>}
                    </div>
                    {/* Hiện ảnh đã upload */}
                    {essayImages[q.id]?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {essayImages[q.id].map((url, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                            <img src={url} alt={`Ảnh ${i+1}`} className="w-full h-full object-cover" />
                            <button onClick={() => setEssayImages(prev => ({ ...prev, [q.id]: prev[q.id].filter((_, j) => j !== i) }))} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="px-8 py-4 border-t border-slate-100 flex justify-between gap-3 bg-slate-50/30">
                <Btn variant="outline" icon="arrow_back" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>Câu trước</Btn>
                <span className="text-xs text-slate-400 self-center">{answeredCount} / {questions.length} câu đã trả lời</span>
                {current < questions.length - 1 ? (
                  <Btn iconRight="arrow_forward" onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}>Câu tiếp</Btn>
                ) : (
                  <Btn variant="success" onClick={handleSubmit} loading={submitting} icon="task_alt">Nộp bài</Btn>
                )}
              </div>
            </div>
          )}
        </main>

        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-28">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách câu hỏi</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx} onClick={() => setCurrent(idx)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${idx === current ? 'bg-primary text-white ring-2 ring-primary/30' : !!answers[questions[idx]?.id] ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >{idx + 1}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExamTaking;