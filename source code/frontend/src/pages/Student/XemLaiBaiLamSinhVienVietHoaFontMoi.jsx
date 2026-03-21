import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const XemLaiBaiLamSinhVienVietHoaFontMoi = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="flex min-h-screen">
        <StudentSidebar />

        <main className="flex-1 lg:ml-72 bg-surface min-h-screen pb-24">
          <div className="bg-white px-8 py-10 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Hệ thống DHDedu
                  </span>
                </div>
                <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">
                  Kiểm tra Giữa kỳ II - Môn Toán
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="schedule"
                    >
                      schedule
                    </span>{" "}
                    90 phút
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="task_alt"
                    >
                      task_alt
                    </span>{" "}
                    32/50 Câu đúng
                  </span>
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="grade"
                    >
                      grade
                    </span>{" "}
                    6.4 / 10.0
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#eeeeee] hover:bg-[#eeeeee] rounded-xl text-tertiary font-bold transition-all">
                <span className="material-symbols-outlined" data-icon="history">
                  history
                </span>
                Quay lại danh sách
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] overflow-hidden">
              <div className="p-8 border-b border-surface-container-low">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-bold">
                    Câu số 03 / 50
                  </span>
                  <span className="bg-primary/10 text-primary flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="check_circle"
                    >
                      check_circle
                    </span>
                    Trả lời đúng
                  </span>
                </div>
                <h2 className="text-lg font-headline font-bold text-on-surface leading-relaxed">
                  Cho hàm số y = ax³ + bx² + cx + d có đồ thị như hình vẽ bên.
                  Mệnh đề nào dưới đây đúng?
                </h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative p-5 rounded-xl border-2 border-primary-container bg-primary-fixed/20 flex items-center gap-4 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      A
                    </div>
                    <span className="text-on-surface font-medium">
                      a &gt; 0, b &lt; 0, c &gt; 0, d &lt; 0
                    </span>
                    <div className="absolute -top-3 -right-3">
                      <span
                        className="material-symbols-outlined text-primary bg-white rounded-full p-1"
                        data-icon="check_circle"
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div className="p-5 rounded-xl border-2 border-transparent bg-surface-container hover:bg-surface-container-high flex items-center gap-4 transition-all">
                    <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      B
                    </div>
                    <span className="text-tertiary font-medium">
                      a &lt; 0, b &gt; 0, c &lt; 0, d &gt; 0
                    </span>
                  </div>
                  <div className="p-5 rounded-xl border-2 border-transparent bg-surface-container hover:bg-surface-container-high flex items-center gap-4 transition-all">
                    <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      C
                    </div>
                    <span className="text-tertiary font-medium">
                      a &gt; 0, b &gt; 0, c &lt; 0, d &lt; 0
                    </span>
                  </div>
                  <div className="p-5 rounded-xl border-2 border-transparent bg-surface-container hover:bg-surface-container-high flex items-center gap-4 transition-all">
                    <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      D
                    </div>
                    <span className="text-tertiary font-medium">
                      a &gt; 0, b &lt; 0, c &lt; 0, d &gt; 0
                    </span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-tertiary">
                      Đáp án của bạn: <span className="text-primary">A</span>
                    </p>
                    <div className="h-4 w-[1px] bg-outline-variant"></div>
                    <p className="text-sm font-bold text-tertiary">
                      Đáp án đúng: <span className="text-primary">A</span>
                    </p>
                  </div>
                  <span className="text-primary-container text-xs font-bold uppercase tracking-widest">
                    + 0.2 điểm
                  </span>
                </div>
              </div>

              <div className="p-8 bg-[#D8D9F2]/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-lg">
                    <span
                      className="material-symbols-outlined"
                      data-icon="auto_awesome"
                    >
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-tertiary-fixed text-lg">
                      AI Giải thích chi tiết
                    </h3>
                    <p className="text-xs text-tertiary">
                      Phân tích dựa trên thuật toán DHD-A1
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-1 bg-primary rounded-full"></div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-primary text-base"
                          data-icon="lightbulb"
                        >
                          lightbulb
                        </span>
                        Phân tích bước làm
                      </h4>
                      <ul className="text-sm text-tertiary-container space-y-3 list-disc pl-4">
                        <li>
                          <strong>Bước 1:</strong> Quan sát nét cuối của đồ thị
                          hướng lên → Hệ số{" "}
                          <span className="text-on-surface font-semibold">
                            a &gt; 0
                          </span>
                          .
                        </li>
                        <li>
                          <strong>Bước 2:</strong> Đồ thị cắt trục tung tại điểm
                          nằm dưới trục hoành → Hệ số tự do{" "}
                          <span className="text-on-surface font-semibold">
                            d &lt; 0
                          </span>
                          .
                        </li>
                        <li>
                          <strong>Bước 3:</strong> Hàm số có hai điểm cực trị
                          trái dấu và |x_cực đại| &lt; |x_cực tiểu| → Phân tích
                          dấu của b và c thông qua công thức Vi-ét cho y'.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-1 bg-secondary rounded-full"></div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-secondary text-base"
                          data-icon="menu_book"
                        >
                          menu_book
                        </span>
                        Kiến thức liên quan
                      </h4>
                      <div className="bg-white/60 p-3 rounded-lg border border-white text-sm text-tertiary-container italic leading-relaxed">
                        "Dấu của các hệ số trong hàm đa thức bậc 3 phụ thuộc vào
                        hướng của nhánh cuối, vị trí giao điểm với trục Oy, và
                        tọa độ của các điểm cực trị."
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-1 bg-error rounded-full"></div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-error text-base"
                          data-icon="warning"
                        >
                          warning
                        </span>
                        Lỗi thường gặp
                      </h4>
                      <p className="text-sm text-tertiary-container">
                        Sinh viên thường nhầm lẫn dấu của <strong>b</strong> khi
                        không nhớ công thức x1 + x2 = -2b/3a. Lưu ý quan sát vị
                        trí tâm đối xứng của đồ thị.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button className="flex items-center gap-3 px-6 py-3 bg-white text-tertiary font-bold rounded-xl hover:bg-surface-container-high transition-all shadow-sm">
                <span
                  className="material-symbols-outlined"
                  data-icon="arrow_back"
                >
                  arrow_back
                </span>
                Câu trước
              </button>
              <div className="hidden sm:flex gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
                <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
                <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
              </div>
              <button className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">
                Câu tiếp theo
                <span
                  className="material-symbols-outlined"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-[#eeeeee]/50 dark:border-slate-800/50 shadow-[0px_-4px_16px_rgba(0,0,0,0.04)] rounded-t-[24px]">
        <button className="flex flex-col items-center justify-center bg-[#005ea5] text-white rounded-2xl px-6 py-2 scale-90">
          <span className="material-symbols-outlined" data-icon="edit_note">
            edit_note
          </span>
          <span className="text-[10px] font-medium font-label">Bài làm</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#585b6f] dark:text-slate-400 px-4 py-2 hover:text-[#005ea5]">
          <span className="material-symbols-outlined" data-icon="check_circle">
            check_circle
          </span>
          <span className="text-[10px] font-medium font-label">Đáp án</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#585b6f] dark:text-slate-400 px-4 py-2 hover:text-[#005ea5]">
          <span className="material-symbols-outlined" data-icon="auto_awesome">
            auto_awesome
          </span>
          <span className="text-[10px] font-medium font-label">AI Giải</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#585b6f] dark:text-slate-400 px-4 py-2 hover:text-[#005ea5]">
          <span className="material-symbols-outlined" data-icon="logout">
            logout
          </span>
          <span className="text-[10px] font-medium font-label">Thoát</span>
        </button>
      </nav>
    </div>
  );
};

export default XemLaiBaiLamSinhVienVietHoaFontMoi;
