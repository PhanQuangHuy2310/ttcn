// src/pages/Student/TongQuanNguoiHocVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same data as TongQuanNguoiHocDhdeduVietHoaFontMoi – different class wrapper
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TongQuanNguoiHocVietHoa = () => {
  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [classes,  setClasses]  = useState([]);
  const [recent,   setRecent]   = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, statsRes, classRes, histRes] = await Promise.all([
        studentService.getProfile(user.id),
        studentService.getDashboardStats(user.id),
        studentService.getMyClasses(user.id),
        studentService.getHistory(user.id),
      ]);
      setProfile(prof.data);
      if (!statsRes.error) setStats(statsRes.data);
      setClasses((classRes.data ?? []).slice(0, 6));
      const hist = histRes.data ?? [];
      setRecent(hist.filter(s => s.status === 'SUBMITTED').slice(0, 4));
      const now = new Date();
      setUpcoming(hist.filter(s => {
        if (!s.exams?.start_time || s.status === 'SUBMITTED') return false;
        const end = new Date(new Date(s.exams.start_time).getTime() + (s.exams.duration ?? 60) * 60000);
        return end > now;
      }).slice(0, 3));
      setLoading(false);
    }
    init();
  }, []);

  const scores    = recent.map(s => s.score).filter(s => s !== null);
  const avgScore  = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const mastery   = avgScore !== null ? Math.round(parseFloat(avgScore) * 10) : 0;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <StudentSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <StudentHeader />
          <div className="p-8 max-w-7xl mx-auto w-full">

            <section className="mb-10">
              {loading ? <Skeleton className="h-8 w-64 mb-3" /> : (
                <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                  Chào mừng quay trở lại, {profile?.full_name?.split(' ').pop() ?? 'bạn'}! 👋
                </h2>
              )}
              <div className="mt-4 p-5 rounded-xl bg-secondary-accent/20 border border-secondary-accent">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-info-callout text-3xl">auto_awesome</span>
                  <div>
                    <h3 className="font-bold text-header-accent mb-1">Tóm tắt học tập AI</h3>
                    {loading ? <Skeleton className="h-4 w-80" /> : (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Bạn đã nắm vững{' '}
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{mastery}%</span>
                        {' '}nội dung. Điểm trung bình:{' '}
                        <span className="font-bold text-primary">{avgScore ?? '—'}/10</span>.
                        {' '}Đã hoàn thành <strong>{stats?.submitted ?? 0}</strong> kỳ thi.
                        {stats?.inProgress > 0 && ` Còn ${stats.inProgress} bài đang làm dở.`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { label: 'Lớp đang học',  value: stats?.totalClasses,   icon: 'school',     cls: 'bg-blue-50 text-blue-600'    },
                { label: 'Bài đã nộp',    value: stats?.submitted,      icon: 'task_alt',   cls: 'bg-green-50 text-green-600'  },
                { label: 'Đang làm dở',   value: stats?.inProgress,     icon: 'pending',    cls: 'bg-yellow-50 text-yellow-600'},
                { label: 'Điểm TB',       value: stats?.avgScore ? `${stats.avgScore}/10` : '—', icon: 'grade', cls: 'bg-purple-50 text-purple-600' },
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.cls}`}>
                    <span className="material-symbols-outlined text-xl">{c.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{c.label}</p>
                    {loading ? <Skeleton className="h-6 w-10 mt-1" /> : <p className="text-xl font-black">{c.value ?? 0}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Classes grid */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Lớp học ({classes.length})</h3>
                  <a href="/student/class-detailsstudent-viet-hoa-font-moi" className="text-primary text-sm font-semibold">Tất cả →</a>
                </div>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
                  </div>
                ) : classes.length === 0 ? (
                  <div className="p-10 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
                    <p className="text-sm">Chưa đăng ký lớp nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {classes.map(sc => {
                      const cls    = sc.classes;
                      const course = cls?.courses;
                      return (
                        <a key={cls?.id}
                          href={`/student/class-detailsstudent-viet-hoa-font-moi?classId=${cls?.id}`}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-primary/30 hover:shadow-md transition-all block">
                          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-primary text-base">school</span>
                          </div>
                          <p className="font-bold text-xs text-on-surface line-clamp-2">{course?.name ?? cls?.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{course?.subject}</p>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: upcoming + recent */}
              <div className="space-y-5">
                {/* Upcoming */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-bold text-sm mb-3">Kỳ thi sắp tới</h3>
                  {loading ? (
                    <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
                  ) : upcoming.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">Không có kỳ thi sắp tới</p>
                  ) : upcoming.map(sub => (
                    <div key={sub.id} className="p-3 bg-primary/5 rounded-xl mb-2">
                      <p className="font-semibold text-xs text-on-surface">{sub.exams?.title}</p>
                      <p className="text-[10px] text-slate-400">{sub.exams?.courses?.subject}</p>
                      <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${sub.exams?.id}`}
                        className="text-[10px] font-bold text-primary mt-1 inline-block">Vào làm bài →</a>
                    </div>
                  ))}
                </div>

                {/* Recent */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-bold text-sm mb-3">Kết quả gần đây</h3>
                  {loading ? (
                    <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
                  ) : recent.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">Chưa có kết quả</p>
                  ) : recent.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate">{sub.exams?.title}</p>
                        <p className="text-[10px] text-slate-400">{sub.exams?.courses?.subject}</p>
                      </div>
                      {sub.score !== null && (
                        <span className={`text-sm font-black ${sub.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>{sub.score}</span>
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
  );
};

export default TongQuanNguoiHocVietHoa;
