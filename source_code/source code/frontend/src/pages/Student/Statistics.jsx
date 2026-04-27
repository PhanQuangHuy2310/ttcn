// src/pages/Student/Statistics.jsx
// Replaces ThongKeHocTapChiTietSinhVien (hardcoded). Connected to real submissions.

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate } from '../../components/ui';
import { submissionsService, classesService } from '../../services/supabaseService';

const ScoreBar = ({ score, max = 10 }) => {
  const pct = Math.min(100, ((parseFloat(score) || 0) / max) * 100);
  const color = pct >= 80 ? 'bg-green-500' : pct >= 65 ? 'bg-blue-500' : pct >= 50 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-2 ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8 text-right">{score ?? '—'}</span>
    </div>
  );
};

const Statistics = () => {
  const profile = useSelector(selectProfile);
  const [submissions,  setSubmissions]  = useState([]);
  const [enrollments,  setEnrollments]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [subRes, enrRes] = await Promise.all([
        submissionsService.getByStudent(profile.id),
        classesService.getEnrolledByStudent(profile.id),
      ]);
      if (subRes.error) setError('Không thể tải dữ liệu thống kê.');
      else {
        setSubmissions(subRes.data ?? []);
        setEnrollments(enrRes.data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  // ── Computed stats ──────────────────────────────────────────
  const submitted = submissions.filter(s => s.status === 'SUBMITTED');
  const scored    = submitted.filter(s => s.score !== null && s.score !== undefined);

  const avgScore  = scored.length
    ? (scored.reduce((a, s) => a + parseFloat(s.score), 0) / scored.length).toFixed(1)
    : null;

  const topScore  = scored.length ? Math.max(...scored.map(s => parseFloat(s.score))).toFixed(1) : null;
  const lowScore  = scored.length ? Math.min(...scored.map(s => parseFloat(s.score))).toFixed(1) : null;

  const scoreDistribution = [
    { label: '9–10 (Xuất sắc)',    min: 9,   color: 'bg-green-500' },
    { label: '7–8.9 (Tốt)',        min: 7,   color: 'bg-blue-500' },
    { label: '5–6.9 (Trung bình)', min: 5,   color: 'bg-orange-500' },
    { label: 'Dưới 5 (Yếu)',       min: -1,  color: 'bg-red-500' },
  ].map(({ label, min, color }) => {
    const count = scored.filter(s => {
      const v = parseFloat(s.score);
      return min === -1 ? v < 5 : min === 9 ? v >= 9 : v >= min && v < min + 2;
    }).length;
    const pct = scored.length ? Math.round((count / scored.length) * 100) : 0;
    return { label, count, pct, color };
  });

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Thống kê học tập"
        subtitle="Phân tích chi tiết kết quả học tập của bạn"
      />
      {error && <ErrorBanner message={error} />}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="school"   iconBg="bg-blue-50 text-blue-600"    label="Số lớp đang học"   value={enrollments.length}          loading={loading} />
        <StatCard icon="quiz"     iconBg="bg-purple-50 text-purple-600" label="Bài thi đã nộp"  value={submitted.length}             loading={loading} />
        <StatCard icon="grade"    iconBg="bg-green-50 text-green-600"  label="Điểm TB"           value={avgScore ?? '—'}              loading={loading} />
        <StatCard icon="trending_up" iconBg="bg-orange-50 text-orange-600" label="Điểm cao nhất" value={topScore ?? '—'}             loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score history */}
        <Card className="lg:col-span-3">
          <CardHeader title="Lịch sử điểm số" />
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <Sk key={i} className="h-10 w-full" />)}</div>
          ) : scored.length === 0 ? (
            <EmptyState icon="grade" title="Chưa có điểm số nào" subtitle="Hoàn thành bài thi để xem thống kê." />
          ) : (
            <div className="divide-y divide-slate-50">
              {scored.slice(0, 10).map(sub => (
                <div key={sub.id} className="px-6 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-purple-600 text-base">quiz</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{sub.exams?.title ?? '—'}</p>
                    <p className="text-xs text-slate-400">{fmtDate(sub.submitted_at)}</p>
                  </div>
                  <div className="w-32 shrink-0">
                    <ScoreBar score={parseFloat(sub.score).toFixed(1)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Distribution + overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score distribution */}
          <Card>
            <CardHeader title="Phân bố điểm số" />
            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3,4].map(i => <Sk key={i} className="h-8 w-full" />)}</div>
            ) : scored.length === 0 ? (
              <EmptyState icon="pie_chart" title="Chưa có dữ liệu" />
            ) : (
              <div className="px-6 py-4 space-y-3">
                {scoreDistribution.map(({ label, count, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{label}</span>
                      <span className="text-slate-500">{count} bài ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-2 ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Min/Max/Avg */}
          <Card>
            <CardHeader title="Tổng kết" />
            <div className="px-6 py-4 space-y-3">
              {[
                { label: 'Điểm trung bình', value: avgScore, icon: 'avg_pace',      color: 'text-blue-600' },
                { label: 'Điểm cao nhất',   value: topScore, icon: 'trending_up',   color: 'text-green-600' },
                { label: 'Điểm thấp nhất',  value: lowScore, icon: 'trending_down', color: 'text-red-500' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  {loading
                    ? <Sk className="h-5 w-12" />
                    : <span className={`text-xl font-black ${color}`}>{value ?? '—'}</span>
                  }
                </div>
              ))}
            </div>
          </Card>

          {/* Enrolled classes summary */}
          <Card>
            <CardHeader title="Các lớp đang học" />
            {loading ? (
              <div className="p-4 space-y-2">{[1,2].map(i => <Sk key={i} className="h-10 w-full" />)}</div>
            ) : enrollments.length === 0 ? (
              <EmptyState icon="school" title="Chưa đăng ký lớp nào" />
            ) : (
              <div className="divide-y divide-slate-50">
                {enrollments.slice(0, 5).map(en => (
                  <div key={en.id} className="px-6 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-600 text-base">school</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{en.classes?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{en.classes?.courses?.subject ?? '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Statistics;
