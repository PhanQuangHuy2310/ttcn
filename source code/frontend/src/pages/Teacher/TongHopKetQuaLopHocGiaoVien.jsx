import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const TongHopKetQuaLopHocGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <TeacherHeader />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <nav className="flex items-center gap-2 text-sm text-tertiary mb-2">
                <span>Lớp học</span>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <span>IT3011</span>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <span className="text-primary font-medium">
                  Kết quả chi tiết
                </span>
              </nav>
              <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
                Kết quả bài kiểm tra: Cấu trúc dữ liệu &amp; Giải thuật - Lớp
                IT3011
              </h1>
              <p className="text-tertiary">
                Cập nhật lần cuối: 10:45 - Hôm nay
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-low transition-all font-medium text-sm">
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Xuất file Excel
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-medium text-sm">
                <span className="material-symbols-outlined text-sm">send</span>
                Gửi thông báo cho lớp
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary-fixed rounded-xl text-primary">
                  <span className="material-symbols-outlined">equalizer</span>
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +0.4 so với bài trước
                </span>
              </div>
              <p className="text-sm text-tertiary mb-1">Điểm trung bình lớp</p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                8.2
                <span className="text-sm text-tertiary font-normal">/10</span>
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-secondary-fixed rounded-xl text-secondary">
                  <span className="material-symbols-outlined">task_alt</span>
                </div>
                <div className="w-12 h-1.5 bg-surface-container rounded-full mt-3">
                  <div className="w-[98%] h-full bg-secondary rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-tertiary mb-1">Tỷ lệ hoàn thành</p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                98%
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-tertiary-fixed rounded-xl text-tertiary">
                  <span className="material-symbols-outlined">
                    workspace_premium
                  </span>
                </div>
              </div>
              <p className="text-sm text-tertiary mb-1">
                Số điểm giỏi (&gt;8.5)
              </p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">
                15{" "}
                <span className="text-sm text-tertiary font-normal">
                  sinh viên
                </span>
              </h3>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-error-container/40 rounded-xl text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
              </div>
              <p className="text-sm text-tertiary mb-1">
                Số điểm cần chú ý (&lt;5.0)
              </p>
              <h3 className="text-2xl font-bold font-headline text-error">
                3{" "}
                <span className="text-sm text-tertiary font-normal">
                  sinh viên
                </span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-bold font-headline text-on-surface">
                  Biểu đồ Phân bổ điểm số
                </h4>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                    Sinh viên
                  </span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-surface-container mb-2">
                <div className="flex-1 bg-surface-container-low rounded-t-lg relative group h-[15%]">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    2 SV
                  </div>
                </div>
                <div className="flex-1 bg-surface-container-low rounded-t-lg relative group h-[10%]"></div>
                <div className="flex-1 bg-surface-container-low rounded-t-lg relative group h-[20%]"></div>
                <div className="flex-1 bg-secondary-container rounded-t-lg relative group h-[45%]"></div>
                <div className="flex-1 bg-primary rounded-t-lg relative group h-[85%]">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    18 SV
                  </div>
                </div>
                <div className="flex-1 bg-primary rounded-t-lg relative group h-[60%]"></div>
                <div className="flex-1 bg-primary-container rounded-t-lg relative group h-[40%]"></div>
              </div>
              <div className="flex justify-between px-4 text-[10px] text-tertiary font-medium">
                <span className="flex-1 text-center">0-2</span>
                <span className="flex-1 text-center">2-4</span>
                <span className="flex-1 text-center">4-5</span>
                <span className="flex-1 text-center">5-7</span>
                <span className="flex-1 text-center font-bold text-primary">
                  7-8.5
                </span>
                <span className="flex-1 text-center">8.5-9.5</span>
                <span className="flex-1 text-center">9.5-10</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-3xl border border-primary-fixed relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">
                  auto_awesome
                </span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  auto_awesome
                </span>
                <h4 className="text-lg font-bold font-headline text-on-surface">
                  Phân tích AI
                </h4>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Ưu điểm
                    </p>
                    <p className="text-xs text-tertiary leading-relaxed mt-1">
                      Lớp nắm vững kiến thức về{" "}
                      <strong>Danh sách liên kết</strong> (92% chính xác).
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined text-sm">
                      lightbulb
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Cần cải thiện
                    </p>
                    <p className="text-xs text-tertiary leading-relaxed mt-1">
                      Cần ôn tập thêm về <strong>Độ phức tạp thuật toán</strong>{" "}
                      (chỉ 55% hiểu đúng).
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <span className="material-symbols-outlined text-sm">
                      person_alert
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Cảnh báo
                    </p>
                    <p className="text-xs text-tertiary leading-relaxed mt-1">
                      <strong>3 sinh viên</strong> có dấu hiệu sa sút cần hỗ trợ
                      riêng.
                    </p>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl bg-white text-primary text-xs font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all">
                  Xem chi tiết lỗi sai AI
                </button>
              </div>
            </div>
          </div>

          <section className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/5 overflow-hidden">
            <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-lg font-bold font-headline text-on-surface">
                Danh sách điểm số
              </h4>
              <div className="flex gap-2">
                <select className="text-xs border-outline-variant/30 rounded-lg focus:ring-primary focus:border-primary">
                  <option>Tất cả trạng thái</option>
                  <option>Đã chấm</option>
                  <option>Chưa chấm</option>
                </select>
                <select className="text-xs border-outline-variant/30 rounded-lg focus:ring-primary focus:border-primary">
                  <option>Sắp xếp: Điểm cao - thấp</option>
                  <option>Sắp xếp: Tên A-Z</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      MSSV
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      Họ tên
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      Điểm số
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      Thời gian làm bài
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      20210001
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary">
                          NT
                        </div>
                        <span className="text-sm font-semibold text-on-surface">
                          Nguyễn Thành Trung
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        9.5
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-tertiary">
                      42 phút 15 giây
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        Đã chấm
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      20210045
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-secondary">
                          PT
                        </div>
                        <span className="text-sm font-semibold text-on-surface">
                          Phạm Thu Hà
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        8.0
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-tertiary">
                      58 phút 10 giây
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        Đã chấm
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      20210112
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-tertiary">
                          LV
                        </div>
                        <span className="text-sm font-semibold text-on-surface">
                          Lê Văn Khoa
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-error">4.5</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-tertiary">
                      60 phút (Hết giờ)
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        Đã chấm
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-error">
                        <span className="material-symbols-outlined text-lg">
                          error_outline
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      20210204
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-tertiary">
                          BM
                        </div>
                        <span className="text-sm font-semibold text-on-surface">
                          Bùi Minh Anh
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-tertiary">
                        --
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-tertiary">
                      35 phút 00 giây
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                        Chưa chấm
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                        Chấm ngay
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-surface-container flex items-center justify-between">
              <p className="text-xs text-tertiary font-medium">
                Hiển thị 4/45 sinh viên
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-tertiary hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-tertiary hover:bg-surface-container transition-colors text-xs">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-tertiary hover:bg-surface-container transition-colors text-xs">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-tertiary hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-container-highest md:hidden flex justify-around py-3 px-2 z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined">class</span>
          <span className="text-[10px] font-medium">Lớp học</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-tertiary" href="#">
          <span className="material-symbols-outlined">quiz</span>
          <span className="text-[10px] font-medium">Đề thi</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-tertiary" href="#">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-medium">Báo cáo</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-tertiary" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">Cài đặt</span>
        </a>
      </nav>
    </div>
  );
};

export default TongHopKetQuaLopHocGiaoVien;
