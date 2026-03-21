import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const DashboardGiaoVienOngBoUi = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <TeacherSidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <TeacherHeader />

          <main className="p-8 max-w-7xl mx-auto w-full space-y-10">
            <section>
              <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                Chào buổi sáng, Thầy A! 👋
              </h2>
              <p className="text-slate-500 mt-2">
                Hôm nay thầy có 2 lớp học và 1 cuộc họp khoa lúc 14:00.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    school
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tổng số lớp học
                  </p>
                  <p className="text-2xl font-black text-header-accent">05</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-info-callout flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    group
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tổng số sinh viên
                  </p>
                  <p className="text-2xl font-black text-header-accent">150</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    timer
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Bài kiểm tra
                  </p>
                  <p className="text-2xl font-black text-header-accent">02</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-header-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    description
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tài liệu chia sẻ
                  </p>
                  <p className="text-2xl font-black text-header-accent">24</p>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-header-accent">
                      Lớp học đang hoạt động
                    </h3>
                    <a
                      className="text-primary text-sm font-semibold hover:underline"
                      href="#"
                    >
                      Xem tất cả
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                      <div className="h-28 relative overflow-hidden">
                        <img
                          alt="Hình nền trừu tượng lớp học"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp-CiwFP75DZ0QH68Z9X0SOwDnPlHjLEdI4rVK9hoM1t4evhUG7blLB0Nqgz3oQZKT7hrtAEDGI0p0xziYHucW00t0R31SNtvG3niI9O4l2Vv6B6F4KFoR0nnfYQeuA_aAiU4y6ohOwO9h2SKk2bTjhluWSblqEqFZu-KlYuv4gwnQxamg5j6OFPZW4ww8ClExYMmV5Ls4xmQgo3YWcnKh0qt74uV_qpfXnWoSwgNAsqTx6qW6YJDf1A_HNaQS4bkFi6f5etZZCKo"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase w-fit">
                            Công nghệ phần mềm
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                          CS301 - Phát triển Web
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              groups
                            </span>{" "}
                            45 Sinh viên
                          </span>
                          <span className="font-bold text-primary">
                            Tiến độ: 65%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-[65%] rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                      <div className="h-28 relative overflow-hidden">
                        <img
                          alt="Hình nền trừu tượng lớp học 2"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBkqrwM7TKpbciw_B691OWSEaPsTNxndMKBEvOpngwhn6mpaakEUAVUwUIZJdgW8m2jiGEVScugAvM8Pfs7FTfNxq9DAd0c08Orb6HNmgSwFc910ID4JQ-zWpxaoQ00I4eD8rkF2nDabe5a8ab0__HX7MSDiN5xqY9jFAMFFGuARIW75siLUlvvuMXGd_oTOcN6q_SVB1eamltIkScoe6GomRAM08CFFko4oeGxuyLFtpa8nZqdcMCEvk4SNTySHozfLZuFg4d8ms"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase w-fit">
                            Khoa học máy tính
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                          CS202 - Cấu trúc dữ liệu
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              groups
                            </span>{" "}
                            38 Sinh viên
                          </span>
                          <span className="font-bold text-info-callout">
                            Tiến độ: 40%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-info-callout h-full w-[40%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-4 text-header-accent">
                    Hoạt động gần đây
                  </h3>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          assignment_turned_in
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          <span className="text-primary">Trần Thị B</span> đã
                          nộp bài tập "Lab 4 - React Hooks"
                        </p>
                        <p className="text-xs text-slate-500">
                          Lớp CS301 • 10 phút trước
                        </p>
                      </div>
                      <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Chấm điểm
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          add_task
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Đã thêm 15 câu hỏi mới vào Ngân hàng đề thi
                        </p>
                        <p className="text-xs text-slate-500">
                          Môn Giải tích • 2 giờ trước
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">chat</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          <span className="text-primary">Lê Văn C</span> đã để
                          lại một câu hỏi trong diễn đàn lớp
                        </p>
                        <p className="text-xs text-slate-500">
                          Lớp CS202 • 4 giờ trước
                        </p>
                      </div>
                      <button className="px-3 py-1.5 bg-info-callout/10 text-info-callout text-xs font-bold rounded-lg hover:bg-info-callout hover:text-white transition-colors">
                        Phản hồi
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="space-y-10">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-info-callout">
                      psychology
                    </span>
                    <h3 className="text-xl font-bold text-header-accent">
                      Gợi ý từ AI
                    </h3>
                  </div>
                  <div className="bg-primary text-white p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group border-l-4 border-orange-400">
                    <div className="relative z-10">
                      <h4 className="text-lg font-bold mb-2">
                        AI Insights cho Giảng viên
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-1">
                            Cần chú ý
                          </p>
                          <p className="text-xs leading-relaxed">
                            5 sinh viên có kết quả giảm sút &gt;15% trong các
                            bài kiểm tra tuần qua.
                          </p>
                          <button className="mt-2 text-[10px] bg-white text-primary px-3 py-1 rounded font-bold hover:bg-slate-100 transition-colors">
                            Xem danh sách
                          </button>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-1">
                            Gợi ý nội dung
                          </p>
                          <p className="text-xs leading-relaxed">
                            Cập nhật thêm tài liệu tham khảo cho Chương 4 môn
                            Giải tích để hỗ trợ sinh viên.
                          </p>
                          <button className="mt-2 text-[10px] bg-white/20 text-white px-3 py-1 rounded font-bold hover:bg-white/30 transition-colors">
                            Thực hiện ngay
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                      auto_awesome
                    </span>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-4 text-header-accent">
                    Lịch trình sắp tới
                  </h3>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center size-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 4
                        </span>
                        <span className="text-lg font-black text-primary leading-none">
                          24
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Lên lớp: Phát triển Web
                        </p>
                        <p className="text-xs text-slate-500">
                          08:00 - 11:30 • Phòng B402
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center size-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 5
                        </span>
                        <span className="text-lg font-black text-primary leading-none">
                          25
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Hạn nộp: Đồ án cuối kỳ
                        </p>
                        <p className="text-xs text-slate-500">
                          23:59 • Lớp CS301
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center size-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 6
                        </span>
                        <span className="text-lg font-black text-primary leading-none">
                          26
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Kiểm tra: Cấu trúc d�� liệu
                        </p>
                        <p className="text-xs text-slate-500">
                          14:00 - 15:30 • Trực tuyến
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2.5 text-primary text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-2">
                      Xem toàn bộ lịch
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGiaoVienOngBoUi;
