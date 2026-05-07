// src/pages/Teacher/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  StatCard, Card, CardHeader, EmptyState, ErrorBanner,
  Sk, PageHeader, Btn, StatusBadge, fmtDate, fmtDateTime,
} from '../../components/ui';
import { coursesService, examsService, submissionsService, questionsService } from '../../services/supabaseService';

const TeacherDashboard = () => {
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [pending, setPending] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [courseRes, examRes, pendingRes, qCount] = await Promise.all([
        coursesService.getByTeacher(profile.id),
        examsService.getByTeacher(profile.id, 5),
        submissionsService.getPendingByTeacher(profile.id),
        questionsService.countByTeacher(profile.id),
      ]);

      if (courseRes.error) { setError('Không thể tải dữ liệu.'); setLoading(false); return; }

      const courseList = courseRes.data ?? [];
      const totalClasses = courseList.reduce((a, c) => a + (c.classes ?? []).length, 0);
      const totalStudents = courseList.reduce((a, c) => a + (c.classes ?? []).reduce((a2, cl) => a2 + (cl.student_classes?.length ?? 0), 0), 0);

      setStats({
        courses: courseList.length,
        classes: totalClasses,
        students: totalStudents,
        questions: qCount.data ?? 0,
        pending: (pendingRes.data ?? []).length,
        exams: (examRes.data ?? []).length,
      });
      setCourses(courseList.slice(0, 3));
      setExams(examRes.data ?? []);
      setPending((pendingRes.data ?? []).slice(0, 5));
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title={`${greeting()}, ${profile?.full_name?.split(' ').pop() ?? 'Giảng viên'}!`}
        subtitle={`Hôm nay ${fmtDate(new Date().toISOString())} · Tổng quan giảng dạy`}
      />

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="school" iconBg="bg-blue-50 text-blue-600" label="Khóa học" value={stats?.courses} loading={loading} />
        <StatCard icon="groups" iconBg="bg-cyan-50 text-cyan-600" label="Tổng sinh viên" value={stats?.students} loading={loading} />
        <StatCard icon="quiz" iconBg="bg-purple-50 text-purple-600" label="Đề thi" value={stats?.exams} loading={loading} />
        <StatCard icon="rate_review" iconBg={stats?.pending > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'} label="Chờ chấm bài" value={stats?.pending ?? 0} loading={loading} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Tạo đề thi', icon: 'add', to: '/teacher/exams', variant: 'primary' },
          { label: 'Thêm câu hỏi', icon: 'help', to: '/teacher/questions', variant: 'secondary' },
          { label: 'Quản lý lớp', icon: 'groups', to: '/teacher/classes', variant: 'secondary' },
          { label: 'Xem báo cáo', icon: 'monitoring', to: '/teacher/reports', variant: 'secondary' },
        ].map(a => (
          <Btn key={a.label} variant={a.variant} icon={a.icon} onClick={() => navigate(a.to)} className="justify-start">{a.label}</Btn>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {stats?.pending > 0 && (
            <Card>
              <CardHeader title={`Bài tự luận chờ chấm (${stats.pending})`} action={pending.length > 0 && (<Btn variant="outline" size="sm" icon="rate_review" onClick={() => navigate(`/teacher/essay-grading?examId=${pending[0]?.exam_id}`)}>Chấm bài</Btn>)} />
              <div className="divide-y divide-slate-50">
                {loading ? ([1, 2].map(i => <Sk key={i} className="h-12 w-full mx-6 my-3" />)) : pending.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-amber-600 text-base">rate_review</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">Nộp lúc {fmtDateTime(sub.submitted_at)}</p>
                      <p className="text-xs text-slate-400">Từ đề thi ID: {sub.exam_id?.slice(0, 8)}…</p>
                    </div>
                    <Btn size="xs" variant="warning" icon="grading" onClick={() => navigate(`/teacher/essay-grading?examId=${sub.exam_id}`)}>Chấm</Btn>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Đề thi gần đây" action={<Btn size="sm" variant="outline" icon="open_in_new" onClick={() => navigate('/teacher/exams')}>Tất cả</Btn>} />
            {loading ? (
              <div className="p-4 space-y-3">{[1, 2, 3].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
            ) : exams.length === 0 ? (
              <EmptyState icon="quiz" title="Chưa có đề thi" subtitle="Tạo đề thi đầu tiên để bắt đầu." action={<Btn size="sm" icon="add" onClick={() => navigate('/teacher/exams')}>Tạo đề thi</Btn>} />
            ) : (
              <div className="divide-y divide-slate-50">
                {exams.map(exam => {
                  const isMock = exam.title.includes('[Thi thử]');
                  return (
                    <div key={exam.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isMock ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-600'}`}>
                        <span className="material-symbols-outlined text-base">{isMock ? 'model_training' : 'school'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {isMock ? <span className="text-orange-500 mr-1.5">[Thi Thử]</span> : null}
                          {exam.title.replace('[Thi thử]', '').trim()}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{exam.duration} phút · Khóa học: {exam.courses?.name ?? '—'}</p>
                      </div>
                      <StatusBadge status={exam.status ?? 'DRAFT'} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <Card>
            <CardHeader title="Khóa học của tôi" action={<Btn size="sm" variant="outline" onClick={() => navigate('/teacher/classes')}>Quản lý</Btn>} />
            {loading ? (
              <div className="p-4 space-y-3">{[1, 2].map(i => <Sk key={i} className="h-20 w-full" />)}</div>
            ) : courses.length === 0 ? (
              <EmptyState icon="school" title="Chưa có khóa học" action={<Btn size="sm" icon="add" onClick={() => navigate('/teacher/classes')}>Tạo khóa học</Btn>} />
            ) : (
              <div className="divide-y divide-slate-50">
                {courses.map(course => {
                  const clsCount = (course.classes ?? []).length;
                  const stuCount = (course.classes ?? []).reduce((a, cl) => a + (cl.student_classes?.length ?? 0), 0);
                  return (
                    <div key={course.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/classes?id=${course.id}`)}>
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 truncate">{course.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{course.subject ?? '—'} · HK {course.semester ?? '—'}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 text-base shrink-0">chevron_right</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1 text-slate-500"><span className="material-symbols-outlined text-xs">groups</span>{clsCount} lớp</span>
                        <span className="flex items-center gap-1 text-slate-500"><span className="material-symbols-outlined text-xs">person</span>{stuCount} sinh viên</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeacherDashboard;