// src/pages/Student/Dashboard.jsx
// UPGRADED: Real DB stats, upcoming exams from enrolled classes,
// score trend mini-chart, recent submissions table

/**
 * FILE: Dashboard.jsx (Student)
 * MÔ TẢ: Bảng điều khiển chính dành cho Sinh viên.
 * CHỨC NĂNG: Hiển thị các bài thi sắp tới, tiến độ học tập, thông báo mới và truy cập nhanh vào các khóa học đang tham gia.
 */
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

  // ── 1. KHỞI TẠO STATE ───────────────────────────────────────────
  const [enrollments, setEnrollments] = useState([]); // Danh sách các lớp học đang tham gia
  const [exams,       setExams]       = useState([]); // Danh sách các kỳ thi sắp tới
  const [submissions, setSubmissions] = useState([]); // Lịch sử các bài thi đã làm
  const [loading,     setLoading]     = useState(true); // Trạng thái tải dữ liệu
  const [error,       setError]       = useState(null); // Trạng thái lỗi (nếu có)

  // ── 2. EFFECT: Tải dữ liệu Dashboard ────────────────────────────
  // Hoạt động: Chạy 1 lần khi trang được load (phụ thuộc vào profile.id)
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

  // ── 3. TÍNH TOÁN THỐNG KÊ (Stats) ───────────────────────────────
  // Lọc ra những bài thi đã được chấm điểm (score !== null)
  const scoredSubs = submissions.filter(s => s.score !== null);
  
  // Tính điểm trung bình cộng của tất cả các bài đã chấm
  const avgScore   = scoredSubs.length
    ? (scoredSubs.reduce((a, s) => a + parseFloat(s.score), 0) / scoredSubs.length).toFixed(1)
    : null;
    
  // Đếm số bài thi đạt (Điểm >= Điểm chuẩn, mặc định điểm chuẩn = 5 nếu giảng viên không setup)
  const passCount  = scoredSubs.filter(s => parseFloat(s.score) >= (s.exams?.pass_score ?? 5)).length;
  
  // Tính tỷ lệ phần trăm Đạt
  const passRate   = scoredSubs.length ? Math.round((passCount / scoredSubs.length) * 100) : 0;

  // Tính số bài điểm kém (< 5) để hiển thị cảnh báo
  const lowScoreCount = scoredSubs.filter(s => parseFloat(s.score) < 5).length;
  const isAtRisk = (avgScore !== null && avgScore < 5) || lowScoreCount >= 2;

  // ── 4. CHUẨN BỊ DỮ LIỆU BIỂU ĐỒ (Trend data) ─────────────────────
  // YÊU CẦU 10: Sử dụng useMemo để tránh Sort lại mảng lớn mỗi khi component Re-render
  const trendData = React.useMemo(() => {
    return [...scoredSubs]
      .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
      .slice(-6)
      .map(s => ({ label: fmtDate(s.submitted_at), score: parseFloat(s.score) }));
  }, [scoredSubs]);

  // ── 5. HÀM TIỆN ÍCH ─────────────────────────────────────────────
  // Trả về câu chào phù hợp theo buổi trong ngày (Sáng/Chiều/Tối)
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

      {/* TÍNH NĂNG MỚI: Cảnh báo học tập (Study Alert) */}
      {!loading && isAtRisk && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded text-2xl">warning</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-700 text-lg">Cảnh báo Kết quả Học tập</h3>
            <p className="text-red-600 mt-1">
              Bạn đang có {lowScoreCount} bài kiểm tra dưới trung bình, và điểm tổng kết hiện tại là <strong>{avgScore}/10</strong>. 
              Điều này ảnh hưởng lớn đến quá trình học. Hãy nhanh chóng ôn tập lại các phần kiến thức hổng và liên hệ Giảng viên để được hỗ trợ!
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="school"    iconBg="bg-blue-50 text-blue-600"   label="Lớp đang học"  value={enrollments.length}  loading={loading} onClick={() => navigate('/student/classes')} />
        <StatCard icon="quiz"      iconBg="bg-purple-50 text-purple-600" label="Bài đã nộp" value={submissions.length}  loading={loading} />
        <StatCard icon="grade"     iconBg="bg-orange-50 text-orange-600" label="Điểm TB"    value={avgScore ? `${avgScore}/10` : '—'} loading={loading} />
        <StatCard icon="task_alt"  iconBg="bg-green-50 text-green-600"  label="Tỷ lệ đạt"   value={`${passRate}%`}      loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Vào thi ngay',  icon: 'quiz',    to: '/student/exams',      variant: 'primary'   },
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
          {/* TÍNH NĂNG MỚI: Biểu đồ Nhiệt Học tập (Gamification Heatmap) */}
          <Card>
            <CardHeader title="Năng nổ học tập (Study Streak)" subtitle="Tần suất nộp bài của bạn trong 30 ngày qua" />
            <div className="px-6 py-5">
              {loading ? <Sk className="h-24 w-full" /> : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const daySubmissions = submissions.filter(s => {
                        const d = new Date();
                        d.setDate(d.getDate() - (29 - i));
                        const dateStr = s?.submitted_at || s?.created_at;
                        return dateStr ? dateStr.startsWith(d.toISOString().split('T')[0]) : false;
                      }).length;
                      
                      const intensity = daySubmissions === 0 ? 'bg-slate-100' : 
                                        daySubmissions === 1 ? 'bg-green-300' : 
                                        daySubmissions === 2 ? 'bg-green-400' : 'bg-green-600';
                                        
                      return (
                        <div 
                          key={i} 
                          title={`${daySubmissions} bài nộp`}
                          className={`w-[calc(100%/15-6px)] h-4 sm:w-5 sm:h-5 rounded-[4px] cursor-help transition-all hover:scale-110 ${intensity}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 mt-2 font-medium">
                    <span>Ít</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-slate-100 rounded-[2px]" />
                      <div className="w-3 h-3 bg-green-300 rounded-[2px]" />
                      <div className="w-3 h-3 bg-green-400 rounded-[2px]" />
                      <div className="w-3 h-3 bg-green-600 rounded-[2px]" />
                    </div>
                    <span>Nhiều</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

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
