import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const QuanLyEThiGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-3xl font-headline font-bold mb-4">
                  Tạo đề thi mới trong tích tắc
                </h2>
                <p className="text-primary-fixed mb-8 opacity-90">
                  Sử dụng công cụ AI thế hệ mới để tự động hóa quy trình soạn đề
                  hoặc tự tay lựa chọn những câu hỏi tâm đắc nhất.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-95 transition-transform">
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                    AI Tự tạo đề
                  </button>
                  <button className="bg-primary-fixed/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">list_alt</span>
                    Tự chọn câu hỏi
                  </button>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 opacity-20 translate-x-1/4 translate-y-1/4 pointer-events-none">
                <span className="material-symbols-outlined text-[300px]">
                  quiz
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-8 border-none shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-headline font-bold text-lg">
                    Cấu hình nhanh
                  </span>
                  <span className="material-symbols-outlined text-slate-300">
                    tune
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        timer
                      </span>
                      <span className="text-sm font-medium">
                        Thời gian làm bài
                      </span>
                    </div>
                    <span className="text-sm font-bold">45m</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        lock
                      </span>
                      <span className="text-sm font-medium">Mật khẩu đề</span>
                    </div>
                    <div className="w-8 h-4 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        shuffle
                      </span>
                      <span className="text-sm font-medium">Đảo câu hỏi</span>
                    </div>
                    <div className="w-8 h-4 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 bg-surface-container text-primary font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                Tùy chỉnh mặc định
              </button>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-headline font-bold">
                  Danh sách các đề thi đã tạo
                </h2>
                <p className="text-sm text-slate-500">
                  Quản lý và theo dõi trạng thái các kỳ thi trực tuyến
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container rounded-lg text-sm font-medium hover:bg-surface-container-high flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    filter_list
                  </span>
                  Lọc
                </button>
                <button className="px-4 py-2 bg-surface-container rounded-lg text-sm font-medium hover:bg-surface-container-high flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    file_download
                  </span>
                  Xuất Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-8 py-4">Tên đề thi</th>
                    <th className="px-6 py-4">Lớp áp dụng</th>
                    <th className="px-6 py-4">Thông số</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Thời gian tạo</th>
                    <th className="px-8 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">
                            menu_book
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            Kiểm tra giữa kỳ Toán 12 - Chương 1
                          </p>
                          <p className="text-xs text-slate-500">
                            Mã đề: MATH12-GK1
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tighter">
                          12A1
                        </span>
                        <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tighter">
                          12A2
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            quiz
                          </span>{" "}
                          40 câu hỏi
                        </span>
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            schedule
                          </span>{" "}
                          60 phút
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang diễn ra
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      14/10/2023
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-surface-container-high">
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container">
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined">
                            biotech
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            Trắc nghiệm Vật Lý 11 - Định luật Ôm
                          </p>
                          <p className="text-xs text-slate-500">
                            Mã đề: PHY11-Q2
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tighter">
                        11B3
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            quiz
                          </span>{" "}
                          20 câu hỏi
                        </span>
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            schedule
                          </span>{" "}
                          15 phút
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Đã kết thúc
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      10/10/2023
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary-fixed">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-surface-container-high">
                          <span className="material-symbols-outlined text-lg">
                            analytics
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container">
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <span className="material-symbols-outlined">
                            language
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            Tiếng Anh 10 - Unit 2 Vocabulary
                          </p>
                          <p className="text-xs text-slate-500">
                            Mã đề: ENG10-U2
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tighter">
                        KHOI10
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            quiz
                          </span>{" "}
                          50 câu hỏi
                        </span>
                        <span className="text-xs flex items-center gap-1 text-slate-600">
                          <span className="material-symbols-outlined text-xs">
                            schedule
                          </span>{" "}
                          45 phút
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang diễn ra
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      08/10/2023
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary-fixed">
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-surface-container-high">
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error-container">
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-surface-container-low flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Hiển thị 3 / 12 đề thi
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-white transition-colors text-xs font-bold">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-white transition-colors text-xs font-bold">
                  3
                </button>
                <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  auto_fix_high
                </span>
                AI Cấu hình độ khó
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>DỄ</span>
                    <span>40%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[40%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>TRUNG BÌNH</span>
                    <span>35%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>KHÓ</span>
                    <span>25%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[25%]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-primary-fixed/30 rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">
                  info
                </span>
                <p className="text-xs text-on-primary-fixed-variant leading-relaxed">
                  Hệ thống sẽ tự động quét ngân hàng câu hỏi để lấy 40 câu theo
                  đúng tỷ lệ độ khó bạn đã chọn phía trên.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  analytics
                </span>
                Thống kê nhanh
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Tổng câu hỏi
                  </p>
                  <p className="text-2xl font-headline font-black text-primary">
                    1,248
                  </p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Đề đang mở
                  </p>
                  <p className="text-2xl font-headline font-black text-secondary">
                    05
                  </p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Lượt thi tuần này
                  </p>
                  <p className="text-2xl font-headline font-black text-tertiary">
                    342
                  </p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Điểm TB
                  </p>
                  <p className="text-2xl font-headline font-black text-emerald-600">
                    7.8
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-50 hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default QuanLyEThiGiaoVien;
