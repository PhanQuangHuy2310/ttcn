import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const QuanLyNguoiDungQuanTriVien = () => {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "12,482",
      change: "+12%",
      changeClass: "text-green-600 bg-green-100",
      icon: "groups",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: "Hoạt động hôm nay",
      value: "3,120",
      change: "+5%",
      changeClass: "text-green-600 bg-green-100",
      icon: "bolt",
      iconClass: "bg-secondary/10 text-secondary",
    },
    {
      title: "Mới trong tuần",
      value: "428",
      change: "New",
      changeClass: "text-primary bg-primary-fixed",
      icon: "person_add",
      iconClass: "bg-edu-cam/10 text-edu-cam",
    },
    {
      title: "Chờ xác thực",
      value: "15",
      change: "Chờ",
      changeClass: "text-error bg-error-container",
      icon: "pending_actions",
      iconClass: "bg-error/10 text-error",
    },
  ];

  const users = [
    {
      id: 1,
      name: "Nguyễn Thị Mai Anh",
      email: "maianh.dhd@edu.vn",
      code: "SV2024001",
      role: "Sinh viên",
      roleClass: "bg-secondary/10 text-secondary",
      department: "K68-CNTT01",
      status: "Hoạt động",
      statusDot: "bg-green-500",
      statusTextClass: "text-green-700",
      lastLogin: "10 phút trước",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDZwGpyICKFbKVi7-Rjn7DrL1toKSQBr2Z42dEL7GXfJg9cL-9FYeAkZlLmkZczvZzidHiODZ61JRJF_whOzmlElAottEgxekw69jYcZ629fyAHvGc703exKdMXKzFHuBuu6Y8iXpDVxlM3thrqJBO3NZ2vxKH0DK-cQyx5cqx5dN1EW524tksL6bvmv2cVHWolPhvCkNX6XFwMckRF0sDEDjOzUBGcw3qxlHvYG8AfkxNxusU0qOT0Mn5rUkrAcXT1e2ahkMQwd1A",
    },
    {
      id: 2,
      name: "Phạm Văn Thành",
      email: "thanhpv.it@edu.vn",
      code: "GV100242",
      role: "Giảng viên",
      roleClass: "bg-primary/10 text-primary",
      department: "Khoa CNTT",
      status: "Hoạt động",
      statusDot: "bg-green-500",
      statusTextClass: "text-green-700",
      lastLogin: "2 giờ trước",
      avatarInitials: "PT",
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      email: "namlh.ta@edu.vn",
      code: "TA88291",
      role: "Trợ giảng",
      roleClass: "bg-tertiary/10 text-tertiary",
      department: "Trung tâm Ngoại ngữ",
      status: "Đang khóa",
      statusDot: "bg-error",
      statusTextClass: "text-error",
      lastLogin: "02/10/2023",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDlAfTqNGS0GelwaZmMbXUUAidKRTmGt-D4sI5H2mFdkaUBbdztyBz4cw9NMHNayEXOn_XDJWx58r8U-cYVnrhMg2xzJpiBnfFpISe-r9VUO3YNt8ga8W4JM8uYN1Z_U1FKfXQzBdgpWZfPX8MGfBRFAsM2Qyk_KgPfw7eOgbMlOa9g9tD1zJnl6kEy-r-PZSQr_c2Unmv0ep7WXkfAtAb-CEvvoB32N9ikbDGH16Pu400bRJJCXX0rBZXfdUfb8kWcm-to4m-XGGc",
    },
    {
      id: 4,
      name: "Trần Minh Quân",
      email: "quantm.dhd@edu.vn",
      code: "SV2024115",
      role: "Sinh viên",
      roleClass: "bg-secondary/10 text-secondary",
      department: "K68-KT02",
      status: "Chờ xác thực",
      statusDot: "bg-edu-cam",
      statusTextClass: "text-edu-cam",
      lastLogin: "Chưa từng",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBmnsVHRzX93N8mddMsVuoL8UGrgWiCENRXGLoZ6jONqI30J80jxg1aQ_jiNNcIV10xUW4SiCLXWoRdLzqR6fmXIfJa8kmiMtNzL_cXY-gBNhcXZHukcBqPBe6EFfqLAQRjh2OeNHFLkbBmZszdWeZsv75XOgTMyxGdFm9SmqqE2aI-8RXMIw_8OQKV6bh7aYSYa1i8eF_SBwMNswB3aIOo7h6IUxU6xSFHOaR-IOwKf7EH8rumYJHnTH3FE3nml56Fm2w8vWQ-RA",
    },
  ];

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <AdminSidebar />

      <AdminHeader />

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
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-outline-variant/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.iconClass}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.changeClass}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-tertiary text-xs font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-black font-headline">
                {stat.value}
              </h3>
            </div>
          ))}
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface-container-low/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all"
                          data-alt="Portrait avatar"
                          src={user.avatar}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.avatarInitials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-on-surface">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-tertiary">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-tertiary">
                    {user.code}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[11px] font-bold rounded-full ${user.roleClass}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-tertiary">
                    {user.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.statusDot}`}
                      ></span>
                      <span
                        className={`text-xs font-semibold ${user.statusTextClass}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-tertiary">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-tertiary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/10">
            <p className="text-xs text-tertiary">
              Hiển thị <span className="font-bold text-on-surface">1 - 10</span>{" "}
              trong <span className="font-bold text-on-surface">1,280</span>{" "}
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

export default QuanLyNguoiDungQuanTriVien;
