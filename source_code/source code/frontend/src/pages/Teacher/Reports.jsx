// src/pages/Teacher/Reports.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, Sk, PageHeader, ScoreBadge, fmtDate, Select } from '../../components/ui';
import { coursesService, submissionsService, examsService } from '../../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

const ScoreDistChart = ({ submissions }) => {
  const buckets = [
    { name: 'Giỏi (8-10)', min: 8, max: 10 },
    { name: 'Khá (6.5-7.9)', min: 6.5, max: 8 },
    { name: 'TB (5-6.4)', min: 5, max: 6.5 },
    { name: 'Yếu (< 5)', min: -1, max: 5 },
  ].map(b => ({
    name: b.name,
    count: submissions.filter(s => {
      const v = parseFloat(s.score);
      return !isNaN(v) && (b.min === -1 ? v < 5 : v >= b.min && v < b.max + (b.max === 10 ? 0.01 : 0));
    }).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={buckets} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="count" name="Số bài" radius={[6, 6, 0, 0]}>{buckets.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const PassFailPie = ({ submissions, passScore = 5 }) => {
  const scored = submissions.filter(s => s.score !== null);
  const pass = scored.filter(s => parseFloat(s.score) >= passScore).length;
  const fail = scored.length - pass;
  const data = [{ name: 'Đạt', value: pass, color: '#22c55e' }, { name: 'Không đạt', value: fail, color: '#ef4444' }].filter(d => d.value > 0);

  if (data.length === 0) return <EmptyState icon="pie_chart" title="Chưa có dữ liệu" />;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{data.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie>
        <Tooltip formatter={(v, n) => [`${v} bài`, n]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Reports = () => {
  const profile = useSelector(selectProfile);
  const [courses, setCourses] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState('');

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const [courseRes, pendingRes, examRes] = await Promise.all([
      coursesService.getByTeacher(profile.id),
      submissionsService.getPendingByTeacher(profile.id),
      examsService.getByTeacher(profile.id),
    ]);

    const courseList = courseRes.data ?? [];
    const pending = pendingRes.data ?? [];
    const examList = examRes.data ?? [];
    const totalStudents = courseList.reduce((a, c) => a + (c.classes ?? []).reduce((a2, cls) => a2 + (cls.student_classes?.length ?? 0), 0), 0);

    setStats({ totalCourses: courseList.length, totalStudents, pendingGrade: pending.length, totalExams: examList.length });
    setCourses(courseList);
    setAllExams(examList);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  useEffect(() => {
    if (!selectedExam) { setSubmissions([]); return; }
    setSubLoading(true);
    submissionsService.getByExam(selectedExam).then(({ data }) => { setSubmissions(data ?? []); setSubLoading(false); });
  }, [selectedExam]);

  const scored = submissions.filter(s => s.score !== null);
  const avgScore = scored.length ? (scored.reduce((a, s) => a + parseFloat(s.score), 0) / scored.length).toFixed(1) : null;
  const topScore = scored.length ? Math.max(...scored.map(s => parseFloat(s.score))).toFixed(1) : null;
  const selectedExamObj = allExams.find(e => e.id === selectedExam);

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Báo cáo & Thống kê" subtitle="Tổng quan hiệu suất giảng dạy" />
      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="school" iconBg="bg-blue-50 text-blue-600" label="Tổng khóa học" value={stats?.totalCourses} loading={loading} />
        <StatCard icon="group" iconBg="bg-cyan-50 text-cyan-600" label="Tổng sinh viên" value={stats?.totalStudents} loading={loading} />
        <StatCard icon="quiz" iconBg="bg-purple-50 text-purple-600" label="Tổng đề thi" value={stats?.totalExams} loading={loading} />
        <StatCard icon="rate_review" iconBg="bg-amber-50 text-amber-600" label="Chờ chấm bài" value={stats?.pendingGrade} loading={loading} />
      </div>

      <Card className="mb-6">
        <CardHeader title="Phân tích chất lượng bài thi" subtitle="Chọn đề thi để xem phổ điểm chi tiết" />
        <div className="px-6 py-4">
          <div className="max-w-md">
            <Select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
              <option value="">— Vui lòng chọn đề thi cần xem báo cáo —</option>

              <optgroup label="✅ Đề thi Chính thức (Lấy điểm)">
                {allExams.filter(e => !e.title.includes('[Thi thử]')).map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </optgroup>

              <optgroup label="📝 Đề thi Thử (Tự luyện)">
                {allExams.filter(e => e.title.includes('[Thi thử]')).map(e => (
                  <option key={e.id} value={e.id}>{e.title.replace('[Thi thử]', '').trim()}</option>
                ))}
              </optgroup>
            </Select>
          </div>

          {selectedExam && (
            <div className="mt-6">
              {subLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Sk className="h-48 w-full" /><Sk className="h-48 w-full" /></div>
              ) : submissions.length === 0 ? (
                <EmptyState icon="assignment" title="Chưa có sinh viên làm bài" subtitle="Không có dữ liệu thống kê cho đề thi này." />
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon="group" iconBg="bg-blue-50 text-blue-600" label="Tổng số bài nộp" value={submissions.length} />
                    <StatCard icon="grade" iconBg="bg-green-50 text-green-600" label="Điểm Trung bình" value={avgScore ?? '—'} />
                    <StatCard icon="trending_up" iconBg="bg-orange-50 text-orange-600" label="Điểm Cao nhất" value={topScore ?? '—'} />
                    <StatCard icon="timer" iconBg="bg-purple-50 text-purple-600" label="Điểm chuẩn (Pass)" value={selectedExamObj?.pass_score ?? '—'} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div><p className="text-sm font-bold text-slate-700 mb-3">Phân bố điểm số</p><ScoreDistChart submissions={scored} /></div>
                    <div><p className="text-sm font-bold text-slate-700 mb-3">Tỷ lệ đạt / không đạt</p><PassFailPie submissions={scored} passScore={selectedExamObj?.pass_score ?? 5} /></div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          {['Sinh viên', 'Email', 'Điểm', 'Trạng thái', 'Thoát tab', 'Thời gian nộp'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                            <td className="px-4 py-3 font-semibold text-slate-800">{s.users?.full_name ?? '—'}</td>
                            <td className="px-4 py-3 text-slate-500">{s.users?.email ?? '—'}</td>
                            <td className="px-4 py-3"><ScoreBadge score={s.score} /></td>
                            <td className="px-4 py-3">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.status === 'GRADED' ? 'bg-green-100 text-green-700' : s.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
                            </td>
                            <td className="px-4 py-3">{(s.tab_switches ?? 0) > 0 ? <span className="text-xs font-bold text-red-600">⚠ {s.tab_switches}x</span> : <span className="text-xs text-slate-400">0</span>}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs">{fmtDate(s.submitted_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default Reports;