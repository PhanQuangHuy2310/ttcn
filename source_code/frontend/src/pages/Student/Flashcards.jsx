// src/pages/Student/Flashcards.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate } from '../../components/ui';
import { supabase } from '../../lib/supabase';

const StudyMode = ({ cards, onClose }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  if (cards.length === 0) return null;

  if (done) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-green-600 text-4xl">celebration</span></div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Hoàn thành!</h3>
        <p className="text-slate-500 text-sm mb-6">Bạn đã ôn tập xong {cards.length} thẻ.</p>
        <div className="flex gap-3">
          <button onClick={() => { setIdx(0); setFlipped(false); setDone(false); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">Học lại</button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">Kết thúc</button>
        </div>
      </div>
    </div>
  );

  const card = cards[idx];
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-white/80 text-sm font-medium">{idx + 1} / {cards.length}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full mb-8"><div className="h-1.5 bg-white rounded-full transition-all" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} /></div>

        <div onClick={() => setFlipped(f => !f)} className="bg-white rounded-3xl shadow-2xl min-h-[300px] flex flex-col items-center justify-center p-12 cursor-pointer select-none hover:scale-[1.02] transition-transform">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-6">{flipped ? 'Đáp án' : 'Câu hỏi'}</span>
          <p className="text-2xl font-bold text-slate-800 text-center leading-relaxed">{flipped ? card.back_text : card.front_text}</p>
          <p className="text-xs text-slate-400 mt-8 font-medium italic">{flipped ? 'Nhấp để lật lại câu hỏi' : 'Nhấp để xem đáp án'}</p>
        </div>

        {flipped && (
          <div className="flex gap-4 mt-6">
            <button onClick={() => { setFlipped(false); setIdx(i => Math.max(0, i - 1)); }} disabled={idx === 0} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 disabled:opacity-30 transition">← Trước</button>
            <button onClick={() => { setFlipped(false); if (idx === cards.length - 1) setDone(true); else setIdx(i => i + 1); }} className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg">{idx === cards.length - 1 ? 'Hoàn thành ✓' : 'Tiếp theo →'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Flashcards = () => {
  const profile = useSelector(selectProfile);
  const [sets, setSets] = useState([]);
  const [studySet, setStudySet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        // 1. Tìm các lớp mà học sinh đang học
        const { data: stdClasses } = await supabase.from('student_classes').select('class_id').eq('student_id', profile.id);
        const classIds = stdClasses?.map(c => c.class_id) || [];

        if (classIds.length === 0) { setSets([]); setLoading(false); return; }

        // 2. TÌm course_id của các lớp đó
        const { data: cls } = await supabase.from('classes').select('course_id').in('id', classIds);
        const courseIds = cls?.map(c => c.course_id) || [];

        // 3. Tải Flashcard thuộc về các Khóa học này HOẶC do học sinh tự tạo lúc trước
        let query = supabase.from('flashcard_sets').select('*, flashcards(count)').order('created_at', { ascending: false });
        if (courseIds.length > 0) {
          query = query.or(`course_id.in.(${courseIds.join(',')}),created_by.eq.${profile.id}`);
        } else {
          query = query.eq('created_by', profile.id);
        }

        const { data, error: err } = await query;
        if (err) throw err;

        setSets(data ?? []);
      } catch (err) {
        setError('Không thể tải danh sách flashcard từ giáo viên.');
      }
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const handleStudy = async (set) => {
    const { data } = await supabase.from('flashcards').select('*').eq('set_id', set.id).order('created_at', { ascending: true });
    if (data?.length > 0) setStudySet({ set, cards: data });
  };

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Học Flashcard" subtitle="Ôn tập kiến thức thông qua bộ thẻ ghi nhớ do Giảng viên cung cấp" />
      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <Sk key={i} className="h-48 w-full rounded-3xl" />)}
        </div>
      ) : sets.length === 0 ? (
        <Card>
          <EmptyState icon="style" title="Chưa có bộ Flashcard nào" subtitle="Giảng viên của bạn chưa xuất bản bộ Flashcard nào." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sets.map(set => {
            const cardCount = set.flashcards?.[0]?.count || 0;
            return (
              <div key={set.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group" onClick={() => cardCount > 0 && handleStudy(set)}>
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <span className="material-symbols-outlined text-indigo-600 group-hover:text-white transition-colors">style</span>
                    </div>
                    <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{cardCount} thẻ</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{set.title}</h3>
                  {set.description && <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">{set.description}</p>}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{fmtDate(set.created_at)}</span>
                    <span className="text-indigo-600 group-hover:underline">Bắt đầu học →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {studySet && <StudyMode cards={studySet.cards} onClose={() => setStudySet(null)} />}
    </AppLayout>
  );
};

export default Flashcards;