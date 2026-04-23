// src/components/TeacherSidebar.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TeacherSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { icon: 'dashboard',  text: 'Tổng quan',         href: '/teacher/dashboardteacher-dhdedu-viet-hoa-font-moi' },
    { icon: 'groups',     text: 'Lớp học của tôi',    href: '/teacher/class-detailsteacher' },
    { icon: 'quiz',       text: 'Ngân hàng đề thi',   href: '/teacher/examsteacher' },
    { icon: 'folder_open',text: 'Kho tài liệu',       href: '/teacher/contentteacher' },
    { icon: 'monitoring', text: 'Báo cáo & Thống kê', href: '/teacher/reportsteacher' },
    { icon: 'help_bank',  text: 'Ngân hàng câu hỏi',  href: '/teacher/question-bankteacher' },
    { icon: 'settings',   text: 'Cài đặt',            href: '/common/profile-dhdedu' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tighter">
          <span className="text-primary">DHD</span>
          <span className="text-orange-500">edu</span>
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {navLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              to={link.href}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-sm font-medium">{link.text}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="bg-primary/5 p-4 rounded-xl mb-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Hỗ trợ kỹ thuật</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Liên hệ ngay nếu bạn gặp sự cố hệ thống.</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
