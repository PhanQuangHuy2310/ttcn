// src/pages/Teacher/DashboardGiaoVienDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardGiaoVienDhdedu = () => {
  const [profile,   setProfile]   = useState(null);
  const [stats,     setStats]     = useState(null);
  const [exams,     setExams]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, statsRes, examsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        teacherService.getDashboardStats(user.id),
        teacherService.getExams(user.id),
      ]);
      setProfile(prof.data);
      if (!statsRes.error) setStats(statsRes.data);
      setExams((examsRes.data ?? []).slice(0, 5));
      setLoading(false);
    }
    init();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  };

  const examStatusLabel = (exam) => {
    const now = new Date(), start = new Date(exam.start_time);
    const end = new Date(start.getTime() + exam.duration * 60000);
    if (!exam.start_time) return { label: 'Bản nháp', cls: 'text-slate-400' };
    if (now < start)      return { label: 'Sắp tới',  cls: 'text-blue-500' };
    if (now <= end)       return { label: 'Đang thi', cls: 'text-green-500' };
    return                       { label: 'Kết thúc', cls: 'text-slate-400' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <TeacherHeader />
          <main className="p-8 space-y-8">

            <div>
              {loading ? <Skeleton className="h-8 w-64" /> : (
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {greeting()}, {profile?.full_name?.split(' ').pop() ?? 'Thầy/Cô'}! 👋
                </h1>
              )}
              <p className="text-slate-500 mt-1">
                Bạn có {stats?.pendingGrade ?? 0} bài chờ chấm và {stats?.totalClasses ?? 0} lớp đang quản lý.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Lớp học',   value: stats?.totalClasses,  icon: 'school',           cls: 'bg-blue-50 text-blue-600' },
                { label: 'Sinh viên', value: stats?.totalStudents, icon: 'group',             cls: 'bg-green-50 text-green-600' },
                { label: 'Đề thi',    value: stats?.totalExams,    icon: 'quiz',              cls: 'bg-purple-50 text-purple-600' },
                { label: 'Chờ chấm',  value: stats?.pendingGrade,  icon: 'pending_actions',   cls: 'bg-orange-50 text-orange-600' },
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.cls}`}>
                    <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{c.label}</p>
                    {loading ? <Skeleton className="h-6 w-10 mt-1" /> : (
                      <p className="text-2xl font-black">{String(c.value ?? 0).padStart(2, '0')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent exams */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-on-surface">Kỳ thi gần đây</h3>
                <a href="/teacher/examsteacher" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : exams.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Chưa có đề thi nào</p>
              ) : (
                <div className="space-y-3">
                  {exams.map(e => {
                    const s = examStatusLabel(e);
                    return (
                      <div key={e.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{e.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{e.classes?.name ?? '—'} · {e.duration} phút</p>
                        </div>
                        <span className={`text-xs font-bold ${s.cls}`}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGiaoVienDhdedu;
