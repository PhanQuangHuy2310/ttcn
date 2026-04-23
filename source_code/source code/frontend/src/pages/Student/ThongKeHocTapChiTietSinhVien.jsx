// src/pages/Student/ThongKeHocTapChiTietSinhVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ThongKeHocTapChiTietSinhVien = () => {
  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [history,  setHistory]  = useState([]);
  const [classes,  setClasses]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, statsRes, histRes, classRes] = await Promise.all([
        studentService.getProfile(user.id),
        studentService.getDashboardStats(user.id),
        studentService.getHistory(user.id),
        studentService.getMyClasses(user.id),
      ]);
      setProfile(prof.data);
      if (!statsRes.error) setStats(statsRes.data);
      setHistory(histRes.data ?? []);
      setClasses(classRes.data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  // Compute detailed analytics from history
  const submitted  = history.filter(s => s.status === 'SUBMITTED');
  const scores     = submitted.map(s => s.score).filter(s => s !== null);
  const avgScore   = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const best       = scores.length ? Math.max(...scores) : null;
  const passCount  = scores.filter(s => s >= 5).length;
  const passRate   = scores.length ? Math.round((passCount / scores.length) * 100) : 0;
  const totalTime  = submitted.reduce((acc, s) => acc + (s.time_spent ?? 0), 0);
  const avgTime    = submitted.length ? Math.floor(totalTime / submitted.length / 60) : 0;

  // Score distribution [0-2, 3-4, 5-6, 7-8, 9-10]
  const scoreDist = [
    { label: '0–2',  count: scores.filter(s => s <= 2).length,              color: 'bg-red-400' },
    { label: '3–4',  count: scores.filter(s => s >= 3 && s <= 4).length,   color: 'bg-orange-400' },
    { label: '5–6',  count: scores.filter(s => s >= 5 && s <= 6).length,   color: 'bg-yellow-400' },
    { label: '7–8',  count: scores.filter(s => s >= 7 && s <= 8).length,   color: 'bg-blue-400' },
    { label: '9–10', count: scores.filter(s => s >= 9).length,              color: 'bg-green-400' },
  ];
  const maxDist = Math.max(...scoreDist.map(d => d.count), 1);

  // Per-subject stats
  const subjectStats = {};
  submitted.forEach(s => {
    const subj = s.exams?.courses?.subject ?? 'Khác';
    if (!subjectStats[subj]) subjectStats[subj] = { scores: [], count: 0 };
    subjectStats[subj].count++;
    if (s.score !== null) subjectStats[subj].scores.push(s.score);
  });

  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64 min-h-screen">
        <StudentHeader />
        <div className="pt-24 pb-12 px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-2">
                Thống kê cá nhân
              </span>
              <h1 className="text-3xl font-black text-on-surface">
                {loading ? 'Đang tải...' : `Xin chào, ${profile?.full_name ?? 'Sinh viên'}!`}
              </h1>
              <p className="text-on-surface-variant max-w-2xl leading-relaxed mt-1">
                Phân tích chuyên sâu về tiến độ học tập và hiệu suất cá nhân của bạn dựa trên dữ liệu thời gian thực từ hệ thống DHDedu.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                Tùy chỉnh thời gian
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">download</span>
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Bài đã làm',      value: submitted.length,                        icon: 'assignment',        cls: 'text-primary bg-primary/10' },
              { label: 'Điểm trung bình',  value: avgScore ? `${avgScore}/10` : '—',       icon: 'grade',             cls: 'text-blue-600 bg-blue-50'  },
              { label: 'Điểm cao nhất',    value: best !== null ? `${best}/10` : '—',      icon: 'emoji_events',      cls: 'text-yellow-600 bg-yellow-50' },
              { label: 'Tỷ lệ vượt qua',  value: `${passRate}%`,                          icon: 'check_circle',      cls: 'text-green-600 bg-green-50' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.cls}`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{c.label}</p>
                  {loading ? <Skeleton className="h-7 w-16 mt-1" /> : (
                    <p className="text-2xl font-black text-on-surface">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

            {/* Score distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold mb-5">Phân phối điểm số</h3>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 rounded" />)}</div>
              ) : scores.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Chưa có dữ liệu điểm</p>
              ) : (
                <div className="space-y-3">
                  {scoreDist.map(d => (
                    <div key={d.label} className="flex items-center gap-3">
                      <span className="text-xs font-mono w-10 text-slate-400">{d.label}</span>
                      <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden">
                        <div className={`h-6 ${d.color} rounded-lg transition-all flex items-center justify-end pr-2`}
                          style={{ width: `${(d.count / maxDist) * 100}%` }}>
                          {d.count > 0 && <span className="text-white text-[10px] font-bold">{d.count}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 w-6">{d.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Per-subject breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold mb-5">Theo môn học</h3>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
              ) : Object.keys(subjectStats).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(subjectStats).map(([subj, data]) => {
                    const avg = data.scores.length
                      ? (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1)
                      : null;
                    return (
                      <div key={subj} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{subj}</p>
                          <p className="text-xs text-slate-400">{data.count} bài thi</p>
                        </div>
                        <span className={`font-black text-lg ${avg !== null ? (parseFloat(avg) >= 5 ? 'text-green-600' : 'text-red-500') : 'text-slate-300'}`}>
                          {avg ?? '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time & Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold mb-5">Hoạt động học tập</h3>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}</div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Tổng số lớp',        value: classes.length,              icon: 'school'    },
                    { label: 'Bài đã hoàn thành',   value: submitted.length,            icon: 'done_all'  },
                    { label: 'Thời gian TB/bài',    value: `${avgTime} phút`,           icon: 'timer'     },
                    { label: 'Tổng thời gian học',  value: `${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`, icon: 'schedule' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-base">{c.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">{c.label}</p>
                        <p className="font-bold text-sm text-on-surface">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent submissions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold">Lịch sử gần đây</h3>
              <a href="/student/history-chi-tietstudent" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
            ) : submitted.slice(0, 5).map(sub => (
              <div key={sub.id} className="flex items-center gap-4 p-3.5 hover:bg-slate-50 rounded-xl transition-colors mb-1">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-base">quiz</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{sub.exams?.title ?? '—'}</p>
                  <p className="text-xs text-slate-400">{sub.exams?.courses?.subject} · {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('vi-VN') : '—'}</p>
                </div>
                {sub.score !== null && (
                  <span className={`text-lg font-black ${sub.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                    {sub.score}<span className="text-xs text-slate-400">/10</span>
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
    </>
  );
};

export default ThongKeHocTapChiTietSinhVien;
