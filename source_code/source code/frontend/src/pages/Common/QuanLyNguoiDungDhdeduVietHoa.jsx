import React from "react";
import CommonSidebar from "../../components/CommonSidebar";
import CommonHeader from "../../components/CommonHeader";

const QuanLyNguoiDungDhdeduVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />

      <CommonHeader />

      <main className="ml-64 p-8 min-h-screen">
        <div className="flex justify-between items-end mb-8">
          <div>
            <nav className="flex gap-2 text-xs text-tertiary mb-2">
              <span>Hệ thống</span>
              <span>/</span>
              <span className="text-primary font-medium">
                Quản lý Người dùng
              </span>
            </nav>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Quản lý Người dùng
            </h2>
          </div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Thêm người dùng mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-tertiary text-xs font-medium mb-1">
              Tổng người dùng
            </p>
            <h3 className="text-2xl font-black font-headline">12.482</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                +5%
              </span>
            </div>
            <p className="text-tertiary text-xs font-medium mb-1">
              Hoạt động hôm nay
            </p>
            <h3 className="text-2xl font-black font-headline">3.120</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-edu-cam/10 text-edu-cam rounded-lg">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                Mới
              </span>
            </div>
            <p className="text-tertiary text-xs font-medium mb-1">
              M��i trong tuần
            </p>
            <h3 className="text-2xl font-black font-headline">428</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error/10 text-error rounded-lg">
                <span className="material-symbols-outlined">
                  pending_actions
                </span>
              </div>
              <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
                Chờ
              </span>
            </div>
            <p className="text-tertiary text-xs font-medium mb-1">
              Chờ xác thực
            </p>
            <h3 className="text-2xl font-black font-headline">15</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl mb-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select className="appearance-none bg-surface-container border-none text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-primary/20 min-w-[140px]">
                  <option>Vai trò: Tất cả</option>
                  <option>Admin</option>
                  <option>Giảng viên</option>
                  <option>Sinh viên</option>
                  <option>Trợ giảng</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select className="appearance-none bg-surface-container border-none text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-primary/20 min-w-[160px]">
                  <option>Khoa/Phòng: Tất cả</option>
                  <option>CNTT</option>
                  <option>Kinh tế</option>
                  <option>Ngoại ngữ</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select className="appearance-none bg-surface-container border-none text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-primary/20 min-w-[140px]">
                  <option>Trạng thái: Tất cả</option>
                  <option>Đang hoạt động</option>
                  <option>Đang khóa</option>
                  <option>Chờ kích hoạt</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold text-xs hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Mã số
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Khoa / Lớp
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  Đăng nhập cuối
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-tertiary text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZwGpyICKFbKVi7-Rjn7DrL1toKSQBr2Z42dEL7GXfJg9cL-9FYeAkZlLmkZczvZzidHiODZ61JRJF_whOzmlElAottEgxekw69jYcZ629fyAHvGc703exKdMXKzFHuBuu6Y8iXpDVxlM3thrqJBO3NZ2vxKH0DK-cQyx5cqx5dN1EW524tksL6bvmv2cVHWolPhvCkNX6XFwMckRF0sDEDjOzUBGcw3qxlHvYG8AfkxNxusU0qOT0Mn5rUkrAcXT1e2ahkMQwd1A"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Nguyễn Thị Mai Anh
                      </p>
                      <p className="text-[11px] text-tertiary">
                        maianh.dhd@edu.vn
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-tertiary">
                  SV2024001
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-[11px] font-bold rounded-full">
                    Sinh viên
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">K68-CNTT01</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold text-green-700">
                      Hoạt động
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-tertiary">
                  10 phút trước
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      PT
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Phạm Văn Thành
                      </p>
                      <p className="text-[11px] text-tertiary">
                        thanhpv.it@edu.vn
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-tertiary">
                  GV100242
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                    Giảng viên
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">Khoa CNTT</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold text-green-700">
                      Hoạt động
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-tertiary">2 giờ trước</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlAfTqNGS0GelwaZmMbXUUAidKRTmGt-D4sI5H2mFdkaUBbdztyBz4cw9NMHNayEXOn_XDJWx58r8U-cYVnrhMg2xzJpiBnfFpISe-r9VUO3YNt8ga8W4JM8uYN1Z_U1FKfXQzBdgpWZfPX8MGfBRFAsM2Qyk_KgPfw7eOgbMlOa9g9tD1zJnl6kEy-r-PZSQr_c2Unmv0ep7WXkfAtAb-CEvvoB32N9ikbDGH16Pu400bRJJCXX0rBZXfdUfb8kWcm-to4m-XGGc"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Lê Hoàng Nam
                      </p>
                      <p className="text-[11px] text-tertiary">
                        namlh.ta@edu.vn
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-tertiary">
                  TA88291
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[11px] font-bold rounded-full">
                    Trợ giảng
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">
                  Trung tâm Ngoại ngữ
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    <span className="text-xs font-semibold text-error">
                      Đang khóa
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-tertiary">02/10/2023</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBmnsVHRzX93N8mddMsVuoL8UGrgWiCENRXGLoZ6jONqI30J80jxg1aQ_jiNNcIV10xUW4SiCLXWoRdLzqR6fmXIfJa8kmiMtNzL_cXY-gBNhcXZHukcBqPBe6EFfqLAQRjh2OeNHFLkbBmZszdWeZsv75XOgTMyxGdFm9SmqqE2aI-8RXMIw_8OQKV6bh7aYSYa1i8eF_SBwMNswB3aIOo7h6IUxU6xSFHOaR-IOwKf7EH8rumYJHnTH3FE3nml56Fm2w8vWQ-RA"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Trần Minh Quân
                      </p>
                      <p className="text-[11px] text-tertiary">
                        quantm.dhd@edu.vn
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-tertiary">
                  SV2024115
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-[11px] font-bold rounded-full">
                    Sinh viên
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">K68-KT02</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-edu-cam"></span>
                    <span className="text-xs font-semibold text-edu-cam">
                      Chờ xác thực
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-tertiary">Chưa từng</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/10">
            <p className="text-xs text-tertiary">
              Hiển thị <span className="font-bold text-on-surface">1 - 10</span>{" "}
              trong <span className="font-bold text-on-surface">1.280</span>{" "}
              người dùng
            </p>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-white text-tertiary transition-all">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-md shadow-primary/20">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-white text-tertiary text-xs font-semibold">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-white text-tertiary text-xs font-semibold">
                3
              </button>
              <div className="w-8 h-8 flex items-end justify-center text-tertiary">
                ...
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-white text-tertiary text-xs font-semibold">
                128
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-white text-tertiary transition-all">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuanLyNguoiDungDhdeduVietHoa;
