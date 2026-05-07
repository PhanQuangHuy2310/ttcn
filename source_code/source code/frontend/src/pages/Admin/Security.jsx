// src/pages/Admin/Security.jsx
// FIXED: auditLogsService.getRecent now joins users(full_name,role) properly
// ADDED: Live reload, search/filter, export to CSV, pagination

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/AppLayout';
import {
  Card, CardHeader, EmptyState, ErrorBanner, Sk, PageHeader,
  RoleBadge, SearchInput, FilterTabs, Btn, timeAgo, fmtDateTime,
} from '../../components/ui';
import { auditLogsService } from '../../services/supabaseService';
import { useDebounce, usePagination } from '../../hooks/useDebounce';

const ACTION_ICONS = {
  LOGIN:           { icon: 'login',         color: 'text-green-600',  bg: 'bg-green-50'  },
  LOGOUT:          { icon: 'logout',        color: 'text-slate-500',  bg: 'bg-slate-100' },
  EXAM_START:      { icon: 'quiz',          color: 'text-purple-600', bg: 'bg-purple-50' },
  EXAM_SUBMIT:     { icon: 'task_alt',      color: 'text-blue-600',   bg: 'bg-blue-50'   },
  EXAM_CREATE:     { icon: 'add_circle',    color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
  EXAM_PUBLISH:    { icon: 'publish',       color: 'text-green-600',  bg: 'bg-green-50'  },
  EXAM_DELETE:     { icon: 'delete',        color: 'text-red-600',    bg: 'bg-red-50'    },
  USER_CREATE:     { icon: 'person_add',    color: 'text-blue-600',   bg: 'bg-blue-50'   },
  USER_DELETE:     { icon: 'person_remove', color: 'text-red-600',    bg: 'bg-red-50'    },
  USER_DEACTIVATE: { icon: 'block',         color: 'text-orange-600', bg: 'bg-orange-50' },
  CLASS_JOIN:      { icon: 'group_add',     color: 'text-teal-600',   bg: 'bg-teal-50'   },
  MATERIAL_UPLOAD: { icon: 'upload',        color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ESSAY_GRADED:    { icon: 'grade',         color: 'text-amber-600',  bg: 'bg-amber-50'  },
};

const DEFAULT_ICON = { icon: 'history_edu', color: 'text-slate-500', bg: 'bg-slate-100' };

const ACTION_FILTER_OPTS = [
  { value: 'ALL',   label: 'Tất cả' },
  { value: 'LOGIN', label: 'Đăng nhập' },
  { value: 'EXAM',  label: 'Đề thi' },
  { value: 'USER',  label: 'Người dùng' },
  { value: 'CLASS', label: 'Lớp học' },
];

const Security = () => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('ALL');

  const debouncedSearch = useDebounce(search, 250);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    // FIXED: auditLogsService.getRecent now joins users(full_name,role)
    const { data, error: err } = await auditLogsService.getRecent(200);
    if (err) setError('Không thể tải nhật ký hoạt động.');
    else setLogs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = logs.filter(log => {
    const matchAction = filter === 'ALL' || log.action_type?.startsWith(filter);
    const q = debouncedSearch.toLowerCase();
    const matchSearch = !q
      || log.description?.toLowerCase().includes(q)
      || log.users?.full_name?.toLowerCase().includes(q)
      || log.action_type?.toLowerCase().includes(q);
    return matchAction && matchSearch;
  });

  const filterCounts = {
    ALL:   logs.length,
    LOGIN: logs.filter(l => l.action_type?.startsWith('LOGIN') || l.action_type?.startsWith('LOGOUT')).length,
    EXAM:  logs.filter(l => l.action_type?.startsWith('EXAM')).length,
    USER:  logs.filter(l => l.action_type?.startsWith('USER')).length,
    CLASS: logs.filter(l => l.action_type?.startsWith('CLASS')).length,
  };

  const pagination = usePagination(filtered, 25);

  // Export to CSV
  const exportCSV = () => {
    const rows = [
      ['Thời gian', 'Người dùng', 'Vai trò', 'Hành động', 'Mô tả'],
      ...filtered.map(l => [
        fmtDateTime(l.created_at),
        l.users?.full_name ?? '—',
        l.users?.role ?? '—',
        l.action_type ?? '—',
        l.description ?? '—',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `audit-log-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout role="ADMIN">
      <PageHeader
        title="Nhật ký bảo mật"
        subtitle="Theo dõi toàn bộ hoạt động trong hệ thống"
        actions={
          <div className="flex gap-3">
            <Btn variant="outline" icon="download" onClick={exportCSV}>Xuất CSV</Btn>
            <Btn variant="outline" icon="refresh" onClick={load} loading={loading}>Làm mới</Btn>
          </div>
        }
      />

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên, hành động, mô tả..."
          className="sm:max-w-xs"
        />
        <FilterTabs
          options={ACTION_FILTER_OPTS.map(o => ({ ...o, count: filterCounts[o.value] }))}
          value={filter}
          onChange={v => { setFilter(v); pagination.reset(); }}
        />
      </div>

      <Card>
        <CardHeader
          title={`Nhật ký hoạt động (${filtered.length})`}
          subtitle="Cập nhật tự động mỗi 60 giây"
        />

        {loading && logs.length === 0 ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="manage_search" title="Không tìm thấy nhật ký" subtitle="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm." />
        ) : (
          <>
            <div className="divide-y divide-slate-50">
              {pagination.pageData.map(log => {
                const { icon, color, bg } = ACTION_ICONS[log.action_type] ?? DEFAULT_ICON;
                return (
                  <div key={log.id} className="flex items-start gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`material-symbols-outlined text-base ${color}`}>{icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium leading-snug">{log.description ?? log.action_type}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {log.users?.full_name && (
                          <span className="text-xs text-slate-500 font-medium">{log.users.full_name}</span>
                        )}
                        {log.users?.role && <RoleBadge role={log.users.role} />}
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.action_type}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">{timeAgo(log.created_at)}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5 hidden sm:block">{fmtDateTime(log.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400">
                  Hiển thị {pagination.start}–{pagination.end} / {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Btn variant="outline" size="xs" icon="chevron_left" onClick={pagination.prev} disabled={!pagination.hasPrev} />
                  <span className="text-xs font-semibold text-slate-600">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Btn variant="outline" size="xs" iconRight="chevron_right" onClick={pagination.next} disabled={!pagination.hasNext} />
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </AppLayout>
  );
};

export default Security;
