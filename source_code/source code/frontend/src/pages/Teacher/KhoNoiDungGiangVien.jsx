import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const KhoNoiDungGiangVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">
                Kho nội dung
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <span className="hover:text-primary cursor-pointer">
                  Trang chủ
                </span>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <span className="text-slate-900 font-medium">
                  Tài liệu học thuật
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">
                  create_new_folder
                </span>
                <span>Thư mục mới</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">
                  upload_file
                </span>
                <span>Tải lên tài liệu</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">
                      folder
                    </span>
                    Thư mục của tôi
                  </h2>
                  <button className="text-primary text-sm font-semibold hover:underline">
                    Xem tất cả
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="group bg-white p-5 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">
                          folder_open
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Cơ sở dữ liệu nâng cao
                    </h3>
                    <p className="text-xs text-slate-500">
                      24 tập tin • Cập nhật 2 giờ trước
                    </p>
                  </div>
                  <div className="group bg-white p-5 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">
                          folder_special
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Lập trình hướng đối tượng
                    </h3>
                    <p className="text-xs text-slate-500">
                      12 tập tin • Cập nhật hôm qua
                    </p>
                  </div>
                  <div className="group bg-white p-5 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">
                          auto_stories
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Giáo trình 2024
                    </h3>
                    <p className="text-xs text-slate-500">
                      8 tập tin • Cập nhật 3 ngày trước
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-edu-orange">
                      description
                    </span>
                    Tập tin học liệu
                  </h2>
                  <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-lg">
                    <button className="p-1.5 bg-white shadow-sm rounded-md text-slate-800">
                      <span className="material-symbols-outlined text-sm">
                        grid_view
                      </span>
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800">
                      <span className="material-symbols-outlined text-sm">
                        list
                      </span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-primary/30 transition-all shadow-sm">
                    <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <span className="material-symbols-outlined text-red-500 text-5xl opacity-40">
                        picture_as_pdf
                      </span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-slate-900 p-2 rounded-full mx-1 hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-xl">
                            visibility
                          </span>
                        </button>
                        <button className="bg-primary text-white p-2 rounded-full mx-1 hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-xl">
                            smart_toy
                          </span>
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1">
                      Bai_giang_Chuong_1.pdf
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        PDF
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        4.2 MB
                      </span>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-primary/30 transition-all shadow-sm">
                    <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <img
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-60"
                        data-alt="Screenshot of a digital database lecture video"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTcezjW5cJdofdRy8YX1uVehYTTCsECXm4FjI4SuFe_X46CMProXfsjhiQ2FRaVQQDfYbrfnMyXeXJvCTBnvr10iX1052cBtbULuN63dBo08CVxkd35tZAJDGBLBgpXus1nAYABLodKyrl5uyB3FVUXVZvOpoyLkFibpzZ_F9P_lNs7sA6opYQHUh5HyI8O23OYb62DKUnyJxumJe4p-0yd-gZ-qt4GkT8v8ZyLZdXdbdeOxFky0OnxiqweokBhEH-XGV2iE1hcFU"
                      />
                      <span className="material-symbols-outlined text-white text-4xl absolute z-10">
                        play_circle
                      </span>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        15:24
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1">
                      Huong_dan_thuc_hanh_SQL.mp4
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        Video
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        128 MB
                      </span>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-primary/30 transition-all shadow-sm">
                    <div className="aspect-video bg-orange-50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <span className="material-symbols-outlined text-orange-500 text-5xl opacity-40">
                        slideshow
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1">
                      Kien_truc_he_thong.pptx
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        Slide
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        8.5 MB
                      </span>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-4 border border-transparent hover:border-primary/30 transition-all shadow-sm">
                    <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <span className="material-symbols-outlined text-red-500 text-5xl opacity-40">
                        picture_as_pdf
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1">
                      De_cuong_chi_tiet.pdf
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        PDF
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        1.1 MB
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-slate-900">
                      AI Trợ lý học vụ
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">
                      Đang sẵn sàng giúp đỡ
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chọn một tài liệu để bắt đầu phân tích hoặc trích xuất nội
                    dung thông minh.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400">
                      Kéo thả file vào đây để AI phân tích
                    </p>
                  </div>
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-primary/30 transition-all shadow-sm group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        summarize
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Tóm tắt nội dung
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-primary/30 transition-all shadow-sm group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        quiz
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Trích xuất câu hỏi
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-primary/30 transition-all shadow-sm group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        translate
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        Dịch thuật đa ngữ
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Gợi ý tác vụ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1.5 rounded-full font-bold cursor-pointer hover:bg-blue-100">
                      Phân loại tự động
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1.5 rounded-full font-bold cursor-pointer hover:bg-blue-100">
                      Gắn thẻ thông minh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default KhoNoiDungGiangVien;
