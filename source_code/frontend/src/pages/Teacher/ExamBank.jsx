// src/pages/Teacher/ExamBank.jsx
/**
 * FILE: ExamBank.jsx
 * MÔ TẢ: Ngân hàng Đề thi của Giáo viên.
 * CHỨC NĂNG: Quản lý danh sách các đề thi đã tạo, cho phép xem chi tiết, chỉnh sửa cấu hình và theo dõi tình trạng làm bài.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Btn, IconBtn, Card, EmptyState, ErrorBanner, StatusBadge, SkRow, PageHeader, Modal, Input, Select, ConfirmDialog, FilterTabs, SearchInput, Table, Th, Td } from '../../components/ui';
import { examsService, examsAdminService, coursesService, examMatricesService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { TEACHER_AI_API } from '../../constant/apiEndpoints';

const STATUS_OPTS = [{ value: 'ALL', label: 'Tất cả' }, { value: 'DRAFT', label: 'Nháp' }, { value: 'ACTIVE', label: 'Đang thi' }, { value: 'ENDED', label: 'Đã đóng' }];
const NEXT_STATUS = { DRAFT: 'ACTIVE', ACTIVE: 'ENDED', ENDED: null };
const NEXT_LABEL = { DRAFT: 'Mở thi', ACTIVE: 'Đóng thi' };

const CreateExamModal = ({ open, onClose, onCreated, profile }) => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [examType, setExamType] = useState('OFFICIAL');
  const [examMode, setExamMode] = useState('MATRIX'); // Đổi Default thành Matrix cho tiện
  const [docType, setDocType] = useState('THEORY');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', course_id: '', class_id: '', matrix_id: '', material_id: '', duration: 60, status: 'DRAFT',
    easy: 0, medium: 0, hard: 0, essay: 0
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !profile?.id) return;
    setFile(null);
    setDocType('THEORY');
    coursesService.getByTeacher(profile.id).then(({ data }) => setCourses(data ?? []));
    examMatricesService.getByTeacher(profile.id).then(({ data }) => setMatrices(data ?? []));

    // Chỉ tải danh sách các tài liệu thuộc diện Nguồn câu hỏi
    supabase.from('materials').select('id, title, lessons(course_id)').eq('purpose', 'EXAM_SOURCE')
      .then(({ data }) => {
        const formattedMats = (data || []).map(m => ({ id: m.id, title: m.title, course_id: m.lessons?.course_id }));
        setMaterials(formattedMats);
      });
  }, [open, profile?.id]);

  useEffect(() => {
    const selectedCourse = courses.find(c => c.id === form.course_id);
    const firstClass = selectedCourse?.classes?.[0];
    setClasses(selectedCourse?.classes ?? []);
    setForm(f => ({ ...f, class_id: firstClass?.id || '', material_id: '' }));
  }, [form.course_id, courses]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.course_id) { setError('Vui lòng điền đủ thông tin.'); return; }
    if (examMode === 'AI' && !file) { setError('Vui lòng tải lên file tài liệu PDF.'); return; }

    setSaving(true); setError(null);

    try {
      const finalTitle = examType === 'MOCK' ? `[Thi thử] ${form.title.trim()}` : form.title.trim();
      const payload = {
        title: finalTitle, course_id: form.course_id, class_id: form.class_id || null,
        duration: parseInt(form.duration) || 60, status: form.status, allow_review: true, shuffle_questions: true,
        start_time: form.status === 'ACTIVE' ? new Date().toISOString() : null
      };

      // 1. Tạo vỏ đề thi
      const { data: examData, error: examErr } = await examsAdminService.create(payload);
      if (examErr) throw new Error('Lỗi tạo vỏ đề thi.');

      // 2. Xử lý theo từng chế độ tạo đề
      if (examMode === 'AI') {
        const { data: { session } } = await supabase.auth.getSession();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);

        const response = await fetch(TEACHER_AI_API.EXTRACT_QUESTIONS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session?.access_token}` },
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'AI Server gặp sự cố trong quá trình phân tích file.');
        }

        const aiQuestions = await response.json();
        if (!aiQuestions || aiQuestions.length === 0) {
          throw new Error('AI không nhận diện được hoặc không tạo được câu hỏi nào từ file này.');
        }

        const insertPayload = aiQuestions.map(q => ({
          exam_id: examData.id,
          course_id: form.course_id,
          content: q.content,
          type: q.type || 'MCQ',
          difficulty: q.difficulty || 'MEDIUM',
          points: q.points || 1.0,
          options: q.options || null,
          correct_answer: q.correctAnswer || null
        }));

        const { error: insertErr } = await supabase.from('questions').insert(insertPayload);
        if (insertErr) {
          await supabase.from('exams').delete().eq('id', examData.id);
          throw insertErr;
        }
      } else if (examMode === 'MATRIX') {
        let conf = {};
        if (form.matrix_id === 'none') {
          conf = {
            easy: parseInt(form.easy) || 0,
            medium: parseInt(form.medium) || 0,
            hard: parseInt(form.hard) || 0,
            essay: parseInt(form.essay) || 0
          };
          if (conf.easy + conf.medium + conf.hard + conf.essay === 0) {
            throw new Error('Vui lòng thiết lập ít nhất 1 câu hỏi để trộn đề.');
          }
        } else if (form.matrix_id) {
          const matrix = matrices.find(m => m.id === form.matrix_id);
          conf = matrix?.config || {};
        } else {
          throw new Error('Vui lòng chọn Ma trận cấu trúc hoặc chọn "Không dùng ma trận đề".');
        }

        // CHỈ LẤY CÂU HỎI TRONG NGÂN HÀNG
        let query = supabase.from('questions').select('*').eq('course_id', form.course_id).is('exam_id', null);

        // NẾU GIÁO VIÊN CHỈ ĐỊNH RÕ NGUỒN TÀI LIỆU
        if (form.material_id) {
          query = query.eq('source_material_id', form.material_id);
        }

        const { data: allQuestions } = await query;
        let finalQuestions = [];

        if (allQuestions && allQuestions.length > 0) {
          ['EASY', 'MEDIUM', 'HARD'].forEach(diff => {
            const countNeeded = conf[diff.toLowerCase()] || 0;
            const available = allQuestions.filter(q => q.difficulty === diff && q.type === 'MCQ').sort(() => 0.5 - Math.random());
            finalQuestions.push(...available.slice(0, countNeeded));
          });

          const essayNeeded = conf.essay || 0;
          if (essayNeeded > 0) {
            const availableEssays = allQuestions.filter(q => q.type === 'ESSAY').sort(() => 0.5 - Math.random());
            finalQuestions.push(...availableEssays.slice(0, essayNeeded));
          }
        }

        if (finalQuestions.length === 0) {
          await supabase.from('exams').delete().eq('id', examData.id);
          throw new Error('Không đủ câu hỏi trong Ngân hàng (hoặc tài liệu nguồn) để trộn đề.');
        }

        const insertPayload = finalQuestions.map(q => ({
          exam_id: examData.id, course_id: form.course_id, content: q.content, type: q.type, difficulty: q.difficulty, points: q.points, options: q.options, correct_answer: q.correct_answer
        }));

        await supabase.from('questions').insert(insertPayload);
      }

      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const courseMaterials = materials.filter(m => m.course_id === form.course_id);

  return (
    <Modal open={open} onClose={onClose} title="Tạo Đề thi">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl font-medium">{error}</p>}

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button type="button" onClick={() => setExamType('OFFICIAL')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${examType === 'OFFICIAL' ? 'bg-primary text-white shadow-sm' : 'text-slate-500'}`}>Thi Chính thức</button>
          <button type="button" onClick={() => setExamType('MOCK')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${examType === 'MOCK' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500'}`}>Thi Thử</button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button type="button" onClick={() => setExamMode('MATRIX')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${examMode === 'MATRIX' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>Trộn Tự động (Ma trận)</button>
          <button type="button" onClick={() => setExamMode('MANUAL')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${examMode === 'MANUAL' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>Soạn Thủ công</button>
          <button type="button" onClick={() => setExamMode('AI')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${examMode === 'AI' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>Tạo bằng AI (Upload)</button>
        </div>

        <Input label="Tên đề thi *" value={form.title} onChange={set('title')} required />

        <div>
          <Select label="Khóa học *" value={form.course_id} onChange={set('course_id')} required>
            <option value="">— Chọn khóa học —</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {examMode === 'AI' && (
          <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="block text-slate-700">Loại tài liệu *</label>
              <Select value={docType} onChange={e => setDocType(e.target.value)}>
                <option value="THEORY">Tài liệu Lý thuyết (AI tự thiết kế câu hỏi)</option>
                <option value="QUESTIONS">Đề bài / Câu hỏi sẵn có (AI quét & giải đáp án)</option>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-slate-700">Tải tệp PDF tài liệu *</label>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
              />
              
              {file ? (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-700 truncate mr-2">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1 font-bold"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span> Chọn file PDF
                </button>
              )}
            </div>
          </div>
        )}

        {examMode === 'MATRIX' && (
          <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4">
            <Select label="Áp dụng Ma trận cấu trúc *" value={form.matrix_id} onChange={set('matrix_id')} required>
              <option value="">— Vui lòng chọn Ma trận —</option>
              <option value="none">Không dùng ma trận đề (Nhập số lượng câu hỏi)</option>
              {matrices.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </Select>

            {form.matrix_id === 'none' && (
              <div className="bg-white p-4 border border-indigo-100 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-700">Cấu trúc mức độ & Loại câu hỏi</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Trắc nghiệm (Dễ)" type="number" min={0} value={form.easy} onChange={set('easy')} />
                  <Input label="Trắc nghiệm (TB)" type="number" min={0} value={form.medium} onChange={set('medium')} />
                  <Input label="Trắc nghiệm (Khó)" type="number" min={0} value={form.hard} onChange={set('hard')} />
                  <Input label="Số câu Tự luận" type="number" min={0} value={form.essay} onChange={set('essay')} />
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Tổng số câu hỏi:</span>
                  <span className="font-bold text-primary">{(parseInt(form.easy) || 0) + (parseInt(form.medium) || 0) + (parseInt(form.hard) || 0) + (parseInt(form.essay) || 0)}</span>
                </div>
              </div>
            )}

            <Select label="Lọc theo Nguồn tài liệu (Tùy chọn)" value={form.material_id} onChange={set('material_id')} disabled={!form.course_id}>
              <option value="">— Lấy tổng hợp toàn bộ Ngân hàng —</option>
              {courseMaterials.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </Select>
            <p className="text-xs text-indigo-600 font-medium">Hệ thống sẽ lấy tự động các câu hỏi gốc từ Ngân hàng (chưa từng ghép vào đề) để ráp theo cấu trúc.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input label="Thời gian làm bài (phút)" type="number" value={form.duration} onChange={set('duration')} required />
          <Select label="Trạng thái" value={form.status} onChange={set('status')}>
            <option value="DRAFT">Lưu Nháp</option>
            <option value="ACTIVE">Mở thi ngay</option>
          </Select>
        </div>

        <div className="flex justify-end pt-4"><Btn type="submit" loading={saving}>Khởi tạo Đề thi</Btn></div>
      </form>
    </Modal>
  );
};

const ExamBank = () => {
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await examsService.getByTeacher(profile.id);
    setExams(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  const filtered = exams.filter(e => {
    const matchFilter = filter === 'ALL' || e.status === filter;
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusCounts = STATUS_OPTS.reduce((acc, opt) => {
    acc[opt.value] = opt.value === 'ALL' ? exams.length : exams.filter(e => e.status === opt.value).length;
    return acc;
  }, {});

  const handleStatusChange = async (examId, newStatus) => {
    setStatusUpdating(examId);
    const targetExam = exams.find(e => e.id === examId);

    if (targetExam && targetExam.class_id) {
      const { data: students } = await supabase.from('student_classes').select('student_id').eq('class_id', targetExam.class_id);
      if (students && students.length > 0) {
        let notifs = [];
        const isMock = targetExam.title.includes('[Thi thử]');

        if (newStatus === 'ACTIVE') {
          notifs = students.map(s => ({
            user_id: s.student_id, title: isMock ? '📝 Đề thi thử mới!' : '🔥 Đề thi chính thức đã mở!',
            message: `Vào làm bài: "${targetExam.title}".`, type: 'EXAM',
            action_url: isMock ? `/student/mock-exams` : `/student/exams`, read_status: false
          }));
        } else if (newStatus === 'ENDED') {
          notifs = students.map(s => ({
            user_id: s.student_id, title: '🔒 Đề thi đã đóng!', message: `Bài thi "${targetExam.title}" đã kết thúc.`,
            type: 'SYSTEM', action_url: `/student/history`, read_status: false
          }));
        }
        if (notifs.length > 0) await supabase.from('notifications').insert(notifs);
      }
    }
    const { error: err } = await examsAdminService.updateStatus(examId, newStatus);
    if (!err) setExams(prev => prev.map(e => e.id === examId ? { ...e, status: newStatus } : e));
    setStatusUpdating(null);
  };

  const handleDelete = async () => {
    const { error: err } = await examsAdminService.delete(confirmId);
    if (!err) setExams(prev => prev.filter(e => e.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Quản lý Đề thi" actions={<Btn icon="add" onClick={() => setCreateOpen(true)}>Tạo đề thi mới</Btn>} />
      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên đề thi..." className="sm:max-w-sm" />
        <FilterTabs options={STATUS_OPTS.map(o => ({ ...o, count: statusCounts[o.value] }))} value={filter} onChange={setFilter} />
      </div>

      <Card>
        <Table>
          <thead><tr><Th>Tên đề thi</Th><Th>Khóa học</Th><Th>Thời gian</Th><Th>Trạng thái</Th><Th>Thao tác</Th></tr></thead>
          <tbody>
            {loading ? <SkRow cols={5} /> : filtered.map(exam => {
              const next = NEXT_STATUS[exam.status];
              return (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <Td><p className="font-semibold text-slate-800">{exam.title}</p></Td>
                  <Td><p className="text-slate-500 text-sm">{exam.courses?.name || '—'}</p></Td>
                  <Td>{exam.duration} phút</Td>
                  <Td><StatusBadge status={exam.status ?? 'DRAFT'} /></Td>
                  <Td>
                    <div className="flex gap-2">
                      <IconBtn icon="help" onClick={() => navigate('/teacher/questions')} />
                      <IconBtn icon="rate_review" onClick={() => navigate(`/teacher/essay-grading?examId=${exam.id}`)} />
                      {next && (
                        <Btn variant={next === 'ACTIVE' ? 'success' : 'warning'} size="xs" loading={statusUpdating === exam.id} onClick={() => handleStatusChange(exam.id, next)}>
                          {NEXT_LABEL[exam.status]}
                        </Btn>
                      )}
                      <IconBtn icon="delete" variant="danger" size="sm" onClick={() => setConfirmId(exam.id)} />
                    </div>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
      <CreateExamModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load} profile={profile} />
      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Xóa đề thi" message="Bạn chắc chắn muốn xóa đề thi này?" confirmLabel="Xóa" />
    </AppLayout>
  );
};
export default ExamBank;