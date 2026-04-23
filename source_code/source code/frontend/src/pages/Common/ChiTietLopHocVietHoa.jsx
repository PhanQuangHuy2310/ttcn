// src/pages/Common/ChiTietLopHocVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Shared class detail for all roles — reads class data based on user role
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ChiTietLopHocVietHoa = () => {
  const [sp]      = useSearchParams();
  const classId   = sp.get('classId');
  const [cls,     setCls]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    supabase.from('classes').select(`
      id, name, code, academic_year, max_student,
      courses(name, subject, grade_level, users(full_name)),
      student_classes(users(id, full_name, email, student_id), enrolled_at),
      exams(id, title, start_time, duration, submissions(status))
    `).eq('id', classId).single()
      .then(({ data }) => { setCls(data); setLoading(false); });
  }, [classId]);

  const students = cls?.student_classes ?? [];
  const exams    = cls?.exams ?? [];
  const total    = exams.flatMap(e => e.submissions ?? []).length;
  const submitted = exams.flatMap(e => (e.submissions ?? []).filter(s => s.status === 'SUBMITTED')).length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <CommonHeader />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
          <CommonSidebar />
          <div className="flex-1 bg-background-light dark:bg-background-dark p-6 lg:p-10">

            {/* Breadcrumb */}
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
              <div>
                <nav className="mb-4 flex text-sm text-slate-500">
                  <a className="hover:text-primary" href="#">Bảng điều khiển</a>
                  <span className="mx-2">/</span>
                  <a className="hover:text-primary" href="#">Lớp học</a>
                  <span className="mx-2">/</span>
                  <span className="text-on-surface font-semibold">{cls?.name ?? '...'}</span>
                </nav>
                {loading ? <Skeleton className="h-8 w-64" /> : (
                  <>
                    <h1 className="text-3xl font-black text-on-surface">{cls?.name}</h1>
                    <p className="text-slate-500 mt-1">
                      {cls?.courses?.name} · {cls?.courses?.subject} · {cls?.academic_year}
                    </p>
                  </>
                )}
              </div>
            </div>

            {!classId ? (
              <div className="p-12 bg-white rounded-2xl text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">school</span>
                <p>Thêm ?classId=... vào URL để xem chi tiết lớp học</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Sinh viên',     value: students.length,   icon: 'group' },
                    { label: 'Kỳ thi',         value: exams.length,      icon: 'quiz' },
                    { label: 'Tổng nộp bài',  value: total,             icon: 'assignment' },
                    { label: 'Đã hoàn thành', value: submitted,         icon: 'task_alt' },
                  ].map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{c.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{c.label}</p>
                        {loading ? <Skeleton className="h-6 w-10 mt-1" /> : <p className="text-xl font-black">{c.value}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Teacher info */}
                {cls?.courses?.users?.full_name && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{cls.courses.users.full_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Giáo viên phụ trách</p>
                      <p className="font-bold text-on-surface">{cls.courses.users.full_name}</p>
                    </div>
                  </div>
                )}

                {/* Students table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-50">
                    <h3 className="font-bold">Danh sách sinh viên</h3>
                  </div>
                  {loading ? (
                    <div className="p-5 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-50">
                          {['Sinh viên', 'Mã SV', 'Email', 'Ngày đăng ký'].map(h => (
                            <th key={h} className="text-left p-4 text-xs font-bold text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-400">Chưa có sinh viên</td></tr>
                        ) : students.map(sc => (
                          <tr key={sc.users?.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary text-xs font-bold">{(sc.users?.full_name ?? 'S').charAt(0)}</span>
                                </div>
                                <span className="text-sm font-medium">{sc.users?.full_name ?? '—'}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm font-mono text-slate-400">{sc.users?.student_id ?? '—'}</td>
                            <td className="p-4 text-sm text-slate-400">{sc.users?.email ?? '—'}</td>
                            <td className="p-4 text-sm text-slate-400">
                              {sc.enrolled_at ? new Date(sc.enrolled_at).toLocaleDateString('vi-VN') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChiTietLopHocVietHoa;
