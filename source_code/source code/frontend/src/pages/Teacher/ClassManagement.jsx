// src/pages/Teacher/ClassManagement.jsx
// Shows teacher's courses → classes → enrolled students. Fixes: was querying wrong table.

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, EmptyState, ErrorBanner, Avatar, Sk, PageHeader } from '../../components/ui';
import { coursesService, classesService } from '../../services/supabaseService';

const ClassManagement = () => {
  const profile  = useSelector(selectProfile);
  const [courses,       setCourses]       = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classDetail,    setClassDetail]    = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [detailLoading,  setDetailLoading]  = useState(false);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await coursesService.getByTeacher(profile.id);
      if (err) setError('Không thể tải danh sách lớp học.');
      else {
        const list = data ?? [];
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0]);
      }
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  useEffect(() => {
    if (!selectedCourse) return;
    const loadDetail = async () => {
      setDetailLoading(true);
      const allClasses = [];
      for (const cls of selectedCourse.classes ?? []) {
        const { data } = await classesService.getByCourse(selectedCourse.id);
        if (data) allClasses.push(...data);
        break; // one fetch per course
      }
      const { data } = await classesService.getByCourse(selectedCourse.id);
      setClassDetail(data ?? []);
      setDetailLoading(false);
    };
    loadDetail();
  }, [selectedCourse?.id]);

  const totalStudents = (classDetail ?? []).reduce((a, cls) =>
    a + (cls.student_classes ?? []).length, 0);

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title="Lớp học của tôi"
        subtitle="Quản lý các khóa học, lớp và sinh viên"
      />
      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course list */}
        <Card className="lg:col-span-1">
          <CardHeader title="Khóa học" />
          {loading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
          ) : courses.length === 0 ? (
            <EmptyState icon="school" title="Chưa có khóa học" />
          ) : (
            <div className="p-2 space-y-1">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                    selectedCourse?.id === course.id
                      ? 'bg-primary text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <p className="truncate">{course.name}</p>
                  <p className={`text-xs mt-0.5 ${selectedCourse?.id === course.id ? 'text-white/70' : 'text-slate-400'}`}>
                    {course.subject ?? '—'} · {(course.classes ?? []).length} lớp
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Class + student detail */}
        <div className="lg:col-span-3 space-y-4">
          {selectedCourse && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedCourse.name}</h2>
                <p className="text-slate-500 text-sm">Môn: {selectedCourse.subject ?? '—'} · HK {selectedCourse.semester ?? '—'} · {totalStudents} sinh viên</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Thêm sinh viên
                </button>
              </div>
            </div>
          )}

          {detailLoading ? (
            <div className="space-y-3">{[1,2].map(i => <Sk key={i} className="h-32 w-full" />)}</div>
          ) : !classDetail || classDetail.length === 0 ? (
            <Card><EmptyState icon="groups" title="Khóa học này chưa có lớp nào" subtitle="Tạo lớp mới để bắt đầu quản lý sinh viên." /></Card>
          ) : (
            classDetail.map(cls => (
              <Card key={cls.id}>
                <CardHeader
                  title={`${cls.name} (${cls.code})`}
                  action={
                    <span className="text-xs text-slate-400 font-medium">
                      {(cls.student_classes ?? []).length} / {cls.max_student ?? 40} sinh viên
                    </span>
                  }
                />
                {(cls.student_classes ?? []).length === 0 ? (
                  <EmptyState icon="person" title="Chưa có sinh viên nào" subtitle="Chưa có sinh viên đăng ký lớp này." />
                ) : (
                  <div className="divide-y divide-slate-50">
                    {cls.student_classes.map(sc => (
                      <div key={sc.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                        <Avatar name={sc.users?.full_name} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{sc.users?.full_name ?? '—'}</p>
                          <p className="text-xs text-slate-400">{sc.users?.email ?? '—'}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {sc.users?.student_id ?? '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassManagement;
