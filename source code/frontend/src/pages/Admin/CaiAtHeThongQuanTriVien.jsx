import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const CaiAtHeThongQuanTriVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          <AdminHeader />

          <div className="p-8 max-w-7xl mx-auto w-full space-y-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
                Cấu hình chung
              </h2>
              <p className="text-slate-500 font-body max-w-2xl">
                Quản lý các thiết lập cơ bản của hệ thống, nhận diện thương hiệu
                và trạng thái hoạt động của nền tảng.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-8 bg-surface-container-lowest rounded-[24px] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined"
                      data-icon="info"
                    >
                      info
                    </span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">
                    Thông tin cơ bản
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Tên hệ thống
                      </label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                        type="text"
                        value="DHDedu Learning Platform"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Slogan / Headline
                      </label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                        type="text"
                        value="Khai phá tri thức Việt"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Mô tả ngắn
                    </label>
                    <textarea
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                      rows="3"
                    >
                      Hệ thống quản lý học tập thông minh hỗ trợ giáo viên và
                      học sinh trong quá trình chuyển đổi số giáo dục.
                    </textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Ngôn ngữ mặc định
                      </label>
                      <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20">
                        <option>Tiếng Việt (Vietnam)</option>
                        <option>English (United Kingdom)</option>
                        <option>日本語 (Japan)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Múi giờ
                      </label>
                      <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20">
                        <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                        <option>(GMT+08:00) Singapore, Taipei</option>
                        <option>(GMT+00:00) London, UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <div className="lg:col-span-4 space-y-8">
                <section className="bg-surface-container-lowest rounded-[24px] p-8 shadow-sm">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-6">
                    Màu sắc thương hiệu
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg shadow-sm"></div>
                        <span className="text-xs font-mono font-medium">
                          #1B8EF2
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                        Chính
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div
                        className="w-full aspect-square rounded-lg shadow-sm"
                        title="#0477BF"
                      ></div>
                      <div
                        className="w-full aspect-square rounded-lg shadow-sm"
                        title="#049DD9"
                      ></div>
                      <div
                        className="w-full aspect-square rounded-lg shadow-sm"
                        title="#F2F2F2"
                      ></div>
                      <div
                        className="w-full aspect-square rounded-lg shadow-sm"
                        title="#D8D9F2"
                      ></div>
                    </div>
                    <button className="w-full py-2.5 text-xs font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                      Thay đổi bảng màu
                    </button>
                  </div>
                </section>

                <section className="bg-primary rounded-[24px] p-8 shadow-lg shadow-primary/10 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="material-symbols-outlined text-3xl"
                        data-icon="construction"
                      >
                        construction
                      </span>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-white/20 p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full transition-transform transform translate-x-0"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg">
                        Chế độ bảo trì
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed mt-1">
                        Khi kích hoạt, chỉ quản trị viên mới có thể truy cập hệ
                        thống.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="lg:col-span-12 bg-surface-container-high/40 rounded-[24px] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 bg-[#001c38] p-10 text-white flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                        <span
                          className="material-symbols-outlined text-3xl text-blue-400"
                          data-icon="smart_toy"
                        >
                          smart_toy
                        </span>
                      </div>
                      <h3 className="text-3xl font-headline font-bold leading-tight mb-4">
                        Cấu hình Tích hợp AI
                      </h3>
                      <p className="text-blue-200/70 font-body text-sm leading-relaxed">
                        Kết nối hệ thống với các mô hình ngôn ngữ lớn để tự động
                        hóa việc tạo câu hỏi và đánh giá học tập.
                      </p>
                    </div>
                    <div className="mt-10 lg:mt-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Service Status: Online
                      </div>
                      <button className="bg-white text-[#001c38] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-xl">
                        Lưu cấu hình AI
                        <span
                          className="material-symbols-outlined text-sm"
                          data-icon="arrow_forward"
                        >
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-2/3 p-10 glass-panel">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            Lựa chọn Mô hình
                            <span
                              className="material-symbols-outlined text-xs text-slate-400"
                              data-icon="help"
                            >
                              help
                            </span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="relative flex flex-col items-center justify-center p-4 border-2 border-primary bg-primary/5 rounded-2xl cursor-pointer group">
                              <input
                                checked=""
                                className="hidden"
                                name="model"
                                type="radio"
                              />
                              <span className="font-bold text-sm text-primary">
                                GPT-4 Turbo
                              </span>
                              <span className="text-[10px] text-primary/60 mt-1">
                                OpenAI
                              </span>
                            </label>
                            <label className="relative flex flex-col items-center justify-center p-4 border-2 border-slate-200 bg-white rounded-2xl cursor-pointer group hover:border-primary/40 transition-all">
                              <input
                                className="hidden"
                                name="model"
                                type="radio"
                              />
                              <span className="font-bold text-sm text-slate-700">
                                Gemini Pro
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1">
                                Google
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-800">
                            API Key Configuration
                          </label>
                          <div className="relative">
                            <input
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                              type="password"
                              value="sk-••••••••••••••••••••••••"
                            />
                            <button className="absolute right-3 top-3 text-slate-400 hover:text-primary">
                              <span
                                className="material-symbols-outlined text-lg"
                                data-icon="visibility"
                              >
                                visibility
                              </span>
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 italic font-medium">
                            Khóa API sẽ được mã hóa chuẩn AES-256 trước khi lưu
                            vào cơ sở dữ liệu.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-bold text-slate-800">
                                Temperature (Sáng tạo)
                              </label>
                              <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                                0.7
                              </span>
                            </div>
                            <input
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                              type="range"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                              <span>Chính xác</span>
                              <span>Sáng tạo</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-bold text-slate-800">
                                Token Limit
                              </label>
                              <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                                4,096
                              </span>
                            </div>
                            <input
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                              type="range"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                              <span>Min (256)</span>
                              <span>Max (8,192)</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100/50 flex gap-4">
                          <span
                            className="material-symbols-outlined text-yellow-600"
                            data-icon="warning"
                          >
                            warning
                          </span>
                          <div>
                            <p className="text-xs font-bold text-yellow-800">
                              Giới hạn Chi phí
                            </p>
                            <p className="text-[11px] text-yellow-700/80 leading-relaxed mt-1">
                              Cấu hình hiện tại có thể tiêu tốn khoảng $0.01 cho
                              mỗi 1,000 token xử lý.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end gap-4 py-10 border-t border-slate-200">
              <button className="px-8 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                Hủy thay đổi
              </button>
              <button className="bg-[#1B8EF2] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-sm"
                  data-icon="save"
                  data-weight="fill"
                >
                  save
                </span>
                Lưu toàn bộ cài đặt
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaiAtHeThongQuanTriVien;
