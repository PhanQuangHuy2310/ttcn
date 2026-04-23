// src/pages/Student/HocFlashcardDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const HocFlashcardDhdeduVietHoa = () => {
  const [searchParams]  = useSearchParams();
  const setId           = searchParams.get('setId');

  const [sets,         setSets]         = useState([]);
  const [cards,        setCards]        = useState([]);
  const [selectedSet,  setSelectedSet]  = useState(null);
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [flipped,      setFlipped]      = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [error,        setError]        = useState(null);
  const [mode,         setMode]         = useState('browse'); // browse | study

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error: err } = await studentService.getFlashcardSets(user.id);
      if (err) { setError(err.message); setLoading(false); return; }
      const allSets = data ?? [];
      setSets(allSets);
      // If setId in URL, auto-select
      const target = setId ? allSets.find(s => s.id === setId) : allSets[0];
      if (target) { setSelectedSet(target); loadCards(target.id); }
      setLoading(false);
    }
    init();
  }, [setId]);

  const loadCards = async (sid) => {
    setLoadingCards(true);
    setCurrentIdx(0);
    setFlipped(false);
    const { data } = await studentService.getFlashcards(sid);
    setCards(data ?? []);
    setLoadingCards(false);
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    loadCards(set.id);
    setMode('browse');
  };

  const handleFlip = () => setFlipped(f => !f);
  const handleNext = () => { setCurrentIdx(i => Math.min(i + 1, cards.length - 1)); setFlipped(false); };
  const handlePrev = () => { setCurrentIdx(i => Math.max(i - 1, 0)); setFlipped(false); };

  const card = cards[currentIdx];
  const progress = cards.length ? Math.round(((currentIdx + 1) / cards.length) * 100) : 0;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64 min-h-screen p-8">
        <StudentHeader />
        <div className="max-w-6xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-black text-on-surface">Học Flashcard</h1>
            <p className="text-slate-500 mt-1">Ôn tập nhanh với thẻ học thông minh</p>
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          <div className="grid grid-cols-12 gap-8">
            {/* Set list */}
            <div className="col-span-3 space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bộ thẻ học</h3>
              {loading ? (
                Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
              ) : sets.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl mb-2 block">style</span>
                  <p className="text-xs">Chưa có bộ thẻ nào</p>
                </div>
              ) : sets.map(set => (
                <button key={set.id} onClick={() => handleSelectSet(set)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSet?.id === set.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-white hover:border-primary/30'}`}
                >
                  <p className="font-semibold text-sm text-on-surface">{set.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {set.courses?.name ?? '—'} · {typeof set.flashcards === 'number' ? set.flashcards : (set.flashcards?.[0]?.count ?? '?')} thẻ
                  </p>
                </button>
              ))}
            </div>

            {/* Flashcard viewer */}
            <div className="col-span-9">
              {!selectedSet ? (
                <div className="p-20 bg-white rounded-3xl border border-slate-100 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3 block">style</span>
                  <p>Chọn một bộ thẻ để bắt đầu học</p>
                </div>
              ) : loadingCards ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 rounded-3xl" />
                  <div className="flex justify-center gap-4">
                    {Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-10 w-24 rounded-xl"/>)}
                  </div>
                </div>
              ) : cards.length === 0 ? (
                <div className="p-20 bg-white rounded-3xl border border-slate-100 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3 block">style</span>
                  <p>Bộ thẻ này chưa có flashcard nào</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-500">{currentIdx + 1} / {cards.length}</span>
                  </div>

                  {/* Card */}
                  <div
                    onClick={handleFlip}
                    className="cursor-pointer h-64 relative select-none"
                    style={{ perspective: '1000px' }}
                  >
                    <div style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s',
                      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      width: '100%', height: '100%', position: 'relative'
                    }}>
                      {/* Front */}
                      <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                        className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-xl">
                        <span className="text-xs font-bold tracking-widest uppercase opacity-60 mb-4">Câu hỏi</span>
                        <p className="text-xl font-bold text-center">{card?.front_text}</p>
                        <p className="text-xs opacity-60 mt-6">Nhấn để lật thẻ</p>
                      </div>
                      {/* Back */}
                      <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
                        className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl">
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-300 mb-4">Trả lời</span>
                        <p className="text-xl font-bold text-center text-on-surface">{card?.back_text}</p>
                        <p className="text-xs text-slate-300 mt-6">Nhấn để lật lại</p>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={handlePrev} disabled={currentIdx === 0}
                      className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button onClick={handleFlip}
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                      {flipped ? 'Xem câu hỏi' : 'Xem đáp án'}
                    </button>
                    <button onClick={handleNext} disabled={currentIdx === cards.length - 1}
                      className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>

                  {/* Card dots */}
                  <div className="flex justify-center gap-1 flex-wrap">
                    {cards.map((_, i) => (
                      <button key={i} onClick={() => { setCurrentIdx(i); setFlipped(false); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'bg-primary w-4' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HocFlashcardDhdeduVietHoa;
