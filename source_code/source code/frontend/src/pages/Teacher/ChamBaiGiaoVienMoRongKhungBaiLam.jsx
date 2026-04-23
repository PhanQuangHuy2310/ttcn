// src/pages/Teacher/ChamBaiGiaoVienMoRongKhungBaiLam.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ChamBaiGiaoVienMoRongKhungBaiLam = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');

  const [submissions,    setSubmissions]    = useState([]);
  const [selected,       setSelected]       = useState(null);  // currently viewed submission
  const [exam,           setExam]           = useState(null);
  const [questions,      setQuestions]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [savingScore,    setSavingScore]     = useState(false);
  const [teacherId,      setTeacherId]      = useState(null);
  const [scoreInput,     setScoreInput]     = useState('');
  const [filter,         setFilter]         = useState('SUBMITTED'); // SUBMITTED | graded
  const [search,         setSearch]         = useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setTeacherId(user.id);

      if (!examId) { setLoading(false); return; }

      const [examRes, subsRes, qRes] = await Promise.all([
        supabase.from('exams').select('*, classes(name), courses(name, subject)').eq('id', examId).single(),
        teacherService.getStudentStatusByExam(examId),
        teacherService.getQuestions(examId),
      ]);

      setExam(examRes.data);
      const allSubs = (subsRes.data ?? []).filter(s => s.status === 'SUBMITTED');
      setSubmissions(allSubs);
      setQuestions(qRes.data ?? []);
      if (allSubs.length) { setSelected(allSubs[0]); setScoreInput(String(allSubs[0].score ?? '')); }
      setLoading(false);
    }
    init();
  }, [examId]);

  const handleSelectSub = (sub) => {
    setSelected(sub);
    setScoreInput(String(sub.score ?? ''));
  };

  const handleSaveScore = async () => {
    if (!selected || scoreInput === '') return;
    const score = parseFloat(scoreInput);
    if (isNaN(score) || score < 0 || score > 10) { alert('Điểm phải từ 0 đến 10'); return; }

    setSavingScore(true);
    const { error } = await teacherService.gradeSubmission(selected.id, score, teacherId);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === selected.id ? { ...s, score } : s));
      setSelected(s => ({ ...s, score }));
    }
    setSavingScore(false);
  };

  const filteredSubs = submissions.filter(s => {
    const matchSearch = !search || s.users?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'SUBMITTED' ? s.score === null : s.score !== null;
    return matchSearch && matchFilter;
  });

  const formatTime = (iso) => iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  const pendingCount = submissions.filter(s => s.score === null).length;
  const gradedCount  = submissions.filter(s => s.score !== null).length;

  const getAnswerForQuestion = (qId) => {
    if (!selected?.answers) return null;
    return selected.answers[qId];
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <TeacherHeader />

        {!examId ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl mb-3 block">grading</span>
              <p>Vui lòng thêm ?examId=... vào URL để xem bài chấm</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">

            {/* Left: submission list */}
            <aside className="w-64 bg-surface-container-low border-r border-outline-variant/5 flex flex-col flex-shrink-0">
              <div className="p-4 space-y-3 border-b border-outline-variant/10">
                {exam && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 truncate">{exam.title}</p>
                    <p className="text-[10px] text-slate-400">{exam.classes?.name}</p>
                  </div>
                )}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Tìm sinh viên..." type="text" value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setFilter('SUBMITTED')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${filter === 'SUBMITTED' ? 'bg-primary text-white' : 'text-on-surface-variant bg-surface-container-high hover:bg-surface-variant'}`}>
                    Chờ chấm ({pendingCount})
                  </button>
                  <button onClick={() => setFilter('graded')}
                    className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${filter === 'graded' ? 'bg-primary text-white' : 'text-on-surface-variant bg-surface-container-high hover:bg-surface-variant'}`}>
                    Đã chấm ({gradedCount})
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pb-8">
                <div className="px-3 pt-3">
                  {loading ? (
                    Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 mb-2"><Skeleton className="w-8 h-8 rounded-full"/><Skeleton className="h-3 flex-1"/></div>
                    ))
                  ) : filteredSubs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Không có bài nào</p>
                  ) : filteredSubs.map(sub => (
                    <button key={sub.id} onClick={() => handleSelectSub(sub)}
                      className={`w-full flex items-center gap-2 p-2.5 rounded-lg mb-2 text-left transition-colors ${selected?.id === sub.id ? 'bg-surface-container-lowest shadow-sm border-l-4 border-primary' : 'hover:bg-surface-container-lowest/60'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">{(sub.users?.full_name ?? 'S').charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">{sub.users?.full_name ?? '—'}</p>
                        <p className="text-[10px] text-slate-400">{formatTime(sub.submitted_at)}</p>
                      </div>
                      {sub.score !== null && (
                        <span className={`text-[10px] font-black px-1.5 rounded ${sub.score >= 5 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {sub.score}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right: submission detail */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6">
              {!selected ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-5xl mb-3 block">assignment</span>
                    <p className="text-sm">Chọn bài làm để xem chi tiết</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Student info header */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">{(selected.users?.full_name ?? 'S').charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{selected.users?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">
                          Nộp lúc: {formatTime(selected.submitted_at)} ·
                          Thời gian: {selected.time_spent ? `${Math.floor(selected.time_spent / 60)} phút` : '—'}
                        </p>
                      </div>
                    </div>
                    {/* Score input */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
                        <input
                          type="number" min="0" max="10" step="0.5"
                          value={scoreInput}
                          onChange={e => setScoreInput(e.target.value)}
                          placeholder="0–10"
                          className="w-16 bg-transparent text-lg font-black text-center focus:outline-none"
                        />
                        <span className="text-slate-400 text-sm">/10</span>
                      </div>
                      <button onClick={handleSaveScore} disabled={savingScore || scoreInput === ''}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-opacity">
                        {savingScore ? 'Đang lưu...' : 'Lưu điểm'}
                      </button>
                    </div>
                  </div>

                  {/* Answer review */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-on-surface">Chi tiết bài làm</h3>
                    {loading ? (
                      Array.from({length: 4}).map((_,i) => <Skeleton key={i} className="h-24 rounded-2xl"/>)
                    ) : questions.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-8">Không có câu hỏi</p>
                    ) : questions.map((q, idx) => {
                      const studentAns = getAnswerForQuestion(q.id);
                      const isCorrect  = q.type === 'MCQ' && studentAns === q.correct_answer;
                      return (
                        <div key={q.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${q.type === 'MCQ' ? (isCorrect ? 'border-green-100' : 'border-red-100') : 'border-slate-100'}`}>
                          <div className="flex items-start gap-3 mb-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${q.type === 'MCQ' ? (isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500') : 'bg-slate-100 text-slate-600'}`}>
                              {idx + 1}
                            </span>
                            <p className="text-sm font-medium text-on-surface">{q.content}</p>
                          </div>
                          {q.type === 'MCQ' && Array.isArray(q.options) && (
                            <div className="ml-10 space-y-1.5">
                              {q.options.map(opt => {
                                const isStudentAns = String(opt.id) === studentAns;
                                const isCorrectOpt = String(opt.id) === q.correct_answer;
                                return (
                                  <div key={opt.id} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${isCorrectOpt ? 'bg-green-50 text-green-700 font-semibold' : isStudentAns ? 'bg-red-50 text-red-600' : 'text-slate-500'}`}>
                                    {isCorrectOpt && <span className="material-symbols-outlined text-sm">check</span>}
                                    {isStudentAns && !isCorrectOpt && <span className="material-symbols-outlined text-sm">close</span>}
                                    <span className="font-bold mr-1">{String.fromCharCode(64 + opt.id)}.</span>
                                    {opt.text}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {q.type === 'ESSAY' && (
                            <div className="ml-10 p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                              {studentAns ?? <span className="italic text-slate-300">Không có câu trả lời</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChamBaiGiaoVienMoRongKhungBaiLam;
