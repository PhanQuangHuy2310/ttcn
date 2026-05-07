// src/components/AppLayout.jsx — FINAL VERSION
// Integrates: NotificationBell (Realtime), mobile hamburger drawer,
// role-aware nav, sticky header, max-w content area

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk, selectProfile } from '../features/authentication/authenticationSlice';
import NotificationBell from './NotificationBell';

const NAV_CONFIG = {
  ADMIN: {
    label: 'Quản trị hệ thống', accent: 'from-blue-600 to-blue-700',
    links: [
      { icon: 'dashboard',            label: 'Bảng điều khiển',    to: '/admin/dashboard' },
      { icon: 'groups',               label: 'Quản lý người dùng', to: '/admin/users'     },
      { icon: 'admin_panel_settings', label: 'Bảo mật',            to: '/admin/security'  },
      { icon: 'settings',             label: 'Cài đặt hệ thống',   to: '/admin/settings'  },
    ],
  },
  TEACHER: {
    label: 'Giảng viên', accent: 'from-cyan-500 to-blue-600',
    links: [
      { icon: 'dashboard',   label: 'Tổng quan',          to: '/teacher/dashboard'     },
      { icon: 'groups',      label: 'Lớp học của tôi',    to: '/teacher/classes'       },
      { icon: 'quiz',        label: 'Ngân hàng đề thi',   to: '/teacher/exams'         },
      { icon: 'help',        label: 'Ngân hàng câu hỏi',  to: '/teacher/questions'     },
      { icon: 'folder_open', label: 'Kho tài liệu',       to: '/teacher/materials'     },
      { icon: 'monitoring',  label: 'Báo cáo & Thống kê', to: '/teacher/reports'       },
      { icon: 'grid_view',   label: 'Ma trận đề thi',     to: '/teacher/exam-matrices' },
      { icon: 'rate_review', label: 'Chấm tự luận',       to: '/teacher/essay-grading' },
    ],
  },
  STUDENT: {
    label: 'Sinh viên', accent: 'from-orange-400 to-orange-600',
    links: [
      { icon: 'dashboard',            label: 'Bảng điều khiển',  to: '/student/dashboard'  },
      { icon: 'school',               label: 'Lớp học',          to: '/student/classes'    },
      { icon: 'quiz',                 label: 'Thi trực tuyến',   to: '/student/exams'      },
      { icon: 'auto_stories',         label: 'Luyện tập',        to: '/student/practice'   },
      { icon: 'style',                label: 'Flashcard',        to: '/student/flashcards' },
      { icon: 'history',              label: 'Lịch sử làm bài',  to: '/student/history'    },
      { icon: 'bar_chart',            label: 'Thống kê học tập', to: '/student/statistics' },
      { icon: 'assignment_turned_in', label: 'Đề thi thử',       to: '/student/mock-exams' },
    ],
  },
};

const Sidebar = ({ role, onLogout, loggingOut, onClose }) => {
  const location = useLocation();
  const profile  = useSelector(selectProfile);
  const config   = NAV_CONFIG[role] ?? NAV_CONFIG.STUDENT;
  const initial  = (profile?.full_name ?? role ?? 'U').trim().charAt(0).toUpperCase();

  const prevPath = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      onClose?.();
    }
  }, [location.pathname, onClose]);

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-black">D</span>
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-primary">DHD</span><span className="text-orange-500">edu</span>
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" aria-label="Đóng menu">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="px-5 py-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.label}</span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {config.links.map(link => {
          const isActive = location.pathname === link.to
            || (!link.to.endsWith('dashboard') && location.pathname.startsWith(link.to));
          return (
            <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <span className={`material-symbols-outlined text-xl shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>{link.icon}</span>
              <span className="text-sm font-semibold leading-none truncate">{link.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 bg-white/50 rounded-full shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-slate-100 mx-3" />

      <div className="px-3 py-3 space-y-1">
        <Link to="/common/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.accent} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{initial}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{profile?.full_name ?? config.label}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">{profile?.student_id ?? profile?.teacher_code ?? 'Xem hồ sơ'}</p>
          </div>
          <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-slate-500 shrink-0">chevron_right</span>
        </Link>
        <button onClick={onLogout} disabled={loggingOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 disabled:opacity-50 group">
          <span className="material-symbols-outlined text-xl group-hover:text-red-500 transition-colors">logout</span>
          <span className="text-sm font-semibold">{loggingOut ? 'Đang thoát...' : 'Đăng xuất'}</span>
        </button>
      </div>
    </aside>
  );
};

const AppHeader = ({ onMenuToggle }) => {
  const profile  = useSelector(selectProfile);
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-30 shrink-0 shadow-sm">
      <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors shrink-0" aria-label="Mở menu">
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 flex-1 max-w-xs gap-2">
        <span className="material-symbols-outlined text-slate-400 text-lg shrink-0">search</span>
        <input type="text" placeholder="Tìm kiếm nhanh..." className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-slate-400" readOnly />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button className="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl px-2.5 py-1.5 transition-colors" onClick={() => navigate('/common/profile')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {(profile?.full_name ?? 'U').trim().charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">{profile?.full_name ?? 'Người dùng'}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{{ ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Sinh viên' }[profile?.role] ?? ''}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

const AppLayout = ({ children, role }) => {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const [open,       setOpen]       = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutThunk());
    navigate('/login');
  };

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const fn = e => { if (e.matches) setOpen(false); };
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 shrink-0">
        <Sidebar role={role} onLogout={handleLogout} loggingOut={loggingOut} />
      </div>
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar role={role} onLogout={handleLogout} loggingOut={loggingOut} onClose={() => setOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader onMenuToggle={() => setOpen(s => !s)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
