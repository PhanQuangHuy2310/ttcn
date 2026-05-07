// src/pages/Teacher/MaterialLibrary.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Btn, IconBtn, Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate, SearchInput, Modal, Input } from '../../components/ui';
import { supabase } from '../../lib/supabase';

const SIZE_LABEL = bytes => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

const ICON_MAP = {
  PDF: { icon: 'picture_as_pdf', bg: 'bg-red-50', color: 'text-red-500' },
  VIDEO: { icon: 'play_circle', bg: 'bg-blue-50', color: 'text-blue-500' },
  AUDIO: { icon: 'headphones', bg: 'bg-purple-50', color: 'text-purple-500' },
  IMAGE: { icon: 'image', bg: 'bg-green-50', color: 'text-green-500' },
  OTHER: { icon: 'attach_file', bg: 'bg-slate-100', color: 'text-slate-500' },
};

const getMaterialType = file => {
  const t = file.type;
  if (t.includes('pdf')) return 'PDF';
  if (t.includes('video')) return 'VIDEO';
  if (t.includes('audio')) return 'AUDIO';
  if (t.includes('image')) return 'IMAGE';
  return 'OTHER';
};

const UploadArea = ({ onUploaded, profile }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ courseId: '', lessonId: '', purpose: 'THEORY' });

  useEffect(() => {
    if (profile?.id) {
      supabase.from('courses').select('id, name').eq('teacher_id', profile.id)
        .then(({ data }) => setCourses(data || []));
    }
  }, [profile?.id]);

  useEffect(() => {
    if (form.courseId) {
      supabase.from('lessons').select('id, title').eq('course_id', form.courseId).order('order_index', { ascending: true })
        .then(({ data }) => {
          setLessons(data || []);
          if (!data || data.length === 0) setForm(f => ({ ...f, lessonId: 'AUTO_CREATE' }));
          else setForm(f => ({ ...f, lessonId: '' }));
        });
    } else {
      setLessons([]);
      setForm(f => ({ ...f, lessonId: '' }));
    }
  }, [form.courseId]);

  const upload = async file => {
    if (!file) return;
    if (!form.lessonId) { setError('Vui lòng chọn Khóa học và Bài học.'); return; }

    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      let targetLessonId = form.lessonId;
      let targetLessonTitle = '';

      if (targetLessonId === 'AUTO_CREATE') {
        const { data: newLesson, error: lessonErr } = await supabase.from('lessons').insert({
          course_id: form.courseId, title: 'Tài liệu chung', order_index: 1
        }).select().single();
        if (lessonErr) throw new Error('Lỗi khi tạo bài học: ' + lessonErr.message);

        targetLessonId = newLesson.id;
        targetLessonTitle = newLesson.title;
        setLessons(prev => [...prev, newLesson]);
        setForm(f => ({ ...f, lessonId: newLesson.id }));
      } else {
        targetLessonTitle = lessons.find(l => l.id === targetLessonId)?.title || '';
      }

      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `materials/${fileName}`;

      const { error: storageErr } = await supabase.storage.from('materials').upload(path, file, { cacheControl: '3600', upsert: false });
      if (storageErr) throw new Error(`Upload thất bại: ${storageErr.message}`);
      setProgress(70);

      const { data: urlData } = supabase.storage.from('materials').getPublicUrl(path);
      setProgress(85);

      const { data, error: dbErr } = await supabase.from('materials').insert({
        title: file.name.replace(/\.[^/.]+$/, ''),
        file_url: urlData?.publicUrl,
        material_type: getMaterialType(file),
        size: file.size,
        lesson_id: targetLessonId,
        purpose: form.purpose
      }).select().single();

      if (dbErr) throw new Error('Lưu Database thất bại: ' + dbErr.message);

      setProgress(100);
      onUploaded?.({ ...data, lesson_title: targetLessonTitle, course_id: form.courseId });
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      setError(err.message);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Tải tài liệu mới</h3>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl font-medium">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">1. Chọn Khóa học *</label>
          <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value, lessonId: '' })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
            <option value="">-- Chọn khóa học --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">2. Chọn Bài học *</label>
          <select value={form.lessonId} onChange={e => setForm({ ...form, lessonId: e.target.value })} disabled={!form.courseId} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm disabled:bg-slate-50">
            <option value="">-- Chọn bài học --</option>
            {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            {form.courseId && <option value="AUTO_CREATE" className="font-bold text-primary">+ Tự động tạo: "Tài liệu chung"</option>}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">3. Mục đích sử dụng *</label>
          <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
            <option value="THEORY">Tài liệu học tập (Công khai với HS)</option>
            <option value="EXAM_SOURCE">Nguồn tạo câu hỏi (Ẩn với HS)</option>
            <option value="FLASHCARD_SOURCE">Nguồn tạo Flashcard (Ẩn với HS)</option>
          </select>
        </div>
      </div>

      <div onClick={() => { if (form.lessonId && !uploading) fileRef.current?.click(); }} className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${!form.lessonId ? 'border-slate-200 bg-slate-50 opacity-60' : 'hover:bg-slate-50 cursor-pointer'}`}>
        {uploading ? <p className="text-sm font-semibold text-blue-700">Đang tải lên... {progress}%</p> : <p className="text-sm font-semibold text-slate-700">{!form.lessonId ? 'Vui lòng chọn khóa học/bài học' : 'Click để tải lên tài liệu'}</p>}
      </div>
      <input ref={fileRef} type="file" className="hidden" onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0]); e.target.value = ''; }} />
    </div>
  );
};

// ── Modal Tạo Flashcard bằng AI ───────────────────────
const GenerateFlashcardModal = ({ material, open, onClose, profile }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setSaving(true); setError(null); setSuccess(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('http://localhost:8080/api/ai/generate-flashcards-from-url', {
        method: 'POST',
        body: JSON.stringify({ pdfUrl: material.file_url, title: material.title, userId: profile.id }),
        headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}) }
      });

      if (!response.ok) throw new Error('Có lỗi xảy ra trong quá trình gọi AI phân tích.');
      const extractedCards = await response.json();

      if (!extractedCards || extractedCards.length === 0) {
        throw new Error('AI không nhận diện được nội dung học thuật nào từ file này.');
      }

      const { data: newSet, error: setErr } = await supabase.from('flashcard_sets').insert({
        title: `Flashcard ôn tập: ${material.title}`,
        description: `Tạo tự động từ AI.`,
        created_by: profile.id
      }).select().single();
      if (setErr) throw setErr;

      const insertPayload = extractedCards.map(c => ({
        set_id: newSet.id,
        front_text: c.front || c.front_text || c.question,
        back_text: c.back || c.back_text || c.answer
      }));
      const { error: cardErr } = await supabase.from('flashcards').insert(insertPayload);
      if (cardErr) throw cardErr;

      if (material.course_id) {
        const { data: classes } = await supabase.from('classes').select('id').eq('course_id', material.course_id);
        const classIds = classes?.map(c => c.id) || [];
        if (classIds.length > 0) {
          const { data: stdClasses } = await supabase.from('student_classes').select('student_id').in('class_id', classIds);
          const studentIds = stdClasses?.map(s => s.student_id) || [];
          if (studentIds.length > 0) {
            const notifs = studentIds.map(sid => ({
              user_id: sid,
              title: '📚 Bộ Flashcard mới!',
              message: `Giảng viên vừa tạo thẻ ôn tập cho bài: ${material.title}`,
              type: 'SYSTEM',
              action_url: '/student/flashcards',
              read_status: false
            }));
            await supabase.from('notifications').insert(notifs);
          }
        }
      }

      setSuccess(true);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  if (!material) return null;

  return (
    <Modal open={open} onClose={onClose} title="Tạo Flashcard tự động (AI)">
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span></div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Phân tích thành công!</h3>
          <p className="text-sm text-slate-500 mb-6">Đã phân tích xong tệp PDF, tạo bộ thẻ và gửi thông báo đến học sinh trong lớp.</p>
          <Btn onClick={onClose} className="w-full">Đóng</Btn>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <span className="material-symbols-outlined text-indigo-500 text-5xl mb-2">auto_awesome</span>
          <h3 className="font-bold text-slate-800">Trích xuất Flashcard từ {material.title}</h3>
          <p className="text-sm text-slate-500">Hệ thống AI sẽ quét nội dung PDF thật sự và tự động tạo ra một bộ thẻ Flashcard (Hỏi/Đáp).</p>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div className="pt-4 flex gap-3">
            <Btn variant="outline" className="flex-1" onClick={onClose}>Hủy</Btn>
            <Btn loading={saving} onClick={handleGenerate} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">Phân tích ngay</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ── Modal Trích xuất Câu hỏi vào Ngân hàng ──────────
const ExtractQuestionsModal = ({ material, open, onClose }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExtract = async () => {
    setSaving(true); setError(null); setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('http://localhost:8080/api/ai/extract-questions-from-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ pdfUrl: material.file_url, materialTitle: material.title })
      });

      if (!response.ok) throw new Error('Không thể kết nối đến AI Server. Vui lòng kiểm tra Backend.');

      const aiQuestions = await response.json();
      if (!aiQuestions || aiQuestions.length === 0) {
        throw new Error('AI không nhận diện được câu hỏi nào từ nội dung PDF này.');
      }

      // TẠO ĐỀ THI NHÁP "KHO CHỨA" ĐỂ GIỮ CHUẨN DATABASE VÀ TRÁNH LỖI RLS/400
      const bankTitle = `[Kho AI] ${material.title}`;
      let bankExamId = null;

      const { data: existingExams } = await supabase.from('exams').select('id').eq('title', bankTitle).limit(1);

      if (existingExams && existingExams.length > 0) {
        bankExamId = existingExams[0].id;
      } else {
        const { data: newExam, error: exErr } = await supabase.from('exams').insert({
          title: bankTitle,
          course_id: material.course_id,
          duration: 0,
          status: 'DRAFT'
        }).select().single();
        if (exErr) throw new Error("Không thể tạo Kho chứa: " + exErr.message);
        bankExamId = newExam.id;
      }

      // LƯU CÁC CÂU HỎI MÀ AI ĐÃ BÓC TÁCH ĐƯỢC (Bỏ qua các trường Database không hỗ trợ)
      const payload = aiQuestions.map(q => ({
        exam_id: bankExamId,
        content: q.content || q.question,
        type: q.type || 'MCQ',
        points: q.points || 1,
        options: q.options || null,
        correct_answer: q.correct_answer || q.answer || null
      }));

      const { error: dbErr } = await supabase.from('questions').insert(payload);
      if (dbErr) throw dbErr;

      setSuccess(true);
    } catch (err) {
      setError('Lỗi khi lưu vào Ngân hàng: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!material) return null;

  return (
    <Modal open={open} onClose={onClose} title="Bóc tách câu hỏi (AI OCR)">
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span></div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Trích xuất thành công!</h3>
          <p className="text-sm text-slate-500 mb-6">Đã đọc và lưu các câu hỏi từ tệp PDF. Bạn có thể xem lại ở mục Ngân hàng câu hỏi.</p>
          <Btn onClick={onClose} className="w-full">Đóng</Btn>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <span className="material-symbols-outlined text-orange-500 text-5xl mb-2">document_scanner</span>
          <h3 className="font-bold text-slate-800">Lưu vào Ngân hàng câu hỏi</h3>
          <p className="text-sm text-slate-500">Hệ thống AI sẽ đọc trực tiếp nội dung văn bản bên trong tệp PDF và tự động nhận diện thành các câu Trắc nghiệm / Tự luận.</p>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div className="pt-4 flex gap-3">
            <Btn variant="outline" className="flex-1" onClick={onClose}>Hủy</Btn>
            <Btn loading={saving} onClick={handleExtract} className="flex-1 bg-orange-500 border-none text-white hover:bg-orange-600">Bắt đầu quét AI</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

const MaterialLibrary = () => {
  const profile = useSelector(selectProfile);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [generateFlashcardMat, setGenerateFlashcardMat] = useState(null);
  const [extractQuestionMat, setExtractQuestionMat] = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const { data: courses } = await supabase.from('courses').select('id').eq('teacher_id', profile.id);
      if (!courses || courses.length === 0) { setMaterials([]); setLoading(false); return; }
      const courseIds = courses.map(c => c.id);

      const { data: lessons } = await supabase.from('lessons').select('id, title, course_id').in('course_id', courseIds);
      if (!lessons || lessons.length === 0) { setMaterials([]); setLoading(false); return; }
      const lessonIds = lessons.map(l => l.id);

      const { data: mats } = await supabase.from('materials').select('*').in('lesson_id', lessonIds).order('created_at', { ascending: false });

      const enrichedMats = (mats || []).map(m => {
        const parentLesson = lessons.find(l => l.id === m.lesson_id);
        return { ...m, lesson_title: parentLesson?.title, course_id: parentLesson?.course_id };
      });
      setMaterials(enrichedMats);
    } catch (err) { setError('Lỗi tải dữ liệu.'); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [profile?.id]);

  const handleDelete = async () => {
    await supabase.from('materials').delete().eq('id', confirmId);
    setMaterials(prev => prev.filter(m => m.id !== confirmId));
    setConfirmId(null);
  };

  const filtered = materials.filter(m => !search || m.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Kho tài liệu" subtitle={`${materials.length} tài liệu`} />
      {error && <ErrorBanner message={error} onRetry={load} />}

      <UploadArea onUploaded={m => setMaterials(prev => [m, ...prev])} profile={profile} />

      <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm tài liệu..." className="mb-5 max-w-sm" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Sk key={i} className="h-36 w-full rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon="folder_open" title="Kho trống" subtitle="Tải lên PDF/Video." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => {
            const { icon, bg, color } = ICON_MAP[m.material_type] ?? ICON_MAP.OTHER;
            return (
              <div key={m.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}><span className={`material-symbols-outlined ${color}`}>{icon}</span></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate text-sm">{m.title}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{SIZE_LABEL(m.size)} · Bài: {m.lesson_title}</p>
                        <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold ${m.purpose === 'EXAM_SOURCE' ? 'bg-orange-100 text-orange-700' : m.purpose === 'FLASHCARD_SOURCE' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                          {m.purpose === 'EXAM_SOURCE' ? 'NGUỒN CÂU HỎI' : m.purpose === 'FLASHCARD_SOURCE' ? 'NGUỒN FLASHCARD' : 'LÝ THUYẾT'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {m.purpose === 'FLASHCARD_SOURCE' && m.material_type === 'PDF' && <IconBtn icon="auto_awesome" label="Tạo Flashcard" variant="primary" size="sm" onClick={() => setGenerateFlashcardMat(m)} />}
                      {m.purpose === 'EXAM_SOURCE' && m.material_type === 'PDF' && <IconBtn icon="document_scanner" label="Bóc tách câu hỏi" variant="warning" size="sm" onClick={() => setExtractQuestionMat(m)} />}
                      <IconBtn icon="delete" label="Xóa" variant="danger" size="sm" onClick={() => setConfirmId(m.id)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GenerateFlashcardModal open={!!generateFlashcardMat} material={generateFlashcardMat} profile={profile} onClose={() => setGenerateFlashcardMat(null)} />
      <ExtractQuestionsModal open={!!extractQuestionMat} material={extractQuestionMat} onClose={() => setExtractQuestionMat(null)} />
    </AppLayout>
  );
};

export default MaterialLibrary;