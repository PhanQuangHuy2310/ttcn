// src/pages/Admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, EmptyState, ErrorBanner, RoleBadge, Avatar, Sk, fmtDate, PageHeader } from '../../components/ui';
import { usersService } from '../../services/supabaseService';

const ROLE_LABELS = { ALL: 'Tất cả', ADMIN: 'Admin', TEACHER: 'Giáo viên', STUDENT: 'Sinh viên' };

const UserManagement = () => {
  const myProfile = useSelector(selectProfile);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await usersService.getAll();
    if (err) setError('Không thể tải danh sách người dùng.');
    else setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.student_id?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const handleDelete = async (userId) => {
    if (userId === myProfile?.id) return;
    setDeleting(userId);
    const { error: err } = await usersService.deleteUser(userId);
    if (err) setError('Không thể xóa người dùng. Vui lòng thử lại.');
    else setUsers(prev => prev.filter(u => u.id !== userId));
    setDeleting(null);
    setConfirmDelete(null);
  };

  return (
    <AppLayout role="ADMIN">
      <PageHeader
        title="Quản lý Người dùng"
        subtitle={`Tổng cộng ${users.length} người dùng trong hệ thống`}
        actions={
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Thêm người dùng
          </button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, mã số..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                roleFilter === role ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="person_search" title="Không tìm thấy người dùng" subtitle="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" />
        ) : (
          <>
            <div className="px-6 py-3 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="col-span-4">Người dùng</span>
              <span className="col-span-2">Vai trò</span>
              <span className="col-span-3">Mã số</span>
              <span className="col-span-2">Ngày tạo</span>
              <span className="col-span-1"></span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map(u => (
                <div key={u.id} className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar name={u.full_name} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name ?? '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2"><RoleBadge role={u.role} /></div>
                  <div className="col-span-3">
                    <p className="text-sm text-slate-600 font-mono text-xs">{u.student_id ?? u.teacher_code ?? '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">{fmtDate(u.created_at)}</p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {u.id !== myProfile?.id && (
                      confirmDelete === u.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={deleting === u.id}
                            className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50"
                          >
                            {deleting === u.id ? '...' : 'Xóa'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-500 px-2 py-1 rounded-lg hover:bg-slate-100">
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(u.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
              Hiển thị {filtered.length} / {users.length} người dùng
            </div>
          </>
        )}
      </Card>
    </AppLayout>
  );
};

export default UserManagement;
