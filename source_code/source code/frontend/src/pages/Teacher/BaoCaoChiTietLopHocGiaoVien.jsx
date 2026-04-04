import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const BaoCaoChiTietLopHocGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black font-headline text-on-surface">
                Lớp 12A1 - Toán học
              </h2>
              <p className="text-on-surface-variant font-medium mt-1">
                Báo cáo chi tiết học kỳ 1 • Niên khóa 2023-2024
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-outline-variant/30 font-bold text-primary hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-xl">
                download
              </span>
              Xuất báo cáo PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 group hover:bg-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </span>
                <span className="text-xs font-bold text-green-600 group-hover:text-white">
                  +0.4%
                </span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-white/80 transition-colors">
                Điểm trung bình
              </p>
              <h3 className="text-3xl font-black font-headline mt-1 group-hover:text-white transition-colors">
                8.4
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 group hover:bg-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">task_alt</span>
                </span>
                <span className="text-xs font-bold text-blue-600 group-hover:text-white">
                  Ổn định
                </span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-white/80 transition-colors">
                Tỷ lệ hoàn thành
              </p>
              <h3 className="text-3xl font-black font-headline mt-1 group-hover:text-white transition-colors">
                96%
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 group hover:bg-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">trending_up</span>
                </span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-white/80 transition-colors">
                Điểm cao nhất
              </p>
              <h3 className="text-3xl font-black font-headline mt-1 group-hover:text-white transition-colors">
                10.0
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 group hover:bg-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    trending_down
                  </span>
                </span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-white/80 transition-colors">
                Điểm thấp nhất
              </p>
              <h3 className="text-3xl font-black font-headline mt-1 group-hover:text-white transition-colors">
                4.5
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/15">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="font-bold text-lg font-headline">
                    Phân bổ điểm số lớp học
                  </h4>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant bg-surface p-2 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                      Toán học
                    </span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-surface-container group-hover:bg-primary/20 rounded-t-lg transition-all h-[15%] relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        2
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">
                      0-4
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-surface-container group-hover:bg-primary/20 rounded-t-lg transition-all h-[30%] relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        5
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">
                      5-6
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary/40 group-hover:bg-primary/60 rounded-t-lg transition-all h-[65%] relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        14
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">
                      7-8
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary group-hover:bg-primary-container rounded-t-lg transition-all h-[85%] relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        18
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">
                      8-9
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary/80 group-hover:bg-primary rounded-t-lg transition-all h-[45%] relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        9
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">
                      9-10
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
                <div className="p-6 border-b border-surface-container">
                  <h4 className="font-bold text-lg font-headline">
                    Chi tiết học sinh
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Học sinh</th>
                        <th className="px-6 py-4">Điểm</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4">AI Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                              NL
                            </div>
                            <span className="font-bold text-sm">
                              Nguyễn Lâm
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-primary">
                          9.5
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                            Hoàn thành
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm italic text-slate-500">
                          Nắm vững kiến thức, tư duy tốt...
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                              TA
                            </div>
                            <span className="font-bold text-sm">Trần Anh</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-primary">
                          8.2
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                            Hoàn thành
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm italic text-slate-500">
                          Tiến bộ rõ rệt trong tuần qua.
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                              LM
                            </div>
                            <span className="font-bold text-sm">Lê Minh</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-primary">
                          4.5
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase">
                            Cần lưu ý
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm italic text-slate-500">
                          Hổng kiến thức phần logarit.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-3xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <span className="material-symbols-outlined text-3xl">
                    auto_awesome
                  </span>
                  <h4 className="font-black text-xl font-headline">
                    AI Phân tích
                  </h4>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <h5 className="text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-green-300 text-sm">
                        thumb_up
                      </span>
                      Điểm mạnh
                    </h5>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Lớp có tư duy giải toán nhanh, đặc biệt là phần hình học
                      không gian.
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <h5 className="text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-orange-300 text-sm">
                        warning
                      </span>
                      Điểm yếu
                    </h5>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Tỷ lệ sai sót trong các câu hỏi vận dụng cao về đại số vẫn
                      còn khoảng 30%.
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <h5 className="text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-blue-200 text-sm">
                        lightbulb
                      </span>
                      Đề xuất
                    </h5>
                    <ul className="text-sm text-white/80 space-y-2 list-disc pl-4">
                      <li>Tăng cường bài tập nhóm phần giải tích.</li>
                      <li>Phụ đạo thêm cho 3 học sinh nhóm dưới 5.0.</li>
                      <li>Sử dụng bộ đề ôn tập nâng cao tuần tới.</li>
                    </ul>
                  </div>
                </div>
                <button className="w-full mt-8 bg-white text-primary py-3 rounded-xl font-black text-sm hover:bg-slate-50 transition-colors">
                  Hỏi thêm AI về lớp học
                </button>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/15">
                <h4 className="font-bold mb-4 font-headline">
                  Chuyên cần hôm nay
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img
                      alt=""
                      className="inline-block h-10 w-10 rounded-full ring-4 ring-white"
                      data-alt="Student profile photo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPyL2NidlsFYD1QfxQdcKWAvB1WEwrhHE6oewifKHfxq-024Oz0uPCDScYxuFWt62pn6b0HfIHNkHjb8twAp4XtF1waAkgA7J15ys5S5MrshrxaLI_bUZHchEV39-yfeIcCNrm52hWshEPvBoBehDFuTeWMQucTz1u8YVNfCe6YP7SJxJBqSjK1fZExmHHrH6kclrQYQwFI_dmQSd0_J2CbzH2l0bQae3kNdZ0jdHK-yg_NCW9QpgNI3wHnFCt-rTiGSwLwt9czo"
                    />
                    <img
                      alt=""
                      className="inline-block h-10 w-10 rounded-full ring-4 ring-white"
                      data-alt="Student profile photo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhzvhjN1F8p-zX710hF_KsYcXMp8XxHoaG2xaA2zGJ572R9DlxZmp1mCsZHMI8X57nVADHmai8G8NmdagN4QRd3PgXfojSRTlFR9UIy-Eg2L3GK7upt1RtlB-mCkJSYpmwOwtAXUAD1ym4uSGAxltDszRJrKcLOCTeY0nXu8jj_l35vI_gq-O3x3jQfiPd8v125UeVcpRYgxY4TRHzCDudmvoxOGgSD9TADXIKHYc8RBnye4UHlDUYvH1O9uYaO8Ggy7HW_RtUyKI"
                    />
                    <img
                      alt=""
                      className="inline-block h-10 w-10 rounded-full ring-4 ring-white"
                      data-alt="Student profile photo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_qiqjV7mxShKqJkQBBBOb-cYtSZAkSo0RHlxg0XzJhQBNu8houiSGg_iLg9WcnEC3cvu3eyt0xBNAe4RIrR523PWhqT3tZKF3RXPO-GI7tW3NleYWYXkKx3qyTZJNZhjaUy4lavZ7nw-_CfgKSsJQsF4CkrEK-qcXkV5v4uisHPl4NZYlsFcJZIGJAKEYLhjaJBHMpmhyPNt-2jJgjPdX8nF9lUlCSRYNBV4coxvIOqcOtnb0UQcxXQazNBMD_TnpFgM8I2jrLOE"
                    />
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 text-xs font-bold text-slate-600 ring-4 ring-white">
                      +42
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    98% Hiện diện
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group relative">
          <span className="material-symbols-outlined text-2xl">chat</span>

          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Hỗ trợ giáo viên
          </span>
        </button>
      </div>
    </div>
  );
};

export default BaoCaoChiTietLopHocGiaoVien;
