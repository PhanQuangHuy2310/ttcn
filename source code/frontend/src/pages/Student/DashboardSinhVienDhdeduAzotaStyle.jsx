import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const DashboardSinhVienDhdeduAzotaStyle = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="ml-64 min-h-screen p-8">
        <StudentHeader />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-xl">
              <div className="relative z-10 flex justify-between items-center">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="material-symbols-outlined fill text-[#F59E0B]"
                      data-icon="auto_awesome"
                    >
                      auto_awesome
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase opacity-90">
                      AI Gợi ý học tập
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-headline mb-2">
                    Cải thiện kỹ năng Giải thuật
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Dựa trên kết quả bài kiểm tra tuần trước, AI gợi ý bạn nên
                    dành thêm 30 phút để ôn tập lại phần Đồ thị (Graph theory)
                    vào chiều nay.
                  </p>
                  <button className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform active:opacity-80">
                    Xem tài liệu gợi ý
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center transform rotate-12">
                    <span
                      className="material-symbols-outlined text-6xl opacity-50"
                      data-icon="psychology"
                    >
                      psychology
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-secondary-container/20 rounded-full blur-2xl"></div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold font-headline">
                  Lớp học của tôi
                </h3>
                <a
                  className="text-primary text-sm font-semibold hover:underline"
                  href="#"
                >
                  Xem tất cả
                </a>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-primary"
                        data-icon="code"
                      >
                        code
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      Đang diễn ra
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    Cấu trúc dữ liệu &amp; Giải thuật
                  </h4>
                  <p className="text-tertiary text-xs mb-4">
                    GV: TS. Lê Quang Đạo
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Tiến độ hoàn thành</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full w-[75%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-secondary"
                        data-icon="architecture"
                      >
                        architecture
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      Đang diễn ra
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    Thiết kế UI/UX Nâng cao
                  </h4>
                  <p className="text-tertiary text-xs mb-4">
                    GV: ThS. Nguyễn Linh Anh
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Tiến độ hoàn thành</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-secondary h-full w-[40%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-tertiary"
                        data-icon="database"
                      >
                        database
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">
                      Sắp bắt đầu
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    Hệ quản trị Cơ sở dữ liệu
                  </h4>
                  <p className="text-tertiary text-xs mb-4">
                    GV: TS. Trần Văn Bình
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Tiến độ hoàn thành</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-slate-300 h-full w-0 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[#F59E0B]"
                        data-icon="history_edu"
                      >
                        history_edu
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      Đang diễn ra
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    Triết học Mác - Lênin
                  </h4>
                  <p className="text-tertiary text-xs mb-4">
                    GV: TS. Mai Thu Hà
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Tiến độ hoàn thành</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div className="bg-[#F59E0B] h-full w-[92%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="col-span-4 space-y-8">
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)]">
              <h3 className="text-lg font-bold font-headline mb-6">
                Thống kê nhanh
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-primary text-xl"
                      data-icon="trending_up"
                    >
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary font-medium">
                      Điểm trung bình học kỳ
                    </p>
                    <p className="text-lg font-bold">3.85 / 4.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-secondary text-xl"
                      data-icon="assignment_turned_in"
                    >
                      assignment_turned_in
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary font-medium">
                      Bài tập đã hoàn thành
                    </p>
                    <p className="text-lg font-bold">24 / 28</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[#F59E0B] text-xl"
                      data-icon="schedule"
                    >
                      schedule
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary font-medium">
                      Giờ học tuần này
                    </p>
                    <p className="text-lg font-bold">18.5 Giờ</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)]">
              <h3 className="text-lg font-bold font-headline mb-4">
                Bài tập sắp hết hạn
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-error">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-bold leading-tight">
                      Thiết kế Prototype ứng dụng Banking
                    </h5>
                    <span
                      className="material-symbols-outlined text-error text-lg"
                      data-icon="error_outline"
                    >
                      error_outline
                    </span>
                  </div>
                  <p className="text-[11px] text-tertiary mb-3">
                    Môn: Thiết kế UI/UX Nâng cao
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-error px-2 py-0.5 bg-error/10 rounded">
                      Hết hạn trong 4 giờ
                    </span>
                    <button className="text-primary text-xs font-bold hover:underline">
                      Nộp bài
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-[#F59E0B]">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-bold leading-tight">
                      Giải thuật Dijkstra &amp; Bellman-Ford
                    </h5>
                    <span
                      className="material-symbols-outlined text-[#F59E0B] text-lg"
                      data-icon="warning"
                    >
                      warning
                    </span>
                  </div>
                  <p className="text-[11px] text-tertiary mb-3">
                    Môn: Cấu trúc dữ liệu &amp; Giải thuật
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#F59E0B] px-2 py-0.5 bg-orange-50 rounded">
                      Hết hạn: Ngày mai
                    </span>
                    <button className="text-primary text-xs font-bold hover:underline">
                      Làm bài
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-bold leading-tight">
                      Tiểu luận Triết học Phương Đông
                    </h5>
                  </div>
                  <p className="text-[11px] text-tertiary mb-3">
                    Môn: Triết học Mác - Lênin
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                      Hết hạn: 3 ngày nữa
                    </span>
                    <button className="text-primary text-xs font-bold hover:underline">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 text-primary text-sm font-bold bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
                Xem tất cả bài tập
              </button>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-headline">
                  Lịch học hôm nay
                </h3>
                <span className="text-xs font-bold text-primary">
                  T2, 24 Tháng 5
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold">08:00</span>
                    <div className="w-0.5 flex-1 bg-surface-container mt-1"></div>
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-bold">
                      Cấu trúc dữ liệu &amp; Giải thuật
                    </p>
                    <p className="text-xs text-tertiary">Phòng A2 - 402</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold">13:30</span>
                    <div className="w-0.5 h-4 bg-surface-container mt-1"></div>
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-bold">Thiết kế UI/UX Nâng cao</p>
                    <p className="text-xs text-tertiary">Phòng Lab 3 - Tòa C</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-[60]">
        <button className="w-14 h-14 glass-panel border border-white/40 shadow-2xl rounded-2xl flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all group overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span
            className="material-symbols-outlined text-3xl font-variation-settings-'FILL'-1"
            data-icon="smart_toy"
          >
            smart_toy
          </span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSinhVienDhdeduAzotaStyle;
