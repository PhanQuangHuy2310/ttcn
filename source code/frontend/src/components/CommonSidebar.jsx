import React from "react";
import { Link } from "react-router-dom";

const CommonSidebar = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-[#f9f9f9] dark:bg-slate-950 p-4 gap-2 z-50">
      <div className="mb-8 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black flex items-center gap-0.5 text-[#1B8EF2] font-['Be_Vietnam_Pro'] after:content-['edu'] after:text-orange-500">
            DHD
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Hệ thống DHDedu
        </p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200 group"
          to="#"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-medium text-sm">Tổng quan</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200 group"
          to="#"
        >
          <span className="material-symbols-outlined">group</span>
          <span className="font-medium text-sm">Người dùng</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 bg-[#1B8EF2] text-white rounded-xl shadow-lg shadow-[#1B8EF2]/20 transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined">security</span>
          <span className="font-medium text-sm">Vai trò &amp; Quyền</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200 group"
          to="#"
        >
          <span className="material-symbols-outlined">enhanced_encryption</span>
          <span className="font-medium text-sm">Bảo mật dữ liệu</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200 group"
          to="#"
        >
          <span className="material-symbols-outlined">
            settings_applications
          </span>
          <span className="font-medium text-sm">Cài đặt hệ thống</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200 group"
          to="#"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-medium text-sm">Lịch sử truy cập</span>
        </Link>
      </nav>
      <div className="mt-auto border-t border-slate-200 pt-4 flex flex-col gap-1">
        <Link
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-[#eeeeee] rounded-xl transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-medium text-sm">Trợ giúp</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-xl transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-sm">Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
};

export default CommonSidebar;
