// src/pages/Admin/Security.jsx
import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, EmptyState, ErrorBanner, RoleBadge, Sk, PageHeader, timeAgo } from '../../components/ui';
import { auditLogsService } from '../../services/supabaseService';

const Security = () => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await auditLogsService.getRecent(30);
    if (err) setError('Không thể tải nhật ký bảo mật.');
    else setLogs(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const logIcon = type =>
    type === 'LOGIN' ? 'login' : type === 'LOGOUT' ? 'logout' : type?.includes('EXAM') ? 'quiz' : type?.includes('DELETE') ? 'delete' : 'history_edu';

  const logColor = type =>
    type === 'LOGIN' ? 'bg-green-50 text-green-600' : type === 'LOGOUT' ? 'bg-slate-100 text-slate-500' : type?.includes('DELETE') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600';

  return (
    <AppLayout role="ADMIN">
      <PageHeader title="Bảo mật & Phân quyền" subtitle="Nhật ký hoạt động và kiểm soát truy cập hệ thống" />
      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* RLS status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Row Level Security', value: 'Đang bật', icon: 'shield', cls: 'bg-green-50 text-green-600', sub: 'Bảo vệ tất cả bảng dữ liệu' },
          { label: 'Xác thực 2 lớp',    value: 'Tuỳ chọn', icon: 'lock',   cls: 'bg-blue-50 text-blue-600',   sub: 'Người dùng có thể bật trong hồ sơ' },
          { label: 'Supabase Auth',      value: 'JWT',      icon: 'token',  cls: 'bg-purple-50 text-purple-600', sub: 'Bearer token - 1 giờ hết hạn' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.cls}`}>
              <span className="material-symbols-outlined text-2xl">{c.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="font-black text-slate-800">{c.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="Nhật ký hoạt động hệ thống" action={
          <button onClick={load} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-base">refresh</span> Làm mới
          </button>
        } />
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <Sk key={i} className="h-12 w-full" />)}</div>
        ) : logs.length === 0 ? (
          <EmptyState icon="history" title="Chưa có hoạt động nào được ghi lại" />
        ) : (
          <div className="divide-y divide-slate-50">
            {logs.map(log => (
              <div key={log.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${logColor(log.action_type)}`}>
                  <span className="material-symbols-outlined text-sm">{logIcon(log.action_type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{log.description ?? log.action_type}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{log.users?.full_name ?? 'Hệ thống'}</span>
                    {log.users?.role && <RoleBadge role={log.users.role} />}
                  </div>
                </div>
                <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{timeAgo(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default Security;
