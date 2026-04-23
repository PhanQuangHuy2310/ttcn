// src/components/AdminSidebar.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { icon: 'dashboard',          text: 'Bảng điều khiển', href: '/admin/dashboardadmin-dhdedu' },
    { icon: 'groups',             text: 'Người dùng',       href: '/admin/usersadmin' },
    { icon: 'quiz',               text: 'Kỳ thi',           href: '/teacher/examsteacher' },
    { icon: 'school',             text: 'Lớp học',          href: '/teacher/class-detailsteacher' },
    { icon: 'analytics',          text: 'Báo cáo',          href: '/teacher/reportsteacher' },
    { icon: 'admin_panel_settings',text: 'Bảo mật',         href: '/admin/securityadmin' },
    { icon: 'settings',           text: 'Cài đặt',          href: '/admin/system-settingsadmin' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 dark:bg-slate-900 border-r border-slate-200/50 flex flex-col p-4 z-50">
      <div className="mb-8 px-4 flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight">
          <span className="text-blue-700">DHD</span><span className="text-orange-500">edu</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1">
        {navLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
              to={link.href}
            >
              <span className="material-symbols-outlined" data-icon={link.icon}>{link.icon}</span>
              <span className="text-sm font-semibold">{link.text}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-slate-100 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span className="text-sm font-semibold">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
