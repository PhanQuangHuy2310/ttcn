import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const TongQuanNguoiHocDhdeduVietHoaFontMoi = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <StudentSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto">
          <StudentHeader />
          <div className="p-8 max-w-7xl mx-auto w-full">
            <section className="mb-10">
              <h2 className="text-3xl font-black tracking-tight text-header-accent dark:text-white">
                Chào mừng quay trở lại, Alex! 👋
              </h2>
              <div className="mt-4 p-5 rounded-xl bg-secondary-accent/20 border border-secondary-accent">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-info-callout text-3xl">
                    auto_awesome
                  </span>
                  <div>
                    <h3 className="font-bold text-header-accent mb-1">
                      Tóm tắt học tập AI
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Bạn đã nắm vững{" "}
                      <span className="font-bold text-slate-900 dark:text-white text-lg">
                        85%
                      </span>{" "}
                      môn Giải tích. Hãy tập trung vào{" "}
                      <span className="text-primary font-semibold">
                        Hình học
                      </span>{" "}
                      hôm nay để duy trì chuỗi 12 ngày học và đạt mục tiêu tuần
                      của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    task_alt
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Khóa học hoàn thành
                  </p>
                  <p className="text-2xl font-black text-header-accent">12</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    star
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Điểm trung bình
                  </p>
                  <p className="text-2xl font-black text-header-accent">94%</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    local_fire_department
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Chuỗi ngày học
                  </p>
                  <p className="text-2xl font-black text-header-accent">12</p>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-header-accent">
                      Lộ trình học tập
                    </h3>
                    <a
                      className="text-primary text-sm font-semibold hover:underline"
                      href="#"
                    >
                      Xem tất cả
                    </a>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-sm">
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-info-callout uppercase tracking-widest mb-1">
                          Đang tiến hành
                        </p>
                        <h4 className="text-xl font-bold mb-1">
                          Giải tích nâng cao
                        </h4>
                        <p className="text-slate-500 text-sm">
                          Chương 4: Tích phân bội ba &amp; Ứng dụng
                        </p>
                        <div className="mt-6">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span>Tiến độ</span>
                            <span className="text-primary">65%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[65%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <button className="mt-8 bg-primary text-white py-2 px-6 rounded-lg font-bold text-sm w-fit hover:bg-primary/90 transition-all flex items-center gap-2">
                        Tiếp tục học tập
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                    <div className="w-full md:w-64 h-48 md:h-auto bg-slate-200 dark:bg-slate-800">
                      <img
                        alt="Trình quan sát trừu tượng các công thức toán học và hình học"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlUNrtTREbUR7XC3wDICHfiLgSRwmUWoINF10IEsbP-43phcWDMTyYcGo6L7Vd7L7Kz9_7XPDz-i14D0H5GK-AdavbXSe6WcHih_xOhNEe3oTZoXekB3zfxFVnbUjiha2HcShgRfVHzBCmmZDatVLo9gn2xqakXPC256NSC0QZzEL8_W_WDfbOWZ4DKP6AEXuYaCB_bz9rRLHr5RVaQzaiBtLW3iBKMVNJsEGwLXlXFjb8Lwmg1ENNfgNVvsBgj9E6_cHG2lsD-bQ"
                      />
                    </div>
                  </div>
                </section>

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
                        Phát hiện lỗ hổng kiến thức
                      </h4>
                      <p className="text-blue-50 mb-4 text-sm leading-relaxed">
                        "Bạn nên xem lại{" "}
                        <span className="font-bold underline">
                          Chương 3: Hình học
                        </span>{" "}
                        dựa tr��n lần làm bài trước. Độ chính xác của bạn trong
                        các định lý đường tròn đã giảm 15%."
                      </p>
                      <div className="flex gap-3">
                        <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-100 transition-colors">
                          Bắt đầu ôn tập
                        </button>
                        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-white/20 transition-colors">
                          Bỏ qua
                        </button>
                      </div>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                      lightbulb
                    </span>
                  </div>
                </section>
              </div>

              <aside>
                <section>
                  <h3 className="text-xl font-bold mb-4 text-header-accent">
                    Hoạt động gần đây
                  </h3>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">quiz</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Hoàn thành bài kiểm tra: Đại số tuyến tính
                        </p>
                        <p className="text-xs text-slate-500">
                          Điểm: 92/100 • 2 giờ trước
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          play_circle
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Đã xem video: Vật lý lượng tử
                        </p>
                        <p className="text-xs text-slate-500">
                          Hoàn thành 15 phút • Hôm qua
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">style</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Luyện tập thẻ ghi nhớ: Sinh học
                        </p>
                        <p className="text-xs text-slate-500">
                          24 thẻ đã ôn tập • 2 ngày trước
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-10 flex-shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          assignment
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          Đã nộp bài tập: Kinh tế học
                        </p>
                        <p className="text-xs text-slate-500">
                          Đang chờ chấm điểm • 3 ngày trước
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2 text-primary text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-2">
                      Xem toàn bộ lịch sử
                    </button>
                  </div>
                </section>

                <section className="mt-8">
                  <div className="bg-header-accent dark:bg-primary/20 text-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold">Mục tiêu hàng ngày</h4>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        45/60 phút
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 flex-1 rounded-full bg-primary"></div>
                      <div className="h-2 flex-1 rounded-full bg-primary"></div>
                      <div className="h-2 flex-1 rounded-full bg-primary"></div>
                      <div className="h-2 flex-1 rounded-full bg-white/20"></div>
                    </div>
                    <p className="text-xs mt-4 text-blue-50">
                      Cố lên! Bạn chỉ còn 15 phút nữa là đạt được mục tiêu hàng
                      ngày.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TongQuanNguoiHocDhdeduVietHoaFontMoi;
