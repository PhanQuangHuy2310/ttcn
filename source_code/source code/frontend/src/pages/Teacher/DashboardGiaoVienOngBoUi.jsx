// src/pages/Teacher/DashboardGiaoVienOngBoUi.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Re-exports same logic as DashboardGiaoVienDhdeduOngBoAzota with OngBoUi layout
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardGiaoVienOngBoUi = () => {
  const [profile, setProfile] = useState(null);
  const [stats,   setStats]   = useState(null);
  const [exams,   setExams]   = useState([]);
  const [subs,    setSubs]    = useState([]);
  const [loading, setLoading] = useState(true);

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
      setExams((examsRes.data ?? []).slice(0, 4));

      const { data: subsData } = await supabase.from('submissions')
        .select('id, status, score, submitted_at, users(full_name), exams!inner(title, courses!inner(teacher_id))')
        .eq('exams.courses.teacher_id', user.id)
        .eq('status', 'SUBMITTED')
        .order('submitted_at', { ascending: false })
        .limit(5);
      setSubs(subsData ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <TeacherHeader />
          <main className="p-8 max-w-7xl mx-auto w-full space-y-10">

            <section>
              {loading ? <Skeleton className="h-8 w-64" /> : (
                <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                  {greeting()}, {profile?.full_name?.split(' ').pop() ?? 'Thầy/Cô'}! 👋
                </h2>
              )}
              <p className="text-slate-500 mt-2">
                Bạn có {stats?.pendingGrade ?? 0} bài chờ chấm · {stats?.totalStudents ?? 0} sinh viên đang học.
              </p>
            </section>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Khóa học',  value: stats?.totalCourses,  icon: 'menu_book',      cls: 'bg-indigo-50 text-indigo-600' },
                { label: 'Lớp học',   value: stats?.totalClasses,  icon: 'school',          cls: 'bg-blue-50 text-blue-600' },
                { label: 'Đề thi',    value: stats?.totalExams,    icon: 'quiz',            cls: 'bg-purple-50 text-purple-600' },
                { label: 'Chờ chấm',  value: stats?.pendingGrade,  icon: 'pending_actions', cls: 'bg-orange-50 text-orange-600' },
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                  <div className={`size-11 rounded-xl flex items-center justify-center ${c.cls}`}>
                    <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{c.label}</p>
                    {loading ? <Skeleton className="h-6 w-10 mt-1" /> : (
                      <p className="text-xl font-black text-on-surface">{c.value ?? 0}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Exams */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold">Kỳ thi gần đây</h3>
                  <a href="/teacher/examsteacher" className="text-primary text-xs font-semibold">Xem tất cả →</a>
                </div>
                {loading ? (
                  <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
                ) : exams.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Chưa có đề thi</p>
                ) : exams.map(e => (
                  <div key={e.id} className="flex items-center gap-3 p-3.5 hover:bg-slate-50 rounded-xl transition-colors mb-2">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-base">quiz</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{e.title}</p>
                      <p className="text-xs text-slate-400">{e.classes?.name ?? '—'} · {e.duration} phút</p>
                    </div>
                    <span className="text-xs text-slate-300">{(e.submissions ?? []).length} bài</span>
                  </div>
                ))}
              </div>

              {/* Recent submissions */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold">Bài nộp mới</h3>
                  <a href="/teacher/reportsteacher" className="text-primary text-xs font-semibold">Xem tất cả →</a>
                </div>
                {loading ? (
                  <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
                ) : subs.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Chưa có bài nộp</p>
                ) : subs.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">{(sub.users?.full_name ?? 'S').charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{sub.users?.full_name ?? '—'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{sub.exams?.title}</p>
                    </div>
                    {sub.score !== null ? (
                      <span className={`text-xs font-black ${sub.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>{sub.score}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-orange-500">Chờ</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGiaoVienOngBoUi;
