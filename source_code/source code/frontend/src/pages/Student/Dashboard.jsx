// src/pages/Student/Dashboard.jsx
// UPGRADED: Real DB stats, upcoming exams from enrolled classes,
// score trend mini-chart, recent submissions table

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  StatCard, Card, CardHeader, EmptyState, ErrorBanner,
  Sk, PageHeader, Btn, ScoreBadge, ProgressBar, fmtDate, fmtDateTime,
} from '../../components/ui';
import {
  classesService, examsService, submissionsService,
} from '../../services/supabaseService';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const StudentDashboard = () => {
  const profile  = useSelector(selectProfile);
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [exams,       setExams]       = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [enRes, exRes, subRes] = await Promise.all([
        classesService.getEnrolledByStudent(profile.id),
        examsService.getUpcoming(5),
        submissionsService.getByStudent(profile.id),
      ]);
      if (enRes.error && exRes.error) {
        setError('Không thể tải dữ liệu bảng điều khiển.');
      } else {
        setEnrollments(enRes.data ?? []);
        setExams(exRes.data ?? []);
        setSubmissions(subRes.data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  // Stats
  const scoredSubs = submissions.filter(s => s.score !== null);
  const avgScore   = scoredSubs.length
    ? (scoredSubs.reduce((a, s) => a + parseFloat(s.score), 0) / scoredSubs.length).toFixed(1)
    : null;
  const passCount  = scoredSubs.filter(s => parseFloat(s.score) >= (s.exams?.pass_score ?? 5)).length;
  const passRate   = scoredSubs.length ? Math.round((passCount / scoredSubs.length) * 100) : 0;

  // Trend data
  const trendData = [...scoredSubs]
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
    .slice(-6)
    .map(s => ({ label: fmtDate(s.submitted_at), score: parseFloat(s.score) }));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title={`${greeting()}, ${profile?.full_name?.split(' ').pop() ?? 'bạn'}!`}
        subtitle={`${fmtDate(new Date().toISOString())} · Hãy học tốt hôm nay!`}
      />

      {error && <ErrorBanner message={error} />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="school"    iconBg="bg-blue-50 text-blue-600"   label="Lớp đang học"  value={enrollments.length}  loading={loading} />
        <StatCard icon="quiz"      iconBg="bg-purple-50 text-purple-600" label="Bài đã nộp" value={submissions.length}  loading={loading} />
        <StatCard icon="grade"     iconBg="bg-orange-50 text-orange-600" label="Điểm TB"    value={avgScore ? `${avgScore}/10` : '—'} loading={loading} />
        <StatCard icon="task_alt"  iconBg="bg-green-50 text-green-600"  label="Tỷ lệ đạt"   value={`${passRate}%`}      loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Vào thi ngay',  icon: 'quiz',    to: '/student/exams',      variant: 'primary'   },
          { label: 'Luyện tập',     icon: 'book',    to: '/student/practice',   variant: 'secondary' },
          { label: 'Flashcard',     icon: 'style',   to: '/student/flashcards', variant: 'secondary' },
          { label: 'Thống kê',      icon: 'bar_chart', to: '/student/statistics', variant: 'secondary' },
        ].map(a => (
          <Btn key={a.label} variant={a.variant} icon={a.icon} onClick={() => navigate(a.to)} className="justify-start">
            {a.label}
          </Btn>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Score trend */}
          {trendData.length > 1 && (
            <Card>
              <CardHeader title="Xu hướng điểm số gần đây" subtitle="Dựa trên 6 bài thi gần nhất" />
              <div className="px-6 pb-6">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={v => [v.toFixed(1), 'Điểm']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5}
                      dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Recent submissions */}
          <Card>
            <CardHeader
              title="Kết quả thi gần đây"
              action={<Btn size="sm" variant="outline" onClick={() => navigate('/student/history')}>Xem tất cả</Btn>}
            />
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
            ) : submissions.length === 0 ? (
              <EmptyState icon="assignment" title="Chưa có bài thi nào" subtitle="Tham gia kỳ thi đầu tiên để xem kết quả."
                action={<Btn size="sm" onClick={() => navigate('/student/exams')}>Xem đề thi</Btn>}
              />
            ) : (
              <div className="divide-y divide-slate-50">
                {submissions.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      s.score !== null
                        ? parseFloat(s.score) >= (s.exams?.pass_score ?? 5) ? 'bg-green-50' : 'bg-red-50'
                        : 'bg-slate-100'
                    }`}>
                      <span className={`material-symbols-outlined text-base ${
                        s.score !== null
                          ? parseFloat(s.score) >= (s.exams?.pass_score ?? 5) ? 'text-green-600' : 'text-red-600'
                          : 'text-slate-400'
                      }`}>
                        {s.status === 'GRADED' ? 'grade' : s.status === 'SUBMITTED' ? 'task_alt' : 'pending'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {s.exams?.title ?? 'Bài thi'}
                      </p>
                      <p className="text-xs text-slate-400">{fmtDate(s.submitted_at ?? s.created_at)}</p>
                    </div>
                    <ScoreBadge score={s.score} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Upcoming exams */}
          <Card>
            <CardHeader
              title="Lịch thi sắp tới"
              action={<Btn size="sm" variant="outline" onClick={() => navigate('/student/exams')}>Tất cả</Btn>}
            />
            {loading ? (
              <div className="p-4 space-y-3">{[1,2].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
            ) : exams.length === 0 ? (
              <EmptyState icon="event" title="Không có lịch thi" subtitle="Chưa có đề thi nào được lên lịch." />
            ) : (
              <div className="divide-y divide-slate-50">
                {exams.map(exam => {
                  const startTime = exam.start_time ? new Date(exam.start_time) : null;
                  const isToday   = startTime && fmtDate(exam.start_time) === fmtDate(new Date().toISOString());
                  return (
                    <div key={exam.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isToday ? 'bg-red-50' : 'bg-primary/10'
                        }`}>
                          <span className={`material-symbols-outlined text-base ${isToday ? 'text-red-600' : 'text-primary'}`}>
                            {isToday ? 'alarm' : 'event'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{exam.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {startTime ? fmtDateTime(exam.start_time) : 'Chưa có lịch'} · {exam.duration} phút
                          </p>
                          {isToday && (
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                              Hôm nay!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader title="Tiến độ học tập" />
            <div className="p-5 space-y-5">
              {[
                { label: 'Điểm trung bình',  value: avgScore ? parseFloat(avgScore) : 0, max: 10,  color: 'bg-primary', display: avgScore ? `${avgScore}/10` : '—' },
                { label: 'Tỷ lệ đạt',        value: passRate,                            max: 100, color: 'bg-green-500', display: `${passRate}%` },
                { label: 'Lớp học tham gia', value: enrollments.length,                  max: Math.max(enrollments.length, 1), color: 'bg-orange-500', display: `${enrollments.length} lớp` },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="font-black text-slate-800">{item.display}</span>
                  </div>
                  <ProgressBar value={item.value} max={item.max} colorClass={item.color} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
