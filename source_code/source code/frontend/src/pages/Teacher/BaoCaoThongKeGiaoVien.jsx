import React from "react";
import TeacherHeader from "../../components/TeacherHeader";

const BaoCaoThongKeGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <nav className="fixed left-0 top-0 h-full flex flex-col py-6 bg-[#f9f9f9] dark:bg-slate-950 h-screen w-64 border-r-0 z-50">
        <div className="px-6 mb-10">
          <span className="text-xl font-extrabold text-[#005ea5]">
            DHD<span className="text-edu-orange">edu</span>
          </span>
        </div>
        <div className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 my-1 hover:bg-[#eeeeee] dark:hover:bg-slate-800 rounded-xl transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">Tổng quan</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 my-1 hover:bg-[#eeeeee] dark:hover:bg-slate-800 rounded-xl transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">school</span>
            <span className="font-medium text-sm">Lớp học của tôi</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 my-1 hover:bg-[#eeeeee] dark:hover:bg-slate-800 rounded-xl transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">quiz</span>
            <span className="font-medium text-sm">Ngân hàng đề thi</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 my-1 hover:bg-[#eeeeee] dark:hover:bg-slate-800 rounded-xl transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-medium text-sm">Kho tài liệu</span>
          </a>
          <a
            className="flex items-center gap-3 bg-[#005ea5] text-white rounded-xl px-4 py-3 mx-2 my-1 shadow-md translate-x-1 duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-medium text-sm">Báo cáo &amp; Thống kê</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 my-1 hover:bg-[#eeeeee] dark:hover:bg-slate-800 rounded-xl transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm">Cài đặt</span>
          </a>
        </div>
        <div className="px-4 py-4 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden">
              <img
                alt="Teacher"
                className="w-full h-full object-cover"
                data-alt="Teacher profile picture circular avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI8fpmsuYShuF4INtZsgy4ahvaxNgnZaWHf4CGHH_KUmHvVzIcUFKStMrDKKg0dXRdoxuwHNV2-amlzItfV35HTURHDMhrCj376618IVFXyogEVScpIklSF0TWg-yCxuZwjYPGJ-N_XcKuKVtFQQRYVi6iuiVMloL8MgnIJ6lzTIs4DmICpImW0UwHWBdwCdOk4YC8vctcoAy4ad_o1vmxpA56lxQTUMFtrdAZsb8Sg6Qn_D4O_OBdApxMTGBBdPZHsno4M7BApzs"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Giáo viên</p>
              <p className="text-[10px] text-slate-500 truncate">
                Hệ thống DHDedu
              </p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-3 w-full hover:bg-error-container/20 rounded-xl transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </nav>

      <main className="ml-64 min-h-screen">
        <TeacherHeader />

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-[24px] text-white flex flex-col justify-between h-48 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80 font-medium">
                    Trung bình điểm toàn khối
                  </p>
                  <h2 className="font-headline text-4xl font-black mt-1">
                    8.4 / 10
                  </h2>
                </div>
                <span className="material-symbols-outlined text-3xl opacity-50">
                  show_chart
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/10 w-fit px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                <span>Tăng 0.6 so với kỳ trước</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <p className="text-sm font-bold text-outline">
                  Tổng số sinh viên
                </p>
              </div>
              <h3 className="font-headline text-3xl font-black">1,248</h3>
              <p className="text-xs text-slate-500 mt-2">
                Đang theo học 12 lớp
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <p className="text-sm font-bold text-outline">
                  Tỷ lệ chuyên cần
                </p>
              </div>
              <h3 className="font-headline text-3xl font-black">94.2%</h3>
              <p className="text-xs text-secondary font-bold mt-2">
                Vượt chỉ tiêu 2%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-8 shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-xl font-bold">
                    Thống kê kết quả học tập
                  </h3>
                  <p className="text-sm text-slate-500">
                    So sánh hiệu suất giữa các lớp học
                  </p>
                </div>
                <select className="text-xs font-bold border-none bg-surface-container rounded-lg px-4 py-2 focus:ring-0">
                  <option>Học kỳ 1 - 2024</option>
                  <option>Học kỳ 2 - 2023</option>
                </select>
              </div>

              <div className="relative h-64 flex items-end gap-6 px-4">
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary-fixed group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp A1
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary-fixed group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp A2
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp B1
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary-fixed group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp B2
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary-fixed group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp C1
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary-fixed group-hover:bg-primary-container transition-colors rounded-t-xl"></div>
                  <span className="text-[10px] font-bold text-outline">
                    Lớp C2
                  </span>
                </div>

                <div className="absolute inset-0 border-b border-outline-variant/20 -z-10 flex flex-col justify-between">
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-outline-variant/10 w-full"></div>
                  <div className="border-t border-outline-variant/10 w-full"></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-surface-container-low rounded-[24px] p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    auto_awesome
                  </span>
                  <h3 className="font-headline text-lg font-bold">
                    Phân tích lỗi sai AI
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                  Dựa trên 450 bài kiểm tra gần nhất, AI phát hiện các lỗ hổng
                  kiến thức chính:
                </p>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-primary">
                        Hình học không gian
                      </span>
                      <span className="text-xs font-bold text-error">
                        42% lỗi
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-error h-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Ghi chú: Đa số nhầm lẫn giữa tính diện tích và thể tích.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-primary">
                        Tích phân &amp; Đạo hàm
                      </span>
                      <span className="text-xs font-bold text-error">
                        28% lỗi
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-error h-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Ghi chú: Lỗi quy tắc chuỗi phổ biến ở lớp A2.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-primary">
                        Phương trình lượng giác
                      </span>
                      <span className="text-xs font-bold text-error">
                        15% lỗi
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-error h-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-8 shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-xl font-bold">
                  Xếp hạng sinh viên
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    Điểm số
                  </button>
                  <button className="px-4 py-1.5 text-slate-400 text-xs font-bold rounded-full hover:bg-slate-50 transition-colors">
                    Độ tích cực
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-4 font-bold">Sinh viên</th>
                      <th className="pb-4 font-bold">Lớp</th>
                      <th className="pb-4 font-bold">Điểm TB</th>
                      <th className="pb-4 font-bold">Tích cực</th>
                      <th className="pb-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body">
                    <tr className="border-b border-outline-variant/5">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-[10px]">
                          NA
                        </div>
                        <span className="font-bold">Nguyễn Văn An</span>
                      </td>
                      <td className="py-4 text-slate-600">Lớp A1</td>
                      <td className="py-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">
                          9.8
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-0.5">
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-primary hover:underline font-bold text-xs">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/5">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-[10px]">
                          LH
                        </div>
                        <span className="font-bold">Lê Minh Hoàng</span>
                      </td>
                      <td className="py-4 text-slate-600">Lớp B1</td>
                      <td className="py-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">
                          9.5
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-0.5">
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-primary hover:underline font-bold text-xs">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/5">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-[10px]">
                          PT
                        </div>
                        <span className="font-bold">Phạm Thảo Vy</span>
                      </td>
                      <td className="py-4 text-slate-600">Lớp A2</td>
                      <td className="py-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold">
                          9.2
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-0.5">
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star
                          </span>
                          <span className="material-symbols-outlined text-[14px] text-edu-orange">
                            star_half
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-primary hover:underline font-bold text-xs">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
                <h4 className="font-bold text-sm mb-4">Gửi thông báo nhanh</h4>
                <textarea
                  className="w-full text-xs bg-surface-container border-none rounded-xl focus:ring-primary p-4 h-24 mb-4 font-body"
                  placeholder="Nhập nội dung cần thông báo cho học sinh có kết quả kém..."
                ></textarea>
                <button className="w-full bg-secondary text-white py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    send
                  </span>
                  Gửi cho toàn bộ
                </button>
              </div>
              <div className="bg-primary-fixed p-6 rounded-[24px] border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary">
                    calendar_month
                  </span>
                  <h4 className="font-bold text-sm text-on-primary-fixed">
                    Kế hoạch báo c��o kế tiếp
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Báo cáo giữa kỳ</span>
                    <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded text-primary font-bold">
                      15/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      Đánh giá tháng 10
                    </span>
                    <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded text-primary font-bold">
                      30/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-primary to-primary-container text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform glass border border-white/20 z-50">
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
      </button>
    </div>
  );
};

export default BaoCaoThongKeGiaoVien;
