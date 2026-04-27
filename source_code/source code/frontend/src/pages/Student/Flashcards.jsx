// src/pages/Student/Flashcards.jsx
// Replaces HocFlashcardDhdedu + HocFlashcardDhdeduVietHoa (both hardcoded).
// Connected to flashcard_sets + flashcards tables.

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate } from '../../components/ui';
import { flashcardsService, flashcardSetsService } from '../../services/supabaseService';

// ── Study mode component ─────────────────────────────────────
const StudyMode = ({ cards, onClose }) => {
  const [idx,     setIdx]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done,    setDone]    = useState(false);

  if (cards.length === 0) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl">
        <span className="material-symbols-outlined text-slate-300 text-5xl">style</span>
        <p className="text-slate-600 mt-3 font-semibold">Bộ flashcard này chưa có thẻ nào.</p>
        <button onClick={onClose} className="mt-5 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">Đóng</button>
      </div>
    </div>
  );

  if (done) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-green-600 text-4xl">celebration</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Hoàn thành!</h3>
        <p className="text-slate-500 text-sm mb-6">Bạn đã ôn tập xong {cards.length} thẻ.</p>
        <div className="flex gap-3">
          <button onClick={() => { setIdx(0); setFlipped(false); setDone(false); }}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
            Học lại
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
            Kết thúc
          </button>
        </div>
      </div>
    </div>
  );

  const card = cards[idx];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-white/80 text-sm font-medium">{idx + 1} / {cards.length}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="h-1 bg-white/20 rounded-full mb-6">
          <div className="h-1 bg-white rounded-full transition-all" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} />
        </div>

        {/* Card flip */}
        <div
          onClick={() => setFlipped(f => !f)}
          className="bg-white rounded-3xl shadow-2xl min-h-64 flex flex-col items-center justify-center p-10 cursor-pointer select-none hover:shadow-3xl transition-all duration-200 active:scale-[0.99]"
        >
          <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-4">
            {flipped ? 'Đáp án' : 'Câu hỏi'}
          </span>
          <p className="text-xl font-bold text-slate-800 text-center leading-relaxed">
            {flipped ? card.back : card.front}
          </p>
          {!flipped && card.hint && (
            <p className="text-sm text-slate-400 mt-4 text-center italic">💡 {card.hint}</p>
          )}
          <p className="text-xs text-slate-300 mt-6">{flipped ? 'Nhấp để xem câu hỏi' : 'Nhấp để xem đáp án'}</p>
        </div>

        {/* Controls */}
        {flipped && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setFlipped(false); setIdx(i => Math.max(0, i - 1)); }}
              disabled={idx === 0}
              className="flex-1 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 disabled:opacity-40 transition"
            >
              ← Trước
            </button>
            <button
              onClick={() => {
                setFlipped(false);
                if (idx === cards.length - 1) setDone(true);
                else setIdx(i => i + 1);
              }}
              className="flex-1 py-3 bg-white text-primary rounded-xl font-bold hover:opacity-90 transition"
            >
              {idx === cards.length - 1 ? 'Hoàn thành ✓' : 'Tiếp theo →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────
const Flashcards = () => {
  const profile = useSelector(selectProfile);
  const [sets,        setSets]        = useState([]);
  const [studySet,    setStudySet]    = useState(null);   // { set, cards }
  const [loading,     setLoading]     = useState(true);
  const [cardsLoading,setCardsLoading]= useState(false);
  const [error,       setError]       = useState(null);
  const [creating,    setCreating]    = useState(false);
  const [newTitle,    setNewTitle]    = useState('');
  const [newDesc,     setNewDesc]     = useState('');
  const [saving,      setSaving]      = useState(false);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data, error: err } = await flashcardsService.getSets(profile.id);
    if (err) setError('Không thể tải flashcard.');
    else setSets(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  const handleCreateSet = async () => {
    if (!newTitle.trim() || !profile?.id) return;
    setSaving(true);
    const { data, error: err } = await flashcardSetsService.create({ title: newTitle.trim(), description: newDesc.trim() || null, created_by: profile.id });
    if (err) setError('Không thể tạo bộ flashcard.');
    else {
      setSets(prev => [{ ...data, flashcards: [{ count: 0 }] }, ...prev]);
      setNewTitle('');
      setNewDesc('');
      setCreating(false);
    }
    setSaving(false);
  };

  const handleStudy = async (set) => {
    setCardsLoading(true);
    const { data } = await flashcardsService.getCards(set.id);
    setStudySet({ set, cards: data ?? [] });
    setCardsLoading(false);
  };

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Flashcard"
        subtitle="Ôn tập kiến thức với thẻ ghi nhớ"
        actions={
          <button
            onClick={() => setCreating(c => !c)}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo bộ mới
          </button>
        }
      />
      {error && <ErrorBanner message={error} />}

      {/* Create form */}
      {creating && (
        <Card className="mb-6">
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-slate-800">Tạo bộ Flashcard mới</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Tên bộ thẻ</label>
              <input
                type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Từ vựng Toán học HK1"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Mô tả (tùy chọn)</label>
              <input
                type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)}
                placeholder="Mô tả ngắn về bộ thẻ..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCreating(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Hủy
              </button>
              <button
                onClick={handleCreateSet} disabled={!newTitle.trim() || saving}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Đang tạo...' : 'Tạo bộ thẻ'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Set grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Sk key={i} className="h-44 w-full rounded-2xl" />)}
        </div>
      ) : sets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <span className="material-symbols-outlined text-slate-200 text-6xl">style</span>
          <p className="text-slate-600 font-semibold mt-4">Bạn chưa có bộ flashcard nào</p>
          <p className="text-slate-400 text-sm mt-1">Tạo bộ thẻ đầu tiên để bắt đầu ôn tập</p>
          <button onClick={() => setCreating(true)}
            className="mt-5 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
            Tạo ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map(set => {
            const cardCount = set.flashcards?.[0]?.count ?? 0;
            return (
              <div key={set.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-secondary-container" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">style</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{cardCount} thẻ</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {set.title}
                  </h3>
                  {set.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{set.description}</p>}
                  <p className="text-xs text-slate-300 mb-4">{fmtDate(set.created_at)}</p>
                  <button
                    onClick={() => handleStudy(set)}
                    disabled={cardsLoading || cardCount === 0}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
                      cardCount === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:opacity-90'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                    {cardCount === 0 ? 'Chưa có thẻ' : 'Học ngay'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Study overlay */}
      {studySet && (
        <StudyMode
          cards={studySet.cards}
          onClose={() => setStudySet(null)}
        />
      )}
    </AppLayout>
  );
};

export default Flashcards;
