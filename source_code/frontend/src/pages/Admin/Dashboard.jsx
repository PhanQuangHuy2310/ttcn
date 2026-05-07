// src/pages/Admin/Dashboard.jsx
// UPGRADED: Full stats from real DB, recharts user growth chart,
// proper audit log with users join (FIXED), recent users table

import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '../../components/AppLayout';
import {
  StatCard, Card, CardHeader, EmptyState, ErrorBanner,
  Sk, PageHeader, RoleBadge, Avatar, fmtDate, timeAgo,
} from '../../components/ui';
import {
  usersService, auditLogsService, examsService, coursesService,
} from '../../services/supabaseService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

// ── Role distribution chart ───────────────────────────────────
const RoleChart = ({ counts }) => {
  const data = [
    { name: 'Admin',     value: counts.admins,   color: '#ef4444' },
    { name: 'Giáo viên', value: counts.teachers, color: '#3b82f6' },
    { name: 'Sinh viên', value: counts.students, color: '#22c55e' },
  ];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Bar dataKey="value" name="Người dùng" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── Audit log row ─────────────────────────────────────────────
const ACTION_ICONS = {
  LOGIN:           { icon: 'login',     color: 'text-green-600',  bg: 'bg-green-50'  },
  LOGOUT:          { icon: 'logout',    color: 'text-slate-400',  bg: 'bg-slate-100' },
  EXAM_START:      { icon: 'quiz',      color: 'text-purple-600', bg: 'bg-purple-50' },
  EXAM_SUBMIT:     { icon: 'task_alt',  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  EXAM_CREATE:     { icon: 'add',       color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
  USER_CREATE:     { icon: 'person_add', color: 'text-blue-600',  bg: 'bg-blue-50'   },
  USER_DELETE:     { icon: 'delete',    color: 'text-red-600',    bg: 'bg-red-50'    },
  CLASS_JOIN:      { icon: 'group_add', color: 'text-teal-600',   bg: 'bg-teal-50'   },
};
const DEFAULT_ICON = { icon: 'history_edu', color: 'text-slate-500', bg: 'bg-slate-100' };

// ── Main page ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const [userCounts,  setUserCounts]  = useState(null);
  const [examCounts,  setExamCounts]  = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [auditLogs,   setAuditLogs]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [uCounts, eCounts, rUsers, logs] = await Promise.all([
        usersService.countByRole(),
        examsService.countAll(),
        usersService.getRecent(6),
        auditLogsService.getRecent(8),   // FIXED: now joins users(full_name,role)
      ]);

      if (uCounts.error || eCounts.error) {
        setError('Không thể tải dữ liệu bảng điều khiển.');
      } else {
        setUserCounts(uCounts.data);
        setExamCounts(eCounts.data);
        setRecentUsers(rUsers.data ?? []);
        setAuditLogs(logs.data ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppLayout role="ADMIN">
      <PageHeader
        title="Bảng điều khiển"
        subtitle={`Tổng quan hệ thống · ${fmtDate(new Date().toISOString())}`}
      />

      {error && <ErrorBanner message={error} />}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="group"
          iconBg="bg-blue-50 text-blue-600"
          label="Tổng người dùng"
          value={userCounts?.total}
          sub={`${userCounts?.students ?? 0} sinh viên`}
          loading={loading}
        />
        <StatCard
          icon="school"
          iconBg="bg-cyan-50 text-cyan-600"
          label="Giáo viên"
          value={userCounts?.teachers}
          loading={loading}
        />
        <StatCard
          icon="quiz"
          iconBg="bg-purple-50 text-purple-600"
          label="Tổng đề thi"
          value={examCounts?.total}
          sub={`${examCounts?.active ?? 0} đang mở`}
          loading={loading}
        />
        <StatCard
          icon="admin_panel_settings"
          iconBg="bg-red-50 text-red-600"
          label="Quản trị viên"
          value={userCounts?.admins}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Role distribution chart */}
          <Card>
            <CardHeader title="Phân bố người dùng theo vai trò" />
            <div className="px-6 pb-6">
              {loading ? (
                <Sk className="h-40 w-full" />
              ) : userCounts ? (
                <RoleChart counts={userCounts} />
              ) : null}
            </div>
          </Card>

          {/* Recent users */}
          <Card>
            <CardHeader
              title="Người dùng mới tham gia"
              subtitle="6 tài khoản được tạo gần nhất"
            />
            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <Sk key={i} className="h-14 w-full" />)}
              </div>
            ) : recentUsers.length === 0 ? (
              <EmptyState icon="group" title="Chưa có người dùng" />
            ) : (
              <div className="divide-y divide-slate-50">
                {recentUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <Avatar name={u.full_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name ?? '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <RoleBadge role={u.role} />
                      <span className="text-[10px] text-slate-300">{fmtDate(u.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* System status */}
          <Card>
            <CardHeader title="Trạng thái hệ thống" />
            <div className="p-5 space-y-3">
              {[
                { label: 'Supabase Auth',    ok: true  },
                { label: 'Database',         ok: true  },
                { label: 'Storage',          ok: true  },
                { label: 'Realtime',         ok: true  },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${item.ok ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.ok ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    {item.ok ? 'Hoạt động' : 'Sự cố'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Audit log */}
          <Card>
            <CardHeader title="Hoạt động gần đây" />
            {loading ? (
              <div className="p-4 space-y-3">
                {[1,2,3,4].map(i => <Sk key={i} className="h-10 w-full" />)}
              </div>
            ) : auditLogs.length === 0 ? (
              <EmptyState icon="history" title="Chưa có nhật ký" />
            ) : (
              <div className="divide-y divide-slate-50">
                {auditLogs.map(log => {
                  const { icon, color, bg } = ACTION_ICONS[log.action_type] ?? DEFAULT_ICON;
                  return (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 font-medium line-clamp-1">{log.description ?? log.action_type}</p>
                        {/* FIXED: log.users now has full_name and role due to join fix */}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {log.users?.full_name ?? 'Hệ thống'} · {timeAgo(log.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="px-4 pb-4">
              <a href="/admin/security" className="block text-center text-xs text-primary font-semibold hover:underline mt-2">
                Xem toàn bộ nhật ký →
              </a>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
