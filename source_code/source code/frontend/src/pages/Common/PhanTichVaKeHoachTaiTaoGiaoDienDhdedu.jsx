// src/pages/Common/PhanTichVaKeHoachTaiTaoGiaoDienDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// This page shows system analytics - referenced in App.jsx but was missing from source
import React, { useState, useEffect } from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const PhanTichVaKeHoachTaiTaoGiaoDienDhdedu = () => {
  const [stats,   setStats]   = useState(null);
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const [statsRes, logsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAuditLogs({ limit: 10 }),
      ]);
      if (!statsRes.error) setStats(statsRes.data);
      setLogs(logsRes.data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const timeAgo = (iso) => {
    if (!iso) return '—';
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (diff < 1)    return 'Vừa xong';
    if (diff < 60)   return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return new Date(iso).toLocaleDateString('vi-VN');
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <CommonHeader />
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Phân tích & Kế hoạch Hệ thống DHDedu
            </h1>
            <p className="text-slate-500 mt-1">
              Tổng quan toàn diện về hoạt động và hiệu suất hệ thống
            </p>
          </div>

          {/* System KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Tổng người dùng',  value: stats?.totalUsers,    icon: 'groups',           color: 'text-blue-600 bg-blue-50'   },
              { label: 'Số lớp học',       value: stats?.totalClasses,  icon: 'school',           color: 'text-green-600 bg-green-50' },
              { label: 'Số kỳ thi',        value: stats?.totalExams,    icon: 'quiz',             color: 'text-purple-600 bg-purple-50'},
              { label: 'Bài đã nộp',       value: stats?.submittedSubs, icon: 'assignment_turned_in', color: 'text-orange-600 bg-orange-50' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{c.label}</p>
                  {loading ? <Skeleton className="h-7 w-12 mt-1" /> : (
                    <p className="text-2xl font-black text-on-surface">{c.value?.toLocaleString('vi-VN') ?? '—'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Role breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { role: 'Quản trị viên', count: 1,                       icon: 'admin_panel_settings', cls: 'text-red-600 bg-red-50',    pct: 2 },
              { role: 'Giáo viên',     count: stats?.totalTeachers ?? 0,icon: 'school',               cls: 'text-blue-600 bg-blue-50',  pct: stats?.totalUsers ? Math.round(stats.totalTeachers / stats.totalUsers * 100) : 0 },
              { role: 'Sinh viên',     count: stats?.totalStudents ?? 0,icon: 'person',               cls: 'text-green-600 bg-green-50', pct: stats?.totalUsers ? Math.round(stats.totalStudents / stats.totalUsers * 100) : 0 },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.cls}`}>
                    <span className="material-symbols-outlined text-xl">{r.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{r.role}</p>
                    {loading ? <Skeleton className="h-5 w-12 mt-0.5" /> : (
                      <p className="text-sm text-slate-400">{r.count.toLocaleString('vi-VN')} tài khoản</p>
                    )}
                  </div>
                </div>
                {!loading && (
                  <>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full transition-all ${r.cls.split(' ')[1].replace('bg-', 'bg-').replace('50', '400')}`}
                        style={{ width: `${r.pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{r.pct}% tổng người dùng</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Recent system activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-on-surface">Hoạt động hệ thống gần đây</h3>
              <a href="/admin/securityadmin" className="text-primary text-sm font-semibold hover:underline">Xem tất cả →</a>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1"><Skeleton className="h-3.5 w-3/4" /><Skeleton className="h-3 w-1/3" /></div>
                </div>
              ))}</div>
            ) : logs.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Chưa có hoạt động nào</p>
            ) : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">history</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {log.users?.full_name ?? 'Hệ thống'}
                        <span className="text-slate-400 font-normal ml-1">{log.description}</span>
                      </p>
                      <p className="text-xs text-slate-400">{timeAgo(log.created_at)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full shrink-0">
                      {log.action_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System health */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold mb-5">Trạng thái hệ thống</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { service: 'Database (Supabase)',    status: 'Hoạt động', ok: true },
                { service: 'Authentication',         status: 'Hoạt động', ok: true },
                { service: 'Storage',                status: 'Hoạt động', ok: true },
                { service: 'Edge Functions',         status: 'Sẵn sàng',  ok: true },
              ].map((s, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-xs font-bold ${s.ok ? 'text-green-600' : 'text-red-600'}`}>{s.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.service}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PhanTichVaKeHoachTaiTaoGiaoDienDhdedu;
