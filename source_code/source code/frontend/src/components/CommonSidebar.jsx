// src/components/CommonSidebar.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LINKS_BY_ROLE = {
  ADMIN: [
    { icon: 'dashboard',           text: 'Dashboard',       href: '/admin/dashboardadmin-dhdedu' },
    { icon: 'groups',              text: 'Người dùng',      href: '/admin/usersadmin' },
    { icon: 'admin_panel_settings',text: 'Bảo mật',        href: '/admin/securityadmin' },
    { icon: 'settings',            text: 'Cài đặt',         href: '/admin/system-settingsadmin' },
    { icon: 'person',              text: 'Hồ sơ',           href: '/common/profile-dhdedu' },
  ],
  TEACHER: [
    { icon: 'dashboard',   text: 'Dashboard',         href: '/teacher/dashboardteacher-dhdedu-viet-hoa-font-moi' },
    { icon: 'school',      text: 'Lớp học',           href: '/teacher/class-detailsteacher' },
    { icon: 'quiz',        text: 'Đề thi',            href: '/teacher/examsteacher' },
    { icon: 'monitoring',  text: 'Báo cáo',           href: '/teacher/reportsteacher' },
    { icon: 'person',      text: 'Hồ sơ',             href: '/common/profile-dhdedu' },
    { icon: 'security',    text: 'Bảo mật',           href: '/common/2fa-dhdedu' },
  ],
  STUDENT: [
    { icon: 'home',       text: 'Trang chủ',          href: '/student/dashboardstudent-dhdedu-azota-style' },
    { icon: 'school',     text: 'Lớp học',            href: '/student/overviewstudent-viet-hoa' },
    { icon: 'quiz',       text: 'Bài thi',            href: '/student/mock-examsstudent' },
    { icon: 'history',    text: 'Lịch sử',            href: '/student/history-chi-tietstudent' },
    { icon: 'person',     text: 'Hồ sơ',             href: '/common/profile-dhdedu' },
    { icon: 'security',   text: 'Bảo mật',           href: '/common/2fa-dhdedu' },
  ],
};

const DEFAULT_LINKS = [
  { icon: 'dashboard', text: 'Dashboard',  href: '/' },
  { icon: 'person',    text: 'Hồ sơ',     href: '/common/profile-dhdedu' },
  { icon: 'security',  text: 'Bảo mật',   href: '/common/2fa-dhdedu' },
];

const CommonSidebar = () => {
  const location  = useLocation();
  const [role,    setRole]    = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('users').select('full_name, role').eq('id', user.id).single();
      if (data) { setRole(data.role); setProfile(data); }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = LINKS_BY_ROLE[role] ?? DEFAULT_LINKS;
  const initial  = (profile?.full_name ?? 'U').charAt(0).toUpperCase();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-[#f9f9f9] dark:bg-slate-950 p-4 gap-2 z-50">
      <div className="mb-8 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-[#1B8EF2]">
            DHD<span className="text-orange-500">edu</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={i}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-surface-container hover:text-on-surface font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              <span>{link.text}</span>
            </Link>
          );
        })}
      </nav>

      {profile && (
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">{profile.full_name}</p>
            <p className="text-xs text-slate-400">
              {profile.role === 'ADMIN' ? 'Quản trị viên' : profile.role === 'TEACHER' ? 'Giáo viên' : 'Sinh viên'}
            </p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors shrink-0" title="Đăng xuất">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default CommonSidebar;
