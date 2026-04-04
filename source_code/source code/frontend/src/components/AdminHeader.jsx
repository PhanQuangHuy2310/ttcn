import React from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8">
      <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 w-96">
        <span
          className="material-symbols-outlined text-outline text-sm mr-2"
          data-icon="search"
        >
          search
        </span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline"
          placeholder="Tìm kiếm nhanh..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-all"
            to="#"
          >
            Hỗ trợ
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-600 transition-all"
            to="#"
          >
            Tin tức
          </Link>
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative">
            <span
              className="material-symbols-outlined"
              data-icon="notifications"
            >
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span
              className="material-symbols-outlined"
              data-icon="help_outline"
            >
              help_outline
            </span>
          </button>
          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-bold leading-none text-on-surface">
                Admin DHD
              </p>
              <p className="text-[10px] text-outline font-medium uppercase tracking-wider">
                Hệ thống
              </p>
            </div>
            <img
              alt="Ảnh đại diện người dùng"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container/20 group-hover:ring-primary-container transition-all"
              data-alt="Admin user profile professional portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa4_pRhZ4VVZIN5KtN53K68kXaTVrfZQoH-B_mciYqknNOfF46XHX-ywuJi1lOf701Q2cWV68gyWCYx_LYJPeWL5QehqOyEbe7ZR3LPIVbdAKTVtH5n3tPGfbzE-oA-AzVOLM5MW2MbntHaVs6jdq39sAXFX3bWC5t5H_lR0D6xTGsT5QQF9lHhbjgD5W9CLrTYSUfWVmQdaHsKYXPwGvTU-cOoCxtkteBuXMEpZqjEcgNOJCgqEztnzAJTxBZrVA88IOu1HbEpeg"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
