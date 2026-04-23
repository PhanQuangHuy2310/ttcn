// src/pages/Student/HocFlashcardDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same data as HocFlashcardDhdeduVietHoa but different layout wrapper
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const HocFlashcardDhdedu = () => {
  const [sp]        = useSearchParams();
  const setId       = sp.get('setId');
  const [sets,      setSets]      = useState([]);
  const [cards,     setCards]     = useState([]);
  const [selSet,    setSelSet]    = useState(null);
  const [idx,       setIdx]       = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [loadingC,  setLoadingC]  = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await studentService.getFlashcardSets(user.id);
      const all = data ?? [];
      setSets(all);
      const target = setId ? all.find(s => s.id === setId) : all[0];
      if (target) { setSelSet(target); loadCards(target.id); }
      setLoading(false);
    }
    init();
  }, [setId]);

  const loadCards = async (id) => {
    setLoadingC(true);
    setIdx(0); setFlipped(false);
    const { data } = await studentService.getFlashcards(id);
    setCards(data ?? []);
    setLoadingC(false);
  };

  const card = cards[idx];
  const prog = cards.length ? Math.round(((idx + 1) / cards.length) * 100) : 0;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <StudentHeader />
        <div className="flex-1 flex flex-col lg:flex-row p-8 gap-8 overflow-y-auto">

          {/* Card area */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            {/* Set selector header */}
            <div className="w-full flex justify-between items-end mb-8">
              <div>
                <h1 className="text-2xl font-black text-on-surface">{selSet?.title ?? 'Học Flashcard'}</h1>
                <p className="text-slate-400 text-sm mt-0.5">{selSet?.courses?.name ?? '—'} · {cards.length} thẻ</p>
              </div>
              <select
                value={selSet?.id ?? ''}
                onChange={e => {
                  const s = sets.find(x => x.id === e.target.value);
                  if (s) { setSelSet(s); loadCards(s.id); }
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sets.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>

            {loading || loadingC ? (
              <Skeleton className="w-full h-64 rounded-3xl mb-6" />
            ) : !card ? (
              <div className="w-full h-64 bg-white rounded-3xl border border-slate-100 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl mb-2 block">style</span>
                  <p>Chưa có thẻ nào trong bộ này</p>
                </div>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="w-full flex items-center gap-4 mb-6">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${prog}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-400">{idx + 1}/{cards.length}</span>
                </div>

                {/* Flip card */}
                <div onClick={() => setFlipped(f => !f)} className="w-full h-72 cursor-pointer" style={{ perspective: '1000px' }}>
                  <div style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    width: '100%', height: '100%', position: 'relative'
                  }}>
                    <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                      className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-10 flex flex-col items-center justify-center text-white shadow-xl">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Câu hỏi</p>
                      <p className="text-xl font-bold text-center">{card.front_text}</p>
                      <p className="text-xs opacity-50 mt-6">Nhấn để xem đáp án</p>
                    </div>
                    <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
                      className="bg-white border border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center shadow-xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Đáp án</p>
                      <p className="text-xl font-bold text-center text-on-surface">{card.back_text}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
                    disabled={idx === 0}
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 shadow-sm">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <button onClick={() => setFlipped(f => !f)}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90">
                    {flipped ? 'Câu hỏi' : 'Đáp án'}
                  </button>
                  <button onClick={() => { setIdx(i => Math.min(i + 1, cards.length - 1)); setFlipped(false); }}
                    disabled={idx === cards.length - 1}
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 shadow-sm">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Set list sidebar */}
          <aside className="w-72 shrink-0 space-y-3">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Bộ thẻ học</h3>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : sets.map(s => (
              <button key={s.id} onClick={() => { setSelSet(s); loadCards(s.id); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selSet?.id === s.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-primary/30'}`}>
                <p className="font-semibold text-sm text-on-surface">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.courses?.name ?? '—'}</p>
              </button>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HocFlashcardDhdedu;
