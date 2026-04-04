import React from "react";
import CommonSidebar from "../../components/CommonSidebar";
import CommonHeader from "../../components/CommonHeader";

const XemTruocBaiThiDhdeduVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <CommonHeader />

        <main className="flex-1 px-10 py-8 max-w-7xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-xs text-tertiary mb-6">
            <a className="hover:text-primary" href="#">
              Bảng điều khiển
            </a>
            <span
              className="material-symbols-outlined text-[14px]"
              data-icon="chevron_right"
            >
              chevron_right
            </span>
            <a className="hover:text-primary" href="#">
              Bài thi của tôi
            </a>
            <span
              className="material-symbols-outlined text-[14px]"
              data-icon="chevron_right"
            >
              chevron_right
            </span>
            <span className="text-on-surface font-semibold">
              Xem trước bài thi
            </span>
          </nav>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0px_12px_32px_rgba(0,28,56,0.04)] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      Giữa Kỳ
                    </span>
                    <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest">
                      Quan trọng
                    </span>
                  </div>
                  <h2 className="text-3xl font-headline font-bold text-on-surface mb-4 leading-tight">
                    Kiểm tra giữa kỳ môn Cấu trúc dữ liệu &amp; Giải thuật
                  </h2>
                  <div className="flex flex-wrap gap-6 text-sm text-tertiary">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-primary"
                        data-icon="school"
                      >
                        school
                      </span>
                      <span>
                        Học phần:{" "}
                        <strong className="text-on-surface">
                          IT3011 - 2023.2
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-primary"
                        data-icon="person"
                      >
                        person
                      </span>
                      <span>
                        Giảng viên:{" "}
                        <strong className="text-on-surface">
                          TS. Lê Mạnh Hùng
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1 bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.04)]">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary"
                      data-icon="analytics"
                    >
                      analytics
                    </span>
                    Cấu trúc đề thi
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-tertiary">Dễ (15 câu)</span>
                        <span className="text-on-surface">37.5%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-tertiary">
                          Trung bình (15 câu)
                        </span>
                        <span className="text-on-surface">37.5%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-tertiary">Khó (10 câu)</span>
                        <span className="text-on-surface">25.0%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.04)]">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-error"
                      data-icon="gavel"
                    >
                      gavel
                    </span>
                    Quy định phòng thi
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded bg-error/10 flex items-center justify-center flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-error text-[14px]"
                          data-icon="warning"
                        >
                          warning
                        </span>
                      </div>
                      <p className="text-xs text-tertiary leading-relaxed">
                        Không được phép chuyển tab hoặc trình duyệt khi đang làm
                        bài.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-primary text-[14px]"
                          data-icon="timer"
                        >
                          timer
                        </span>
                      </div>
                      <p className="text-xs text-tertiary leading-relaxed">
                        Hệ thống sẽ tự động nộp bài khi hết thời gian quy định.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span
                          className="material-symbols-outlined text-primary text-[14px]"
                          data-icon="camera_alt"
                        >
                          camera_alt
                        </span>
                      </div>
                      <p className="text-xs text-tertiary leading-relaxed">
                        Yêu cầu bật webcam trong suốt quá trình làm bài thi trực
                        tuyến.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)] border border-surface-container-high">
                <h3 className="text-sm font-bold text-on-surface mb-6 uppercase tracking-wider">
                  Thông tin chi tiết
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined"
                          data-icon="schedule"
                        >
                          schedule
                        </span>
                      </div>
                      <span className="text-sm font-medium text-tertiary">
                        Thời gian
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      60 phút
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined"
                          data-icon="quiz"
                        >
                          quiz
                        </span>
                      </div>
                      <span className="text-sm font-medium text-tertiary">
                        Câu hỏi
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      40 câu
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined"
                          data-icon="replay"
                        >
                          replay
                        </span>
                      </div>
                      <span className="text-sm font-medium text-tertiary">
                        Lần làm còn lại
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      01 / 01
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                    <span>BẮT ĐẦU LÀM BÀI</span>
                    <span
                      className="material-symbols-outlined"
                      data-icon="arrow_forward"
                    >
                      arrow_forward
                    </span>
                  </button>
                  <p className="text-[10px] text-center text-tertiary mt-4 px-4">
                    Bằng việc nh��n nút, bạn đồng ý với mọi quy định của phòng
                    thi ảo.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-secondary shadow-sm">
                  <span
                    className="material-symbols-outlined"
                    data-icon="support_agent"
                  >
                    support_agent
                  </span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-2">
                  Gặp sự cố kỹ thuật?
                </h4>
                <p className="text-xs text-tertiary mb-4">
                  Liên hệ ngay với bộ phận kỹ thuật để được hỗ trợ kịp thời.
                </p>
                <a
                  className="text-xs font-bold text-primary hover:underline"
                  href="#"
                >
                  Trung tâm trợ giúp
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-10 py-6 text-center">
          <p className="text-[11px] text-tertiary font-medium">
            © 2024 DHDedu - Hệ thống Đào tạo &amp; Khảo thí Trực tuyến
          </p>
        </footer>
      </div>
    </div>
  );
};

export default XemTruocBaiThiDhdeduVietHoa;
