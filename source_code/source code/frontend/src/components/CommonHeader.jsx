import React from "react";
import { Link } from "react-router-dom";

const CommonHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#1B8EF2]/20 text-sm font-['Be_Vietnam_Pro']"
            placeholder="Tìm kiếm vai trò, quyền hạn..."
            type="text"
          />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            className="text-slate-500 font-medium hover:text-[#1B8EF2] transition-colors"
            to="#"
          >
            Hệ thống
          </Link>
          <Link
            className="text-[#1B8EF2] border-b-2 border-[#1B8EF2] pb-1 font-bold"
            to="#"
          >
            Bảo mật
          </Link>
          <Link
            className="text-slate-500 font-medium hover:text-[#1B8EF2] transition-colors"
            to="#"
          >
            Nhật ký
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors relative">
          <span className="material-symbols-outlined text-slate-600">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-slate-600">
            settings
          </span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">Quản trị viên</p>
            <p className="text-[10px] text-slate-500 font-medium">
              Hệ thống cấp cao
            </p>
          </div>
          <img
            alt="Admin Avatar"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-[#1B8EF2]/20 transition-all"
            data-alt="Chân dung chuyên nghiệp của quản trị viên"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0Dm-wVrsruV7UAqNkHYyq04ZpITA36Qgh64L0bKy5FM6Hf_PaELq5b0KuXtgbcm0A7uXk_XHkMHwnwRx21YPSQTP67wuGVcwwV6eG1RLcpqRArbcyLvwz38-rQwfr0s2HF1ESq5iq123GKRcdtEYj2LP2XNxabdCeYzfxpv_CiEM4GPi7B86wg7hkUtcRQewS4M6mfsezaupVjxebft1knj4tgeDv67I5xmYK1Q6PufikpD0NiqL1AxxvhIkfKR8vS6f_N2wrh4"
          />
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
