// src/pages/Teacher/NganHangEThiGiaoVienVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same data logic as NganHangEThiGiangVien, different layout (col-span-8 + sidebar panel)
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NganHangEThiGiaoVienVietHoa = () => {
  const [exams,    setExams]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await teacherService.getExams(user.id);
      setExams(data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const statusOf = (e) => {
    const now = new Date();
    if (!e.start_time) return 'draft';
    const start = new Date(e.start_time);
    const end   = new Date(start.getTime() + e.duration * 60000);
    if (now < start) return 'upcoming';
    if (now <= end)  return 'active';
    return 'ended';
  };

  const STATUS_CFG = {
    draft:    { label: 'Bản nháp',    cls: 'bg-slate-100 text-slate-500' },
    upcoming: { label: 'Sắp tới',     cls: 'bg-blue-50 text-blue-700'   },
    active:   { label: 'Đang diễn ra',cls: 'bg-green-50 text-green-700' },
    ended:    { label: 'Kết thúc',    cls: 'bg-gray-100 text-gray-500'  },
  };

  const filtered = exams.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || statusOf(e) === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-72 min-h-screen pb-20">
        <TeacherHeader />
        <div className="px-8 pt-8 space-y-8">
          <div className="grid grid-cols-12 gap-6">

            {/* Main content */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">filter_list</span>
                  Bộ lọc & tìm kiếm
                </h3>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm đề thi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
                  <option value="">Tất cả trạng thái</option>
                  <option value="draft">Bản nháp</option>
                  <option value="upcoming">Sắp tới</option>
                  <option value="active">Đang diễn ra</option>
                  <option value="ended">Kết thúc</option>
                </select>
              </div>

              {/* Exam list */}
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">quiz</span>
                  <p>Không tìm thấy đề thi nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(exam => {
                    const st = statusOf(exam);
                    const cfg = STATUS_CFG[st];
                    return (
                      <div key={exam.id} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary">quiz</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-on-surface truncate">{exam.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{exam.classes?.name ?? '—'} · {exam.duration} phút · {(exam.questions ?? []).length} câu</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${cfg.cls}`}>{cfg.label}</span>
                        <div className="flex gap-2 shrink-0">
                          <a href={`/teacher/class-detailsteacher?classId=${exam.class_id}`}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20">Chi tiết</a>
                          <a href={`/teacher/gradingteacher-mo-rong-khung-bai-lam?examId=${exam.id}`}
                            className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300">Chấm</a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar stats */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
                <h3 className="font-bold text-sm mb-4">Tổng quan</h3>
                {loading ? (
                  <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(STATUS_CFG).map(([key, cfg]) => {
                      const count = exams.filter(e => statusOf(e) === key).length;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{cfg.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>{count}</span>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-slate-100 flex justify-between">
                      <span className="text-sm font-semibold">Tổng cộng</span>
                      <span className="text-sm font-black text-primary">{exams.length}</span>
                    </div>
                  </div>
                )}
              </div>

              <a href="/teacher/examsteacher"
                className="block w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm text-center hover:opacity-90 shadow-lg shadow-primary/20">
                + Tạo đề thi mới
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NganHangEThiGiaoVienVietHoa;
