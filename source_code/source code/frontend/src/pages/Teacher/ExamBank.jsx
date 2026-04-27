// src/pages/Teacher/ExamBank.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, EmptyState, ErrorBanner, StatusBadge, Sk, PageHeader, fmtDateTime } from '../../components/ui';
import { examsService, examsAdminService, coursesService } from '../../services/supabaseService';

const STATUS_FILTERS = ['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED', 'GRADING'];

const ExamBank = () => {
  const profile = useSelector(selectProfile);
  const [exams,    setExams]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState('ALL');
  const [search,   setSearch]   = useState('');
  const [creating, setCreating] = useState(false);
  const [newExam,  setNewExam]  = useState({ title: '', duration: 60, status: 'DRAFT' });

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data, error: err } = await examsService.getByTeacher(profile.id);
    if (err) setError('Không thể tải ngân hàng đề thi.');
    else setExams(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  const filtered = exams.filter(e => {
    const matchFilter = filter === 'ALL' || e.status === filter;
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCreate = async () => {
    if (!newExam.title.trim() || !profile?.id) return;
    setCreating(true);
    // Resolve course_id via service layer
    const { data: courseList } = await coursesService.getByTeacher(profile.id);
    const courseId = courseList?.[0]?.id;
    if (!courseId) { setError('Bạn cần tạo khóa học trước khi tạo đề thi.'); setCreating(false); return; }

    const { data, error: err } = await examsAdminService.create({ ...newExam, course_id: courseId });
    if (err) setError('Không thể tạo đề thi. Vui lòng thử lại.');
    else { setExams(prev => [data, ...prev]); setNewExam({ title: '', duration: 60, status: 'DRAFT' }); }
    setCreating(false);
  };

  const handleStatusChange = async (examId, newStatus) => {
    const { error: err } = await examsAdminService.updateStatus(examId, newStatus);
    if (!err) setExams(prev => prev.map(e => e.id === examId ? { ...e, status: newStatus } : e));
  };

  const handleDelete = async (examId) => {
    const { error: err } = await examsAdminService.delete(examId);
    if (!err) setExams(prev => prev.filter(e => e.id !== examId));
  };

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title="Ngân hàng đề thi"
        subtitle={`${exams.length} đề thi trong hệ thống`}
        actions={
          <button
            onClick={() => setCreating(c => !c)}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo đề thi mới
          </button>
        }
      />
      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Create form */}
      {creating && (
        <Card className="mb-6">
          <CardHeader title="Tạo đề thi mới" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tên đề thi</label>
              <input
                type="text"
                value={newExam.title}
                onChange={e => setNewExam(p => ({ ...p, title: e.target.value }))}
                placeholder="Ví dụ: Kiểm tra Toán - HK1 2024"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Thời gian (phút)</label>
              <input
                type="number"
                value={newExam.duration}
                onChange={e => setNewExam(p => ({ ...p, duration: parseInt(e.target.value) || 60 }))}
                min={5} max={300}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3">
              <button onClick={() => setCreating(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={!newExam.title.trim()}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
              >
                Tạo đề thi
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm đề thi..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {s === 'ALL' ? 'Tất cả' : s === 'DRAFT' ? 'Nháp' : s === 'PUBLISHED' ? 'Đã mở' : s === 'CLOSED' ? 'Đã đóng' : 'Đang chấm'}
            </button>
          ))}
        </div>
      </div>

      {/* Exam list */}
      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Sk key={i} className="h-20 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon="quiz" title="Không có đề thi nào" subtitle="Tạo đề thi mới để bắt đầu." /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(exam => (
            <Card key={exam.id}>
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-purple-600 text-xl">quiz</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 truncate">{exam.title}</p>
                    <StatusBadge status={exam.status ?? 'DRAFT'} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {exam.courses?.name ?? '—'} · {exam.duration ?? 60} phút
                    {exam.start_time && ` · Bắt đầu: ${fmtDateTime(exam.start_time)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status controls */}
                  {exam.status === 'DRAFT' && (
                    <button onClick={() => handleStatusChange(exam.id, 'PUBLISHED')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition">
                      Mở thi
                    </button>
                  )}
                  {exam.status === 'PUBLISHED' && (
                    <button onClick={() => handleStatusChange(exam.id, 'CLOSED')}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition">
                      Đóng thi
                    </button>
                  )}
                  {exam.status === 'CLOSED' && (
                    <button onClick={() => handleStatusChange(exam.id, 'GRADING')}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition">
                      Bắt đầu chấm
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ExamBank;
