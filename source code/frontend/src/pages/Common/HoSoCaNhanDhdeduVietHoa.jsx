import React from "react";
import CommonSidebar from "../../components/CommonSidebar";
import CommonHeader from "../../components/CommonHeader";

const HoSoCaNhanDhdeduVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonHeader />
      <div className="flex pt-16">
        <CommonSidebar />

        <main className="flex-1 lg:ml-64 min-h-screen bg-surface p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] overflow-hidden relative">
              <div className="h-48 w-full bg-gradient-to-r from-primary to-primary-container relative">
                <img
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                  data-alt="Ảnh nền flycam khuôn viên trường đại học"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMoFL2NRKYialvkvoKjNCI-1L5lDwUiLY9uoax2LzR_KeLFXmCMyYUYt6qLPT69KDGym5EuFZYpu4FJpTJRSOg60Hj1XDRKT6r3_geojG2HDGrdhqFGOh-NtmI7zLyoWxapZxb_vRtuzco0oN28gHfi2sMqnPh7fVOPnnxGD3N70bpTSV35wBuyGH212cVe5hZvpR8zXJXfM5tCt7Qk3uPALquugfhg3zK9yS5lW3H6Dn84mgxWyZwcFKrApBtlAXWCE48EcuBJOc"
                />
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all">
                  <span
                    className="material-symbols-outlined text-base"
                    data-icon="edit"
                  >
                    edit
                  </span>
                  Thay đổi ảnh bìa
                </button>
              </div>
              <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6 relative">
                <div className="relative group">
                  <img
                    alt="Ảnh đại diện lớn"
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                    data-alt="Ảnh chân dung sinh viên hiển thị lớn"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL4e0xNWApa_ivKPx3-iYfG8p1Q1WTciT0ncHzLqJ91tj9lnROrN5pqWutSsMR2H0jun-_oDQOIhBIhESa8S3Ek2hg2LLubvZAOEMyr8FSN2cmeeXXs_S7EONR_uLJ6Zx2p_b9wVhqtS1a-pRc6QQXNjUB4Rse6gXVpdKLo09_977Yk8y1KPHSCMPdu8IofZGabhjwkIpbabBtTw1y74KI-sacc2IvASyeFytuZLHDgFJ1C2-7jpBOqkKMfH18nm8bRQiRKA0QCsQ"
                  />
                  <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="photo_camera"
                    >
                      photo_camera
                    </span>
                  </button>
                </div>
                <div className="flex-1 mb-2">
                  <h1 className="text-2xl font-black text-on-surface tracking-tight">
                    Nguyễn Văn An
                  </h1>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        data-icon="verified"
                      >
                        verified
                      </span>
                      Sinh viên
                    </span>
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        data-icon="apartment"
                      >
                        apartment
                      </span>
                      Khoa Công nghệ Thông tin
                    </span>
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        data-icon="badge"
                      >
                        badge
                      </span>
                      MSSV: 21120001
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                    Lưu thay đổi
                  </button>
                </div>
              </div>

              <div className="px-8 border-t border-surface-container">
                <div className="flex gap-8">
                  <button className="py-4 text-primary font-bold border-b-2 border-primary text-sm flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="person"
                    >
                      person
                    </span>
                    Thông tin cá nhân
                  </button>
                  <button className="py-4 text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="route"
                    >
                      route
                    </span>
                    Lộ trình học tập
                  </button>
                  <button className="py-4 text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="lock"
                    >
                      lock
                    </span>
                    Bảo mật
                  </button>
                  <button className="py-4 text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-base"
                      data-icon="notifications"
                    >
                      notifications
                    </span>
                    Thông báo
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)]">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Thông tin liên lạc
                  </h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <input
                            className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                            type="text"
                            value="Nguyễn Văn An"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Email liên hệ
                        </label>
                        <input
                          className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                          type="email"
                          value="an.nv21@student.dhd.edu.vn"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Số điện thoại
                        </label>
                        <input
                          className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                          type="text"
                          value="0987 654 321"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Ngày sinh
                        </label>
                        <input
                          className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                          type="date"
                          value="2003-05-15"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Địa chỉ thường trú
                      </label>
                      <input
                        className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                        type="text"
                        value="Số 1 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. HCM"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        className="w-full bg-surface-container-low border-transparent focus:border-primary/40 focus:ring-0 rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
                        rows="4"
                      >
                        Em là sinh viên năm 3 khoa CNTT, đam mê lập trình Web và
                        Trí tuệ nhân tạo. Đang tìm kiếm cơ hội thực tập tại các
                        công ty công nghệ lớn.
                      </textarea>
                    </div>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-secondary to-[#004a79] rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-80">
                        Thẻ sinh viên điện tử
                      </h4>
                      <p className="text-xl font-black">DHDedu</p>
                    </div>
                    <span
                      className="material-symbols-outlined text-3xl opacity-50"
                      data-icon="contactless"
                    >
                      contactless
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-2 bg-white rounded-lg">
                      <div className="w-16 h-16 bg-slate-100 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-slate-800 text-4xl"
                          data-icon="qr_code_2"
                        >
                          qr_code_2
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">Nguyễn Văn An</p>
                      <p className="text-[10px] opacity-70">Khóa 2021 - 2025</p>
                      <p className="text-[10px] opacity-70">
                        IT21A - Khoa CNTT
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <p className="text-lg font-mono tracking-widest">
                      MSSV: 2112 0001
                    </p>
                    <div className="text-[8px] px-2 py-1 bg-white/20 rounded backdrop-blur-sm">
                      ĐANG HOẠT ĐỘNG
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] space-y-4">
                  <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-2">
                    Thống kê nhanh
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          data-icon="menu_book"
                        >
                          menu_book
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-medium">
                          Lớp học tham gia
                        </p>
                        <p className="font-bold text-primary">12 Lớp</p>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-slate-300"
                      data-icon="chevron_right"
                    >
                      chevron_right
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          data-icon="military_tech"
                        >
                          military_tech
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-medium">
                          Điểm GPA tích lũy
                        </p>
                        <p className="font-bold text-secondary">3.82 / 4.0</p>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-slate-300"
                      data-icon="chevron_right"
                    >
                      chevron_right
                    </span>
                  </div>
                  <div className="pt-4 border-t border-surface-container">
                    <p className="text-xs font-bold text-on-surface-variant uppercase mb-4">
                      Hoạt động học tập
                    </p>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-lg shadow-primary/40"></div>
                        <div>
                          <p className="text-sm font-semibold">
                            Hoàn thành bài tập Lab 5
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            2 giờ trước • Môn Lập trình Java
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-1.5"></div>
                        <div>
                          <p className="text-sm font-semibold">
                            Đã đăng ký Khóa học AI
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            Hôm qua • Hệ thống tự động
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                        <div>
                          <p className="text-sm font-semibold">
                            Cập nhật hồ sơ cá nhân
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            3 ngày trước
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full text-center py-2 mt-4 text-primary font-bold text-xs hover:bg-primary/5 rounded-lg transition-colors">
                      Xem tất cả hoạt động
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HoSoCaNhanDhdeduVietHoa;
