import React from "react";
import StudentSidebar from "../../components/StudentSidebar";
import StudentHeader from "../../components/StudentHeader";

const LamBaiTrucTuyenDhdeduVietHoa = () => {
  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentHeader />

      <StudentSidebar />

      <main className="ml-80 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto p-8 lg:p-12">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="bg-slate-50 p-8 border-b border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-700 text-white px-4 py-1.5 rounded-lg font-bold tracking-wider text-sm uppercase">
                  Câu 05
                </span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 leading-relaxed">
                Độ phức tạp của thuật toán QuickSort trong trường hợp xấu nhất
                là gì?
              </h2>
            </div>

            <div className="p-8 flex-grow space-y-4">
              <label className="group relative flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                <input className="hidden peer" name="question-5" type="radio" />
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors peer-checked:bg-blue-700 peer-checked:text-white">
                  A
                </div>
                <span className="ml-6 text-lg font-medium text-slate-700">
                  O(n log n)
                </span>
                <div className="absolute right-6 opacity-0 peer-checked:opacity-100 text-blue-700 transition-opacity">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
              </label>

              <label className="group relative flex items-center p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/50 transition-all cursor-pointer">
                <input
                  checked=""
                  className="hidden peer"
                  name="question-5"
                  type="radio"
                />
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-700 text-white font-bold transition-colors">
                  B
                </div>
                <span className="ml-6 text-lg font-bold text-blue-900">
                  O(n²)
                </span>
                <div className="absolute right-6 text-blue-700">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
              </label>

              <label className="group relative flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                <input className="hidden peer" name="question-5" type="radio" />
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors peer-checked:bg-blue-700 peer-checked:text-white">
                  C
                </div>
                <span className="ml-6 text-lg font-medium text-slate-700">
                  O(n)
                </span>
                <div className="absolute right-6 opacity-0 peer-checked:opacity-100 text-blue-700 transition-opacity">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
              </label>

              <label className="group relative flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
                <input className="hidden peer" name="question-5" type="radio" />
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors peer-checked:bg-blue-700 peer-checked:text-white">
                  D
                </div>
                <span className="ml-6 text-lg font-medium text-slate-700">
                  O(log n)
                </span>
                <div className="absolute right-6 opacity-0 peer-checked:opacity-100 text-blue-700 transition-opacity">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
              </label>
            </div>

            <div className="p-8 flex justify-between items-center bg-slate-50">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined">arrow_back</span>
                Quay lại
              </button>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              </div>
              <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">
                Tiếp theo
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Gợi ý</h4>
                <p className="text-sm text-slate-500">
                  Trường hợp xấu nhất của QuickSort xảy ra khi trục (pivot) là
                  phần tử lớn nhất hoặc nhỏ nhất.
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Thời gian làm bài</h4>
                <p className="text-sm text-slate-500">
                  Trung bình bạn dành 45 giây cho mỗi câu hỏi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center md:hidden hover:scale-110 active:scale-95 transition-all"
        title="Nộp bài"
      >
        <span className="material-symbols-outlined text-3xl" data-icon="send">
          send
        </span>
      </button>
    </div>
  );
};

export default LamBaiTrucTuyenDhdeduVietHoa;
