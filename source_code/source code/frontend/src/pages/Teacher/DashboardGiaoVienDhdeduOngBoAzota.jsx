// src/pages/Teacher/DashboardGiaoVienDhdeduOngBoAzota.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardGiaoVienDhdeduOngBoAzota = () => {
  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [classes,  setClasses]  = useState([]);
  const [pending,  setPending]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, statsRes, coursesRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        teacherService.getDashboardStats(user.id),
        teacherService.getCourses(user.id),
      ]);
      setProfile(prof.data);
      if (!statsRes.error) setStats(statsRes.data);
      const cls = (coursesRes.data ?? []).flatMap(c => (c.classes ?? []).map(cl => ({ ...cl, courseName: c.name, subject: c.subject })));
      setClasses(cls.slice(0, 4));

      // Pending grade submissions
      const { data: subs } = await supabase.from('submissions')
        .select('id, student_id, exam_id, submitted_at, users(full_name), exams!inner(title, course_id, courses!inner(teacher_id))')
        .eq('status', 'SUBMITTED')
        .is('score', null)
        .eq('exams.courses.teacher_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(5);
      setPending(subs ?? []);
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
      <TeacherSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TeacherHeader />
        <main className="p-8 space-y-8">

          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-container text-white shadow-xl">
            <div className="relative z-10">
              {loading ? <Skeleton className="h-8 w-72 bg-white/20" /> : (
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                  {greeting()}, {profile?.full_name ?? 'Thầy/Cô'}
                </h1>
              )}
              <p className="text-primary-fixed max-w-xl opacity-90">
                Hôm nay bạn có {stats?.totalClasses ?? 0} lớp học và {stats?.pendingGrade ?? 0} bài chờ chấm.
              </p>
              <div className="flex gap-3 mt-5">
                <a href="/teacher/examsteacher" className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform">
                  Tạo đề thi
                </a>
                <a href="/teacher/class-detailsteacher" className="border border-white/30 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
                  Xem lớp học
                </a>
              </div>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
              <span className="material-symbols-outlined text-[200px]">school</span>
            </div>
          </section>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Lớp học',   value: stats?.totalClasses,  icon: 'school',         color: 'text-blue-600 bg-blue-50' },
              { label: 'Sinh viên', value: stats?.totalStudents, icon: 'group',           color: 'text-green-600 bg-green-50' },
              { label: 'Đề thi',    value: stats?.totalExams,    icon: 'quiz',            color: 'text-purple-600 bg-purple-50' },
              { label: 'Chờ chấm',  value: stats?.pendingGrade,  icon: 'pending_actions', color: 'text-red-600 bg-red-50' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.color}`}>
                  <span className="material-symbols-outlined text-xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  {loading ? <Skeleton className="h-6 w-10 mt-1" /> : <p className="text-xl font-black">{c.value ?? 0}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My classes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Lớp học của tôi</h3>
                <a href="/teacher/class-detailsteacher" className="text-primary text-xs font-semibold">Xem tất cả</a>
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : classes.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Chưa có lớp học nào</p>
              ) : (
                <div className="space-y-3">
                  {classes.map(cls => (
                    <a key={cls.id} href={`/teacher/class-detailsteacher?classId=${cls.id}`}
                      className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl hover:bg-primary/5 transition-colors group">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-base">school</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-on-surface">{cls.name}</p>
                        <p className="text-xs text-slate-400">{cls.courseName} · {cls.subject}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-base transition-colors">chevron_right</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Pending grade */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Bài chờ chấm</h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                  {stats?.pendingGrade ?? 0} bài
                </span>
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : pending.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl mb-1 block">check_circle</span>
                  <p className="text-sm">Không có bài nào cần chấm</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map(sub => (
                    <a key={sub.id} href={`/teacher/gradingteacher-mo-rong-khung-bai-lam?examId=${sub.exam_id}`}
                      className="flex items-center gap-3 p-3.5 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                        <span className="text-orange-700 text-xs font-bold">{(sub.users?.full_name ?? 'S').charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-on-surface">{sub.users?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{sub.exams?.title ?? '—'}</p>
                      </div>
                      <span className="text-xs font-bold text-orange-600">Chấm →</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardGiaoVienDhdeduOngBoAzota;
