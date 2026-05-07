// src/pages/Teacher/ExamMatrices.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  Btn, IconBtn, Card, EmptyState, ErrorBanner, Sk, PageHeader,
  fmtDate, Modal, Input, ConfirmDialog, CardHeader, Select
} from '../../components/ui';
import { examMatricesService, examsService } from '../../services/supabaseService';

// ── Create Matrix Modal ───────────────────────────────────────
const CreateMatrixModal = ({ open, onClose, onCreated, profile }) => {
  const [exams, setExams] = useState([]);

  const [form, setForm] = useState({ title: '', exam_id: '' });
  const [config, setConfig] = useState({ easy: 0, medium: 0, hard: 0, essay: 0 });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !profile?.id) return;
    examsService.getByTeacher(profile.id).then(({ data }) => setExams(data ?? []));
  }, [open, profile?.id]);

  const setFormVal = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setConfVal = k => e => setConfig(c => ({ ...c, [k]: parseInt(e.target.value) || 0 }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Vui lòng nhập tên ma trận.'); return; }

    // Bắt buộc chọn Đề thi để dữ liệu không bị "tàng hình" khi query INNER JOIN
    if (!form.exam_id) { setError('Vui lòng chọn Đề thi để gắn ma trận.'); return; }

    if (config.easy + config.medium + config.hard + config.essay === 0) {
      setError('Vui lòng thiết lập ít nhất 1 câu hỏi cho ma trận.'); return;
    }

    setSaving(true);
    setError(null);

    const { data, error: err } = await examMatricesService.create({
      title: form.title.trim(),
      exam_id: form.exam_id,
      config: config,
    });

    setSaving(false);
    if (err) { setError('Không thể tạo ma trận: ' + err); return; }

    // Gọi hàm load() ở component cha để làm mới danh sách ngay lập tức
    if (onCreated) onCreated();

    setForm({ title: '', exam_id: '' });
    setConfig({ easy: 0, medium: 0, hard: 0, essay: 0 });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo ma trận đề thi mới">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl font-medium">{error}</p>}

        <Input label="Tên ma trận *" value={form.title} onChange={setFormVal('title')} placeholder="Ví dụ: Cấu trúc thi giữa kỳ môn Toán" required />

        {/* Yêu cầu bắt buộc (required) chọn đề thi */}
        <Select label="Gắn với Đề thi *" value={form.exam_id} onChange={setFormVal('exam_id')} required>
          <option value="">— Vui lòng chọn một đề thi —</option>
          {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </Select>

        <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-3">
          <label className="block text-sm font-bold text-slate-700">Cấu trúc mức độ & Loại câu hỏi</label>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Trắc nghiệm (Dễ)" type="number" min={0} value={config.easy} onChange={setConfVal('easy')} />
            <Input label="Trắc nghiệm (TB)" type="number" min={0} value={config.medium} onChange={setConfVal('medium')} />
            <Input label="Trắc nghiệm (Khó)" type="number" min={0} value={config.hard} onChange={setConfVal('hard')} />
            <Input label="Số câu Tự luận" type="number" min={0} value={config.essay} onChange={setConfVal('essay')} />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-600">Tổng số câu hỏi:</span>
            <span className="font-black text-primary text-lg">{config.easy + config.medium + config.hard + config.essay}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          Khi tạo đề thi, hệ thống sẽ tự động bốc ngẫu nhiên số lượng câu hỏi Trắc nghiệm và Tự luận từ Ngân hàng tương ứng với cấu hình trên.
        </p>

        <div className="flex gap-3 justify-end pt-2">
          <Btn variant="outline" type="button" onClick={onClose}>Huỷ</Btn>
          <Btn type="submit" loading={saving} icon="save">Lưu ma trận</Btn>
        </div>
      </form>
    </Modal>
  );
};

// ── Matrix detail modal ───────────────────────────────────────
const MatrixDetailModal = ({ matrix, onClose }) => {
  if (!matrix) return null;
  const config = matrix.config ?? { easy: 0, medium: 0, hard: 0, essay: 0 };
  const total = (config.easy || 0) + (config.medium || 0) + (config.hard || 0) + (config.essay || 0);

  return (
    <Modal open={!!matrix} onClose={onClose} title={matrix.title}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-medium">Ngày tạo</p>
            <p className="font-semibold text-slate-800 mt-0.5">{fmtDate(matrix.created_at)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-medium">Đề thi liên kết</p>
            <p className="font-semibold text-slate-800 mt-0.5">{matrix.exams?.title || 'Không xác định'}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm font-bold text-blue-900 mb-4">Cấu trúc bốc đề tự động</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-blue-50/50">
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Trắc nghiệm (Dễ)</span>
              <span className="font-black text-slate-800">{config.easy || 0} câu</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-blue-50/50">
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Trắc nghiệm (TB)</span>
              <span className="font-black text-slate-800">{config.medium || 0} câu</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-blue-50/50">
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div> Trắc nghiệm (Khó)</span>
              <span className="font-black text-slate-800">{config.hard || 0} câu</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-blue-50/50">
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400"></div> Tự luận</span>
              <span className="font-black text-slate-800">{config.essay || 0} câu</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200/60 flex justify-between items-center">
            <span className="text-sm font-bold text-blue-800">Tổng quy mô đề thi:</span>
            <span className="text-xl font-black text-primary">{total} câu hỏi</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Btn variant="outline" onClick={onClose}>Đóng</Btn>
        </div>
      </div>
    </Modal>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const ExamMatrices = () => {
  const profile = useSelector(selectProfile);
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewMatrix, setViewMatrix] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await examMatricesService.getByTeacher(profile.id);
    if (err) setError('Không thể tải danh sách ma trận đề thi.');
    else setMatrices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  const handleDelete = async () => {
    setDeleting(true);
    const { error: err } = await examMatricesService.delete(confirmId);
    if (!err) setMatrices(prev => prev.filter(m => m.id !== confirmId));
    else setError('Không thể xóa ma trận.');
    setDeleting(false);
    setConfirmId(null);
  };

  const matrixToDelete = matrices.find(m => m.id === confirmId);

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title="Ma trận đề thi"
        subtitle={`${matrices.length} ma trận đã tạo`}
        actions={
          <Btn icon="add" onClick={() => setCreateOpen(true)}>Tạo ma trận mới</Btn>
        }
      />

      {error && <ErrorBanner message={error} onRetry={load} />}

      <Card>
        <CardHeader title="Danh sách ma trận" subtitle="Quản lý cấu hình cơ cấu trộn đề thi tự động" />
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Sk key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : matrices.length === 0 ? (
          <EmptyState
            icon="grid_view"
            title="Chưa có ma trận đề thi nào"
            subtitle="Tạo ma trận đề thi để hệ thống tự động bốc câu hỏi từ Ngân hàng."
            action={<Btn icon="add" onClick={() => setCreateOpen(true)}>Tạo ma trận đầu tiên</Btn>}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {matrices.map(m => {
              const conf = m.config ?? {};
              const totalQ = (conf.easy || 0) + (conf.medium || 0) + (conf.hard || 0) + (conf.essay || 0);

              return (
                <div key={m.id} className="px-6 py-5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
                    <span className="material-symbols-outlined text-indigo-600 text-2xl">grid_view</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-base">{m.title ?? 'Ma trận không tên'}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                        Tổng {totalQ} câu
                      </span>
                      <p className="text-xs text-slate-400">Trắc nghiệm: {(conf.easy || 0) + (conf.medium || 0) + (conf.hard || 0)} · Tự luận: {conf.essay || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Btn variant="outline" size="sm" icon="visibility" onClick={() => setViewMatrix(m)}>Chi tiết</Btn>
                    <IconBtn icon="delete" label="Xóa" variant="danger" size="sm" onClick={() => setConfirmId(m.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <CreateMatrixModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => load()} profile={profile} />
      <MatrixDetailModal matrix={viewMatrix} onClose={() => setViewMatrix(null)} />
      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} title="Xóa ma trận đề thi" message={`Xóa ma trận "${matrixToDelete?.title}"? Các đề thi đã trộn từ ma trận này sẽ không bị ảnh hưởng.`} confirmLabel="Xóa ma trận" />
    </AppLayout>
  );
};

export default ExamMatrices;