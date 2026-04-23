// src/pages/Common/QuanLyNguoiDungDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same data logic as Admin/QuanLyNguoiDungQuanTriVien but with Common layout
import React, { useState, useEffect, useCallback } from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const QuanLyNguoiDungDhdeduVietHoa = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page,       setPage]       = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, count } = await adminService.getUsers({ role: roleFilter || undefined, search: search || undefined, page, limit: LIMIT });
    setUsers(data ?? []);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [search, roleFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [search, roleFilter]);

  const roleLabel = (r) => {
    if (r === 'ADMIN')   return { text: 'Quản trị viên', cls: 'bg-red-50 text-red-700'    };
    if (r === 'TEACHER') return { text: 'Giáo viên',     cls: 'bg-blue-50 text-blue-700'  };
    return                      { text: 'Sinh viên',     cls: 'bg-green-50 text-green-700' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <CommonHeader />
      <main className="ml-64 p-8 min-h-screen">
        <div className="flex justify-between items-end mb-8">
          <div>
            <nav className="flex gap-2 text-xs text-tertiary mb-2">
              <span>Hệ thống</span>
              <span>/</span>
              <span className="text-primary font-medium">Quản lý Người dùng</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Quản lý Người dùng</h1>
            <p className="text-slate-500 mt-1">Quản lý tất cả tài khoản trong hệ thống DHDedu</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="relative flex-1 min-w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {['', 'STUDENT', 'TEACHER', 'ADMIN'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${roleFilter === r ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/30'}`}>
              {r || 'Tất cả'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Người dùng', 'Email', 'Mã số', 'Vai trò', 'Ngày tạo'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-bold text-slate-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="p-4"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">Không tìm thấy người dùng</td></tr>
                ) : users.map(u => {
                  const rl = roleLabel(u.role);
                  return (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">{(u.full_name ?? 'U').charAt(0)}</span>
                          </div>
                          <span className="font-semibold text-sm">{u.full_name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">{u.email}</td>
                      <td className="p-4 text-sm font-mono text-slate-400">{u.student_id ?? u.teacher_code ?? '—'}</td>
                      <td className="p-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rl.cls}`}>{rl.text}</span></td>
                      <td className="p-4 text-sm text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!loading && totalCount > LIMIT && (
            <div className="flex items-center justify-between p-5 border-t border-slate-50">
              <p className="text-sm text-slate-400">{page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, totalCount)} / {totalCount}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40">← Trước</button>
                <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= totalCount}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-40">Tiếp →</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuanLyNguoiDungDhdeduVietHoa;
