// src/pages/Admin/BaoMatPhanQuyenQuanTriVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ACTION_ICONS = {
  LOGIN:           { icon: 'login',             color: 'text-green-600 bg-green-50'  },
  LOGOUT:          { icon: 'logout',            color: 'text-slate-500 bg-slate-100' },
  CREATE_EXAM:     { icon: 'quiz',              color: 'text-blue-600 bg-blue-50'    },
  SUBMIT_EXAM:     { icon: 'assignment_turned_in', color: 'text-purple-600 bg-purple-50' },
  START_EXAM:      { icon: 'play_arrow',        color: 'text-orange-500 bg-orange-50'},
  GRADE_SUBMISSION:{ icon: 'grading',           color: 'text-teal-600 bg-teal-50'   },
  CREATE_CLASS:    { icon: 'school',            color: 'text-indigo-600 bg-indigo-50'},
  ENROLL_STUDENT:  { icon: 'person_add',        color: 'text-cyan-600 bg-cyan-50'   },
  UPDATE_USER:     { icon: 'manage_accounts',   color: 'text-yellow-600 bg-yellow-50'},
  DELETE_USER:     { icon: 'person_remove',     color: 'text-red-600 bg-red-50'     },
};

const ROLES = ['', 'ADMIN', 'TEACHER', 'STUDENT'];
const ACTIONS = ['', 'LOGIN', 'LOGOUT', 'CREATE_EXAM', 'START_EXAM', 'SUBMIT_EXAM', 'GRADE_SUBMISSION', 'CREATE_CLASS', 'ENROLL_STUDENT'];

const BaoMatPhanQuyenQuanTriVien = () => {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page,       setPage]       = useState(0);
  const [filters,    setFilters]    = useState({ role: '', actionType: '', from: '', to: '' });
  const [activeTab,  setActiveTab]  = useState('logs');
  const [roleCounts, setRoleCounts] = useState({});
  const LIMIT = 25;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err, count } = await adminService.getAuditLogs({
      role:       filters.role       || undefined,
      actionType: filters.actionType || undefined,
      from:       filters.from       || undefined,
      to:         filters.to         || undefined,
      page, limit: LIMIT
    });
    if (err) setError(err.message ?? String(err));
    else {
      setLogs(data ?? []);
      setTotalCount(count ?? 0);
    }
    setLoading(false);
  }, [filters, page]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Role count summary
  useEffect(() => {
    async function loadCounts() {
      const { data } = await adminService.getAuditLogs({ limit: 1000, page: 0 });
      if (!data) return;
      const counts = {};
      data.forEach(l => { counts[l.role] = (counts[l.role] ?? 0) + 1; });
      setRoleCounts(counts);
    }
    loadCounts();
  }, []);

  const formatTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
  };

  const roleLabel = (r) => ({ ADMIN: 'Quản trị viên', TEACHER: 'Giáo viên', STUDENT: 'Sinh viên' }[r] ?? r);

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <div className="p-8 space-y-8">

          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Bảo mật & Nhật ký hệ thống</h1>
              <p className="text-slate-500 mt-1">Theo dõi mọi hoạt động trong hệ thống DHDedu theo thời gian thực</p>
            </div>
            <button
              onClick={loadLogs}
              className="bg-gradient-to-br from-[#1B8EF2] to-[#0077cf] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#1B8EF2]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">refresh</span>
              Làm mới
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-surface-container rounded-2xl w-fit">
            {[
              { key: 'logs',     label: 'Nhật ký hoạt động' },
              { key: 'roles',    label: 'Vai trò & Quyền' },
              { key: 'security', label: 'Thiết lập Bảo mật' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-[#1B8EF2] shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Tổng sự kiện', value: totalCount,               icon: 'event_note',         cls: 'bg-blue-50 text-blue-600' },
              { label: 'Admin',         value: roleCounts['ADMIN'],       icon: 'admin_panel_settings',cls: 'bg-red-50 text-red-600'  },
              { label: 'Giáo viên',     value: roleCounts['TEACHER'],     icon: 'school',              cls: 'bg-orange-50 text-orange-600' },
              { label: 'Sinh viên',     value: roleCounts['STUDENT'],     icon: 'person',              cls: 'bg-green-50 text-green-600' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.cls}`}>
                  <span className="material-symbols-outlined text-xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{c.label}</p>
                  {loading ? <Skeleton className="h-6 w-12 mt-1" /> : (
                    <p className="text-xl font-black text-on-surface">{c.value?.toLocaleString('vi-VN') ?? '—'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'logs' && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-40">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Vai trò</label>
                  <select
                    value={filters.role}
                    onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r || 'Tất cả vai trò'}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-44">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Loại hành động</label>
                  <select
                    value={filters.actionType}
                    onChange={e => setFilters(f => ({ ...f, actionType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ACTIONS.map(a => <option key={a} value={a}>{a || 'Tất cả hành động'}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-36">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Từ ngày</label>
                  <input type="datetime-local" value={filters.from}
                    onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex-1 min-w-36">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Đến ngày</label>
                  <input type="datetime-local" value={filters.to}
                    onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  onClick={() => { setFilters({ role: '', actionType: '', from: '', to: '' }); setPage(0); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
              )}

              {/* Log timeline */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3.5 w-2/3" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3 block">event_note</span>
                    Không có nhật ký nào phù hợp
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {logs.map(log => {
                      const iconCfg = ACTION_ICONS[log.action_type] ?? { icon: 'info', color: 'text-slate-500 bg-slate-100' };
                      return (
                        <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconCfg.color}`}>
                            <span className="material-symbols-outlined text-base">{iconCfg.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">
                              {log.users?.full_name ?? 'Hệ thống'}
                              <span className="text-slate-400 font-normal ml-1.5">{log.description}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-slate-400">{formatTime(log.created_at)}</span>
                              {log.role && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                                  {roleLabel(log.role)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full shrink-0 font-mono">
                            {log.action_type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {!loading && totalCount > LIMIT && (
                  <div className="flex items-center justify-between p-5 border-t border-slate-50">
                    <p className="text-sm text-slate-400">
                      {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, totalCount)} / {totalCount.toLocaleString('vi-VN')} sự kiện
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                        ← Trước
                      </button>
                      <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= totalCount}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                        Tiếp →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Super Admin', desc: 'Toàn quyền kiểm soát hệ thống, quản lý người dùng và cấu hình bảo mật.', count: roleCounts['ADMIN'] ?? 0, icon: 'admin_panel_settings', color: 'text-[#1B8EF2] bg-primary-fixed' },
                { title: 'Giáo viên',  desc: 'Quản lý lớp học, tạo đề thi, chấm bài và theo dõi tiến độ sinh viên.', count: roleCounts['TEACHER'] ?? 0, icon: 'school', color: 'text-orange-600 bg-orange-50' },
                { title: 'Sinh viên',  desc: 'Tham gia lớp học, làm bài kiểm tra và xem kết quả học tập.', count: roleCounts['STUDENT'] ?? 0, icon: 'person', color: 'text-green-600 bg-green-50' },
                { title: 'Chỉ xem',   desc: 'Quyền truy cập đọc dữ liệu thống kê mà không thay đổi được.', count: 0, icon: 'visibility', color: 'text-slate-600 bg-slate-100' },
              ].map((role, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex flex-col">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${role.color}`}>
                    <span className="material-symbols-outlined">{role.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">{role.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-[#1B8EF2] bg-[#1B8EF2]/10 px-3 py-1 rounded-full">
                      {loading ? '...' : `${role.count} Người dùng`}
                    </span>
                    <button className="text-slate-400 hover:text-[#1B8EF2] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-6">Cấu hình bảo mật</h3>
              <div className="space-y-5">
                {[
                  { label: 'Xác thực 2 lớp (2FA)', desc: 'Yêu cầu OTP khi đăng nhập', enabled: true },
                  { label: 'Giới hạn phiên đăng nhập', desc: 'Tự động logout sau 30 phút không hoạt động', enabled: true },
                  { label: 'Ghi nhật ký chi tiết', desc: 'Lưu toàn bộ hành động vào audit_logs', enabled: true },
                  { label: 'Chặn IP đáng ngờ', desc: 'Tự động chặn IP đăng nhập sai quá 5 lần', enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-primary' : 'bg-slate-200'} relative cursor-pointer`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.enabled ? 'right-1' : 'left-1'} shadow`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default BaoMatPhanQuyenQuanTriVien;
