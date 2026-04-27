// src/pages/Teacher/Reports.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, StatusBadge, Sk, PageHeader, fmtDate } from '../../components/ui';
import { coursesService, submissionsService } from '../../services/supabaseService';

const Reports = () => {
  const profile = useSelector(selectProfile);
  const [courses,  setCourses]  = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const [courseRes, pendingRes, allSubRes] = await Promise.all([
      coursesService.getByTeacher(profile.id),
      submissionsService.getPendingByTeacher(profile.id),
      submissionsService.getPendingByTeacher(profile.id),
    ]);

    const courseList = courseRes.data ?? [];
    const pending    = pendingRes.data ?? [];

    const totalStudents = courseList.reduce((a, c) =>
      a + (c.classes ?? []).reduce((a2, cls) => a2 + (cls.student_classes?.[0]?.count ?? 0), 0), 0);

    setStats({
      totalCourses:  courseList.length,
      totalStudents,
      pendingGrade:  pending.length,
    });
    setCourses(courseList);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Báo cáo & Thống kê" subtitle="Tổng quan hiệu suất giảng dạy" />
      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard icon="school" iconBg="bg-blue-50 text-blue-600" label="Tổng khóa học" value={stats?.totalCourses} loading={loading} />
        <StatCard icon="group" iconBg="bg-cyan-50 text-cyan-600" label="Tổng sinh viên" value={stats?.totalStudents} loading={loading} />
        <StatCard icon="rate_review" iconBg="bg-amber-50 text-amber-600" label="Chờ chấm bài" value={stats?.pendingGrade} loading={loading} />
      </div>

      <Card>
        <CardHeader title="Chi tiết theo khóa học" />
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
        ) : courses.length === 0 ? (
          <EmptyState icon="school" title="Chưa có khóa học nào" />
        ) : (
          <>
            <div className="px-6 py-3 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="col-span-5">Khóa học</span>
              <span className="col-span-2">Môn học</span>
              <span className="col-span-2">Số lớp</span>
              <span className="col-span-2">Sinh viên</span>
              <span className="col-span-1">HK</span>
            </div>
            <div className="divide-y divide-slate-50">
              {courses.map(course => {
                const classCount    = (course.classes ?? []).length;
                const studentCount  = (course.classes ?? []).reduce((a, cls) => {
                  const cnt = cls.student_classes?.[0]?.count ?? 0;
                  return a + (typeof cnt === 'number' ? cnt : parseInt(cnt) || 0);
                }, 0);
                return (
                  <div key={course.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                    <div className="col-span-5">
                      <p className="text-sm font-semibold text-slate-800">{course.name}</p>
                      <p className="text-xs text-slate-400">Khối {course.grade_level ?? '—'}</p>
                    </div>
                    <div className="col-span-2 text-sm text-slate-600">{course.subject ?? '—'}</div>
                    <div className="col-span-2 text-sm text-slate-600">{classCount}</div>
                    <div className="col-span-2">
                      <span className="text-sm font-semibold text-slate-800">{studentCount}</span>
                    </div>
                    <div className="col-span-1 text-xs text-slate-400">{course.semester ?? '—'}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </AppLayout>
  );
};

export default Reports;
