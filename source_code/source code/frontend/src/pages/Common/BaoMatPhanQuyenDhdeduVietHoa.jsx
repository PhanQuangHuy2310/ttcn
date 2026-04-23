// src/pages/Common/BaoMatPhanQuyenDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const BaoMatPhanQuyenDhdeduVietHoa = () => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await adminService.getAuditLogs({ userId: user.id, limit: 20 });
      setLogs(data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = filter ? logs.filter(l => l.action_type === filter) : logs;
  const ACTIONS = [...new Set(logs.map(l => l.action_type))];
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <CommonHeader />
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Vai trò & Quyền hạn</h1>
              <p className="text-slate-500 mt-1">Cấu hình chi tiết khả năng truy cập và bảo mật hệ thống DHDedu</p>
            </div>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'ADMIN',   title: 'Quản trị viên', desc: 'Toàn quyền hệ thống', icon: 'admin_panel_settings', cls: 'text-red-600 bg-red-50' },
              { role: 'TEACHER', title: 'Giáo viên',     desc: 'Quản lý lớp, đề thi',  icon: 'school',               cls: 'text-blue-600 bg-blue-50' },
              { role: 'STUDENT', title: 'Sinh viên',     desc: 'Học tập và thi cử',     icon: 'person',               cls: 'text-green-600 bg-green-50' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${r.cls}`}>
                  <span className="material-symbols-outlined text-2xl">{r.icon}</span>
                </div>
                <h3 className="font-bold text-on-surface">{r.title}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* My activity log */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold">Lịch sử hoạt động của tôi</h3>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Tất cả</option>
                {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
            ) : filtered.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Chưa có hoạt động nào</p>
            ) : (
              <div className="space-y-2">
                {filtered.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">history</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{log.description}</p>
                      <p className="text-xs text-slate-400">{fmtDate(log.created_at)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-500 shrink-0">
                      {log.action_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaoMatPhanQuyenDhdeduVietHoa;
