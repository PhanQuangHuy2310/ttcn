import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const NganHangEThiGiangVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="font-headline text-4xl font-extrabold text-slate-900 tracking-tight">
                Ngân hàng đề thi
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Quản lý và biên soạn bộ đề kiểm tra chất lượng cao.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <span
                  className="material-symbols-outlined"
                  data-icon="filter_list"
                >
                  filter_list
                </span>
                Lọc kết quả
              </button>
              <button className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition-all">
                <span
                  className="material-symbols-outlined"
                  data-icon="add_circle"
                >
                  add_circle
                </span>
                Tạo đề thi mới
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl gradient-ai text-white p-8 flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold mb-4">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="auto_awesome"
                  >
                    auto_awesome
                  </span>
                  DHDedu AI ENGINE
                </div>
                <h2 className="text-3xl font-headline font-bold mb-3">
                  Trộn đề thông minh với AI
                </h2>
                <p className="text-slate-300 max-w-md leading-relaxed">
                  Tự động hóa việc tạo đề thi dựa trên ma trận kiến thức, độ khó
                  và phân loại câu hỏi chỉ trong vài giây.
                </p>
              </div>
              <div className="mt-8 flex gap-4 relative z-10">
                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2">
                  Bắt đầu ngay
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl transition-colors">
                  Xem hướng dẫn
                </button>
              </div>
              <div className="absolute bottom-4 right-8 opacity-20 pointer-events-none">
                <span
                  className="material-symbols-outlined text-[120px]"
                  data-icon="psychology"
                >
                  psychology
                </span>
              </div>
            </div>
            <div className="bg-surface-bright rounded-3xl p-8 flex flex-col justify-center border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-500 font-semibold mb-1">
                  Tổng số đề thi
                </p>
                <h3 className="text-5xl font-headline font-black text-primary">
                  128
                </h3>
                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="trending_up"
                  >
                    trending_up
                  </span>
                  +12% so với tháng trước
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 text-slate-100">
                <span
                  className="material-symbols-outlined text-9xl"
                  data-icon="description"
                >
                  description
                </span>
              </div>
            </div>
          </section>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold">
                Tất cả
              </button>
              <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors">
                Đã xuất bản
              </button>
              <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors">
                Bản nháp
              </button>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Sắp xếp:</span>
              <button className="font-bold text-slate-900 flex items-center gap-1">
                Mới nhất
                <span
                  className="material-symbols-outlined text-xs"
                  data-icon="expand_more"
                >
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Tên đề thi
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Môn học
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                      Câu hỏi
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                          <span
                            className="material-symbols-outlined"
                            data-icon="article"
                          >
                            article
                          </span>
                        </div>
                        <div>
                          <p className="font-headline font-bold text-slate-900">
                            Kiểm tra giữa kỳ - Giải tích 1
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Cập nhật 2 giờ trước
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        Toán học
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        40
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        90 phút
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-black uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Đã xuất bản
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="visibility"
                          >
                            visibility
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-error transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                          <span
                            className="material-symbols-outlined"
                            data-icon="smart_toy"
                          >
                            smart_toy
                          </span>
                        </div>
                        <div>
                          <p className="font-headline font-bold text-slate-900">
                            Đề ôn tập AI &amp; Machine Learning
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Cập nhật hôm qua
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        Công nghệ
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        25
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        45 phút
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                        Nháp
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="visibility"
                          >
                            visibility
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-error transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <span
                            className="material-symbols-outlined"
                            data-icon="code"
                          >
                            code
                          </span>
                        </div>
                        <div>
                          <p className="font-headline font-bold text-slate-900">
                            Cuối kỳ - Cấu trúc dữ liệu &amp; Giải thuật
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Cập nhật 3 ngày trước
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        Khoa học MT
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        50
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        120 phút
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-black uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Đã xuất bản
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
                            data-icon="visibility"
                          >
                            visibility
                          </span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-error transition-colors">
                          <span
                            className="material-symbols-outlined text-xl"
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
            </div>

            <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
              <p className="text-xs text-slate-500">
                Hiển thị <span className="font-bold text-slate-900">1-10</span>{" "}
                trong tổng số{" "}
                <span className="font-bold text-slate-900">128</span> đề thi
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="chevron_left"
                  >
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="chevron_right"
                  >
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full gradient-ai text-white shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50 overflow-hidden">
            <span
              className="material-symbols-outlined text-2xl relative z-10"
              data-icon="auto_awesome"
            >
              auto_awesome
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default NganHangEThiGiangVien;
