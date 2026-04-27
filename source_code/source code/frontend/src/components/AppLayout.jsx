// src/components/AppLayout.jsx
// Single layout component replacing AdminSidebar/TeacherSidebar/StudentSidebar inconsistency.
// All roles use the same structure — only nav items and colors differ.

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk, selectProfile } from '../features/authentication/authenticationSlice';

const NAV_CONFIG = {
  ADMIN: {
    label:    'Quản trị hệ thống',
    avatarBg: 'from-primary to-primary-container',
    links: [
      { icon: 'dashboard',            label: 'Bảng điều khiển',    to: '/admin/dashboard' },
      { icon: 'groups',               label: 'Quản lý người dùng', to: '/admin/users' },
      { icon: 'admin_panel_settings', label: 'Bảo mật & Phân quyền', to: '/admin/security' },
      { icon: 'settings',             label: 'Cài đặt hệ thống',  to: '/admin/settings' },
    ],
  },
  TEACHER: {
    label:    'Giảng viên',
    avatarBg: 'from-cyan-500 to-primary',
    links: [
      { icon: 'dashboard',   label: 'Tổng quan',          to: '/teacher/dashboard' },
      { icon: 'groups',      label: 'Lớp học của tôi',    to: '/teacher/classes' },
      { icon: 'quiz',        label: 'Ngân hàng đề thi',   to: '/teacher/exams' },
      { icon: 'help',        label: 'Ngân hàng câu hỏi',  to: '/teacher/questions' },
      { icon: 'folder_open', label: 'Kho tài liệu',       to: '/teacher/materials' },
      { icon: 'monitoring',  label: 'Báo cáo & Thống kê', to: '/teacher/reports' },
      { icon: 'grid_view',   label: 'Ma trận đề thi',     to: '/teacher/exam-matrices' },
    ],
  },
  STUDENT: {
    label:    'Sinh viên',
    avatarBg: 'from-orange-400 to-orange-600',
    links: [
      { icon: 'dashboard',            label: 'Bảng điều khiển',  to: '/student/dashboard' },
      { icon: 'school',               label: 'Lớp học',          to: '/student/classes' },
      { icon: 'quiz',                 label: 'Thi trực tuyến',   to: '/student/exams' },
      { icon: 'auto_stories',         label: 'Luyện tập',        to: '/student/practice' },
      { icon: 'style',                label: 'Flashcard',        to: '/student/flashcards' },
      { icon: 'history',              label: 'Lịch sử làm bài',  to: '/student/history' },
      { icon: 'bar_chart',            label: 'Thống kê học tập', to: '/student/statistics' },
      { icon: 'assignment_turned_in', label: 'Đề thi thử',       to: '/student/mock-exams' },
    ],
  },
};

// ── Shared Header ─────────────────────────────────────────────
export const AppHeader = ({ onSearch }) => {
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-80 gap-2">
        <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-slate-400"
          onChange={e => onSearch?.(e.target.value)}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-slate-500 text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
        </button>
        <button
          className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-3 py-1.5 transition-colors"
          onClick={() => navigate('/common/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-sm font-bold shrink-0">
            {(profile?.full_name ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{profile?.full_name ?? 'Người dùng'}</p>
            <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-wide">
              {{ ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Sinh viên' }[profile?.role] ?? ''}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

// ── Sidebar ───────────────────────────────────────────────────
const AppSidebar = ({ role, onLogout, loggingOut }) => {
  const location = useLocation();
  const profile  = useSelector(selectProfile);
  const config   = NAV_CONFIG[role] ?? NAV_CONFIG.STUDENT;
  const initial  = (profile?.full_name ?? role?.charAt(0) ?? 'U').charAt(0).toUpperCase();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">D</span>
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-primary">DHD</span>
            <span className="text-orange-500">edu</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wider">{config.label}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {config.links.map(link => {
          const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          return (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>
                {link.icon}
              </span>
              <span className="text-sm font-semibold">{link.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 bg-white/60 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer: profile + logout */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-4 space-y-1">
        <Link to="/common/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{profile?.full_name ?? config.label}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              {profile?.student_id ?? profile?.teacher_code ?? config.label}
            </p>
          </div>
          <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-slate-500">chevron_right</span>
        </Link>

        <button onClick={onLogout} disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm font-semibold">{loggingOut ? 'Đang thoát...' : 'Đăng xuất'}</span>
        </button>
      </div>
    </aside>
  );
};

// ── AppLayout — THE SINGLE LAYOUT WRAPPER ────────────────────
// Usage: <AppLayout role="TEACHER"><PageContent /></AppLayout>
const AppLayout = ({ children, role, onSearch }) => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutThunk());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar role={role} onLogout={handleLogout} loggingOut={loggingOut} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader onSearch={onSearch} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
