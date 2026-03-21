import React from "react";
import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherHeader from "../../components/TeacherHeader";

const DanhSachMaTranEThiGiangVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="headline-font text-3xl font-extrabold text-on-surface mb-2">
                Danh sách Ma trận đề thi
              </h2>
              <p className="text-tertiary body-md">
                Quản lý và thiết kế các cấu trúc đề thi chuẩn hóa cho từng học
                kỳ.
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="add">
                add
              </span>
              Tạo ma trận mới
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center shadow-[0px_12px_32px_rgba(0,28,56,0.04)]">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider px-2">
              Lọc theo môn:
            </span>
            <button className="px-4 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-sm font-semibold">
              Tất cả
            </button>
            <button className="px-4 py-1.5 hover:bg-surface-container text-tertiary rounded-full text-sm font-medium transition-colors">
              Toán
            </button>
            <button className="px-4 py-1.5 hover:bg-surface-container text-tertiary rounded-full text-sm font-medium transition-colors">
              Lý
            </button>
            <button className="px-4 py-1.5 hover:bg-surface-container text-tertiary rounded-full text-sm font-medium transition-colors">
              Hóa
            </button>
            <button className="px-4 py-1.5 hover:bg-surface-container text-tertiary rounded-full text-sm font-medium transition-colors">
              Tiếng Anh
            </button>
            <button className="px-4 py-1.5 hover:bg-surface-container text-tertiary rounded-full text-sm font-medium transition-colors">
              Sinh học
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-fixed/30 text-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                  Toán học
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="edit"
                    >
                      edit
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Nhân bản"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="content_copy"
                    >
                      content_copy
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="delete"
                    >
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <h3 className="headline-font text-lg font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
                Ma trận Kiểm tra Giữa kỳ I - Khối 12
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Số câu hỏi
                  </p>
                  <p className="text-sm font-bold text-on-surface">50 câu</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Tổng điểm
                  </p>
                  <p className="text-sm font-bold text-on-surface">10.0</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Thời gian
                  </p>
                  <p className="text-sm font-bold text-on-surface">90 phút</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Cập nhật
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    12/10/2023
                  </p>
                </div>
              </div>
              <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors mt-auto">
                <span className="material-symbols-outlined" data-icon="bolt">
                  bolt
                </span>
                Tạo đề thi
              </button>
            </div>

            <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                  Vật Lý
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="edit"
                    >
                      edit
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Nhân bản"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="content_copy"
                    >
                      content_copy
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="delete"
                    >
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <h3 className="headline-font text-lg font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
                Ôn tập chương I: Dao động cơ
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Số câu hỏi
                  </p>
                  <p className="text-sm font-bold text-on-surface">40 câu</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Tổng điểm
                  </p>
                  <p className="text-sm font-bold text-on-surface">10.0</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Thời gian
                  </p>
                  <p className="text-sm font-bold text-on-surface">50 phút</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Cập nhật
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    05/10/2023
                  </p>
                </div>
              </div>
              <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors mt-auto">
                <span className="material-symbols-outlined" data-icon="bolt">
                  bolt
                </span>
                Tạo đề thi
              </button>
            </div>

            <div className="group bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                  Hóa Học
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="edit"
                    >
                      edit
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors"
                    title="Nhân bản"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="content_copy"
                    >
                      content_copy
                    </span>
                  </button>
                  <button
                    className="p-2 text-tertiary hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      data-icon="delete"
                    >
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <h3 className="headline-font text-lg font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
                Ma trận Đề khảo sát chất lượng Đợt 1
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Số câu hỏi
                  </p>
                  <p className="text-sm font-bold text-on-surface">50 câu</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Tổng điểm
                  </p>
                  <p className="text-sm font-bold text-on-surface">10.0</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Thời gian
                  </p>
                  <p className="text-sm font-bold text-on-surface">90 phút</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <p className="text-[10px] text-tertiary font-bold uppercase mb-1">
                    Cập nhật
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    28/09/2023
                  </p>
                </div>
              </div>
              <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors mt-auto">
                <span className="material-symbols-outlined" data-icon="bolt">
                  bolt
                </span>
                Tạo đề thi
              </button>
            </div>
          </div>

          <div className="mt-12 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-tertiary hover:bg-surface-container-high rounded-full transition-colors">
              <span
                className="material-symbols-outlined"
                data-icon="chevron_left"
              >
                chevron_left
              </span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-full">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface font-medium hover:bg-surface-container-high rounded-full transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface font-medium hover:bg-surface-container-high rounded-full transition-colors">
              3
            </button>
            <span className="px-2 text-tertiary font-medium">...</span>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface font-medium hover:bg-surface-container-high rounded-full transition-colors">
              12
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-tertiary hover:bg-surface-container-high rounded-full transition-colors">
              <span
                className="material-symbols-outlined"
                data-icon="chevron_right"
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <footer className="mt-12 px-8 py-6 border-t border-outline-variant/10 text-center">
          <p className="text-xs text-tertiary font-medium">
            © 2023 DHDedu. Hệ thống Quản lý Học thuật Toàn diện.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DanhSachMaTranEThiGiangVien;
