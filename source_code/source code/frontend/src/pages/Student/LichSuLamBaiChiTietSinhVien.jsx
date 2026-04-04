import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const LichSuLamBaiChiTietSinhVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />

      <StudentHeader />

      <main className="pt-20 pb-20 md:pb-8 md:pl-72 pr-6 min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <p className="text-sm font-medium text-tertiary">
                  Tổng bài đã làm
                </p>
              </div>
              <p className="text-3xl font-headline font-black text-on-surface">
                42
              </p>
              <p className="text-xs text-secondary font-medium mt-1">
                +3 bài tuần này
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-edu-orange/10 flex items-center justify-center text-edu-orange">
                  <span className="material-symbols-outlined">star</span>
                </div>
                <p className="text-sm font-medium text-tertiary">
                  Điểm trung bình
                </p>
              </div>
              <p className="text-3xl font-headline font-black text-on-surface">
                8.4
              </p>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-edu-orange h-full"></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">task_alt</span>
                </div>
                <p className="text-sm font-medium text-tertiary">
                  Tỷ lệ hoàn thành
                </p>
              </div>
              <p className="text-3xl font-headline font-black text-on-surface">
                95%
              </p>
              <p className="text-xs text-tertiary font-medium mt-1">
                Dựa trên 44 bài giao
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">update</span>
                </div>
                <p className="text-sm font-medium text-tertiary">
                  Bài gần nhất
                </p>
              </div>
              <p className="text-lg font-headline font-bold text-on-surface line-clamp-1">
                Giải tích 2 - HK2
              </p>
              <p className="text-xs text-tertiary mt-1">
                2 giờ trước •{" "}
                <span className="text-primary font-bold">9.0 đ</span>
              </p>
            </div>
          </section>

          <section className="bg-primary overflow-hidden rounded-3xl relative p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-on-primary">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-edu-orange">
                  auto_awesome
                </span>
                <h2 className="text-xl font-headline font-bold">
                  Nhận xét tổng quát từ AI
                </h2>
              </div>
              <p className="text-primary-fixed/90 text-sm leading-relaxed max-w-2xl">
                Dựa trên 10 bài làm gần nhất, bạn đang thể hiện phong độ ổn định
                ở các môn{" "}
                <span className="font-bold text-white">Toán học (8.5)</span> và{" "}
                <span className="font-bold text-white">Vật lý (9.0)</span>. Tuy
                nhiên, phần kiến thức về{" "}
                <span className="italic underline decoration-edu-orange underline-offset-4">
                  Tích phân đa biến
                </span>{" "}
                vẫn cần được cải thiện. AI gợi ý bạn nên ôn tập lại chương 4
                trước khi kỳ thi giữa kỳ bắt đầu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="bg-surface-container-lowest text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">map</span>
                  Xem lộ trình tiếp theo
                </button>
                <button className="bg-white/20 backdrop-blur-md text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                  Tải báo cáo chi tiết
                </button>
              </div>
            </div>
            <div className="w-32 h-32 opacity-20 absolute -right-4 -bottom-4 md:static md:opacity-40 shrink-0">
              <span className="material-symbols-outlined text-[120px] leading-none">
                neurology
              </span>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h3 className="font-headline font-bold text-xl">
                Lịch sử làm bài
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <select className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-primary/20">
                  <option>Tất cả môn học</option>
                  <option>Toán Giải Tích</option>
                  <option>Vật Lý Đại Cương</option>
                  <option>Lập trình C++</option>
                </select>
                <select className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-primary/20">
                  <option>T��t cả thời gian</option>
                  <option>Tuần này</option>
                  <option>Tháng này</option>
                  <option>Học kỳ này</option>
                </select>
                <select className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-primary/20">
                  <option>Loại: Tất cả</option>
                  <option>Bài thi</option>
                  <option>Luyện tập</option>
                </select>
                <button className="p-2.5 bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    filter_list
                  </span>
                </button>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_12px_32px_rgba(0,28,56,0.04)] border border-surface-container-low">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                        Tên bài thi/luyện tập
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                        Môn học
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                        Ngày làm
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                        Kết quả
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    <tr className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-on-surface">
                          Kiểm tra Giữa kỳ - Chương 2
                        </p>
                        <p className="text-xs text-tertiary flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">
                            timer
                          </span>{" "}
                          45 phút
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
                          Toán Giải Tích
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-on-surface-variant font-medium">
                          12/10/2023
                        </p>
                        <p className="text-[10px] text-tertiary uppercase">
                          14:30 PM
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-primary">
                            9.5{" "}
                            <span className="text-xs font-medium text-tertiary">
                              / 10
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">
                              check_circle
                            </span>{" "}
                            ĐẠT
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-tertiary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all">
                            <span className="material-symbols-outlined text-sm">
                              visibility
                            </span>
                            Xem chi tiết
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-edu-orange/10 text-edu-orange rounded-xl text-xs font-bold hover:bg-edu-orange/20 transition-all">
                            <span className="material-symbols-outlined text-sm">
                              psychology
                            </span>
                            Nhận xét AI
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-on-surface">
                          Bài tập rèn luyện số 4
                        </p>
                        <p className="text-xs text-tertiary flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">
                            timer
                          </span>{" "}
                          20 phút
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full uppercase">
                          Vật Lý Đại Cương
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-on-surface-variant font-medium">
                          10/10/2023
                        </p>
                        <p className="text-[10px] text-tertiary uppercase">
                          09:15 AM
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-on-surface">
                            4.0{" "}
                            <span className="text-xs font-medium text-tertiary">
                              / 10
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-error flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">
                              cancel
                            </span>{" "}
                            KHÔNG ĐẠT
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-tertiary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all">
                            <span className="material-symbols-outlined text-sm">
                              visibility
                            </span>
                            Xem chi tiết
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-edu-orange/10 text-edu-orange rounded-xl text-xs font-bold hover:bg-edu-orange/20 transition-all">
                            <span className="material-symbols-outlined text-sm">
                              psychology
                            </span>
                            Nhận xét AI
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-on-surface">
                          Cuối kỳ - Giải thuật
                        </p>
                        <p className="text-xs text-tertiary flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">
                            timer
                          </span>{" "}
                          90 phút
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
                          Lập Trình
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-on-surface-variant font-medium">
                          05/10/2023
                        </p>
                        <p className="text-[10px] text-tertiary uppercase">
                          08:00 AM
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-primary">
                            8.0{" "}
                            <span className="text-xs font-medium text-tertiary">
                              / 10
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">
                              check_circle
                            </span>{" "}
                            ĐẠT
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-tertiary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all">
                            <span className="material-symbols-outlined text-sm">
                              visibility
                            </span>
                            Xem chi tiết
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-edu-orange/10 text-edu-orange rounded-xl text-xs font-bold hover:bg-edu-orange/20 transition-all">
                            <span className="material-symbols-outlined text-sm">
                              psychology
                            </span>
                            Nhận xét AI
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-surface-container-low/30 border-t border-surface-container-low flex items-center justify-between">
                <p className="text-sm text-tertiary font-medium">
                  Hiển thị 3 trên 42 kết quả
                </p>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 text-tertiary hover:bg-surface-container rounded-lg disabled:opacity-30"
                    disabled=""
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-lg text-tertiary hover:bg-surface-container text-xs font-bold">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-lg text-tertiary hover:bg-surface-container text-xs font-bold">
                    3
                  </button>
                  <button className="p-2 text-tertiary hover:bg-surface-container rounded-lg">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-surface-container-low flex justify-around items-center px-4 pb-safe h-16 shadow-[0px_-4px_16px_rgba(0,0,0,0.04)]">
        <a
          className="flex flex-col items-center justify-center text-tertiary active:scale-95 transition-transform"
          href="#"
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-semibold font-label">Home</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-primary bg-primary/5 rounded-2xl px-4 py-1 active:scale-95 transition-transform"
          href="#"
        >
          <span className="material-symbols-outlined text-2xl">
            history_edu
          </span>
          <span className="text-[10px] font-semibold font-label">History</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-tertiary active:scale-95 transition-transform"
          href="#"
        >
          <span className="material-symbols-outlined text-2xl">quiz</span>
          <span className="text-[10px] font-semibold font-label">Exams</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-tertiary active:scale-95 transition-transform"
          href="#"
        >
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] font-semibold font-label">Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default LichSuLamBaiChiTietSinhVien;
