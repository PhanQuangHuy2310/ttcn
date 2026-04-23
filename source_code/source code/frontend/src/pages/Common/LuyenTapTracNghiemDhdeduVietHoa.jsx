// src/pages/Common/LuyenTapTracNghiemDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same logic as Student/LuyenTapTracNghiemSinhVien but with CommonSidebar/Header
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const LuyenTapTracNghiemDhdeduVietHoa = () => {
  const [sp]       = useSearchParams();
  const examId     = sp.get('examId');
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [revealed,  setRevealed]  = useState({});
  const [currentIdx,setCurrentIdx]= useState(0);
  const [timeLeft,  setTimeLeft]  = useState(30 * 60);
  const [phase,     setPhase]     = useState('practice');
  const [score,     setScore]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      if (examId) {
        const { data } = await supabase.from('exams').select('*, questions(id, content, type, options, correct_answer, points)').eq('id', examId).single();
        if (data) { setQuestions((data.questions ?? []).filter(q => q.type === 'MCQ')); setTimeLeft(data.duration * 60); }
      } else {
        const { data: myC } = await studentService.getMyClasses(user.id);
        const cids = (myC ?? []).map(sc => sc.classes?.id).filter(Boolean);
        if (cids.length) {
          const { data: qs } = await supabase.from('questions').select('id, content, type, options, correct_answer, points, exams!inner(class_id)').eq('type', 'MCQ').in('exams.class_id', cids).limit(20);
          setQuestions(qs ?? []);
        }
      }
      setLoading(false);
    }
    init();
  }, [examId]);

  useEffect(() => {
    if (loading || phase !== 'practice' || timeLeft <= 0) return;
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); finish(); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, phase]);

  const handleAnswer  = (qId, optId) => { if (!revealed[qId]) setAnswers(p => ({ ...p, [qId]: String(optId) })); };
  const handleReveal  = (qId) => setRevealed(p => ({ ...p, [qId]: true }));
  const finish = () => {
    clearInterval(timerRef.current);
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_answer) correct++; });
    setScore(questions.length ? parseFloat(((correct / questions.length) * 10).toFixed(1)) : 0);
    setPhase('result');
  };
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const current = questions[currentIdx];
  const answered = Object.keys(answers).length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonHeader />
      <CommonSidebar />
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                <Skeleton className="h-6 w-32 mb-6" />
                <Skeleton className="h-8 w-full mb-4" />
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              </div>
            ) : phase === 'result' ? (
              <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">emoji_events</span>
                </div>
                <h2 className="text-2xl font-black mb-2">Hoàn thành luyện tập!</h2>
                <p className="text-slate-500 mb-4">{questions.filter(q => answers[q.id] === q.correct_answer).length}/{questions.length} câu đúng</p>
                <div className="text-5xl font-black text-primary mb-6">{score}<span className="text-lg text-slate-400">/10</span></div>
                <button onClick={() => { setAnswers({}); setRevealed({}); setCurrentIdx(0); setPhase('practice'); setTimeLeft(30 * 60); }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90">Luyện tập lại</button>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-sm text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
                <p>Không tìm thấy câu hỏi luyện tập</p>
              </div>
            ) : current && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/15">
                <div className="flex justify-between items-center mb-8">
                  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-xs font-bold rounded-full uppercase tracking-wider">
                    CÂU HỎI {currentIdx + 1} / {questions.length}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span className={`material-symbols-outlined text-lg ${timeLeft < 300 ? 'text-red-500' : ''}`}>timer</span>
                    <span className={`font-bold font-mono ${timeLeft < 300 ? 'text-red-500' : ''}`}>{fmt(timeLeft)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                  <div className="h-1.5 bg-primary rounded-full" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
                </div>
                <h1 className="font-headline text-xl font-bold text-on-surface mb-8 leading-relaxed">{current.content}</h1>
                {Array.isArray(current.options) && (
                  <div className="space-y-3">
                    {current.options.map(opt => {
                      const isSel  = answers[current.id] === String(opt.id);
                      const isCorr = String(opt.id) === current.correct_answer;
                      const isRev  = revealed[current.id];
                      let cls = 'border-outline-variant/20 bg-surface-container-low hover:border-primary/40';
                      if (isRev) { if (isCorr) cls = 'border-green-400 bg-green-50 text-green-800'; else if (isSel) cls = 'border-red-300 bg-red-50 text-red-700'; }
                      else if (isSel) cls = 'border-primary bg-primary/5 text-primary font-semibold';
                      return (
                        <button key={opt.id} onClick={() => handleAnswer(current.id, opt.id)} disabled={!!revealed[current.id]}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${cls}`}>
                          <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center shrink-0 text-xs font-bold">{String.fromCharCode(64 + opt.id)}</span>
                          <span className="text-sm">{opt.text}</span>
                          {isRev && isCorr && <span className="material-symbols-outlined text-green-500 ml-auto shrink-0">check_circle</span>}
                          {isRev && isSel && !isCorr && <span className="material-symbols-outlined text-red-400 ml-auto shrink-0">cancel</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex gap-3 mt-8">
                  {answers[current.id] && !revealed[current.id] && (
                    <button onClick={() => handleReveal(current.id)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200">Kiểm tra đáp án</button>
                  )}
                  <button onClick={() => setCurrentIdx(i => Math.min(i + 1, questions.length - 1))} disabled={currentIdx >= questions.length - 1}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 ml-auto">
                    Câu tiếp theo →
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Right panel */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/15">
              <h3 className="font-bold text-sm mb-4">Tiến trình</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Đã trả lời</span><span className="font-bold">{answered}/{questions.length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Đúng</span><span className="font-bold text-green-600">{questions.filter(q => answers[q.id] === q.correct_answer && revealed[q.id]).length}</span></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/15">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, i) => {
                  const isAns = !!answers[q.id], isRev = !!revealed[q.id], isCorr = answers[q.id] === q.correct_answer;
                  let bg = 'bg-slate-100 text-slate-400';
                  if (i === currentIdx) bg = 'bg-primary text-white';
                  else if (isRev) bg = isCorr ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600';
                  else if (isAns) bg = 'bg-primary/20 text-primary';
                  return <button key={q.id} onClick={() => setCurrentIdx(i)} className={`w-full aspect-square rounded-lg text-xs font-bold ${bg}`}>{i + 1}</button>;
                })}
              </div>
            </div>
            {phase === 'practice' && answered > 0 && (
              <button onClick={finish} className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20">Kết thúc</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LuyenTapTracNghiemDhdeduVietHoa;
