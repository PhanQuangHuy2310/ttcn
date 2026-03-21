import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const ChiTietLopHocGiaoVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="flex-1 ml-64 p-8">
        <TeacherHeader />

        <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto">
          <button className="pb-4 px-2 text-primary font-bold border-b-2 border-primary whitespace-nowrap">
            Danh sách sinh viên
          </button>
          <button className="pb-4 px-2 text-slate-500 font-medium hover:text-primary transition-colors whitespace-nowrap">
            Bài tập &amp; Kiểm tra
          </button>
          <button className="pb-4 px-2 text-slate-500 font-medium hover:text-primary transition-colors whitespace-nowrap">
            Tài liệu
          </button>
          <button className="pb-4 px-2 text-slate-500 font-medium hover:text-primary transition-colors whitespace-nowrap">
            Thống kê lớp học
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8a00]">
                    auto_awesome
                  </span>
                  <h2 className="text-lg font-bold">AI Insights</h2>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-[#ffedcc] text-[#ff8a00] rounded-lg">
                  Cập nhật 2p trước
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-error/5 border border-error/10 rounded-2xl flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-error text-lg">
                      trending_down
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Kết quả giảm sút
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      3 sinh viên có điểm trung bình giảm &gt;15% trong tuần
                      qua.
                    </p>
                    <button className="text-xs font-bold text-error mt-2 underline">
                      Xem danh sách
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">
                      support_agent
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Cần hỗ trợ đặc biệt
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Nguyễn Văn A chưa hoàn thành 2 bài tập thiết kế gần nhất.
                    </p>
                    <button className="text-xs font-bold text-primary mt-2 underline">
                      Nhắn tin ngay
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-tertiary-fixed border border-tertiary-fixed-dim rounded-2xl flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-lg">
                      military_tech
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Nhóm tiềm năng
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Trần Thị B đạt điểm tuyệt đối trong đồ án Portfolio.
                    </p>
                    <button className="text-xs font-bold text-tertiary mt-2 underline">
                      Khen thưởng
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold mb-4">Tổng quan lớp</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                    Sĩ số
                  </p>
                  <p className="text-2xl font-black text-primary">42</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                    Điểm TB
                  </p>
                  <p className="text-2xl font-black text-primary">7.8</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                    Hoàn thành
                  </p>
                  <p className="text-2xl font-black text-primary">92%</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                    Vắng mặt
                  </p>
                  <p className="text-2xl font-black text-error">4</p>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 flex justify-between items-center bg-white">
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-xl border-none text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Tìm tên sinh viên..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    filter_list
                  </span>
                  Lọc
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    download
                  </span>
                  Xuất file
                </button>
              </div>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Sinh viên
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                      Tiến độ
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                      GPA
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Student"
                            className="w-full h-full object-cover"
                            data-alt="Male student profile portrait"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBsidkszw_mk6K6nDyHku4MohlqX_pRRxDibhCLZsmtEPnxaqlthytr5qsZb9ZyeActkbMNkjf_JFSlrxZqegn9jSEkN167b4NGEvfZk4bPXFHdeFzvUYWzyBbPpNf8kMujLo6_zqNS_Mk7B26V8oSEuDmbhE2CPVYWA8mKzS364Q_cVIumiuILG6dQRNki3ve9E-xFRi3HTxl-YQ417fhGtVcE6kbQpPZ_-MT9F4QiqYq_WC6Gi6hxRYue4914AMblTgx2rXId0I"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Lê Duy Hùng</p>
                          <p className="text-xs text-slate-500">ID: SV22001</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[120px] mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Hoàn thành</span>
                          <span className="text-primary">85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-bold text-sm">
                        8.5
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Student"
                            className="w-full h-full object-cover"
                            data-alt="Female student portrait"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpUZALP4iTaeZv_DQmMTGcwrYb7W2b04k83TgOcyknWz6wwSczay6aqy0vkvyihXyX74RDxt0UzEOfj_-PKAdUyfCgZAHJfU2vbWvtdeVVtYyRYeaO-y2E99zvj-EPXvR8poc7NIvqPrQnuPXKB26yvxkMmcHBoyMF_pJIUNBg9DDjJfSG5spaCfWkZujTZVL9yTicvdqzMan6SmBC4VFsvbIYIJk9EIhpaILcp0VT_kJtbezuoazQQO6Y6qEyKAmmYh5wb0JjgAk"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Trần Thị Bích</p>
                          <p className="text-xs text-slate-500">ID: SV22045</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[120px] mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Hoàn thành</span>
                          <span className="text-primary">100%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-bold text-sm">
                        9.2
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Student"
                            className="w-full h-full object-cover"
                            data-alt="Male student smiling profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn7VOg_OTcz-Z8B4WuXnvGvVvUz-I_LEW8StlKIK5MST6ODngL7COzK5Id7qwFILiP-safSSUn3sMHOvxfC2OO5UeIgaI__mupLZQ-_RzL54dMd4JuIL62CofBLepI3fXY60N_LQsCO8XGf1M9YNki5hRvXEiJ4z23fCZVtE9oZgJGe2ayuPplBt4xk9s5J2q6apFO0_z-DOlk96OYrJNAlUods1GSTo583ztMof8vBKIyRzpUdxBG_qNsWAtaiKs_jxYn77z-Rww"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Nguyễn Văn An</p>
                          <p className="text-xs text-error font-medium">
                            Cần hỗ trợ
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[120px] mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Hoàn thành</span>
                          <span className="text-error">45%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-error rounded-full"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-error-container text-error font-bold text-sm">
                        5.4
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Student"
                            className="w-full h-full object-cover"
                            data-alt="Student with glasses looking focused"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0lK2uTqTxGW5aVEPLlfOdy4rjU-WPigrgTEZpXcMeSdGS8I6lfbIz2Ub_1eJ7X-JwHp6Ui22Ai4KMzAcIwZrICAivTVCczSzjAwkyf77BqxAq4cTEUX1nWpYrzoaDBCWJITXW909ioliRYCNI_-I44IrQiEQZiVux9SQuwcJL4Rtia8XI-DiGmDM6rmzRs3KEznbCc8imMB3evRf6rlqPhttsjyoIAJX79Wb-XBRMmGv8297KuE3i9ELx2GRWykUEBamIacW4UHY"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Phạm Minh Tâm</p>
                          <p className="text-xs text-slate-500">ID: SV22012</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[120px] mx-auto">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Hoàn thành</span>
                          <span className="text-primary">72%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-bold text-sm">
                        7.9
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-white border-t border-slate-50 flex justify-between items-center">
              <p className="text-xs text-slate-500">
                Hiển thị 1-10 trong số 42 sinh viên
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-slate-400">
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white text-xs font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-xs font-bold">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-xs font-bold">
                  3
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-slate-400">
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform glass-panel">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default ChiTietLopHocGiaoVien;
