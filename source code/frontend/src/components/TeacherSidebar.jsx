import React from "react";
import { Link } from "react-router-dom";

const TeacherSidebar = () => {
  const navLinks = [
    { icon: "dashboard", text: "Tổng quan", href: "#" },
    { icon: "groups", text: "Lớp học của tôi", href: "#" },
    { icon: "quiz", text: "Ngân hàng đề thi", href: "#" },
    { icon: "folder_open", text: "Kho tài liệu", href: "#" },
    { icon: "monitoring", text: "Báo cáo & Thống kê", href: "#" },
    { icon: "settings", text: "Cài đặt", href: "#" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tighter">
          <span className="text-primary">DHD</span>
          <span className="text-accent-orange">edu</span>
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${index === 0 ? "sidebar-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            to={link.href}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="text-sm font-medium">{link.text}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-brand-light/30 p-4 rounded-xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Hỗ trợ kỹ thuật
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Liên hệ ngay nếu bạn gặp sự cố hệ thống.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
