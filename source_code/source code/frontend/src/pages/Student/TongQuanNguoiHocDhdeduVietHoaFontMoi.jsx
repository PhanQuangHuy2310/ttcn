// src/pages/Student/TongQuanNguoiHocDhdeduVietHoaFontMoi.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TongQuanNguoiHocDhdeduVietHoaFontMoi = () => {
  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [classes,  setClasses]  = useState([]);
  const [recent,   setRecent]   = useState([]);
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
      setClasses((classRes.data ?? []).slice(0, 4));
      setRecent((histRes.data ?? []).filter(s => s.status === 'SUBMITTED').slice(0, 3));
      setLoading(false);
    }
    init();
  }, []);

  const scores = recent.map(s => s.score).filter(s => s !== null);
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const mastery = avgScore !== null ? Math.round(parseFloat(avgScore) * 10) : 0;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <StudentSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <StudentHeader />
          <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Greeting + AI summary */}
            <section className="mb-10">
              {loading ? <Skeleton className="h-8 w-64 mb-4" /> : (
                <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                  Chào mừng quay trở lại, {profile?.full_name?.split(' ').pop() ?? 'bạn'}! 👋
                </h2>
              )}
              <div className="mt-4 p-5 rounded-xl bg-secondary-accent/20 border border-secondary-accent">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-info-callout text-3xl">auto_awesome</span>
                  <div>
                    <h3 className="font-bold text-header-accent mb-1">Tóm tắt học tập AI</h3>
                    {loading ? (
                      <Skeleton className="h-4 w-96" />
                    ) : (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Bạn đã nắm vững{' '}
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{mastery}%</span>
                        {' '}nội dung dựa trên {stats?.submitted ?? 0} bài đã nộp với điểm trung bình{' '}
                        <span className="font-bold text-primary">{avgScore ?? '—'}/10</span>.
                        {stats?.inProgress > 0 && ` Bạn còn ${stats.inProgress} bài đang làm dở.`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Stats row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { label: 'Lớp học',      value: stats?.totalClasses,   icon: 'school',      cls: 'text-blue-600 bg-blue-50'    },
                { label: 'Bài đã nộp',   value: stats?.submitted,      icon: 'done_all',    cls: 'text-green-600 bg-green-50'  },
                { label: 'Đang làm dở',  value: stats?.inProgress,     icon: 'pending',     cls: 'text-yellow-600 bg-yellow-50'},
                { label: 'Điểm trung bình', value: stats?.avgScore ? `${stats.avgScore}/10` : '—', icon: 'grade', cls: 'text-purple-600 bg-purple-50' },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.cls}`}>
                    <span className="material-symbols-outlined text-xl">{c.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{c.label}</p>
                    {loading ? <Skeleton className="h-6 w-10 mt-1" /> : <p className="text-xl font-black">{c.value ?? 0}</p>}
                  </div>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Classes */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Lớp học của tôi</h3>
                  <a href="/student/class-detailsstudent-viet-hoa-font-moi" className="text-primary text-sm font-semibold">Xem tất cả</a>
                </div>
                {loading ? (
                  <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
                ) : classes.length === 0 ? (
                  <div className="p-10 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
                    <p className="text-sm">Chưa đăng ký lớp nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {classes.map(sc => {
                      const cls    = sc.classes;
                      const course = cls?.courses;
                      return (
                        <a key={cls?.id}
                          href={`/student/class-detailsstudent-viet-hoa-font-moi?classId=${cls?.id}`}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow block">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-primary">school</span>
                          </div>
                          <p className="font-bold text-sm text-on-surface line-clamp-1">{course?.name ?? cls?.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{course?.subject} · {course?.grade_level ? `Lớp ${course.grade_level}` : ''}</p>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent results */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Kết quả gần đây</h3>
                  <a href="/student/history-chi-tietstudent" className="text-primary text-sm font-semibold">Xem tất cả</a>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
                  ) : recent.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-6">Chưa có kết quả nào</p>
                  ) : recent.map(sub => (
                    <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{sub.exams?.title ?? '—'}</p>
                        <p className="text-xs text-slate-400">{sub.exams?.courses?.subject}</p>
                      </div>
                      {sub.score !== null && (
                        <span className={`text-lg font-black ${sub.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                          {sub.score}
                        </span>
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

export default TongQuanNguoiHocDhdeduVietHoaFontMoi;
