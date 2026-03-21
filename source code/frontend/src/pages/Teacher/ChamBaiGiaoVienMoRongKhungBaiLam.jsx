import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const ChamBaiGiaoVienMoRongKhungBaiLam = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen flex flex-col">
        <TeacherHeader />

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-64 bg-surface-container-low border-r border-outline-variant/5 flex flex-col flex-shrink-0">
            <div className="p-4 space-y-4">
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
                  data-icon="search"
                >
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Tìm..."
                  type="text"
                />
              </div>
              <div className="flex gap-1.5">
                <button className="flex-1 py-1.5 text-[11px] font-bold bg-primary text-white rounded-lg">
                  Chờ chấm
                </button>
                <button className="flex-1 py-1.5 text-[11px] font-medium text-on-surface-variant bg-surface-container-high rounded-lg hover:bg-surface-variant transition-colors">
                  Đã chấm
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
              <div className="px-3">
                <div className="flex items-center gap-2 p-2.5 bg-surface-container-lowest rounded-lg shadow-sm mb-2 border-l-4 border-primary">
                  <div className="relative flex-shrink-0">
                    <img
                      alt="Student avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOqSYos6MNbY7PvNTVIvi8E3Pn32_R7LYdDbIk6gdTOoOWW0Hgg5HDndQcZDyyGaiQrELthOSPTA0XqQLHFRsUGejteTA0z8ya9UKqo0l0hw3bq_aNse0qm1Q4vCoqpgkYOjJZp3V511pjOnzj_1zTugRc3ggPR5KFiWI4DMYyX3U_TeokgwNv198L1lHDzP1N0tI1ov4DLzTrjhML_qgc3WaeruUNFul9YPUV15_MiC4Kx-bi-de0fOzm5UzEJFsxhVIXvA5tog0"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      Nguyễn Văn An
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      MSSV: 202160123
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                    Đang chấm
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-2.5 hover:bg-surface-container rounded-lg transition-all cursor-pointer group">
                    <img
                      alt="Student avatar"
                      className="w-8 h-8 rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsFMbTsJ95slwHw8EcFPwuiy4GCn_CgxGShWBJI366jojJx3ujjW538qrFlrRePB8RGa7ElnRf0NR3n84spQylVA_VBSFHczF_DXx_zZ1_82APWKKPTn9b58xpu8rYjsnz8oNp5domm3LajoitwsWdI1TY2J8N1qykQ9bysrapbuxpyBHIeWgDIohwudNO6R08XxE4BcdSwTReEeD7rw3keBtgcKJCEOEL7uVnQzqHEJp5hhbkCMsCEGtDtGegso0C9b87I1cCMxU"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface-variant truncate group-hover:text-on-surface">
                        Lê Thị Mai
                      </p>
                      <p className="text-[10px] text-on-surface-variant/60">
                        MSSV: 202160456
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 hover:bg-surface-container rounded-lg transition-all cursor-pointer group">
                    <img
                      alt="Student avatar"
                      className="w-8 h-8 rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHzLzkEYQPOHlh2jgberWQIG9eBL7WQ8ZkeyaK64QbuBRmGZgeROXnR_SDaxyuAJPc1GmeCbvMu6daNDab838GOOoZ9L0yyC9LXdBPNPwpReIGverzzEjT3pbH9SEX7Qikiawfj_QSg11mrpTWS23bAsrhFZoP5sML5xyK-VWn9YAMn7x7AlAJ36lhYPnCUASqxWBkdy3BMI6dRHeRNqT-aTWRHsqhMwtyToSPQryyHkbyl0hH3J7H_duQvA-FVdlRF6aXwvGJ0XM"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface-variant truncate group-hover:text-on-surface">
                        Trần Minh Hoàng
                      </p>
                      <p className="text-[10px] text-on-surface-variant/60">
                        MSSV: 202160789
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1 bg-surface flex flex-col overflow-y-auto no-scrollbar">
            <div className="px-10 py-8 bg-surface-container-lowest border-b border-outline-variant/5">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary/5">
                    <img
                      alt="Student profile"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDINfj9IP38KdVooHPB7RBAzEHlYsTM5lXQRaP04AlytUm2h-NdyRbAykGxMDK48oKmHGqnf0-tFL9cAbT_7F8Mv9RTTa_khaUSlJourmKowsa9Ww8KrUbhVbXYURirD2kJwcOU3vG2TVyv5i3T07WbBrZqV5ShJGgQtagi-KL56KYQFb1yx1XuJCsRFZPrhkIvtIotyEKrD_p4_S4LmstQnvnXIjF0OTvNN2M45hioI2z5lsXCPircLZsUK3lpLqGZhjkZc6WH6a0"
                    />
                  </div>
                  <div>
                    <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
                      Nguyễn Văn An
                    </h2>
                    <p className="text-on-surface-variant font-medium flex items-center gap-2 mt-1">
                      <span
                        className="material-symbols-outlined text-base"
                        data-icon="school"
                      >
                        school
                      </span>
                      Lớp: Lớp A1 - Khoa Công nghệ Thông tin
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-surface-container px-5 py-3 rounded-xl text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Thời gian làm
                    </p>
                    <p className="font-bold text-lg text-on-surface">85 Phút</p>
                  </div>
                  <div className="bg-surface-container px-5 py-3 rounded-xl text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                      Hoàn thành
                    </p>
                    <p className="font-bold text-lg text-on-surface">5/5 Câu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-12 max-w-6xl mx-auto w-full">
              <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-sm border border-outline-variant/10">
                <div className="flex items-start gap-6 mb-8">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    01
                  </span>
                  <div>
                    <h3 className="font-headline font-bold text-2xl text-on-surface mb-3 leading-snug">
                      Trình bày khái niệm về Độ phức tạp thời gian (Time
                      Complexity) và cho ví dụ về thuật toán O(log n).
                    </h3>
                    <p className="text-base text-on-surface-variant leading-relaxed">
                      Yêu cầu: Nêu rõ định nghĩa, cách xác định và phân tích ví
                      dụ cụ thể.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-8 rounded-2xl border-l-4 border-primary/40">
                  <p className="text-xs font-bold text-primary uppercase mb-4 tracking-[0.2em]">
                    Bài làm của sinh viên
                  </p>
                  <div className="space-y-6 text-on-surface text-lg leading-[1.8] font-body">
                    <p>
                      Độ phức tạp thời gian là một đại lượng trong khoa học máy
                      tính dùng để mô tả khoảng thời gian cần thiết để một thuật
                      toán thực hiện xong, được tính theo số lượng các phép toán
                      cơ bản. Thông thường người ta sử dụng ký pháp Big O để
                      biểu diễn giới hạn trên của thời gian chạy.
                    </p>
                    <p>
                      Thuật toán có độ phức tạp O(log n) thường là các thuật
                      toán chia để trị. Ví dụ tiêu biểu nhất là Tìm kiếm nhị
                      phân (Binary Search). Trong mỗi bước, phạm vi tìm kiếm bị
                      giảm đi một nửa, dẫn đến số bước thực hiện tối đa là
                      log2(n).
                    </p>
                    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 my-8">
                      <img
                        alt="Algorithm diagram"
                        className="w-full max-h-[400px] object-contain rounded-lg"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4GoK4XnQTLPMczpmt6o278cHnEXSITWhKXtZ6Sp-HX15b2MGpHdUMzPyOTZOairNINWE-r7iXl67c-udTeX1rVr4yLGX0IJKn_rnGXoQAkLpGNKo4d62jrM9xbRDkAhN5xp6QRW1fpsF-uh3Sak1-9ZTCJk_rZsdziT4NjlZk44Ugwfvq25JlKdjp0X_oStLzHA4XNCb1HVeSfmcfuKxYrWg0Y_ZsxBWG9-URXqTaoxeyl6KA81eBKfV0jpybtuhMW--PEDELnlI"
                      />
                      <p className="text-sm text-center text-on-surface-variant mt-4 italic">
                        Hình 1: Mô phỏng quá trình chia đôi không gian tìm kiếm
                        của Binary Search
                      </p>
                    </div>
                    <p>
                      Ký hiệu O(log n) cho thấy rằng khi n tăng theo cấp số
                      nhân, thời gian thực thi chỉ tăng theo cấp số cộng. Đây là
                      một trong những độ phức tạp hiệu quả nhất cho các tập dữ
                      liệu lớn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/10 flex flex-col shadow-2xl flex-shrink-0">
            <div className="p-5 bg-gradient-to-br from-primary/5 to-[#D8D9F2]/20 border-b border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-primary text-xl"
                  data-icon="auto_awesome"
                >
                  auto_awesome
                </span>
                <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-wide">
                  AI Gợi ý chấm điểm
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-primary/10">
                  <span className="text-[11px] font-semibold text-on-surface-variant">
                    Khớp đáp án
                  </span>
                  <span className="text-lg font-black text-primary">85%</span>
                </div>
                <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                  <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
                    "Sinh viên trả lời đúng ý chính. Cần bổ sung thêm ví dụ số
                    lượng phần tử thực tế để rõ ràng hơn về log n."
                  </p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-all border border-primary/20">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="check_circle"
                  >
                    check_circle
                  </span>
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-5 overflow-y-auto no-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Điểm (Thang 10)
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low p-3 rounded-xl border-none text-2xl font-black text-primary focus:ring-2 focus:ring-primary/20 text-center"
                    step="0.1"
                    type="number"
                    value="8.5"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold text-xs">
                    / 10
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Nhận xét
                </label>
                <textarea
                  className="w-full bg-surface-container-low p-3 rounded-xl border-none text-xs focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                  placeholder="Nhập nhận xét..."
                  rows="5"
                >
                  Bài làm khá tốt, nắm vững lý thuyết. Cần bổ sung thêm ví dụ
                  minh họa bằng mã nguồn giả để bài làm chuyên nghiệp hơn.
                </textarea>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Tiêu chí
                </p>
                <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg">
                  <span className="text-[11px] font-medium">Kiến thức</span>
                  <span
                    className="material-symbols-outlined text-green-500 text-sm"
                    data-icon="check"
                  >
                    check
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg">
                  <span className="text-[11px] font-medium">Minh họa</span>
                  <span
                    className="material-symbols-outlined text-orange-400 text-sm"
                    data-icon="warning"
                  >
                    warning
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg">
                  <span className="text-[11px] font-medium">Trình bày</span>
                  <span
                    className="material-symbols-outlined text-green-500 text-sm"
                    data-icon="check"
                  >
                    check
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-surface-container-lowest border-t border-outline-variant/10">
              <button className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Tiếp: Lê Thị Mai
                <span
                  className="material-symbols-outlined text-sm"
                  data-icon="keyboard_arrow_right"
                >
                  keyboard_arrow_right
                </span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ChamBaiGiaoVienMoRongKhungBaiLam;
