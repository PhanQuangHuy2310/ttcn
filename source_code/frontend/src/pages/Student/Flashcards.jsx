// src/pages/Student/Flashcards.jsx
/**
 * FILE: Flashcards.jsx
 * MÔ TẢ: Tính năng học tập qua thẻ ghi nhớ (Flashcards).
 * CHỨC NĂNG: Cho phép sinh viên ôn tập kiến thức thông qua bộ thẻ lật, hỗ trợ học nhanh các thuật ngữ và định nghĩa.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate,
  Btn, Modal, Input, Select, Textarea
} from '../../components/ui';
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

const GenerateFlashcardsModal = ({ open, onClose, profile, onSaved }) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedCards, setExtractedCards] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load student's courses
  useEffect(() => {
    if (open && profile?.id) {
      const loadCourses = async () => {
        try {
          // Find student classes
          const { data: stdClasses } = await supabase.from('student_classes').select('class_id').eq('student_id', profile.id);
          const classIds = stdClasses?.map(c => c.class_id) || [];
          if (classIds.length > 0) {
            const { data: cls } = await supabase.from('classes').select('course_id, courses(id, name)').in('id', classIds);
            const list = [];
            const ids = new Set();
            cls?.forEach(item => {
              const course = item.courses;
              if (course && !ids.has(course.id)) {
                ids.add(course.id);
                list.push(course);
              }
            });
            setCourses(list);
          }
        } catch (err) {
          console.error(err);
        }
      };
      loadCourses();
    }
  }, [open, profile?.id]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) { setError('Vui lòng chọn file PDF.'); return; }
    
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081/api'}/student/ai/extract-flashcards`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể kết nối đến AI Server. Vui lòng kiểm tra Backend.');
      }

      const cards = await response.json();
      if (!cards || cards.length === 0) {
        throw new Error('AI không nhận diện được khái niệm chính nào từ file PDF này.');
      }

      setExtractedCards(cards);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // 1. Save Set
      const { data: newSet, error: setErr } = await supabase.from('flashcard_sets').insert({
        title: title || 'Bộ thẻ AI',
        description: description || 'Tự động tạo từ PDF qua AI.',
        created_by: profile.id,
        course_id: courseId || null
      }).select().single();

      if (setErr) throw setErr;

      // 2. Save Cards
      const insertPayload = extractedCards.map((c, idx) => ({
        set_id: newSet.id,
        front_text: c.frontText || c.front || '',
        back_text: c.backText || c.back || '',
        hint: c.hint || '',
        order: idx + 1
      }));

      const { error: cardErr } = await supabase.from('flashcards').insert(insertPayload);
      if (cardErr) throw cardErr;

      onSaved?.();
      handleClose();
    } catch (err) {
      setError('Lưu thất bại: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCourseId('');
    setError(null);
    setExtractedCards([]);
    onClose();
  };

  const handleEditCard = (index, field, value) => {
    setExtractedCards(prev => prev.map((c, idx) => idx === index ? { ...c, [field]: value } : c));
  };

  return (
    <Modal open={open} onClose={handleClose} title="Tạo Flashcard tự động bằng AI (Gemini)">
      {extractedCards.length > 0 ? (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <p className="text-sm font-semibold text-slate-700">Hãy kiểm tra và chỉnh sửa bộ thẻ trước khi lưu:</p>
          {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl">{error}</p>}
          <div className="space-y-3">
            {extractedCards.map((card, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-indigo-500">Thẻ {idx + 1}</span>
                </div>
                <Input
                  label="Mặt trước (Khái niệm)"
                  value={card.frontText || card.front || ''}
                  onChange={e => handleEditCard(idx, 'frontText', e.target.value)}
                  placeholder="Khái niệm A"
                  required
                />
                <Textarea
                  label="Mặt sau (Định nghĩa / Giải thích)"
                  value={card.backText || card.back || ''}
                  onChange={e => handleEditCard(idx, 'backText', e.target.value)}
                  placeholder="Định nghĩa của A"
                  rows={2}
                  required
                />
                <Input
                  label="Gợi ý (Không bắt buộc)"
                  value={card.hint || ''}
                  onChange={e => handleEditCard(idx, 'hint', e.target.value)}
                  placeholder="Gợi ý nhỏ..."
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
            <Btn variant="outline" className="flex-1" onClick={handleClose}>Hủy bỏ</Btn>
            <Btn loading={saving} onClick={handleSave} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">Lưu vào bộ nhớ</Btn>
          </div>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl font-medium">{error}</p>}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">1. Tên bộ thẻ</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tên bộ thẻ ôn tập" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">2. Mô tả (Tùy chọn)</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Mô tả bộ thẻ..." />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">3. Liên kết với môn học (Tùy chọn)</label>
            <Select value={courseId} onChange={e => setCourseId(e.target.value)}>
              <option value="">-- Không liên kết môn học --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">4. Chọn tệp PDF tài liệu *</label>
            <div
              onClick={() => { if (!uploading) fileRef.current?.click(); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                !file ? 'border-indigo-200 hover:bg-indigo-50/50 cursor-pointer' : 'border-green-400 bg-green-50/20'
              }`}
            >
              {uploading ? (
                <div className="space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-indigo-600">AI đang quét và trích xuất tài liệu...</p>
                </div>
              ) : file ? (
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-green-500 text-3xl">picture_as_pdf</span>
                  <p className="text-sm font-semibold text-slate-700 truncate max-w-xs mx-auto">{file.name}</p>
                  <p className="text-xs text-slate-400">Click để chọn tệp khác</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-indigo-400 text-3xl">cloud_upload</span>
                  <p className="text-sm font-semibold text-slate-700">Chọn tệp PDF học tập</p>
                  <p className="text-xs text-slate-400">AI sẽ tự động đọc khái niệm và tạo thẻ</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <Btn variant="outline" type="button" onClick={handleClose}>Đóng</Btn>
            <Btn type="submit" loading={uploading} disabled={!file} className="bg-indigo-600 text-white hover:bg-indigo-700">Bắt đầu quét AI</Btn>
          </div>
        </form>
      )}
    </Modal>
  );
};

const Flashcards = () => {
  const profile = useSelector(selectProfile);
  const [sets, setSets] = useState([]);
  const [studySet, setStudySet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const loadFlashcardSets = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      // 1. Tìm các lớp mà học sinh đang học
      const { data: stdClasses } = await supabase.from('student_classes').select('class_id').eq('student_id', profile.id);
      const classIds = stdClasses?.map(c => c.class_id) || [];

      let courseIds = [];
      if (classIds.length > 0) {
        // 2. Tìm course_id của các lớp đó
        const { data: cls } = await supabase.from('classes').select('course_id').in('id', classIds);
        courseIds = cls?.map(c => c.course_id) || [];
      }

      // 3. Tải Flashcard thuộc về các Khóa học này HOẶC do học sinh tự tạo
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
      setError('Không thể tải danh sách flashcard.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFlashcardSets();
  }, [profile?.id]);

  const handleStudy = async (set) => {
    const { data } = await supabase.from('flashcards').select('*').eq('set_id', set.id).order('created_at', { ascending: true });
    if (data?.length > 0) setStudySet({ set, cards: data });
  };

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Học Flashcard"
        subtitle="Ôn tập kiến thức thông qua bộ thẻ ghi nhớ do Giảng viên cung cấp hoặc tự tạo"
        actions={<Btn icon="auto_awesome" onClick={() => setAiModalOpen(true)}>Tạo bằng AI (PDF)</Btn>}
      />
      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <Sk key={i} className="h-48 w-full rounded-3xl" />)}
        </div>
      ) : sets.length === 0 ? (
        <Card>
          <EmptyState icon="style" title="Chưa có bộ Flashcard nào" subtitle="Hãy tạo bộ thẻ ghi nhớ đầu tiên của bạn bằng AI hoặc đợi Giảng viên xuất bản." />
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
      
      <GenerateFlashcardsModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        profile={profile}
        onSaved={loadFlashcardSets}
      />
    </AppLayout>
  );
};

export default Flashcards;