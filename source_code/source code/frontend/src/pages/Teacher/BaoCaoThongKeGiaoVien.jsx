// src/pages/Teacher/BaoCaoThongKeGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const BaoCaoThongKeGiaoVien = () => {
  const [stats,     setStats]     = useState(null);
  const [courses,   setCourses]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setTeacherId(user.id);
      const [statsRes, reportsRes] = await Promise.all([
        teacherService.getDashboardStats(user.id),
        teacherService.getReports(user.id),
      ]);
      if (!statsRes.error)   setStats(statsRes.data);
      if (!reportsRes.error) setCourses(reportsRes.data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  // Aggregate submission stats across all classes/exams
  const allSubmissions = courses.flatMap(c =>
    (c.classes ?? []).flatMap(cl =>
      (cl.exams ?? []).flatMap(e => e.submissions ?? [])
    )
  );
  const submitted   = allSubmissions.filter(s => s.status === 'SUBMITTED');
  const scores      = submitted.map(s => s.score).filter(s => s !== null);
  const avgScore    = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const passRate    = scores.length ? Math.round((scores.filter(s => s >= 5).length / scores.length) * 100) : 0;

  // Per-course stats
  const courseStats = courses.map(c => {
    const clsList  = c.classes ?? [];
    const subs     = clsList.flatMap(cl => (cl.exams ?? []).flatMap(e => e.submissions ?? []));
    const subScores = subs.filter(s => s.status === 'SUBMITTED' && s.score !== null).map(s => s.score);
    const avg = subScores.length ? (subScores.reduce((a, b) => a + b, 0) / subScores.length).toFixed(1) : null;
    const stuCount = clsList.reduce((acc, cl) => acc + (cl.student_classes?.[0]?.count ?? 0), 0);
    return {
      id: c.id,
      name: c.name,
      subject: c.subject,
      classes: clsList.length,
      students: stuCount,
      exams: clsList.flatMap(cl => cl.exams ?? []).length,
      avgScore: avg,
      passRate: subScores.length ? Math.round((subScores.filter(s => s >= 5).length / subScores.length) * 100) : 0,
    };
  });

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen flex flex-col">
        <TeacherHeader />

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black font-headline text-on-surface">Báo cáo & Thống kê</h2>
              <p className="text-slate-500 mt-1">Tổng hợp kết quả học tập từ tất cả lớp học của bạn</p>
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Tổng khóa học',  value: stats?.totalCourses,  icon: 'menu_book',   cls: 'bg-primary/10 text-primary' },
              { label: 'Tổng sinh viên',  value: stats?.totalStudents, icon: 'groups',      cls: 'bg-blue-50 text-blue-600' },
              { label: 'Điểm trung bình', value: avgScore ? `${avgScore}/10` : '—', icon: 'grade', cls: 'bg-green-50 text-green-600' },
              { label: 'Tỷ lệ đạt',      value: `${passRate}%`,       icon: 'check_circle',cls: 'bg-orange-50 text-orange-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.cls}`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{c.label}</p>
                  {loading ? <Skeleton className="h-7 w-14 mt-1" /> : (
                    <p className="text-2xl font-black text-on-surface">{c.value ?? '—'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Course breakdown table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-on-surface">Kết quả theo khóa học</h3>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
              </div>
            ) : courseStats.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 block">analytics</span>
                <p>Chưa có dữ liệu báo cáo</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-50">
                      {['Khóa học', 'Môn', 'Lớp', 'Sinh viên', 'Đề thi', 'Điểm TB', 'Tỷ lệ đạt'].map(h => (
                        <th key={h} className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courseStats.map((c, i) => (
                      <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-sm text-on-surface max-w-[180px] truncate">{c.name}</td>
                        <td className="p-4 text-sm text-slate-500">{c.subject ?? '—'}</td>
                        <td className="p-4 text-sm text-slate-500">{c.classes}</td>
                        <td className="p-4 text-sm text-slate-500">{c.students}</td>
                        <td className="p-4 text-sm text-slate-500">{c.exams}</td>
                        <td className="p-4">
                          <span className={`text-sm font-bold ${c.avgScore !== null ? (parseFloat(c.avgScore) >= 5 ? 'text-green-600' : 'text-red-500') : 'text-slate-300'}`}>
                            {c.avgScore !== null ? `${c.avgScore}/10` : '—'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: `${c.passRate}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">{c.passRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaoCaoThongKeGiaoVien;
