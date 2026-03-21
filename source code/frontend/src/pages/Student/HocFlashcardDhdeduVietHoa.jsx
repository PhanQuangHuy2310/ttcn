import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const HocFlashcardDhdeduVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="ml-64 min-h-screen flex flex-col">
        <StudentHeader />

        <div className="flex-1 flex flex-col lg:flex-row p-8 gap-8 overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            <div className="w-full flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">
                  Học Flashcard
                </h2>
                <p className="text-tertiary">
                  Nhấn vào thẻ để xem đáp án hoặc dùng phím Space.
                </p>
              </div>
              <div className="text-right">
                <span className="text-primary font-bold text-lg">20/40</span>
                <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
                  Số thẻ còn lại
                </p>
              </div>
            </div>

            <div className="w-full aspect-[16/9] md:aspect-[21/10] relative group cursor-pointer academic-shadow rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
              <div className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full mb-6">
                  Khái niệm &amp; Định nghĩa
                </span>
                <h3 className="font-headline font-bold text-4xl md:text-5xl text-on-surface tracking-tight max-w-2xl leading-tight">
                  Định lý Weierstrass
                </h3>
                <p className="mt-8 text-tertiary max-w-md italic">
                  Một trong những định lý quan trọng nhất về tính hội tụ của dãy
                  số đơn điệu.
                </p>
                <div className="absolute bottom-10 flex items-center gap-2 text-tertiary opacity-50">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="touch_app"
                  >
                    touch_app
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Nhấn để lật thẻ
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-surface-container">
                <div className="h-full bg-primary-container"></div>
              </div>
            </div>

            <div className="mt-12 w-full max-w-2xl">
              <div className="flex justify-center mb-8">
                <button className="bg-primary hover:bg-primary-container text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all academic-shadow active:scale-95">
                  <span className="material-symbols-outlined" data-icon="flip">
                    flip
                  </span>
                  Lật thẻ
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-surface-container-low hover:bg-error-container text-error transition-all group border border-transparent hover:border-error/20">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="close"
                  >
                    close
                  </span>
                  <span className="text-sm font-bold">Chưa thuộc</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-surface-container-low hover:bg-[#fff7e6] text-[#ff9800] transition-all group border border-transparent hover:border-[#ff9800]/20">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="history"
                  >
                    history
                  </span>
                  <span className="text-sm font-bold">Xem lại sau</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-surface-container-low hover:bg-[#e6f4ea] text-[#2e7d32] transition-all group border border-transparent hover:border-[#2e7d32]/20">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="done_all"
                  >
                    done_all
                  </span>
                  <span className="text-sm font-bold">Đã thuộc</span>
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-surface-container-lowest academic-shadow rounded-3xl p-6 border border-outline-variant/10 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="smart_toy"
                    data-weight="fill"
                  >
                    smart_toy
                  </span>
                </div>
              </div>
              <h4 className="font-headline font-bold text-lg text-on-surface mb-1">
                Trợ lý AI
              </h4>
              <p className="text-xs text-tertiary mb-6">
                Trợ lý học tập thông minh EduAI
              </p>
              <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm text-on-surface leading-relaxed">
                    Chào Minh! Bạn đang học về{" "}
                    <strong>Định lý Weierstrass</strong>. Định lý này khẳng định
                    rằng:
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm text-on-surface italic bg-white/50 p-3 rounded-lg border-l-4 border-primary mb-2">
                    "Mọi dãy đơn điệu và bị chặn đều hội tụ."
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed">
                    Hãy tưởng tượng bạn đang leo một cầu thang (dãy tăng) nhưng
                    trần nhà có giới hạn (bị chặn trên). Chắc chắn bạn sẽ không
                    thể leo mãi được mà phải tiến sát tới một điểm nào đó!
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <input
                    className="w-full bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm py-3 pl-4 pr-12 placeholder:text-tertiary/60 font-body"
                    placeholder="Hỏi AI thêm về ví dụ..."
                    type="text"
                  />
                  <button className="absolute right-2 top-1.5 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="arrow_upward"
                    >
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary p-6 rounded-3xl academic-shadow text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span
                  className="material-symbols-outlined text-[120px]"
                  data-icon="trending_up"
                >
                  trending_up
                </span>
              </div>
              <div className="relative z-10">
                <h5 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">
                  Chế độ tập trung
                </h5>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-headline font-extrabold tracking-tight">
                    42
                  </span>
                  <span className="text-sm opacity-80">phút</span>
                </div>
                <p className="text-xs opacity-70">
                  Thời gian học hiệu quả hôm nay
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-50">
        <span className="material-symbols-outlined" data-icon="smart_toy">
          smart_toy
        </span>
      </button>
    </div>
  );
};

export default HocFlashcardDhdeduVietHoa;
