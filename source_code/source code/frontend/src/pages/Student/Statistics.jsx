// src/pages/Student/Statistics.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  StatCard, Card, CardHeader, EmptyState, ErrorBanner,
  Sk, PageHeader, ScoreBadge, fmtDate, ProgressBar,
} from '../../components/ui';
import { submissionsService } from '../../services/supabaseService';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, PieChart, Pie, Legend,
} from 'recharts';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

const ScoreTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip content={<ChartTooltip />} />
      <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
      <Area
        type="monotone"
        dataKey="score"
        name="Điểm số"
        stroke="#3b82f6"
        strokeWidth={2.5}
        fill="url(#scoreGrad)"
        dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
        activeDot={{ r: 6 }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const ScoreDistChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={180}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
      <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip content={<ChartTooltip />} />
      <Bar dataKey="count" name="Số bài" radius={[6, 6, 0, 0]}>
        {data.map((d, i) => (
          <Cell key={i} fill={
            d.range === '9-10' ? '#22c55e' :
              d.range === '7-9' ? '#3b82f6' :
                d.range === '5-7' ? '#f59e0b' : '#ef4444'
          } />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const Statistics = () => {
  const profile = useSelector(selectProfile);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    submissionsService.getByStudent(profile.id).then(({ data, error: err }) => {
      if (err) setError('Không thể tải dữ liệu thống kê.');
      else setSubmissions((data ?? []).filter(s => s.score !== null));
      setLoading(false);
    });
  }, [profile?.id]);

  const metrics = useMemo(() => {
    if (!submissions.length) return null;
    const scores = submissions.map(s => parseFloat(s.score));
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const best = Math.max(...scores);
    const worst = Math.min(...scores);
    const passed = scores.filter(s => s >= 5).length;
    const passRate = Math.round((passed / scores.length) * 100);
    return { avg: avg.toFixed(1), best: best.toFixed(1), worst: worst.toFixed(1), passRate, total: submissions.length, passed };
  }, [submissions]);

  const trendData = useMemo(() => {
    return [...submissions]
      .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
      .slice(-10)
      .map((s, i) => ({
        label: fmtDate(s.submitted_at),
        score: parseFloat(s.score),
        exam: s.exams?.title ?? `Bài ${i + 1}`,
      }));
  }, [submissions]);

  const distData = useMemo(() => {
    const buckets = [
      { range: '0-5', min: 0, max: 5 },
      { range: '5-7', min: 5, max: 7 },
      { range: '7-9', min: 7, max: 9 },
      { range: '9-10', min: 9, max: 10.01 },
    ];
    return buckets.map(b => ({
      range: b.range,
      count: submissions.filter(s => {
        const v = parseFloat(s.score);
        return v >= b.min && v < b.max;
      }).length,
    }));
  }, [submissions]);

  const pieData = metrics ? [
    { name: 'Đạt (≥5)', value: metrics.passed, color: '#22c55e' },
    { name: 'Không đạt', value: metrics.total - metrics.passed, color: '#ef4444' },
  ].filter(d => d.value > 0) : [];

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Thống kê học tập" subtitle="Phân tích hiệu suất dựa trên kết quả thi" />

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <Sk key={i} className="h-28 w-full rounded-2xl" />)}
          </div>
          <Sk className="h-64 w-full rounded-2xl" />
        </div>
      ) : !metrics ? (
        <Card>
          <EmptyState
            icon="bar_chart"
            title="Chưa có dữ liệu thống kê"
            subtitle="Hoàn thành ít nhất một bài thi để xem thống kê học tập của bạn."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon="quiz" iconBg="bg-blue-50 text-blue-600" label="Tổng bài đã thi" value={metrics.total} sub="bài thi có điểm" />
            <StatCard icon="grade" iconBg="bg-primary/10 text-primary" label="Điểm trung bình" value={`${metrics.avg}/10`} />
            <StatCard icon="trending_up" iconBg="bg-green-50 text-green-600" label="Điểm cao nhất" value={`${metrics.best}/10`} />
            <StatCard icon="task_alt" iconBg="bg-orange-50 text-orange-600" label="Tỷ lệ đạt" value={`${metrics.passRate}%`} sub={`${metrics.passed}/${metrics.total} bài đạt`} />
          </div>

          {trendData.length > 1 && (
            <Card>
              <CardHeader title="Xu hướng điểm số" subtitle="Điểm 10 bài thi gần nhất theo thời gian" />
              <div className="px-6 pb-6">
                <ScoreTrendChart data={trendData} />
                <p className="text-xs text-slate-400 text-center mt-2">Đường nét đứt màu vàng = ngưỡng điểm đạt (5.0)</p>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Phân bố điểm số" subtitle="Số bài theo từng khung điểm" />
              <div className="px-6 pb-6"><ScoreDistChart data={distData} /></div>
            </Card>

            <Card>
              <CardHeader title="Tỷ lệ đạt / Không đạt" />
              <div className="px-6 pb-6">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [`${v} bài`, n]} contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Không đủ dữ liệu</div>
                )}
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Mục tiêu học tập" />
            <div className="p-6 space-y-5">
              {[
                { label: 'Điểm TB hiện tại', value: parseFloat(metrics.avg), target: 8, color: 'bg-primary' },
                { label: 'Tỷ lệ đạt', value: metrics.passRate, target: 100, color: 'bg-green-500', isPercent: true },
                { label: 'Điểm cao nhất', value: parseFloat(metrics.best), target: 10, color: 'bg-orange-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-black text-slate-800">{item.isPercent ? `${item.value}%` : `${item.value}/10`}</span>
                  </div>
                  <ProgressBar value={item.value} max={item.target} colorClass={item.color} />
                </div>
              ))}
            </div>
          </Card>

          {/* ĐÃ CẬP NHẬT: Thêm cột Trạng thái và Nhận xét vào bảng */}
          <Card>
            <CardHeader title="Lịch sử điểm số & Nhận xét" subtitle="Bảng theo dõi các bài đã chấm điểm" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {['Đề thi', 'Điểm số', 'Trạng thái', 'Nhận xét', 'Ngày thi'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...submissions]
                    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
                    .slice(0, 10)
                    .map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                        <td className="px-6 py-3.5 font-medium text-slate-800">{s.exams?.title ?? 'Bài thi'}</td>
                        <td className="px-6 py-3.5"><ScoreBadge score={s.score} /></td>
                        <td className="px-6 py-3.5">
                          {s.status === 'GRADED' ? (
                            <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">Đã chấm tự luận</span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">Chấm tự động</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 text-xs max-w-[250px] truncate" title={s.teacher_comment}>
                          {s.teacher_comment ? `💬 ${s.teacher_comment}` : '—'}
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 text-xs">{fmtDate(s.submitted_at)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};

export default Statistics;