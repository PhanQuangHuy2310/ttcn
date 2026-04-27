// src/pages/Student/Classes.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, Sk, PageHeader } from '../../components/ui';
import { classesService } from '../../services/supabaseService';

const StudentClasses = () => {
  const profile = useSelector(selectProfile);
  const [enrollments, setEnrollments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    classesService.getEnrolledByStudent(profile.id).then(({ data, error: err }) => {
      if (err) setError('Không thể tải danh sách lớp học.');
      else setEnrollments(data ?? []);
      setLoading(false);
    });
  }, [profile?.id]);

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Lớp học của tôi" subtitle={`${enrollments.length} lớp đang tham gia`} />
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Sk key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <span className="material-symbols-outlined text-slate-200 text-6xl">school</span>
          <p className="text-slate-600 font-semibold mt-4">Bạn chưa đăng ký lớp học nào</p>
          <p className="text-slate-400 text-sm mt-1">Liên hệ giảng viên để được thêm vào lớp học.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(en => {
            const cls    = en.classes;
            const course = cls?.courses;
            if (!cls || !course) return null;
            return (
              <div key={en.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary-container" />
                <div className="p-6">
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary">menu_book</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{cls.name}</h3>
                  <p className="text-sm text-slate-500">{course.subject ?? '—'}</p>
                  {course.users?.full_name && <p className="text-xs text-slate-400 mt-1">GV: {course.users.full_name}</p>}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                    <span>Mã lớp: <span className="font-mono font-bold text-slate-600">{cls.code}</span></span>
                    <span>HK {course.semester ?? '—'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default StudentClasses;
