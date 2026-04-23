// src/pages/Student/DashboardSinhVienDhdeduAzotaStyle.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardSinhVienDhdeduAzotaStyle = () => {
  const [profile,    setProfile]    = useState(null);
  const [stats,      setStats]      = useState(null);
  const [classes,    setClasses]    = useState([]);
  const [upcoming,   setUpcoming]   = useState([]); // upcoming exams
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      try {
        const [profRes, statsRes, classRes, histRes] = await Promise.all([
          studentService.getProfile(user.id),
          studentService.getDashboardStats(user.id),
          studentService.getMyClasses(user.id),
          studentService.getHistory(user.id),
        ]);

        setProfile(profRes.data);
        if (!statsRes.error) setStats(statsRes.data);
        const myClasses = classRes.data ?? [];
        setClasses(myClasses.slice(0, 4));

        const history   = histRes.data ?? [];
        setRecentSubs(history.slice(0, 4));

        // Upcoming: IN_PROGRESS or NOT_STARTED where exam hasn't ended
        const now = new Date();
        const upcomingExams = history.filter(s => {
          if (!s.exams?.start_time) return false;
          const start = new Date(s.exams.start_time);
          const end   = new Date(start.getTime() + (s.exams.duration ?? 60) * 60000);
          return end > now && s.status !== 'SUBMITTED';
        });
        setUpcoming(upcomingExams.slice(0, 3));
      } catch (err) {
        setError(err?.message ?? 'Lỗi tải dữ liệu');
      }
      setLoading(false);
    }
    init();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d) / 60000);
    if (diff < 1)    return 'Vừa xong';
    if (diff < 60)   return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return d.toLocaleDateString('vi-VN');
  };

  const scoreColor = (s) => s >= 8 ? 'text-green-600' : s >= 5 ? 'text-yellow-600' : 'text-red-500';

  const classSubjectIcon = (subject) => {
    const map = { 'Toán': 'calculate', 'Vật Lý': 'science', 'Hóa Học': 'biotech', 'Tiếng Anh': 'translate', 'Tin Học': 'code' };
    return map[subject] ?? 'school';
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64 min-h-screen p-8">
        <StudentHeader />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">

            {/* AI Banner */}
            <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-xl">
              <div className="relative z-10 flex justify-between items-center">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined fill text-[#F59E0B]" data-icon="auto_awesome">auto_awesome</span>
                    <span className="text-xs font-bold tracking-widest uppercase opacity-90">AI Gợi ý học tập</span>
                  </div>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-64 bg-white/20"/>
                      <Skeleton className="h-4 w-80 bg-white/20"/>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold font-headline mb-2">
                        Chào {profile?.full_name?.split(' ').pop() ?? 'bạn'}! 👋
                      </h2>
                      <p className="text-white/80 text-sm leading-relaxed mb-6">
                        Bạn đang theo học {stats?.totalClasses ?? 0} lớp với điểm trung bình {stats?.avgScore ?? '—'}/10.
                        {stats?.inProgress > 0 && ` Có ${stats.inProgress} bài đang làm dở.`}
                      </p>
                    </>
                  )}
                  <button className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform active:opacity-80">
                    Xem lớp học
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center transform rotate-12">
                    <span className="material-symbols-outlined text-6xl opacity-50" data-icon="psychology">psychology</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-secondary-container/20 rounded-full blur-2xl" />
            </section>

            {/* My Classes */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold font-headline">Lớp học của tôi</h3>
                <a className="text-primary text-sm font-semibold hover:underline" href="/student/overviewstudent-viet-hoa">Xem tất cả</a>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl"/>)}
                </div>
              ) : classes.length === 0 ? (
                <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
                  <p className="text-sm">Bạn chưa đăng ký lớp học nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {classes.map(sc => {
                    const cls  = sc.classes;
                    const course = cls?.courses;
                    return (
                      <div key={cls?.id} className="group bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" data-icon={classSubjectIcon(course?.subject)}>
                              {classSubjectIcon(course?.subject)}
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Đang học</span>
                        </div>
                        <h4 className="font-bold text-on-surface mb-1 line-clamp-1">{course?.name ?? cls?.name}</h4>
                        <p className="text-xs text-slate-400 mb-4">{course?.users?.full_name ?? '—'} · {course?.subject}</p>
                        <a href={`/student/class-detailsstudent-viet-hoa-font-moi?classId=${cls?.id}`}
                          className="text-xs font-bold text-primary hover:underline">Vào lớp →</a>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent history */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold font-headline">Bài làm gần đây</h3>
                <a className="text-primary text-sm font-semibold hover:underline" href="/student/history-chi-tietstudent">Xem tất cả</a>
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-16 rounded-xl"/>)}</div>
              ) : recentSubs.length === 0 ? (
                <div className="p-10 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">assignment</span>
                  <p className="text-sm">Chưa có bài làm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSubs.map(sub => (
                    <div key={sub.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-base">quiz</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{sub.exams?.title ?? '—'}</p>
                          <p className="text-xs text-slate-400">{sub.exams?.courses?.name} · {formatDate(sub.submitted_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.status === 'SUBMITTED' && sub.score !== null ? (
                          <span className={`text-lg font-black ${scoreColor(sub.score)}`}>{sub.score}<span className="text-xs text-slate-400">/10</span></span>
                        ) : sub.status === 'IN_PROGRESS' ? (
                          <span className="text-xs font-bold px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">Đang làm</span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">Chờ chấm</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="col-span-4 space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-sm mb-4 text-slate-700">Thống kê của tôi</h3>
              <div className="space-y-3">
                {[
                  { label: 'Lớp học',        value: stats?.totalClasses,   icon: 'school',   cls: 'text-blue-600 bg-blue-50' },
                  { label: 'Đã nộp',         value: stats?.submitted,      icon: 'check',    cls: 'text-green-600 bg-green-50' },
                  { label: 'Đang làm',       value: stats?.inProgress,     icon: 'pending',  cls: 'text-yellow-600 bg-yellow-50' },
                  { label: 'Điểm TB',        value: stats?.avgScore !== null ? `${stats.avgScore}/10` : '—', icon: 'grade', cls: 'text-purple-600 bg-purple-50' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.cls}`}>
                      <span className="material-symbols-outlined text-base">{c.icon}</span>
                    </div>
                    <span className="text-sm text-slate-500 flex-1">{c.label}</span>
                    {loading ? <Skeleton className="h-4 w-8"/> : (
                      <span className="text-sm font-bold text-on-surface">{c.value ?? 0}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming exams */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-sm mb-4 text-slate-700">Kỳ thi sắp tới</h3>
              {loading ? (
                <div className="space-y-3">{Array.from({length:2}).map((_,i)=><Skeleton key={i} className="h-14 rounded-xl"/>)}</div>
              ) : upcoming.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Không có kỳ thi nào sắp tới</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map(sub => (
                    <div key={sub.id} className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-sm font-semibold text-on-surface line-clamp-1">{sub.exams?.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{sub.exams?.courses?.name} · {sub.exams?.duration} phút</p>
                      <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${sub.exams?.id}`}
                        className="text-xs font-bold text-primary mt-2 inline-block hover:underline">
                        Vào làm bài →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSinhVienDhdeduAzotaStyle;
