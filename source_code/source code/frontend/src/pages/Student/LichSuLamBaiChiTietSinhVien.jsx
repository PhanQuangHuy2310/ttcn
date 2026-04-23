// src/pages/Student/LichSuLamBaiChiTietSinhVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const LichSuLamBaiChiTietSinhVien = () => {
  const [history,    setHistory]    = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [filter,     setFilter]     = useState('ALL');   // ALL | SUBMITTED | IN_PROGRESS
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [histRes, statsRes] = await Promise.all([
        studentService.getHistory(user.id),
        studentService.getDashboardStats(user.id),
      ]);
      if (histRes.error) { setError(histRes.error.message); setLoading(false); return; }
      setHistory(histRes.data ?? []);
      if (!statsRes.error) setStats(statsRes.data);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = history.filter(s => {
    const matchStatus = filter === 'ALL' || s.status === filter;
    const matchSearch = !search || s.exams?.title?.toLowerCase().includes(search.toLowerCase())
      || s.exams?.courses?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
  const formatDuration = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  };

  const scores = history.filter(s => s.score !== null).map(s => s.score);
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const best = scores.length ? Math.max(...scores) : null;
  const submittedCount = history.filter(s => s.status === 'SUBMITTED').length;

  const scoreColor = (s) => {
    if (s === null) return 'text-slate-400';
    if (s >= 8) return 'text-green-600';
    if (s >= 5) return 'text-yellow-600';
    return 'text-red-500';
  };

  const statusCfg = {
    SUBMITTED:   { label: 'Đã nộp',   cls: 'bg-green-50 text-green-700' },
    IN_PROGRESS: { label: 'Đang làm', cls: 'bg-yellow-50 text-yellow-700' },
    NOT_STARTED: { label: 'Chưa làm', cls: 'bg-slate-100 text-slate-500' },
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <StudentHeader />
      <main className="pt-20 pb-20 md:pb-8 md:pl-72 pr-6 min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Tổng bài đã làm', value: submittedCount, icon: 'assignment',       cls: 'bg-primary/10 text-primary' },
              { label: 'Điểm trung bình',  value: avgScore !== null ? `${avgScore}/10` : '—', icon: 'grade', cls: 'bg-blue-50 text-blue-600' },
              { label: 'Điểm cao nhất',    value: best !== null ? `${best}/10` : '—', icon: 'emoji_events', cls: 'bg-yellow-50 text-yellow-600' },
              { label: 'Đang làm dở',      value: history.filter(s => s.status === 'IN_PROGRESS').length, icon: 'pending', cls: 'bg-orange-50 text-orange-600' },
            ].map((c, i) => (
              <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.cls}`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-tertiary">{c.label}</p>
                </div>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <p className="text-3xl font-headline font-black text-on-surface">{c.value ?? '—'}</p>
                )}
              </div>
            ))}
          </section>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên bài thi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {[
              { key: 'ALL',         label: 'Tất cả' },
              { key: 'SUBMITTED',   label: 'Đã nộp' },
              { key: 'IN_PROGRESS', label: 'Đang làm' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setFilter(opt.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === opt.key ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/30'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* History list */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 bg-surface-container-lowest rounded-2xl text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">history</span>
              <p>Chưa có lịch sử làm bài nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(sub => {
                const cfg = statusCfg[sub.status] ?? statusCfg.NOT_STARTED;
                return (
                  <div key={sub.id} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">quiz</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface">{sub.exams?.title ?? '—'}</p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {sub.exams?.courses?.name} · {sub.exams?.classes?.name} · {formatDate(sub.submitted_at ?? sub.started_at)}
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Thời gian làm: {formatDuration(sub.time_spent)} / {sub.exams?.duration} phút
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                      {sub.status === 'SUBMITTED' && (
                        <div className="text-right">
                          <span className={`text-2xl font-black ${scoreColor(sub.score)}`}>
                            {sub.score !== null ? sub.score : '—'}
                          </span>
                          <span className="text-xs text-slate-400">/10</span>
                        </div>
                      )}
                      {sub.status === 'IN_PROGRESS' && (
                        <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${sub.exams?.id}`}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90">
                          Tiếp tục
                        </a>
                      )}
                      {sub.status === 'SUBMITTED' && (
                        <a href={`/student/review-chi-tietstudent?submissionId=${sub.id}`}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">
                          Xem lại
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LichSuLamBaiChiTietSinhVien;
