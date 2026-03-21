import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const NganHangCauHoiGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                Ngân hàng câu hỏi
              </h2>
              <p className="text-slate-500 font-medium">
                Quản lý và tổ chức hệ thống câu hỏi học liệu chuyên nghiệp.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-container text-white rounded-xl shadow-lg shadow-primary/20">
                  <span
                    className="material-symbols-outlined"
                    data-icon="auto_awesome"
                  >
                    auto_awesome
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">Gợi ý từ AI</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Tạo câu hỏi tự động từ văn bản hoặc tài liệu của bạn.
                  </p>
                  <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all shadow-sm">
                    Bắt đầu tạo với AI
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="min-w-[160px]">
                  <label className="block text-[10px] uppercase font-bold text-outline mb-1.5 ml-1">
                    Môn học
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 py-2.5 px-4 cursor-pointer">
                    <option>Tất cả môn học</option>
                    <option>Toán học</option>
                    <option>Vật lý</option>
                    <option>Tiếng Anh</option>
                  </select>
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-[10px] uppercase font-bold text-outline mb-1.5 ml-1">
                    Chương
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 py-2.5 px-4 cursor-pointer">
                    <option>Tất cả chương</option>
                    <option>Chương 1: Đạo hàm</option>
                    <option>Chương 2: Tích phân</option>
                  </select>
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-[10px] uppercase font-bold text-outline mb-1.5 ml-1">
                    Độ khó
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 py-2.5 px-4 cursor-pointer">
                    <option>Tất cả mức độ</option>
                    <option>Nhận biết</option>
                    <option>Thông hiểu</option>
                    <option>Vận dụng</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 sm:pt-0">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface font-bold text-sm rounded-xl hover:bg-surface-variant transition-all">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    data-icon="upload_file"
                  >
                    upload_file
                  </span>
                  Nhập từ Excel
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-container transition-all shadow-md shadow-primary/20">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    data-icon="add"
                  >
                    add
                  </span>
                  Thêm câu hỏi mới
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-20 text-center">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">
                    Nội dung câu hỏi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">
                    Đơn vị kiến thức
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">
                    Mức độ
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-primary text-center">
                    #001
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-md">
                      <p className="text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                        Cho hàm số f(x) liên tục trên đoạn [a, b]. Phát biểu nào
                        sau đây đúng?
                      </p>
                      <span className="text-[11px] font-medium text-slate-400">
                        Chương 1: Đạo hàm &amp; Ứng dụng
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold rounded-lg uppercase">
                      Trắc nghiệm
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-slate-600">
                      Định lý cơ bản
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-lg uppercase">
                      Nhận biết
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-primary-fixed rounded-lg text-primary transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="edit"
                        >
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 hover:bg-error-container rounded-lg text-error transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="delete"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-primary text-center">
                    #002
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-md">
                      <p className="text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                        Trình bày các bước giải bài toán cực trị bằng phương
                        pháp đạo hàm bậc hai.
                      </p>
                      <span className="text-[11px] font-medium text-slate-400">
                        Chương 1: Đạo hàm &amp; Ứng dụng
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold rounded-lg uppercase">
                      Tự luận
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-slate-600">
                      Cực trị hàm số
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg uppercase">
                      Thông hiểu
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-primary-fixed rounded-lg text-primary transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="edit"
                        >
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 hover:bg-error-container rounded-lg text-error transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="delete"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-primary text-center">
                    #003
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-md">
                      <p className="text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                        Tính thể tích khối tròn xoay được giới hạn bởi y=sin(x),
                        x=0, x=pi...
                      </p>
                      <span className="text-[11px] font-medium text-slate-400">
                        Chương 2: Tích phân
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold rounded-lg uppercase">
                      Trắc nghiệm
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-slate-600">
                      Ứng dụng tích phân
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 bg-orange-100 text-edu-orange text-[11px] font-bold rounded-lg uppercase">
                      Vận dụng
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-primary-fixed rounded-lg text-primary transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="edit"
                        >
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 hover:bg-error-container rounded-lg text-error transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="delete"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-primary text-center">
                    #004
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-md">
                      <p className="text-sm font-semibold text-on-surface line-clamp-1 mb-1">
                        Giải phương trình vi phân cấp 1 sau đây và tìm nghiệm
                        riêng thỏa mãn...
                      </p>
                      <span className="text-[11px] font-medium text-slate-400">
                        Chương 3: Phương trình vi phân
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold rounded-lg uppercase">
                      Tự luận
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-slate-600">
                      Phương trình cấp 1
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2.5 py-1 bg-orange-100 text-edu-orange text-[11px] font-bold rounded-lg uppercase">
                      Vận dụng
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-primary-fixed rounded-lg text-primary transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="edit"
                        >
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 hover:bg-error-container rounded-lg text-error transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="delete"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="px-8 py-5 flex items-center justify-between bg-surface-container-lowest border-t border-outline-variant/10">
              <p className="text-sm text-slate-500 font-medium">
                Hiển thị <span className="text-on-surface font-bold">1-10</span>{" "}
                trong số <span className="text-on-surface font-bold">245</span>{" "}
                câu hỏi
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                  disabled=""
                >
                  <span
                    className="material-symbols-outlined"
                    data-icon="chevron_left"
                  >
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-sm font-bold transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-sm font-bold transition-colors">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-sm font-bold transition-colors">
                  25
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container transition-colors">
                  <span
                    className="material-symbols-outlined"
                    data-icon="chevron_right"
                  >
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-primary p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
              <span
                className="material-symbols-outlined mb-4 opacity-70"
                data-icon="inventory_2"
              >
                inventory_2
              </span>
              <h4 className="text-sm font-medium opacity-80">
                Tổng số câu hỏi
              </h4>
              <p className="text-3xl font-black mt-1">1,245</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
              <span
                className="material-symbols-outlined text-green-500 mb-4"
                data-icon="verified"
              >
                verified
              </span>
              <h4 className="text-sm font-medium text-slate-500">
                Đã kiểm duyệt
              </h4>
              <p className="text-3xl font-black mt-1 text-on-surface">982</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
              <span
                className="material-symbols-outlined text-edu-orange mb-4"
                data-icon="pending"
              >
                pending
              </span>
              <h4 className="text-sm font-medium text-slate-500">
                Chờ phê duyệt
              </h4>
              <p className="text-3xl font-black mt-1 text-on-surface">15</p>
            </div>
            <div className="bg-tertiary-fixed p-6 rounded-3xl shadow-sm border border-outline-variant/10">
              <span
                className="material-symbols-outlined text-tertiary mb-4"
                data-icon="schedule"
              >
                schedule
              </span>
              <h4 className="text-sm font-medium text-tertiary">
                Cập nhật lần cuối
              </h4>
              <p className="text-lg font-bold mt-2 text-on-tertiary-fixed">
                Hôm nay, 10:45
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50 group">
        <div className="absolute bottom-full right-0 mb-4 scale-0 group-hover:scale-100 transition-all origin-bottom-right">
          <div className="bg-inverse-surface text-inverse-on-surface text-xs font-bold py-2 px-4 rounded-xl shadow-xl whitespace-nowrap mb-2">
            Trợ lý AI đang sẵn sàng
          </div>
        </div>
        <button className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl" data-icon="bolt">
            bolt
          </span>
        </button>
      </div>
    </div>
  );
};

export default NganHangCauHoiGiaoVien;
