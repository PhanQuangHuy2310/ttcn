import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const LuyenTapTracNghiemSinhVien = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentHeader />

      <StudentSidebar />

      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/15">
              <div className="flex justify-between items-center mb-8">
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-xs font-bold rounded-full">
                  CÂU HỎI 14 / 20
                </span>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="material-symbols-outlined text-lg">
                    timer
                  </span>
                  <span className="font-medium">12:45</span>
                </div>
              </div>
              <h1 className="font-headline text-2xl font-bold text-on-surface mb-8 leading-relaxed">
                Trong không gian với hệ tọa độ Oxyz, cho mặt phẳng (P): 2x - y +
                2z - 3 = 0. Khoảng cách từ điểm M(1; -2; 1) đến mặt phẳng (P)
                bằng bao nhiêu?
              </h1>
              <div className="grid grid-cols-1 gap-4">
                <button className="group flex items-center gap-4 p-5 rounded-xl border-2 border-surface-container hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                  <span className="flex-none w-10 h-10 rounded-lg bg-surface-container group-hover:bg-primary-fixed flex items-center justify-center font-bold text-on-surface-variant group-hover:text-primary">
                    A
                  </span>
                  <span className="text-lg font-medium">1</span>
                </button>
                <button className="group flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 transition-all text-left">
                  <span className="flex-none w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                    B
                  </span>
                  <span className="text-lg font-medium">2</span>
                </button>
                <button className="group flex items-center gap-4 p-5 rounded-xl border-2 border-surface-container hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                  <span className="flex-none w-10 h-10 rounded-lg bg-surface-container group-hover:bg-primary-fixed flex items-center justify-center font-bold text-on-surface-variant group-hover:text-primary">
                    C
                  </span>
                  <span className="text-lg font-medium">3</span>
                </button>
                <button className="group flex items-center gap-4 p-5 rounded-xl border-2 border-surface-container hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                  <span className="flex-none w-10 h-10 rounded-lg bg-surface-container group-hover:bg-primary-fixed flex items-center justify-center font-bold text-on-surface-variant group-hover:text-primary">
                    D
                  </span>
                  <span className="text-lg font-medium">4</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/15">
              <button className="flex items-center gap-2 px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                Câu trước
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 text-error font-bold hover:bg-error/5 rounded-xl transition-colors">
                <span className="material-symbols-outlined">flag</span>
                Gắn cờ
              </button>
              <button className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all scale-100 active:scale-95">
                Câu tiếp theo
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-panel border border-primary/20 rounded-2xl p-6 h-full sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-weight="fill"
                  >
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">
                    AI Tutor Giải Thích
                  </h3>
                  <p className="text-xs text-slate-500 italic">
                    Dựa trên kiến thức RAG
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    Đáp án chính xác!
                  </div>
                  <p className="text-sm text-green-800/80 leading-relaxed">
                    Bạn đã áp dụng đúng công thức tính khoảng cách từ một điểm
                    đến mặt phẳng.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-primary uppercase tracking-wider">
                    Lý giải chi tiết
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Công thức khoảng cách từ $M(x_0, y_0, z_0)$ đến $(P): Ax +
                    By + Cz + D = 0$ là:
                  </p>
                  <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 text-center font-mono text-xs">
                    d = |A.x0 + B.y0 + C.z0 + D| / sqrt(A² + B² + C²)
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thay số: d = |2(1) - (-2) + 2(1) - 3| / sqrt(2² + (-1)² +
                    2²) = |2 + 2 + 2 - 3| / sqrt(9) = 3 / 3 = 1.
                  </p>
                </div>
                <div className="p-4 bg-primary-fixed/30 rounded-xl border border-primary-fixed">
                  <h4 className="font-bold text-xs text-on-primary-fixed-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      lightbulb
                    </span>
                    KIẾN THỨC LIÊN QUAN
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                    <li>Vị trí tương đối của hai mặt phẳng.</li>
                    <li>Góc giữa đường thẳng và mặt phẳng.</li>
                    <li>Phương trình mặt cầu tâm M tiếp xúc mặt phẳng (P).</li>
                  </ul>
                </div>
              </div>
              <button className="w-full mt-8 py-3 border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors text-sm">
                Hỏi thêm AI về câu này
              </button>
            </div>
          </div>
        </div>

        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="font-headline text-xl font-bold mb-6">
            Đề xuất rèn luyện thêm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <span className="text-xs font-bold text-orange-600">
                  Độ khó: Cao
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">
                Hình học giải tích Oxyz
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Luyện tập các bài toán cực trị trong không gian.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img
                      data-alt="User Avatar 1"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD11QoTt-u01ya2qjwdkKPdKtB_H3WAVigcXuH8gUH3087LuDL8mohvamY4BPe0fLbckHJkmG3jFahrHK8ZY0j_UqMGL2THl-ezdZWpdNOzvPXCFPVdCfYYz_lw9cDE1dP8LZP7QQTd4H4c1t3eOvTS2m-7GtpaGMeSG42QLczQrujVZoYb3YHCMwg69e3YgSkfXqZTq5JV2gVgD1NeDAcn9N37k0vyH0J6-Hc2Z3MS9Lb8e_mQk8v7xNvIrH7uEDv-97evA2cjRM0"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img
                      data-alt="User Avatar 2"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2RZc69niuznAWt9R54y4NFdsGZEC3AeMFDzE7ZBdC0ZG4n-ZGVavtiabtK0w8ixS6cPYH05dqEXHy4Lam4athfNOFZRPMul8OYkzvG7qA4WneRze1NRTThLc3XLuAB6H88F9-YwI0AyeU4Au4pqUXGMA4VMvYlNbzYzR4HRgKid2IUSHEvPP7M4fxMbHM_QLnHDsAgh3vRJZeoJx5hvFG2lk2vCvfoNDhf4W0Htsw5h2N0ItlygrO1vPNeGuPinBPdrX5HSyztns"
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  1.2k học viên đang học
                </span>
              </div>
            </div>
            <div className="bg-primary p-6 rounded-2xl text-white flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
              <span className="material-symbols-outlined text-4xl opacity-50">
                school
              </span>
              <div>
                <h3 className="font-bold">Ôn tập thi THPT</h3>
                <p className="text-xs opacity-80">Trọn bộ 50 đề minh họa</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/15 flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">
                history_edu
              </span>
              <div>
                <h3 className="font-bold text-on-surface">Lịch sử bài làm</h3>
                <p className="text-xs text-slate-500">Xem lại các lỗi sai</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LuyenTapTracNghiemSinhVien;
