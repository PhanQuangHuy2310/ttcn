import React from "react";
import { Link } from "react-router-dom";

const StudentSidebar = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#ffffff] shadow-[0px_12px_32px_rgba(0,28,56,0.06)] flex flex-col py-6 gap-2 z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight font-headline">
            <span className="text-primary">DHD</span>
            <span className="text-[#F59E0B]">edu</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          The Digital Curator
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        <Link
          className="bg-[#005ea5] text-white rounded-xl mx-2 px-4 py-3 flex items-center gap-3 active-tab-shadow"
          to="#"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span className="text-sm font-medium">Bảng điều khiển</span>
        </Link>
        <Link
          className="text-slate-500 hover:bg-[#eeeeee] mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined" data-icon="school">
            school
          </span>
          <span className="text-sm font-medium">Lớp học</span>
        </Link>
        <Link
          className="text-slate-500 hover:bg-[#eeeeee] mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
          to="#"
        >
          <span
            className="material-symbols-outlined"
            data-icon="calendar_today"
          >
            calendar_today
          </span>
          <span className="text-sm font-medium">Lịch học</span>
        </Link>
        <Link
          className="text-slate-500 hover:bg-[#eeeeee] mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined" data-icon="folder_open">
            folder_open
          </span>
          <span className="text-sm font-medium">Tài liệu</span>
        </Link>
        <Link
          className="text-slate-500 hover:bg-[#eeeeee] mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
          to="#"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="text-sm font-medium">Cài đặt</span>
        </Link>
      </nav>
      <div className="px-4 mt-auto">
        <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-sm" data-icon="add">
            add
          </span>
          Tạo lớp mới
        </button>
        <div className="mt-4 pt-4 border-t border-surface-container">
          <Link
            className="text-slate-500 hover:bg-error-container/10 hover:text-error mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
            to="#"
          >
            <span className="material-symbols-outlined" data-icon="logout">
              logout
            </span>
            <span className="text-sm font-medium">Đăng xuất</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
