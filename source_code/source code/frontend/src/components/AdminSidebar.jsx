import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const navLinks = [
    { icon: "dashboard", text: "Bảng điều khiển", href: "#" },
    { icon: "calendar_month", text: "Lịch học", href: "#" },
    { icon: "groups", text: "Quản lý lớp", href: "#" },
    { icon: "book", text: "Tài liệu học tập", href: "#" },
    { icon: "analytics", text: "Báo cáo", href: "#" },
    { icon: "settings", text: "Cài đặt", href: "#" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 dark:bg-slate-900 border-r border-slate-200/50 flex flex-col p-4 z-50">
      <div className="mb-8 px-4 flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight text-blue-700">
          DHD<span className="text-orange-500">edu</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${index === 0 ? "bg-blue-100 text-blue-700 font-bold active:scale-95 duration-150 ease-in-out" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
            to={link.href}
          >
            <span className="material-symbols-outlined" data-icon={link.icon}>
              {link.icon}
            </span>
            <span className="text-sm font-semibold">{link.text}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-100 pt-4">
        <Link
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          to="#"
        >
          <span className="material-symbols-outlined" data-icon="logout">
            logout
          </span>
          <span className="text-sm font-semibold">Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
