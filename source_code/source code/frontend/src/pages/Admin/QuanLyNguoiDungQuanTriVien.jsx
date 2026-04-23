// src/pages/Admin/QuanLyNguoiDungQuanTriVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ROLE_FILTER_OPTIONS = [
  { value: '',         label: 'Tất cả' },
  { value: 'STUDENT',  label: 'Sinh viên' },
  { value: 'TEACHER',  label: 'Giáo viên' },
  { value: 'ADMIN',    label: 'Quản trị viên' },
];

const QuanLyNguoiDungQuanTriVien = () => {
  const [users,       setUsers]       = useState([]);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('');
  const [page,        setPage]        = useState(0);
  const [totalCount,  setTotalCount]  = useState(0);
  const LIMIT = 20;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminService.getUsers({ role: roleFilter || undefined, search: search || undefined, page, limit: LIMIT }),
        adminService.getDashboardStats(),
      ]);
      if (usersRes.error) throw usersRes.error;
      setUsers(usersRes.data ?? []);
      setTotalCount(usersRes.count ?? 0);
      if (!statsRes.error) setStats(statsRes.data);
    } catch (err) {
      setError(err?.message ?? 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  // Debounce search
  useEffect(() => { setPage(0); }, [search, roleFilter]);

  const roleLabel = (role) => {
    if (role === 'ADMIN')   return { text: 'Quản trị viên', cls: 'bg-red-50 text-red-700' };
    if (role === 'TEACHER') return { text: 'Giáo viên',     cls: 'bg-blue-50 text-blue-700' };
    return                          { text: 'Sinh viên',    cls: 'bg-secondary/10 text-secondary' };
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '—';

  const statCards = [
    { title: 'Tổng người dùng', value: stats?.totalUsers,    icon: 'groups',         iconCls: 'bg-primary/10 text-primary' },
    { title: 'Giáo viên',       value: stats?.totalTeachers, icon: 'school',         iconCls: 'bg-blue-50 text-blue-600' },
    { title: 'Sinh viên',       value: stats?.totalStudents, icon: 'person',         iconCls: 'bg-green-50 text-green-600' },
    { title: 'Lớp học',         value: stats?.totalClasses,  icon: 'meeting_room',   iconCls: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader />

      <main className="ml-64 pt-16 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">Quản lý Người dùng</h1>
              <p className="text-outline mt-1">Quản lý tất cả tài khoản trong hệ thống DHDedu.</p>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
          )}

          {/* Stat Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-white flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.iconCls}`}>
                  <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-outline uppercase tracking-wide">{c.title}</p>
                  {loading ? <Skeleton className="h-6 w-14 mt-1" /> : (
                    <p className="text-2xl font-black text-on-surface">{c.value?.toLocaleString('vi-VN') ?? '—'}</p>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Filters */}
          <section className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-56">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full pl-10 pr-4 py-2.5 border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-lowest"
              />
            </div>
            <div className="flex gap-2">
              {ROLE_FILTER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRoleFilter(opt.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    roleFilter === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="bg-surface-container-lowest rounded-3xl border border-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left p-5 text-sm font-bold text-outline">Người dùng</th>
                    <th className="text-left p-5 text-sm font-bold text-outline">Email</th>
                    <th className="text-left p-5 text-sm font-bold text-outline">Mã số</th>
                    <th className="text-left p-5 text-sm font-bold text-outline">Vai trò</th>
                    <th className="text-left p-5 text-sm font-bold text-outline">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({length: 8}).map((_, i) => (
                      <tr key={i} className="border-b border-outline-variant/10">
                        {Array.from({length: 5}).map((__, j) => (
                          <td key={j} className="p-5"><Skeleton className="h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center text-outline">
                        <span className="material-symbols-outlined text-5xl mb-3 block">person_off</span>
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  ) : (
                    users.map(user => {
                      const rl = roleLabel(user.role);
                      return (
                        <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-bold">
                                  {(user.full_name ?? 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-semibold text-sm text-on-surface">{user.full_name ?? '—'}</span>
                            </div>
                          </td>
                          <td className="p-5 text-sm text-outline">{user.email}</td>
                          <td className="p-5 text-sm text-outline font-mono">
                            {user.student_id ?? user.teacher_code ?? '—'}
                          </td>
                          <td className="p-5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rl.cls}`}>{rl.text}</span>
                          </td>
                          <td className="p-5 text-sm text-outline">{formatDate(user.created_at)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalCount > LIMIT && (
              <div className="flex items-center justify-between p-5 border-t border-outline-variant/10">
                <p className="text-sm text-outline">
                  Hiển thị {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, totalCount)} / {totalCount}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-outline-variant/30 disabled:opacity-40 hover:bg-surface-container transition-colors"
                  >
                    ← Trước
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={(page + 1) * LIMIT >= totalCount}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-outline-variant/30 disabled:opacity-40 hover:bg-surface-container transition-colors"
                  >
                    Tiếp →
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default QuanLyNguoiDungQuanTriVien;
