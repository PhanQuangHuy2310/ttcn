import React from "react";
import CommonSidebar from "../../components/CommonSidebar";
import CommonHeader from "../../components/CommonHeader";

const CaiAtBaoMat2LopDhdedu = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />

      <CommonHeader />

      <main className="ml-64 p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex gap-2 text-xs font-semibold text-tertiary mb-2 uppercase tracking-widest">
              <span>Tài khoản</span>
              <span>/</span>
              <span className="text-primary">Bảo mật</span>
            </nav>
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              Cài đặt Bảo mật 2 lớp (2FA)
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-error-container/30 px-4 py-2 rounded-full border border-error/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
            </span>
            <span className="text-sm font-bold text-error">
              Trạng thái: Chưa kích hoạt
            </span>
          </div>
        </div>

        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <span className="material-symbols-outlined text-4xl">
                shield_lock
              </span>
            </div>
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">
                Bảo vệ tối đa tài khoản của bạn
              </h3>
              <p className="text-primary-fixed leading-relaxed">
                Bảo mật 2 lớp giúp bảo vệ tài khoản của bạn bằng cách yêu cầu mã
                xác thực mỗi khi bạn đăng nhập từ một thiết bị mới. Điều này
                ngăn chặn truy cập trái phép ngay cả khi mật khẩu của bạn bị lộ.
              </p>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/15 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-2xl">
                    vibration
                  </span>
                </div>
                <span className="px-3 py-1 bg-surface-container text-[10px] font-bold text-tertiary rounded-full uppercase tracking-tighter">
                  Khuyên dùng
                </span>
              </div>
              <h4 className="font-headline font-bold text-xl mb-3">
                Ứng dụng xác thực
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Sử dụng Google Authenticator hoặc Microsoft Authenticator để
                nhận mã xác thực ngoại tuyến ngay trên điện thoại của bạn.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Thiết lập
              </button>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-surface p-1">
                  <img
                    className="w-full h-full object-contain"
                    data-alt="Google Authenticator Logo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlElup1ZXQXK6zQnk0V1wnmuzQ1Vcp70q0F42LZO75Fh7Zo143bvSfV1XF29B5qBUMQl7KwQau0WdgAbmtIYxzh4mbwpA2qu7U4YlOAhX-KWqvwCb-xhhGV2xUVPmkxTak-EA148ZTco4w4tlx93_uH7cGdQdlBxVIAZYzKZhPx7Wwxl9M0ToftdrSsOFABoBSTmCW7xYRM7Bzee4xWmK3qEO6EDZafzH730ekzk1ruYaWJceVqbbEahQLU7Yj6hB1yb6E8h1yrjE"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-surface p-1">
                  <img
                    className="w-full h-full object-contain"
                    data-alt="Microsoft Authenticator Logo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqLgi9_tj6e5x0Osm9-rrJx6QYSG5LInsFuYPHFJZOFadB9PK1FgvVf9fnIUj-Zn4597ytbyKXaAMQUSBRq_f_JnXZ7MiDZ20gbJJsWxXQCSNFjq9jX4SRNSy4t5VJwivZaokQQ68mAxe8KXJQ9ukr4vWpZH8LoYf0y7BPCd_QGAHYxYUhnBHYnp3NKhb2D92o5W9DmCqnhCy1E_ZEkjjJc6ZE5A2myBvC7hYFIAJTeHxkb28IJps57DK9NscB5KT4RgOvVMCatJg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/15 flex flex-col">
            <div className="w-12 h-12 bg-edu-orange/10 rounded-xl flex items-center justify-center text-edu-orange mb-6">
              <span className="material-symbols-outlined text-2xl">sms</span>
            </div>
            <h4 className="font-headline font-bold text-xl mb-3">
              Xác thực qua SMS
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Nhận mã xác thực gửi trực tiếp đến số điện thoại cá nhân của bạn
              mỗi khi đăng nhập.
            </p>
            <div className="mt-auto space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                  type="tel"
                />
              </div>
              <button className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container-highest active:scale-[0.98] transition-all">
                Kích hoạt
              </button>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 glass-panel p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 border border-white">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex w-16 h-16 bg-tertiary-fixed rounded-2xl items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-3xl">
                  key_visualizer
                </span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-xl mb-1 text-on-surface">
                  Mã dự phòng (Backup Codes)
                </h4>
                <p className="text-on-surface-variant text-sm max-w-md">
                  Tạo các mã sử dụng một lần để đăng nhập trong trường hợp bạn
                  bị mất điện thoại hoặc không thể nhận mã xác thực.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-3 bg-white text-primary border border-primary/20 font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  autorenew
                </span>
                Tạo mã mới
              </button>
              <button className="p-3 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
                <span className="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex flex-col md:flex-row items-center justify-between p-6 bg-surface-container-low rounded-2xl border-dashed border-2 border-outline-variant/30">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-4 md:mb-0">
            <span className="material-symbols-outlined text-secondary">
              info
            </span>
            <p>
              Mẹo bảo mật: Không bao giờ chia sẻ mã xác thực cho bất kỳ ai, kể
              cả nhân viên DHDedu.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">
              Portal Version 2.4.0
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              DHDedu Secure
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CaiAtBaoMat2LopDhdedu;
