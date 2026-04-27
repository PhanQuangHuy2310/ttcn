// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { StatCard, Card, CardHeader, EmptyState, ErrorBanner, RoleBadge, Avatar, Sk, timeAgo } from '../../components/ui';
import { usersService, coursesService, examsService, submissionsService, auditLogsService } from '../../services/supabaseService';

const AdminDashboard = () => {
  const profile = useSelector(selectProfile);
  const [stats,       setStats]       = useState(null);
  const [recentLogs,  setRecentLogs]  = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userCounts, classCount, examCounts, subData, logs, newUsers] = await Promise.all([
        usersService.countByRole(),
        coursesService.countAll(),
        examsService.countAll(),
        submissionsService.countAll(),
        auditLogsService.getRecent(8),
        usersService.getRecent(5),
      ]);

      const subs = subData.data ?? [];
      setStats({
        totalUsers:    userCounts.data?.total ?? 0,
        totalTeachers: userCounts.data?.teachers ?? 0,
        totalStudents: userCounts.data?.students ?? 0,
        totalClasses:  classCount.data ?? 0,
        totalExams:    examCounts.data?.total ?? 0,
        activeExams:   examCounts.data?.active ?? 0,
        totalSubs:     subs.length,
        submittedSubs: subs.filter(s => s.status === 'SUBMITTED').length,
      });
      setRecentLogs(logs.data ?? []);
      setRecentUsers(newUsers.data ?? []);
    } catch {
      setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const STAT_CARDS = [
    { label: 'Tổng người dùng', value: stats?.totalUsers,    sub: `GV: ${stats?.totalTeachers ?? 0} · SV: ${stats?.totalStudents ?? 0}`, icon: 'person',               iconBg: 'bg-blue-50 text-blue-600' },
    { label: 'Số khóa học',     value: stats?.totalClasses,  sub: 'Đang hoạt động',                                                        icon: 'school',               iconBg: 'bg-orange-50 text-orange-600' },
    { label: 'Số kỳ thi',       value: stats?.totalExams,    sub: `${stats?.activeExams ?? 0} đang diễn ra`,                               icon: 'quiz',                 iconBg: 'bg-purple-50 text-purple-600' },
    { label: 'Bài đã nộp',      value: stats?.submittedSubs, sub: `Tổng: ${stats?.totalSubs ?? 0}`,                                        icon: 'assignment_turned_in', iconBg: 'bg-teal-50 text-teal-600' },
  ];

  const logIcon = type =>
    type === 'LOGIN' ? 'login' : type === 'LOGOUT' ? 'logout' : type?.includes('EXAM') ? 'quiz' : 'history_edu';

  return (
    <AppLayout role="ADMIN">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-800 tracking-tight">
            Xin chào, {profile?.full_name ?? 'Quản trị viên'} 👋
          </h1>
          <p className="text-slate-500 mt-1">Tổng quan hiệu suất hệ thống DHDedu hôm nay.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users"
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Thêm người dùng
          </Link>
          <Link to="/teacher/exams"
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo kỳ thi
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((c, i) => <StatCard key={i} {...c} loading={loading} />)}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit log */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Nhật ký hoạt động gần đây"
            action={<Link to="/admin/security" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
          />
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
          ) : recentLogs.length === 0 ? (
            <EmptyState icon="history" title="Chưa có hoạt động nào" />
          ) : (
            <div className="divide-y divide-slate-50">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-slate-500 text-base">{logIcon(log.action_type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium">{log.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{log.users?.full_name ?? '—'}</span>
                      {log.users?.role && <RoleBadge role={log.users.role} />}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{timeAgo(log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* New users */}
        <Card>
          <CardHeader
            title="Người dùng mới"
            action={<Link to="/admin/users" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</Link>}
          />
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
          ) : recentUsers.length === 0 ? (
            <EmptyState icon="person_add" title="Chưa có người dùng mới" />
          ) : (
            <div className="divide-y divide-slate-50">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                  <Avatar name={u.full_name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name ?? 'Người dùng'}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
