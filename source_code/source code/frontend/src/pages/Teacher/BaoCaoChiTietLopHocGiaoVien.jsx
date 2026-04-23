// src/pages/Teacher/BaoCaoChiTietLopHocGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const BaoCaoChiTietLopHocGiaoVien = () => {
  const [sp]        = useSearchParams();
  const classId     = sp.get('classId');
  const [cls,       setCls]       = useState(null);
  const [courses,   setCourses]   = useState([]);
  const [selClass,  setSelClass]  = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await teacherService.getReports(user.id);
      const allClasses = (data ?? []).flatMap(c =>
        (c.classes ?? []).map(cl => ({ ...cl, courseName: c.name, subject: c.subject }))
      );
      setCourses(allClasses);
      const target = classId ? allClasses.find(c => c.id === classId) : allClasses[0];
      if (target) { setSelClass(target); loadDetail(target.id); }
      setLoading(false);
    }
    init();
  }, [classId]);

  const loadDetail = async (id) => {
    const { data } = await teacherService.getClassDetail(id);
    setCls(data);
  };

  const students  = cls?.student_classes ?? [];
  const exams     = cls?.exams ?? [];
  const allSubs   = exams.flatMap(e => e.submissions ?? []);
  const submitted = allSubs.filter(s => s.status === 'SUBMITTED');
  const scores    = submitted.map(s => s.score).filter(s => s !== null);
  const avgScore  = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const passRate  = scores.length ? Math.round(scores.filter(s => s >= 5).length / scores.length * 100) : 0;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 max-w-7xl mx-auto space-y-8">

          {/* Class selector + header */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              {loading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <>
                  <h2 className="text-3xl font-black font-headline text-on-surface">
                    {selClass?.name ?? 'Chọn lớp học'} {selClass?.subject ? `- ${selClass.subject}` : ''}
                  </h2>
                  <p className="text-on-surface-variant font-medium mt-1">
                    Báo cáo chi tiết • {selClass?.academic_year ?? ''}
                  </p>
                </>
              )}
            </div>
            {courses.length > 1 && (
              <select
                value={selClass?.id ?? ''}
                onChange={e => {
                  const c = courses.find(x => x.id === e.target.value);
                  setSelClass(c);
                  if (c) loadDetail(c.id);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.courseName})</option>)}
              </select>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Sinh viên',    value: students.length,             icon: 'group',        cls: 'bg-blue-50 text-blue-600' },
              { label: 'Đề thi',       value: exams.length,                icon: 'quiz',         cls: 'bg-primary/10 text-primary' },
              { label: 'Điểm trung bình', value: avgScore ? `${avgScore}/10` : '—', icon: 'grade', cls: 'bg-green-50 text-green-600' },
              { label: 'Tỷ lệ đạt',   value: `${passRate}%`,              icon: 'check_circle', cls: 'bg-orange-50 text-orange-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.cls}`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{c.label}</p>
                  {loading ? <Skeleton className="h-7 w-12 mt-1" /> : (
                    <p className="text-2xl font-black text-on-surface">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Exam performance table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold">Kết quả từng kỳ thi</h3>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
            ) : exams.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Chưa có kỳ thi nào</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Kỳ thi', 'Ngày thi', 'Đã nộp', 'Điểm TB', 'Cao nhất', 'Thấp nhất', 'Đạt'].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-bold text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exams.map(exam => {
                    const subs   = (exam.submissions ?? []).filter(s => s.status === 'SUBMITTED');
                    const sc     = subs.map(s => s.score).filter(s => s !== null);
                    const avg    = sc.length ? (sc.reduce((a, b) => a + b, 0) / sc.length).toFixed(1) : null;
                    const hi     = sc.length ? Math.max(...sc) : null;
                    const lo     = sc.length ? Math.min(...sc) : null;
                    const pass   = sc.filter(s => s >= 5).length;
                    return (
                      <tr key={exam.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 font-semibold text-sm">{exam.title}</td>
                        <td className="p-4 text-sm text-slate-400">
                          {exam.start_time ? new Date(exam.start_time).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td className="p-4 text-sm">{subs.length}/{students.length}</td>
                        <td className="p-4 text-sm font-bold text-primary">{avg ? `${avg}/10` : '—'}</td>
                        <td className="p-4 text-sm font-bold text-green-600">{hi ?? '—'}</td>
                        <td className="p-4 text-sm font-bold text-red-500">{lo ?? '—'}</td>
                        <td className="p-4 text-sm">{sc.length ? `${pass}/${sc.length}` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Student list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold">Danh sách sinh viên ({students.length})</h3>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Sinh viên', 'Mã SV', 'Ngày đăng ký'].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-bold text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(sc => (
                    <tr key={sc.users?.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-xs font-bold">{(sc.users?.full_name ?? 'S').charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium">{sc.users?.full_name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono text-slate-400">{sc.users?.student_id ?? '—'}</td>
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
      </main>
    </div>
  );
};

export default BaoCaoChiTietLopHocGiaoVien;
