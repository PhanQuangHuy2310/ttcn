// src/pages/Teacher/NganHangEThiGiangVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NganHangEThiGiangVien = () => {
  const [exams,      setExams]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [subFilter,  setSubFilter]  = useState('');
  const [subjects,   setSubjects]   = useState([]);
  const [stats,      setStats]      = useState({ total: 0, active: 0, ended: 0 });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await teacherService.getExams(user.id);
      const list = data ?? [];
      setExams(list);
      const uniqueSubjects = [...new Set(list.map(e => e.courses?.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
      const now = new Date();
      const active = list.filter(e => {
        if (!e.start_time) return false;
        const start = new Date(e.start_time);
        const end   = new Date(start.getTime() + e.duration * 60000);
        return now >= start && now <= end;
      }).length;
      setStats({ total: list.length, active, ended: list.filter(e => e.start_time && new Date(e.start_time).getTime() + e.duration * 60000 < now.getTime()).length });
      setLoading(false);
    }
    init();
  }, []);

  const filtered = exams.filter(e => {
    const matchSearch = !search    || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchSub    = !subFilter || e.courses?.subject === subFilter;
    return matchSearch && matchSub;
  });

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : 'Chưa lên lịch';

  const statusOf = (e) => {
    const now = new Date();
    if (!e.start_time) return { label: 'Bản nháp', cls: 'bg-slate-100 text-slate-500' };
    const start = new Date(e.start_time);
    const end   = new Date(start.getTime() + e.duration * 60000);
    if (now < start) return { label: 'Sắp tới',  cls: 'bg-blue-50 text-blue-700' };
    if (now <= end)  return { label: 'Đang thi', cls: 'bg-green-50 text-green-700' };
    return                  { label: 'Kết thúc', cls: 'bg-gray-100 text-gray-500' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="font-headline text-4xl font-extrabold text-slate-900 tracking-tight">Ngân hàng đề thi</h1>
              <p className="text-slate-500 mt-2 text-lg">Quản lý và biên soạn bộ đề kiểm tra chất lượng cao.</p>
            </div>
            <a href="/teacher/examsteacher" className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">add</span>
              Tạo đề thi mới
            </a>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              { label: 'Tổng đề thi',    value: stats.total,  cls: 'bg-primary/10 text-primary' },
              { label: 'Đang diễn ra',   value: stats.active, cls: 'bg-green-50 text-green-600' },
              { label: 'Đã kết thúc',    value: stats.ended,  cls: 'bg-slate-100 text-slate-500' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : (
                  <p className={`text-3xl font-black ${c.cls.split(' ')[1]}`}>{c.value}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm đề thi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select value={subFilter} onChange={e => setSubFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tất cả môn</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Exam grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
              <p>Chưa có đề thi nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(exam => {
                const s = statusOf(exam);
                const submitted = (exam.submissions ?? []).filter(sub => sub.status === 'SUBMITTED').length;
                return (
                  <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                      <span className="text-xs text-slate-300">{exam.courses?.subject ?? '—'}</span>
                    </div>
                    <h3 className="font-bold text-on-surface mb-1 line-clamp-2">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{exam.classes?.name ?? '—'} · {exam.duration} phút · {formatDate(exam.start_time)}</p>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4 mt-auto">
                      {[
                        { label: 'Câu hỏi', value: (exam.questions ?? []).length },
                        { label: 'Nộp bài', value: submitted },
                        { label: 'Tổng SV', value: (exam.submissions ?? []).length },
                      ].map((c, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg py-2">
                          <p className="text-base font-black text-on-surface">{c.value}</p>
                          <p className="text-[10px] text-slate-400">{c.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={`/teacher/class-detailsteacher?classId=${exam.class_id}`}
                        className="flex-1 py-2 text-center bg-primary/5 text-primary rounded-lg text-xs font-bold hover:bg-primary/10">Chi tiết</a>
                      <a href={`/teacher/gradingteacher-mo-rong-khung-bai-lam?examId=${exam.id}`}
                        className="flex-1 py-2 text-center bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200">Chấm bài</a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NganHangEThiGiangVien;
