import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const DashboardGiaoVienDhdeduOngBoAzota = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <TeacherHeader />

        <main className="p-8 space-y-8">
          <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-container text-white shadow-xl">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Chào buổi sáng, Thầy/Cô Nguyễn Văn A
              </h1>
              <p className="text-primary-fixed max-w-xl">
                Hôm nay bạn có 3 lớp học và 1 lịch kiểm tra định kỳ lúc 14:00.
                Chúc bạn một ngày làm việc hiệu quả!
              </p>
            </div>

            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"></div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-blue-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined"
                    data-icon="school"
                  >
                    school
                  </span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +2 mới
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Tổng số lớp học
              </p>
              <h3 className="text-3xl font-black mt-1">12</h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-emerald-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="group">
                    group
                  </span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +15 mới
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Tổng số học sinh
              </p>
              <h3 className="text-3xl font-black mt-1">350</h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-purple-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined"
                    data-icon="assignment"
                  >
                    assignment
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  Tháng này
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Kỳ thi đã tổ chức
              </p>
              <h3 className="text-3xl font-black mt-1">48</h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-orange-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined"
                    data-icon="auto_awesome"
                  >
                    auto_awesome
                  </span>
                </div>
                <span className="text-xs font-bold text-white bg-orange-500 px-2 py-1 rounded-full animate-pulse">
                  Cảnh báo AI
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Cần chú ý</p>
              <h3 className="text-3xl font-black mt-1">
                5{" "}
                <span className="text-sm font-normal text-slate-400">
                  học sinh
                </span>
              </h3>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Lớp học đang phụ trách
                </h2>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Xem tất cả
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Lớp học</th>
                      <th className="px-6 py-4 font-bold">Môn học</th>
                      <th className="px-6 py-4 font-bold">Sĩ số</th>
                      <th className="px-6 py-4 font-bold">
                        Lịch thi tiếp theo
                      </th>
                      <th className="px-6 py-4 font-bold text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        12A1
                      </td>
                      <td className="px-6 py-4 text-slate-600">Toán học</td>
                      <td className="px-6 py-4 text-slate-600">45</td>
                      <td className="px-6 py-4 text-orange-600 font-medium">
                        14:00 - 24/10
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                          <span
                            className="material-symbols-outlined text-slate-400"
                            data-icon="more_vert"
                          >
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        11B2
                      </td>
                      <td className="px-6 py-4 text-slate-600">Vật lý</td>
                      <td className="px-6 py-4 text-slate-600">42</td>
                      <td className="px-6 py-4 text-slate-400 italic">
                        Chưa có lịch
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                          <span
                            className="material-symbols-outlined text-slate-400"
                            data-icon="more_vert"
                          >
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        12C4
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        Toán học (NC)
                      </td>
                      <td className="px-6 py-4 text-slate-600">38</td>
                      <td className="px-6 py-4 text-orange-600 font-medium">
                        08:00 - 26/10
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                          <span
                            className="material-symbols-outlined text-slate-400"
                            data-icon="more_vert"
                          >
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        10A5
                      </td>
                      <td className="px-6 py-4 text-slate-600">Toán học</td>
                      <td className="px-6 py-4 text-slate-600">40</td>
                      <td className="px-6 py-4 text-slate-400 italic">
                        Chưa có lịch
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                          <span
                            className="material-symbols-outlined text-slate-400"
                            data-icon="more_vert"
                          >
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6 rounded-3xl border border-white relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <span
                      className="material-symbols-outlined"
                      data-icon="psychology"
                    >
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">AI Insights</h3>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest">
                      Phân tích hệ thống
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50/50 p-4 rounded-2xl">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-blue-700">
                        3 học sinh
                      </span>{" "}
                      l���p <span className="font-bold">12A1</span> đang gặp khó
                      khăn với chương <span className="italic">"Đạo hàm"</span>.
                    </p>
                  </div>
                  <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      data-icon="add_task"
                    >
                      add_task
                    </span>
                    Tạo bài ôn tập nhanh
                  </button>
                </div>

                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">
                    Hoạt động gần đây
                  </h3>
                  <span
                    className="material-symbols-outlined text-slate-300"
                    data-icon="history"
                  >
                    history
                  </span>
                </div>
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
                      <span
                        className="material-symbols-outlined text-primary text-[16px]"
                        data-icon="upload_file"
                      >
                        upload_file
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Lớp 12A1 nộp bài tập
                    </p>
                    <p className="text-xs text-slate-500">
                      32 học sinh vừa hoàn thành bài "Kiểm tra 15p"
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">
                      2 phút trước
                    </p>
                  </div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10">
                      <span
                        className="material-symbols-outlined text-emerald-500 text-[16px]"
                        data-icon="check_circle"
                      >
                        check_circle
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Cập nhật hệ thống
                    </p>
                    <p className="text-xs text-slate-500">
                      Tính năng "Ngân hàng câu hỏi" đã được tối ưu hóa
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">
                      1 giờ trước
                    </p>
                  </div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center z-10">
                      <span
                        className="material-symbols-outlined text-orange-500 text-[16px]"
                        data-icon="notification_important"
                      >
                        notification_important
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Nhắc nhở lịch thi
                    </p>
                    <p className="text-xs text-slate-500">
                      Sắp đến giờ bắt đầu thi thử khối 12
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">
                      3 giờ trước
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF9800] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-[28px]" data-icon="add">
          add
        </span>
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Tạo mới
        </span>
      </button>
    </div>
  );
};

export default DashboardGiaoVienDhdeduOngBoAzota;
