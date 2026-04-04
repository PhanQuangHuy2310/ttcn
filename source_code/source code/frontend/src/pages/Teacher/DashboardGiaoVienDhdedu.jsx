import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const DashboardGiaoVienDhdedu = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <TeacherSidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <TeacherHeader />

          <main className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Chào buổi sáng, Thầy A! 👋
              </h1>
              <p className="text-slate-500 mt-1">
                Hôm nay thầy có 2 lớp học và 1 cuộc họp khoa lúc 14:00.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    school
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tổng số lớp học</p>
                  <p className="text-2xl font-bold">05</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-brand-cyan/10 rounded-lg text-brand-cyan">
                  <span className="material-symbols-outlined text-3xl">
                    group
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tổng số sinh viên</p>
                  <p className="text-2xl font-bold">150</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-accent-orange/10 rounded-lg text-accent-orange">
                  <span className="material-symbols-outlined text-3xl">
                    timer
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bài kiểm tra</p>
                  <p className="text-2xl font-bold">02</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue">
                  <span className="material-symbols-outlined text-3xl">
                    description
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tài liệu chia sẻ</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Lớp học đang hoạt động</h2>
                  <button className="text-primary text-sm font-semibold hover:underline">
                    Xem tất cả
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div
                      className="h-24 bg-gradient-to-r from-primary to-brand-blue p-4 flex flex-col justify-end"
                      data-alt="Hình nền trừu tượng xanh dương cho lớp học"
                    >
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase w-fit">
                        Công nghệ phần mềm
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      <h3 className="font-bold text-lg">
                        CS301 - Phát triển Web
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            groups
                          </span>{" "}
                          45 Sinh viên
                        </span>
                        <span className="font-medium">Tiến độ: 65%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%] rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div
                      className="h-24 bg-gradient-to-r from-brand-deep to-brand-cyan p-4 flex flex-col justify-end"
                      data-alt="Hình nền trừu tượng xanh ngọc cho lớp học"
                    >
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase w-fit">
                        Khoa học máy tính
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      <h3 className="font-bold text-lg">
                        CS202 - Cấu trúc dữ liệu
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            groups
                          </span>{" "}
                          38 Sinh viên
                        </span>
                        <span className="font-medium">Tiến độ: 40%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-cyan h-full w-[40%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Hoạt động gần đây</h2>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">
                            assignment_turned_in
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-bold">Trần Thị B</span> đã nộp
                            bài tập "Lab 4 - React Hooks"
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Lớp CS301 • 10 phút trước
                          </p>
                        </div>
                        <button className="text-primary text-xs font-bold px-3 py-1 bg-primary/5 rounded-lg hover:bg-primary/10">
                          Chấm điểm
                        </button>
                      </div>
                      <div className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">
                            add_task
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            Đã thêm{" "}
                            <span className="font-bold">15 câu hỏi mới</span>{" "}
                            vào Ngân hàng đề thi
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Môn Giải tích • 2 giờ trước
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">
                            chat
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-bold">Lê Văn C</span> đã để
                            lại một câu hỏi trong diễn đàn lớp
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Lớp CS202 • 4 giờ trước
                          </p>
                        </div>
                        <button className="text-primary text-xs font-bold px-3 py-1 bg-primary/5 rounded-lg hover:bg-primary/10">
                          Phản hồi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-br from-primary to-brand-deep rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined fill-1">
                      auto_awesome
                    </span>
                    <h3 className="font-bold">AI Insights cho Giảng viên</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-bold text-brand-cyan uppercase tracking-wider mb-2">
                        Cần chú ý
                      </p>
                      <p className="text-sm">
                        5 sinh viên có kết quả giảm sút &gt;15% trong các bài
                        kiểm tra tuần qua.
                      </p>
                      <button className="mt-3 text-xs bg-white text-primary px-3 py-1.5 rounded-lg font-bold">
                        Xem danh sách
                      </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-bold text-accent-orange uppercase tracking-wider mb-2">
                        Gợi ý
                      </p>
                      <p className="text-sm">
                        Cập nhật thêm tài liệu tham khảo cho Chương 4 môn Giải
                        tích để hỗ trợ sinh viên.
                      </p>
                      <button className="mt-3 text-xs bg-white/20 text-white px-3 py-1.5 rounded-lg font-bold">
                        Thực hiện ngay
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="font-bold text-lg mb-4">Lịch trình sắp tới</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 4
                        </span>
                        <span className="text-lg font-extrabold text-primary">
                          24
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Lên lớp: Phát triển Web
                        </p>
                        <p className="text-xs text-slate-500">
                          08:00 - 11:30 • Phòng B402
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 5
                        </span>
                        <span className="text-lg font-extrabold text-primary">
                          25
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Hạn nộp: Đồ án cuối kỳ
                        </p>
                        <p className="text-xs text-slate-500">
                          23:59 • Lớp CS301
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TH 6
                        </span>
                        <span className="text-lg font-extrabold text-primary">
                          26
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Kiểm tra: Cấu trúc dữ liệu
                        </p>
                        <p className="text-xs text-slate-500">
                          14:00 - 15:30 • Trực tuyến
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Xem toàn bộ lịch
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGiaoVienDhdedu;
