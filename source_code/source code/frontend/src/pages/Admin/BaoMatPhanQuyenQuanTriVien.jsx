import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

const BaoMatPhanQuyenQuanTriVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 min-h-screen flex flex-col">
        <AdminHeader />

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Vai trò &amp; Quyền hạn
              </h1>
              <p className="text-slate-500 mt-1">
                Cấu hình chi tiết khả năng truy cập và bảo mật hệ thống DHDedu
              </p>
            </div>
            <button className="bg-gradient-to-br from-[#1B8EF2] to-[#0077cf] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#1B8EF2]/20 hover:scale-[1.02] active:scale-95 transition-all">
              <span className="material-symbols-outlined">add</span>
              Tạo Vai trò mới
            </button>
          </div>

          <div className="flex gap-1 p-1 bg-surface-container rounded-2xl w-fit">
            <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-[#1B8EF2] shadow-sm">
              Danh sách Vai trò
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
              Phân quyền Chi tiết
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
              Thiết lập Bảo mật
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] hover:shadow-xl transition-shadow border border-slate-50 flex flex-col">
              <div className="w-12 h-12 bg-primary-fixed rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#1B8EF2]">
                  admin_panel_settings
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Super Admin</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1">
                Toàn quyền kiểm soát hệ thống, quản lý người dùng và cấu hình
                bảo mật.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-[#1B8EF2] bg-[#1B8EF2]/10 px-3 py-1 rounded-full">
                  3 Người dùng
                </span>
                <button className="text-slate-400 hover:text-[#1B8EF2] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] hover:shadow-xl transition-shadow border border-slate-50 flex flex-col">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-orange-600">
                  school
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Giáo viên</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1">
                Quản lý lớp học, ngân hàng đề thi, chấm bài và tương tác với
                sinh viên.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  124 Người dùng
                </span>
                <button className="text-slate-400 hover:text-[#1B8EF2] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] hover:shadow-xl transition-shadow border border-slate-50 flex flex-col">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-purple-600">
                  group
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Sinh viên</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1">
                Tham gia khóa học, làm bài thi, nộp bài tập và xem kết quả học
                tập cá nhân.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  2,580 Người dùng
                </span>
                <button className="text-slate-400 hover:text-[#1B8EF2] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0px_12px_32px_rgba(0,28,56,0.04)] hover:shadow-xl transition-shadow border border-slate-50 flex flex-col">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-teal-600">
                  support_agent
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Trợ giảng</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1">
                Hỗ trợ giáo viên chấm bài, quản lý điểm số và giải đáp thắc mắc
                cho sinh viên.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  45 Người dùng
                </span>
                <button className="text-slate-400 hover:text-[#1B8EF2] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0px_12px_32px_rgba(0,28,56,0.04)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Phân quyền Chi tiết
                  </h2>
                  <p className="text-sm text-slate-500">
                    Cấu hình hành động cho vai trò{" "}
                    <span className="font-bold text-slate-700">Giáo viên</span>
                  </p>
                </div>
                <button className="text-[#1B8EF2] text-sm font-bold flex items-center gap-1 hover:underline">
                  Chọn tất cả{" "}
                  <span className="material-symbols-outlined text-sm">
                    done_all
                  </span>
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                      <th className="pb-4 pr-4">Tính năng</th>
                      <th className="pb-4 px-4 text-center">Xem</th>
                      <th className="pb-4 px-4 text-center">Tạo</th>
                      <th className="pb-4 px-4 text-center">Sửa</th>
                      <th className="pb-4 px-4 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-blue-600">
                              class
                            </span>
                          </div>
                          <span className="font-semibold text-slate-700">
                            Quản lý lớp học
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-emerald-600">
                              database
                            </span>
                          </div>
                          <span className="font-semibold text-slate-700">
                            Ngân hàng đề thi
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-orange-600">
                              edit_note
                            </span>
                          </div>
                          <span className="font-semibold text-slate-700">
                            Chấm bài trực tuyến
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                    <tr className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-indigo-600">
                              psychology
                            </span>
                          </div>
                          <span className="font-semibold text-slate-700">
                            Cấu hình AI Tutor
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          checked=""
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          className="w-5 h-5 rounded border-slate-300 text-[#1B8EF2] focus:ring-[#1B8EF2]"
                          type="checkbox"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-surface-container transition-colors">
                  Hủy bỏ
                </button>
                <button className="px-6 py-2 rounded-xl font-bold bg-[#1B8EF2] text-white hover:opacity-90 transition-opacity">
                  Lưu thay đổi
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0px_12px_32px_rgba(0,28,56,0.04)] h-fit">
              <h2 className="text-xl font-bold tracking-tight mb-6">
                Thiết lập Bảo mật
              </h2>
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">
                      Xác thực 2 lớp (2FA)
                    </h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      Yêu cầu mã từ ứng dụng xác thực khi đăng nhập.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked=""
                      className="sr-only peer"
                      type="checkbox"
                      value=""
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B8EF2]"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">
                      Giới hạn phiên đăng nhập
                    </h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      Chỉ cho phép 1 thiết bị đăng nhập cùng lúc.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" value="" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B8EF2]"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">
                      Đổi mật khẩu định kỳ
                    </h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      Bắt buộc thay đổi mật khẩu sau mỗi 90 ngày.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked=""
                      className="sr-only peer"
                      type="checkbox"
                      value=""
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B8EF2]"></div>
                  </label>
                </div>
              </div>
              <div className="mt-10 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <span className="material-symbols-outlined text-orange-600">
                  info
                </span>
                <p className="text-[12px] text-orange-800 leading-relaxed font-medium">
                  Việc thay đổi các thiết lập bảo mật này sẽ có hiệu lực ngay
                  lập tức đối với tất cả tài khoản trong hệ thống.
                </p>
              </div>
              <button className="w-full mt-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-colors">
                Cập nhật chính sách
              </button>
            </div>
          </div>
        </div>

        <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
          <span className="material-symbols-outlined text-2xl">security</span>
        </button>
      </main>

      <div className="fixed inset-0 bg-black/50 z-40 hidden"></div>
    </div>
  );
};

export default BaoMatPhanQuyenQuanTriVien;
