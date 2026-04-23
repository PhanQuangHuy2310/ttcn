// src/components/StudentSidebar.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const StudentSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { icon: 'home',            text: 'Trang chủ',         href: '/student/dashboardstudent-dhdedu-azota-style' },
    { icon: 'school',          text: 'Lớp học',            href: '/student/overviewstudent-viet-hoa' },
    { icon: 'quiz',            text: 'Làm bài thi',        href: '/student/mock-examsstudent' },
    { icon: 'history',         text: 'Lịch sử',            href: '/student/history-chi-tietstudent' },
    { icon: 'style',           text: 'Flashcard',          href: '/student/flashcards-dhdedu-viet-hoa' },
    { icon: 'fitness_center',  text: 'Luyện tập',          href: '/student/practicestudent' },
    { icon: 'analytics',       text: 'Thống kê',           href: '/student/statistics-chi-tietstudent' },
    { icon: 'person',          text: 'Hồ sơ',             href: '/common/profile-dhdedu-viet-hoa' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-white shadow-[0px_12px_32px_rgba(0,28,56,0.06)] flex flex-col py-6 gap-2 z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight font-headline">
            <span className="text-primary">DHD</span>
            <span className="text-orange-500">edu</span>
          </span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        {navLinks.map((link, i) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                  : 'text-slate-600 hover:bg-surface-container hover:text-on-surface font-medium'
              }`}
              to={link.href}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              <span>{link.text}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pt-4 border-t border-surface-container mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
