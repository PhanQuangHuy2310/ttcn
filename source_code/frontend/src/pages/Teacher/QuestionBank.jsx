// src/pages/Teacher/QuestionBank.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  Btn, IconBtn, Card, EmptyState, ErrorBanner, Sk,
  PageHeader, Modal, Input, Select, Textarea, ConfirmDialog,
  SearchInput, FilterTabs,
} from '../../components/ui';
import { questionsService, examsService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';

const TYPE_LABEL = { MCQ: 'Trắc nghiệm', ESSAY: 'Tự luận', TRUE_FALSE: 'Đúng/Sai' };

// ── Hàm bóc tách options an toàn chống sập màn hình ──────────
const getOptionsArray = (opts) => {
  if (Array.isArray(opts)) return opts;
  if (typeof opts === 'string') {
    try {
      const parsed = JSON.parse(opts);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) { }
  }
  return ['', '', '', ''];
};

// ── Modal Thêm/Sửa câu hỏi ───────────
const QuestionModal = ({ open, onClose, onSaved, exams, defaultExamId, editQuestion }) => {
  const isEdit = !!editQuestion;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    exam_id: '',
    content: '',
    type: 'MCQ',
    points: 1,
    options: ['', '', '', ''],
    correct_answer: '',
  });

  useEffect(() => {
    if (!open) return;
    if (editQuestion) {
      let safeOptions = getOptionsArray(editQuestion.options);
      while (safeOptions.length < 4) safeOptions.push('');

      setForm({
        exam_id: editQuestion.exam_id ?? '',
        content: editQuestion.content ?? '',
        type: editQuestion.type ?? 'MCQ',
        points: editQuestion.points ?? 1,
        options: safeOptions,
        correct_answer: editQuestion.correct_answer ?? '',
      });
    } else {
      setForm({
        exam_id: defaultExamId || '',
        content: '', type: 'MCQ', points: 1,
        options: ['', '', '', ''], correct_answer: ''
      });
    }
    setError(null);
  }, [open, editQuestion, defaultExamId]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const setOption = (i, val) => setForm(f => {
    const opts = [...f.options];
    opts[i] = val;
    const newCorrect = f.correct_answer === f.options[i] && !val.trim() ? '' : f.correct_answer;
    return { ...f, options: opts, correct_answer: newCorrect };
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.exam_id) { setError('Vui lòng chọn đề thi để gắn câu hỏi.'); return; }
    if (!form.content.trim()) { setError('Vui lòng nhập nội dung câu hỏi.'); return; }

    if (form.type === 'MCQ') {
      const validOptions = form.options.filter(o => o.trim() !== '');
      if (validOptions.length < 2) { setError('Câu trắc nghiệm phải có ít nhất 2 phương án.'); return; }
      if (!form.correct_answer) { setError('Vui lòng chọn 1 đáp án đúng.'); return; }
    }

    setSaving(true);
    setError(null);

    const payload = {
      exam_id: form.exam_id,
      content: form.content.trim(),
      type: form.type,
      points: parseFloat(form.points) || 1,
      options: form.type === 'MCQ' ? form.options.filter(c => c.trim()) : null,
      correct_answer: form.type === 'ESSAY' ? null : form.correct_answer || null,
    };

    const { data, error: err } = isEdit
      ? await questionsService.update(editQuestion.id, payload)
      : await questionsService.create(payload);

    setSaving(false);
    if (err) { setError('Không thể lưu câu hỏi. Lỗi: ' + err); return; }

    onSaved?.(data, isEdit);
    onClose();
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl font-medium">{error}</p>}

        <Select label="Gắn vào đề thi *" value={form.exam_id} onChange={set('exam_id')} required>
          <option value="">— Chọn đề thi —</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Loại câu hỏi" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, correct_answer: '' }))}>
            <option value="MCQ">Trắc nghiệm</option>
            <option value="ESSAY">Tự luận</option>
          </Select>
          <Input label="Điểm số" type="number" min={0.1} max={10} step={0.1} value={form.points} onChange={set('points')} />
        </div>

        <Textarea label="Nội dung câu hỏi *" value={form.content} onChange={set('content')} rows={3} placeholder="Ví dụ: Đâu là một trong những nguyên lý cơ bản của OOP?" required />

        {form.type === 'MCQ' && (
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Các phương án lựa chọn (A, B, C, D) *</label>
            {form.options.slice(0, 4).map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {optionLetters[i]}
                </span>
                <input
                  value={opt}
                  onChange={e => setOption(i, e.target.value)}
                  placeholder={`Nhập phương án ${optionLetters[i]}`}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}

            <div className="pt-2">
              <Select label="Chọn đáp án đúng *" value={form.correct_answer} onChange={set('correct_answer')} required>
                <option value="">— Chọn đáp án đúng —</option>
                {form.options.map((c, i) => c.trim() && <option key={i} value={c}>{optionLetters[i]}: {c}</option>)}
              </Select>
            </div>
          </div>
        )}

        {form.type === 'ESSAY' && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex gap-2">
            <span className="material-symbols-outlined text-blue-500">info</span>
            <p>Đối với câu tự luận, học sinh sẽ nhập văn bản để trả lời. Giáo viên sẽ tiến hành chấm điểm thủ công sau khi thi xong.</p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Btn variant="outline" type="button" onClick={onClose}>Huỷ</Btn>
          <Btn type="submit" loading={saving} icon={isEdit ? 'save' : 'add'}>{isEdit ? 'Lưu thay đổi' : 'Lưu câu hỏi'}</Btn>
        </div>
      </form>
    </Modal>
  );
};

const TYPE_FILTER_OPTS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'MCQ', label: 'Trắc nghiệm' },
  { value: 'ESSAY', label: 'Tự luận' }
];

// ── Trang Chính ───────────────────────────────────────────────────
const QuestionBank = () => {
  const profile = useSelector(selectProfile);
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [examFilter, setExamFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editQ, setEditQ] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);

    try {
      // 1. Lấy danh sách Đề thi của giáo viên
      const { data: examData, error: examErr } = await examsService.getByTeacher(profile.id);
      if (examErr) throw new Error('Lỗi tải đề thi: ' + examErr);

      const fetchedExams = examData || [];
      setExams(fetchedExams);

      // 2. Nếu giáo viên chưa có đề thi nào thì chắc chắn không có câu hỏi
      if (fetchedExams.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const examIds = fetchedExams.map(e => e.id);

      // 3. Lấy thuần túy câu hỏi, loại bỏ hoàn toàn các cấu trúc JOIN gây lỗi Database
      const { data: qData, error: qErr } = await supabase
        .from('questions')
        .select('*')
        .in('exam_id', examIds)
        .order('created_at', { ascending: false });

      if (qErr) throw new Error('Lỗi truy vấn câu hỏi: ' + qErr.message);

      // 4. Dùng Javascript để ghép nối thông tin đề thi vào câu hỏi
      const questionsWithExams = (qData || []).map(q => {
        const parentExam = fetchedExams.find(e => e.id === q.exam_id);
        return {
          ...q,
          exams: parentExam ? { id: parentExam.id, title: parentExam.title } : null
        };
      });

      setQuestions(questionsWithExams);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Không thể tải ngân hàng câu hỏi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [profile?.id]);

  const filtered = questions.filter(q => {
    const matchType = typeFilter === 'ALL' || q.type === typeFilter;
    const matchExam = examFilter === '' || q.exam_id === examFilter;
    const matchSearch = !search || q.content?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchExam && matchSearch;
  });

  const handleDelete = async () => {
    const { error: err } = await questionsService.delete(confirmId);
    if (!err) setQuestions(prev => prev.filter(q => q.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title="Ngân hàng câu hỏi"
        subtitle={`Quản lý ${questions.length} câu hỏi trắc nghiệm & tự luận`}
        actions={<Btn icon="add" onClick={() => { setEditQ(null); setModalOpen(true); }}>Tạo câu hỏi mới</Btn>}
      />
      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm nội dung câu hỏi..." />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Select value={examFilter} onChange={e => setExamFilter(e.target.value)} className="min-w-[200px] border-slate-200">
            <option value="">Lọc theo: Tất cả Đề thi</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </Select>
          <FilterTabs options={TYPE_FILTER_OPTS} value={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      <Card>
        {loading ? <div className="p-6 space-y-4"><Sk className="h-16 w-full" /><Sk className="h-16 w-full" /></div> : (
          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <EmptyState
                icon="quiz"
                title="Chưa có câu hỏi nào"
                subtitle="Hãy thêm câu hỏi thủ công hoặc sử dụng chức năng AI bóc tách từ PDF ở màn hình Kho Tài liệu."
              />
            ) : (
              filtered.map(q => {
                const safeOptions = getOptionsArray(q.options);

                return (
                  <div key={q.id} className="px-6 py-5 flex items-start gap-4 hover:bg-slate-50/60 transition-colors group">
                    <div className="pt-0.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${q.type === 'MCQ' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {TYPE_LABEL[q.type]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.content}</p>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">assignment</span>
                          {q.exams?.title || 'Không rõ đề thi'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{q.points ?? 1} điểm</span>
                      </div>

                      {q.type === 'MCQ' && safeOptions.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {safeOptions.map((opt, idx) => {
                            if (!opt) return null;
                            return (
                              <div key={idx} className={`truncate px-2 py-1 rounded-md ${opt === q.correct_answer ? 'bg-green-50 text-green-700 font-bold border border-green-100' : 'text-slate-500'}`}>
                                {String.fromCharCode(65 + idx)}. {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconBtn icon="edit" label="Chỉnh sửa" variant="secondary" size="sm" onClick={() => { setEditQ(q); setModalOpen(true); }} />
                      <IconBtn icon="delete" label="Xóa" variant="danger" size="sm" onClick={() => setConfirmId(q.id)} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      <QuestionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditQ(null); }}
        onSaved={(saved, isEdit) => { load(); }}
        exams={exams}
        defaultExamId={examFilter}
        editQuestion={editQ}
      />
      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Xóa câu hỏi" message="Hành động này sẽ xóa vĩnh viễn câu hỏi khỏi cơ sở dữ liệu." confirmLabel="Xóa" />
    </AppLayout>
  );
};

export default QuestionBank;