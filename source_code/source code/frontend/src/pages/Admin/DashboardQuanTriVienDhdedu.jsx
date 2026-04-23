// src/pages/Admin/DashboardQuanTriVienDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI/JSX STRUCTURE PRESERVED ────────
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { supabase } from '../../lib/supabase';
import { adminService } from '../../hooks/useSupabaseQuery';

// ─── Loading skeleton component (inline, no new file) ─────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DashboardQuanTriVienDhdedu = () => {
  const [stats,       setStats]       = useState(null);
  const [recentLogs,  setRecentLogs]  = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, logsRes, usersRes] = await Promise.all([
          adminService.getDashboardStats(),
          supabase.from('audit_logs')
            .select('*, users(full_name, role)')
            .order('created_at', { ascending: false })
            .limit(8),
          supabase.from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);
        if (statsRes.error) throw statsRes.error;
        setStats(statsRes.data);
        setRecentLogs(logsRes.data ?? []);
        setRecentUsers(usersRes.data ?? []);
      } catch (err) {
        setError(err?.message ?? 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d) / 60000);
    if (diff < 1)   return 'Vừa xong';
    if (diff < 60)  return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return d.toLocaleDateString('vi-VN');
  };

  const roleLabel = (role) => {
    if (role === 'ADMIN')   return 'Quản trị viên';
    if (role === 'TEACHER') return 'Giáo viên';
    return 'Sinh viên';
  };

  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader />

      <main className="ml-64 pt-16 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ── Header ── */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
                Chào buổi sáng, Quản trị viên
              </h1>
              <p className="text-outline mt-1">Dưới đây là tổng quan hiệu suất hệ thống DHDedu hôm nay.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface shadow-sm hover:bg-surface-container transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
                Xuất báo cáo
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
                Tạo kỳ thi mới
              </button>
            </div>
          </section>

          {/* ── Error ── */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* ── Stats Cards ── */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" data-icon="person">person</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-outline text-sm font-medium">Tổng người dùng</p>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : (
                  <h3 className="text-3xl font-black font-headline mt-1">
                    {stats?.totalUsers?.toLocaleString('vi-VN') ?? '—'}
                  </h3>
                )}
                <div className="flex gap-4 mt-2">
                  {loading ? <Skeleton className="h-3 w-20" /> : (
                    <>
                      <span className="text-[11px] text-outline">GV: {stats?.totalTeachers ?? 0}</span>
                      <span className="text-[11px] text-outline">SV: {stats?.totalStudents ?? 0}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Total Classes */}
            <div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" data-icon="school">school</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-outline text-sm font-medium">Số lớp học</p>
                {loading ? <Skeleton className="h-9 w-16 mt-1" /> : (
                  <h3 className="text-3xl font-black font-headline mt-1">
                    {stats?.totalClasses?.toLocaleString('vi-VN') ?? '—'}
                  </h3>
                )}
              </div>
            </div>

            {/* Total Exams */}
            <div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" data-icon="quiz">quiz</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-outline text-sm font-medium">Số kỳ thi</p>
                {loading ? <Skeleton className="h-9 w-16 mt-1" /> : (
                  <h3 className="text-3xl font-black font-headline mt-1">
                    {stats?.totalExams?.toLocaleString('vi-VN') ?? '—'}
                  </h3>
                )}
                {!loading && (
                  <p className="text-[11px] text-outline mt-2">{stats?.activeExams ?? 0} kỳ thi đang diễn ra</p>
                )}
              </div>
            </div>

            {/* Submissions */}
            <div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" data-icon="assignment_turned_in">assignment_turned_in</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-outline text-sm font-medium">Bài đã nộp</p>
                {loading ? <Skeleton className="h-9 w-16 mt-1" /> : (
                  <h3 className="text-3xl font-black font-headline mt-1">
                    {stats?.submittedSubs?.toLocaleString('vi-VN') ?? '—'}
                  </h3>
                )}
              </div>
            </div>
          </section>

          {/* ── Recent Activity & Users ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Audit Log */}
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm border border-white relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black font-headline">Hoạt động gần đây</h2>
                  <p className="text-outline text-sm mt-0.5">Nhật ký hệ thống thời gian thực</p>
                </div>
                <a href="/admin/securityadmin" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentLogs.length === 0 ? (
                <p className="text-outline text-sm text-center py-8">Chưa có hoạt động nào</p>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {log.users?.full_name ?? 'Hệ thống'}
                          <span className="text-outline font-normal ml-1">{log.description}</span>
                        </p>
                        <p className="text-xs text-outline mt-0.5">{formatTime(log.created_at)}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container rounded-full text-outline shrink-0">
                        {log.action_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm border border-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black font-headline">Người dùng mới</h2>
                <a href="/admin/usersadmin" className="text-primary text-sm font-semibold hover:underline">Xem tất cả</a>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUsers.length === 0 ? (
                <p className="text-outline text-sm text-center py-8">Chưa có người dùng</p>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">
                          {(user.full_name ?? 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{user.full_name ?? user.email}</p>
                        <p className="text-xs text-outline truncate">{user.email}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        user.role === 'TEACHER' ? 'bg-blue-50 text-blue-700' :
                        user.role === 'ADMIN'   ? 'bg-red-50 text-red-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {roleLabel(user.role)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
    </>
  );
};

export default DashboardQuanTriVienDhdedu;
