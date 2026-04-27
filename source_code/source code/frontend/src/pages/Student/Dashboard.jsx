// src/pages/Student/Dashboard.jsx
// Fixes: student_classes.progress doesn't exist in schema — removed. Queries correct FK chain.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, StatusBadge, Sk, fmtDate, fmtDateTime } from '../../components/ui';
import { classesService, submissionsService, examsService } from '../../services/supabaseService';

const StudentDashboard = () => {
  const profile = useSelector(selectProfile);
  const [enrollments,   setEnrollments]   = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [enrollRes, subStats, examRes] = await Promise.all([
        classesService.getEnrolledByStudent(profile.id),
        submissionsService.studentStats(profile.id),
        examsService.getUpcoming(5),
      ]);

      setEnrollments(enrollRes.data ?? []);
      setUpcomingExams(examRes.data ?? []);
      setStats({
        totalClasses:    (enrollRes.data ?? []).length,
        totalSubmissions: subStats.data?.total ?? 0,
        completedExams:  subStats.data?.submitted ?? 0,
        avgScore:        subStats.data?.avgScore,
      });
    } catch {
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [profile?.id]);

  const firstName = profile?.full_name?.split(' ').pop() ?? 'Sinh viên';

  return (
    <AppLayout role="STUDENT">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Chào {firstName}! 👋
        </h2>
        <p className="text-slate-500 mt-1">
          {stats?.totalClasses > 0
            ? `Bạn đang học ${stats.totalClasses} lớp học.`
            : 'Chào mừng đến với DHDedu!'}
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="school"     iconBg="bg-blue-50 text-blue-600"   label="Số lớp đã đăng ký" value={stats?.totalClasses}     loading={loading} />
        <StatCard icon="assignment" iconBg="bg-orange-50 text-orange-600" label="Số bài đã làm"   value={stats?.totalSubmissions} loading={loading} />
        <StatCard icon="task_alt"   iconBg="bg-green-50 text-green-600" label="Bài đã nộp"         value={stats?.completedExams}   loading={loading} />
        <StatCard icon="grade"      iconBg="bg-purple-50 text-purple-600" label="Điểm trung bình" value={stats?.avgScore ?? '—'}   loading={loading} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: AI Banner + Classes */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* AI Banner */}
          <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-xl">
            <div className="relative z-10 flex justify-between items-center">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-yellow-400 fill">auto_awesome</span>
                  <span className="text-xs font-bold tracking-widest uppercase opacity-90">AI Gợi ý học tập</span>
                </div>
                <h2 className="text-2xl font-bold font-headline mb-2">Nền tảng học tập thông minh</h2>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  Luyện tập với ngân hàng câu hỏi, flash card và bài thi thử để cải thiện kết quả học tập.
                </p>
                <Link to="/student/practice"
                  className="inline-block bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
                >
                  Luyện tập ngay
                </Link>
              </div>
              <div className="hidden lg:flex w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center rotate-12 shrink-0">
                <span className="material-symbols-outlined text-5xl opacity-50">psychology</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          </section>

          {/* My Classes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Lớp học của tôi</h3>
              <Link to="/student/classes" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">{[1,2].map(i => <Sk key={i} className="h-44 w-full rounded-2xl" />)}</div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <span className="material-symbols-outlined text-slate-300 text-5xl">school</span>
                <p className="text-slate-500 mt-3 text-sm">Bạn chưa đăng ký lớp học nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.slice(0, 4).map(enroll => {
                  const cls     = enroll.classes;
                  const course  = cls?.courses;
                  if (!cls || !course) return null;
                  const teacherName = course.users?.full_name;
                  return (
                    <Link key={enroll.class_id} to={`/student/classes?id=${cls.id}`}
                      className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:-translate-y-1 hover:border-primary/20 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">menu_book</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">Đang học</span>
                      </div>
                      <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">{cls.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{course.subject ?? '—'}</p>
                      {teacherName && <p className="text-xs text-slate-400 mt-0.5">GV: {teacherName}</p>}
                      <p className="text-xs text-slate-300 mt-2">Mã lớp: {cls.code}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick links */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Truy cập nhanh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: 'quiz',         label: 'Thi trực tuyến',  to: '/student/exams',      bg: 'bg-purple-50 text-purple-600' },
                { icon: 'assignment',   label: 'Đề thi thử',      to: '/student/mock-exams', bg: 'bg-blue-50 text-blue-600' },
                { icon: 'auto_stories', label: 'Luyện tập',       to: '/student/practice',   bg: 'bg-green-50 text-green-600' },
                { icon: 'style',        label: 'Flashcard',       to: '/student/flashcards', bg: 'bg-orange-50 text-orange-600' },
              ].map(item => (
                <Link key={item.to} to={item.to}
                  className={`${item.bg} rounded-2xl p-5 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform`}
                >
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right: upcoming exams */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader
              title="Kỳ thi sắp tới"
              action={<Link to="/student/exams" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
            />
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
            ) : upcomingExams.length === 0 ? (
              <EmptyState icon="event_available" title="Không có kỳ thi nào sắp tới" />
            ) : (
              <div className="divide-y divide-slate-50">
                {upcomingExams.map(exam => (
                  <Link key={exam.id} to={`/student/exams?id=${exam.id}`}
                    className="flex items-start gap-3 px-6 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-purple-600 text-base">quiz</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{exam.title}</p>
                      <p className="text-xs text-slate-400">{exam.classes?.name ?? '—'}</p>
                      <p className="text-xs text-orange-500 font-medium mt-0.5">{fmtDateTime(exam.start_time)}</p>
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">{exam.duration}p</div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Recent submissions */}
          <Card>
            <CardHeader
              title="Bài thi gần đây"
              action={<Link to="/student/history" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
            />
            {loading ? (
              <div className="p-4 space-y-2">{[1,2].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
            ) : stats?.totalSubmissions === 0 ? (
              <EmptyState icon="assignment" title="Chưa làm bài thi nào" />
            ) : (
              <div className="px-6 py-4">
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">{stats?.avgScore ?? '—'}</p>
                  <p className="text-sm text-slate-500 mt-1">Điểm trung bình</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stats?.completedExams ?? 0} bài đã hoàn thành</p>
                </div>
                <Link to="/student/statistics"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="material-symbols-outlined text-lg">bar_chart</span>
                  Xem thống kê chi tiết
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
