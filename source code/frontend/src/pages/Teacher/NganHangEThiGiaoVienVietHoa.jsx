import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const NganHangEThiGiaoVienVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-72 min-h-screen pb-20">
        <TeacherHeader />

        <div className="px-8 pt-8 space-y-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    filter_list
                  </span>
                  Bộ lọc tìm kiếm
                </h3>
                <button className="text-primary text-xs font-bold hover:underline">
                  Đặt lại bộ lọc
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                    Môn học
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 focus:ring-2 focus:ring-primary/20">
                    <option>Tất cả môn học</option>
                    <option>Toán học</option>
                    <option>Vật lý</option>
                    <option>Hóa học</option>
                    <option>Tin học</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                    Khối lớp
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 focus:ring-2 focus:ring-primary/20">
                    <option>Tất cả khối</option>
                    <option>Khối 10</option>
                    <option>Khối 11</option>
                    <option>Khối 12</option>
                    <option>Đại học</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                    Độ khó
                  </label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl text-sm py-3 focus:ring-2 focus:ring-primary/20">
                    <option>Mọi mức độ</option>
                    <option>Cơ bản</option>
                    <option>Trung bình</option>
                    <option>Nâng cao</option>
                    <option>Chuyên sâu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-[#005ea5] to-[#0077cf] p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#f59e0b]">
                    auto_awesome
                  </span>
                  <span className="font-headline font-bold text-sm">
                    Gợi ý từ AI
                  </span>
                </div>
                <h4 className="text-lg font-bold font-headline leading-tight mb-2">
                  Đề thi ôn tập giữa kỳ 2
                </h4>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                  Dựa trên tiến độ bài giảng của bạn, AI gợi ý tạo đề thi trắc
                  nghiệm chương 4 &amp; 5.
                </p>
                <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                  Xem gợi ý chi tiết
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-9xl">
                psychology
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 border-b border-surface-container-high pb-px">
            <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm px-2">
              Đề thi của tôi (24)
            </button>
            <button className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-on-surface font-medium text-sm px-2">
              Đề thi cộng đồng (1.2k+)
            </button>
            <button className="pb-4 border-b-2 border-transparent text-slate-500 hover:text-on-surface font-medium text-sm px-2">
              Đề thi đã lưu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    functions
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      share
                    </span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                  Kiểm tra Giải tích 12 - Chương 1
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: GK12-MATH-001
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    format_list_numbered
                  </span>
                  <span className="text-xs font-medium">50 câu hỏi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    schedule
                  </span>
                  <span className="text-xs font-medium">90 phút</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">12/10/2023</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    signal_cellular_alt
                  </span>
                  <span className="text-xs font-medium text-secondary">
                    Nâng cao
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-surface-container-low hover:bg-secondary-fixed text-on-surface hover:text-secondary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>{" "}
                  Trộn đề AI
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-3xl">
                    science
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      share
                    </span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                  Vật lý 10 - Chuyển động biến đổi đều
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: PHY10-L1-02
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    format_list_numbered
                  </span>
                  <span className="text-xs font-medium">30 câu hỏi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    schedule
                  </span>
                  <span className="text-xs font-medium">45 phút</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">05/11/2023</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    signal_cellular_alt
                  </span>
                  <span className="text-xs font-medium text-on-tertiary-fixed-variant">
                    Cơ bản
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-surface-container-low hover:bg-secondary-fixed text-on-surface hover:text-secondary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>{" "}
                  Trộn đề AI
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">add</span>
              </div>
              <h4 className="font-headline font-bold text-base text-on-surface">
                Tạo đề thi mới ngay
              </h4>
              <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                Bắt đầu soạn thảo hoặc sử dụng AI để tạo đề nhanh chóng.
              </p>
              <button className="mt-6 bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
                Khám phá công cụ
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-3xl">
                    terminal
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      share
                    </span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                  Tin học - Cấu trúc điều kiện C++
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: CS101-QUIZ-04
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    format_list_numbered
                  </span>
                  <span className="text-xs font-medium">20 câu hỏi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    schedule
                  </span>
                  <span className="text-xs font-medium">30 phút</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">20/11/2023</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    signal_cellular_alt
                  </span>
                  <span className="text-xs font-medium text-secondary-container">
                    Trung bình
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-surface-container-low hover:bg-secondary-fixed text-on-surface hover:text-secondary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>{" "}
                  Trộn đề AI
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-3xl">
                    biotech
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      share
                    </span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                  Sinh học 11 - Hệ tuần hoàn ở Động vật
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: BIO11-CH3-01
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    format_list_numbered
                  </span>
                  <span className="text-xs font-medium">40 câu hỏi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    schedule
                  </span>
                  <span className="text-xs font-medium">60 phút</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">28/11/2023</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    signal_cellular_alt
                  </span>
                  <span className="text-xs font-medium text-secondary">
                    Nâng cao
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-surface-container-low hover:bg-secondary-fixed text-on-surface hover:text-secondary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>{" "}
                  Trộn đề AI
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <span className="material-symbols-outlined text-3xl">
                    history_edu
                  </span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      share
                    </span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-low rounded-full text-slate-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                  Ngữ văn 12 - Tác phẩm Người lái đò sông Đà
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề: LIT12-DA-05
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    format_list_numbered
                  </span>
                  <span className="text-xs font-medium">10 câu tự luận</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    schedule
                  </span>
                  <span className="text-xs font-medium">120 phút</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    calendar_today
                  </span>
                  <span className="text-xs font-medium">01/12/2023</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-sm opacity-60">
                    picture_as_pdf
                  </span>
                  <span className="text-xs font-bold text-error">
                    Đã xuất PDF
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-low hover:bg-primary-fixed text-on-surface hover:text-primary font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button className="flex-1 bg-surface-container-low hover:bg-error-container/20 text-error font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>{" "}
                  Xuất PDF
                </button>
              </div>
            </div>
          </div>

          <section className="mt-12 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-xl">
                Xu hướng đề thi tuần này
              </h3>
              <a
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
                href="#"
              >
                Xem tất cả{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              <div className="min-w-[280px] bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-surface-container">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  #1
                </div>
                <div>
                  <p className="text-sm font-bold truncate w-40">
                    Đề ôn thi THPT QG 2024
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    4.2k lượt tải
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-surface-container">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  #2
                </div>
                <div>
                  <p className="text-sm font-bold truncate w-40">
                    Toán 11 - Hình không gian
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    2.8k lượt tải
                  </p>
                </div>
              </div>
              <div className="min-w-[280px] bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-surface-container">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  #3
                </div>
                <div>
                  <p className="text-sm font-bold truncate w-40">
                    Tiếng Anh - Vocabulary Unit 1-5
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    1.9k lượt tải
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="group bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:w-44 transition-all duration-300 relative overflow-hidden">
          <span className="material-symbols-outlined text-2xl group-hover:hidden">
            contact_support
          </span>
          <div className="hidden group-hover:flex items-center gap-2 px-4 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">
              chat_bubble
            </span>
            <span className="text-sm font-bold font-headline">
              Hỗ trợ giáo viên
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NganHangEThiGiaoVienVietHoa;
