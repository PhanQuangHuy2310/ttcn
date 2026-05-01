// src/pages/Teacher/Dashboard.jsx
// Fixes: was querying classes.teacher_id (doesn't exist). Now queries courses.teacher_id correctly.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, StatusBadge, Sk, fmtDate, fmtDateTime } from '../../components/ui';
import { coursesService, examsService, submissionsService, questionsService } from '../../services/supabaseService';

const TeacherDashboard = () => {
  const profile = useSelector(selectProfile);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [courseRes, examRes, pendingRes, qCountRes] = await Promise.all([
        coursesService.getByTeacher(profile.id),
        examsService.getByTeacher(profile.id, 5),
        submissionsService.getPendingByTeacher(profile.id),
        questionsService.countByTeacher(profile.id),
      ]);

      const courseList = courseRes.data ?? [];
      const examList = examRes.data ?? [];
      const pending = pendingRes.data ?? [];

      // Count total students across all classes of all courses
      const studentCount = courseList.reduce((acc, c) => {
        return acc + (c.classes ?? []).reduce((a2, cls) => {
          const cnt = cls.student_classes?.length ?? 0;
          return a2 + (typeof cnt === 'number' ? cnt : parseInt(cnt) || 0);
        }, 0);
      }, 0);

      setStats({
        totalCourses: courseList.length,
        totalStudents: studentCount,
        totalExams: examList.length,
        pendingGrade: pending.length,
        totalQuestions: qCountRes.data ?? 0,
      });
      setCourses(courseList.slice(0, 4));
      setRecentExams(examList);
    } catch {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [profile?.id]);

  const firstName = profile?.full_name?.split(' ').pop() ?? 'Thầy/Cô';

  return (
    <AppLayout role="TEACHER">
      {/* Welcome */}
      <section className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Chào {firstName}! 👋
        </h2>
        <p className="text-slate-500 mt-1">Tổng quan hoạt động giảng dạy của bạn hôm nay.</p>
      </section>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="school" iconBg="bg-blue-50 text-blue-600" label="Tổng số khóa học" value={stats?.totalCourses} loading={loading} />
        <StatCard icon="group" iconBg="bg-cyan-50 text-cyan-600" label="Tổng số sinh viên" value={stats?.totalStudents} loading={loading} />
        <StatCard icon="quiz" iconBg="bg-orange-50 text-orange-600" label="Số đề thi" value={stats?.totalExams} loading={loading} />
        <StatCard icon="rate_review" iconBg="bg-purple-50 text-purple-600" label="Chờ chấm bài" value={stats?.pendingGrade} loading={loading} sub="bài nộp chờ chấm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Khóa học đang quản lý"
            action={<Link to="/teacher/classes" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
          />
          {loading ? (
            <div className="p-6 space-y-4">{[1, 2, 3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
          ) : courses.length === 0 ? (
            <EmptyState icon="school" title="Bạn chưa có khóa học nào" subtitle="Tạo khóa học mới để bắt đầu giảng dạy." />
          ) : (
            <div className="divide-y divide-slate-100">
              {courses.map(course => {
                const totalStudents = (course.classes ?? []).reduce((a, cls) => {
                  const cnt = cls.student_classes?.length ?? 0;
                  return a + (typeof cnt === 'number' ? cnt : parseInt(cnt) || 0);
                }, 0);
                const classCount = (course.classes ?? []).length;
                return (
                  <Link key={course.id} to={`/teacher/classes?id=${course.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">school</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{course.name}</p>
                      <p className="text-xs text-slate-500">{course.subject ?? '—'} · {classCount} lớp · {totalStudents} sinh viên</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-slate-400">HK {course.semester ?? '—'}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent exams */}
        <Card>
          <CardHeader
            title="Đề thi gần đây"
            action={<Link to="/teacher/exams" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
          />
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
          ) : recentExams.length === 0 ? (
            <EmptyState icon="quiz" title="Chưa có đề thi nào" subtitle="Tạo đề thi mới để bắt đầu." />
          ) : (
            <div className="divide-y divide-slate-50">
              {recentExams.map(exam => (
                <Link key={exam.id} to={`/teacher/exams?id=${exam.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-purple-600 text-base">quiz</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{exam.title}</p>
                    <p className="text-xs text-slate-400">{fmtDateTime(exam.start_time)}</p>
                  </div>
                  <StatusBadge status={exam.status ?? 'DRAFT'} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      {stats?.pendingGrade > 0 && (
        <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600 text-2xl">rate_review</span>
            <div>
              <p className="font-bold text-amber-800">Có {stats.pendingGrade} bài thi đang chờ chấm</p>
              <p className="text-sm text-amber-600">Sinh viên đang chờ kết quả của bạn</p>
            </div>
          </div>
          <Link to="/teacher/exams" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition whitespace-nowrap">
            Chấm bài ngay
          </Link>
        </div>
      )}
    </AppLayout>
  );
};

export default TeacherDashboard;
