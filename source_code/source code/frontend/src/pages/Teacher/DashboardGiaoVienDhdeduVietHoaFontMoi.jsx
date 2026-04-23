// src/pages/Teacher/DashboardGiaoVienDhdeduVietHoaFontMoi.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardGiaoVienDhdeduVietHoaFontMoi = () => {
  const [profile,       setProfile]       = useState(null);
  const [stats,         setStats]         = useState(null);
  const [recentExams,   setRecentExams]   = useState([]);
  const [recentSubs,    setRecentSubs]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error('Chưa đăng nhập');

        const { data: prof } = await supabase.from('users').select('*').eq('id', authUser.id).single();
        setProfile(prof);

        const [statsRes, examsRes, subsRes] = await Promise.all([
          teacherService.getDashboardStats(authUser.id),
          supabase.from('exams').select(`
            id, title, start_time, duration,
            classes(name),
            submissions(count)
          `).eq('courses.teacher_id', authUser.id)
            .order('start_time', { ascending: false })
            .limit(5),
          supabase.from('submissions').select(`
            id, status, score, submitted_at,
            users(full_name),
            exams!inner(title, course_id, courses!inner(teacher_id))
          `).eq('exams.courses.teacher_id', authUser.id)
            .eq('status', 'SUBMITTED')
            .order('submitted_at', { ascending: false })
            .limit(6),
        ]);

        if (!statsRes.error) setStats(statsRes.data);
        setRecentExams(examsRes.data ?? []);
        setRecentSubs(subsRes.data ?? []);
      } catch (err) {
        setError(err?.message ?? 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const examStatus = (exam) => {
    const now   = new Date();
    const start = new Date(exam.start_time);
    const end   = new Date(start.getTime() + exam.duration * 60000);
    if (now < start) return { label: 'Sắp diễn ra', cls: 'bg-blue-50 text-blue-700' };
    if (now <= end)  return { label: 'Đang diễn ra', cls: 'bg-green-50 text-green-700' };
    return             { label: 'Đã kết thúc',   cls: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <TeacherSidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <TeacherHeader />

          <main className="p-8 max-w-7xl mx-auto w-full space-y-10">

            {/* Greeting */}
            <section>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-72" />
                  <Skeleton className="h-4 w-96 mt-2" />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                    {greeting()}, {profile?.full_name ?? 'Thầy/Cô'}! 👋
                  </h2>
                  <p className="text-slate-500 mt-2">
                    Bạn có {stats?.pendingGrade ?? 0} bài chờ chấm và {stats?.totalExams ?? 0} kỳ thi đang quản lý.
                  </p>
                </>
              )}
            </section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
            )}

            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Tổng số lớp học',   value: stats?.totalClasses,  icon: 'school',       bg: 'bg-blue-100 dark:bg-blue-900/30 text-primary' },
                { label: 'Tổng số sinh viên',  value: stats?.totalStudents, icon: 'group',        bg: 'bg-cyan-100 dark:bg-cyan-900/30 text-info-callout' },
                { label: 'Bài kiểm tra',       value: stats?.totalExams,    icon: 'timer',        bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
                { label: 'Chờ chấm bài',       value: stats?.pendingGrade,  icon: 'pending_actions', bg: 'bg-red-100 text-red-600' },
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                  <div className={`size-12 rounded-lg flex items-center justify-center ${c.bg}`}>
                    <span className="material-symbols-outlined text-3xl">{c.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
                    {loading ? <Skeleton className="h-6 w-12 mt-1" /> : (
                      <p className="text-2xl font-black text-header-accent">
                        {c.value !== undefined ? String(c.value).padStart(2, '0') : '—'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">

                {/* Recent Exams */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Kỳ thi gần đây</h3>
                    <a href="/teacher/examsteacher" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
                  </div>
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 flex gap-3">
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : recentExams.length === 0 ? (
                    <div className="p-8 bg-white rounded-xl border border-slate-100 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 block">quiz</span>
                      Chưa có kỳ thi nào
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentExams.map(exam => {
                        const s = examStatus(exam);
                        return (
                          <div key={exam.id} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                            <div>
                              <p className="font-semibold text-sm text-on-surface">{exam.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {exam.classes?.name ?? '—'} · {formatTime(exam.start_time)} · {exam.duration} phút
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-slate-400">
                                {(exam.submissions ?? []).length} bài
                              </span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Recent Submissions */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Bài nộp gần đây</h3>
                    <a href="/teacher/reportsteacher" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
                  </div>
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({length: 4}).map((_, i) => <div key={i} className="p-4 bg-white rounded-xl border border-slate-100"><Skeleton className="h-4 w-full" /></div>)}
                    </div>
                  ) : recentSubs.length === 0 ? (
                    <div className="p-8 bg-white rounded-xl border border-slate-100 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 block">assignment</span>
                      Chưa có bài nộp nào
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentSubs.map(sub => (
                        <div key={sub.id} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{sub.users?.full_name ?? '—'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{sub.exams?.title} · {formatTime(sub.submitted_at)}</p>
                          </div>
                          {sub.score !== null ? (
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${sub.score >= 5 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {sub.score}/10
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">Chờ chấm</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right sidebar mini-panel */}
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-sm mb-4 text-slate-700">Thống kê nhanh</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Khóa học',    value: stats?.totalCourses },
                      { label: 'Lớp học',     value: stats?.totalClasses },
                      { label: 'Sinh viên',   value: stats?.totalStudents },
                      { label: 'Kỳ thi',      value: stats?.totalExams },
                      { label: 'Chờ chấm',    value: stats?.pendingGrade },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{item.label}</span>
                        {loading ? <Skeleton className="h-4 w-10" /> : (
                          <span className="text-sm font-bold text-on-surface">{item.value ?? 0}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGiaoVienDhdeduVietHoaFontMoi;
