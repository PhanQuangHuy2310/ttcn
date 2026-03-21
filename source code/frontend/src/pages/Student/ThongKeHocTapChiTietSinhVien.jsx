import React from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';

const ThongKeHocTapChiTietSinhVien = () => {
  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      
      

<StudentSidebar />

<main className="ml-64 min-h-screen">

<StudentHeader />

<div className="pt-24 pb-12 px-8">

<div className="flex items-center justify-between mb-8">
<div>
<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-2">Học kỳ 1, Năm học 2023-2024</span>
<p className="text-on-surface-variant max-w-2xl leading-relaxed">Phân tích chuyên sâu về tiến độ học tập và hiệu suất cá nhân của bạn dựa trên dữ liệu thời gian thực từ hệ thống DHDedu.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm">
<span className="material-symbols-outlined text-lg">calendar_today</span>
                        Tùy chỉnh thời gian
                    </button>
<button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
<span className="material-symbols-outlined text-lg">download</span>
                        Xuất báo cáo (PDF)
                    </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
<div className="flex flex-col h-full relative z-10">
<span className="text-sm font-medium text-slate-500 mb-1">GPA Hiện tại</span>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-on-surface">3.8</span>
<span className="text-sm font-bold text-slate-400">/ 4.0</span>
</div>
<div className="mt-4 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg w-fit">
<span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                            +0.2 so với kỳ trước
                        </div>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4"></div>
<div className="flex flex-col h-full relative z-10">
<span className="text-sm font-medium text-slate-500 mb-1">Xếp hạng lớp</span>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-on-surface">5</span>
<span className="text-sm font-bold text-slate-400">/ 45 sinh viên</span>
</div>
<div className="mt-4 flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
<span className="material-symbols-outlined text-sm mr-1">workspace_premium</span>
                            Top 12% của khối
                        </div>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full -mr-4 -mt-4"></div>
<div className="flex flex-col h-full relative z-10">
<span className="text-sm font-medium text-slate-500 mb-1">Hoàn thành mục tiêu</span>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-on-surface">85%</span>
</div>
<div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary" ></div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9800]/5 rounded-bl-full -mr-4 -mt-4"></div>
<div className="flex flex-col h-full relative z-10">
<span className="text-sm font-medium text-slate-500 mb-1">Tổng thời gian học</span>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-black text-on-surface">124</span>
<span className="text-sm font-bold text-slate-400">giờ học</span>
</div>
<div className="mt-4 flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit">
<span className="material-symbols-outlined text-sm mr-1">history_edu</span>
                            +12h tuần này
                        </div>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 lg:col-span-8 space-y-6">

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-10">
<div>
<h3 className="text-lg font-bold text-on-surface font-headline">Xu hướng điểm số</h3>
<p className="text-sm text-slate-500 mt-1">Sự thay đổi điểm số trung bình qua các môn học chính</p>
</div>
<div className="flex bg-surface-container p-1 rounded-xl">
<button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors">Hàng tuần</button>
<button className="px-4 py-1.5 text-xs font-bold text-primary bg-white rounded-lg shadow-sm">Hàng tháng</button>
<button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors">Học kỳ</button>
</div>
</div>
<div className="h-[300px] w-full flex items-end gap-1 relative pt-8">

<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
<svg className="w-full h-full" viewbox="0 0 800 200">
<path d="M0,150 Q100,120 200,130 T400,80 T600,100 T800,40" fill="none" stroke="rgba(0, 94, 165, 0.4)" strokeDasharray="8,4" strokeWidth="3" /></path>
<path d="M0,180 Q150,140 300,160 T500,120 T800,110" fill="none" stroke="rgba(0, 119, 207, 0.3)" strokeWidth="2" /></path>
<path d="M0,130 Q100,140 200,90 T400,100 T600,60 T800,30" fill="none" stroke="#005ea5" strokeLinecap="round" strokeWidth="4" /></path>
</svg>
</div>

<div className="absolute -bottom-6 left-0 w-full flex justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span>Tháng 9</span>
<span>Tháng 10</span>
<span>Tháng 11</span>
<span>Tháng 12</span>
<span>Tháng 1</span>
</div>
</div>
<div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Toán học</p>
<p className="text-sm font-bold">GPA: 9.2</p>
</div>
</div>
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary/40"></span>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Vật lý</p>
<p className="text-sm font-bold">GPA: 8.5</p>
</div>
</div>
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary/20"></span>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Tiếng Anh</p>
<p className="text-sm font-bold">GPA: 9.0</p>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10">
<h3 className="text-lg font-bold text-on-surface font-headline mb-6">Phân tích Kiến thức</h3>
<div className="space-y-5">
<div>
<div className="flex justify-between mb-1.5">
<span className="text-xs font-bold text-slate-600">Giải tích &amp; Đại số</span>
<span className="text-xs font-bold text-primary">95%</span>
</div>
<div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary" ></div>
</div>
</div>
<div>
<div className="flex justify-between mb-1.5">
<span className="text-xs font-bold text-slate-600">Từ vựng Tiếng Anh</span>
<span className="text-xs font-bold text-primary">82%</span>
</div>
<div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary" ></div>
</div>
</div>
<div>
<div className="flex justify-between mb-1.5">
<span className="text-xs font-bold text-slate-600">Cơ học cổ điển</span>
<span className="text-xs font-bold text-primary">78%</span>
</div>
<div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary" ></div>
</div>
</div>
<div>
<div className="flex justify-between mb-1.5">
<span className="text-xs font-bold text-slate-600 text-error">Hình học không gian</span>
<span className="text-xs font-bold text-error">45%</span>
</div>
<div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-error" ></div>
</div>
</div>
</div>
<div className="mt-6 p-3 bg-error/5 rounded-xl border border-error/10">
<p className="text-[11px] text-error font-medium leading-snug">
<span className="font-bold">Cảnh báo:</span> Phần Hình học không gian cần được ôn tập ngay để tránh ảnh hưởng điểm số cuối kỳ.
                                </p>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10">
<h3 className="text-lg font-bold text-on-surface font-headline mb-4">Hành vi &amp; Thời gian</h3>
<p className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-bold">Tần suất học tập hàng tuần</p>

<div className="grid grid-cols-7 gap-2 mb-6">
<div className="space-y-2">
<div className="h-8 w-full bg-primary/20 rounded-md"></div>
<div className="h-8 w-full bg-primary rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T2</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary/10 rounded-md"></div>
<div className="h-8 w-full bg-primary/40 rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T3</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary/60 rounded-md"></div>
<div className="h-8 w-full bg-primary/80 rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T4</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary/30 rounded-md"></div>
<div className="h-8 w-full bg-primary rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T5</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary/10 rounded-md"></div>
<div className="h-8 w-full bg-primary/20 rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T6</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary rounded-md"></div>
<div className="h-8 w-full bg-primary/90 rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">T7</span>
</div>
<div className="space-y-2">
<div className="h-8 w-full bg-primary/5 rounded-md"></div>
<div className="h-8 w-full bg-primary/10 rounded-md"></div>
<span className="block text-center text-[10px] font-bold text-slate-400">CN</span>
</div>
</div>
<div className="flex items-center justify-between pt-4 border-t border-slate-100">
<div>
<p className="text-xs text-slate-500 font-medium">Trung bình/ngày</p>
<p className="text-lg font-black text-primary">4.5h</p>
</div>
<div className="text-right">
<p className="text-xs text-slate-500 font-medium">Giờ tập trung nhất</p>
<p className="text-lg font-black text-on-surface">20:00 - 22:00</p>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4">

<div className="bg-white rounded-3xl shadow-xl shadow-primary/10 border border-primary/10 overflow-hidden sticky top-28">
<div className="bg-gradient-to-br from-primary to-primary-container p-6 text-white">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
<span className="material-symbols-outlined fill-white" data-icon="auto_awesome" >auto_awesome</span>
</div>
<h3 className="text-lg font-bold font-headline">Nhận xét từ AI</h3>
</div>
<p className="text-white/90 text-sm leading-relaxed font-medium">
                                "Bạn đang làm rất tốt ở phần Giải tích. Tuy nhiên, kết quả phần Hình học không gian đang có xu hướng giảm. Hãy dành thêm 30 phút mỗi ngày cho Flashcard phần này."
                            </p>
</div>
<div className="p-6 space-y-4">
<div className="space-y-3">
<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Hành động đề xuất</p>
<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-primary/5 transition-colors cursor-pointer">
<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
<span className="material-symbols-outlined text-xl">menu_book</span>
</div>
<div>
<p className="text-sm font-bold text-on-surface">Ôn tập Hình học 12</p>
<p className="text-[11px] text-slate-500">Chủ đề: Khối đa diện (15 bài tập)</p>
</div>
</div>
<div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-primary/5 transition-colors cursor-pointer">
<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
<span className="material-symbols-outlined text-xl">quiz</span>
</div>
<div>
<p className="text-sm font-bold text-on-surface">Làm Mock-test cuối tuần</p>
<p className="text-[11px] text-slate-500">Dự đoán điểm hiện tại: 8.2</p>
</div>
</div>
</div>
<div className="pt-4 flex flex-col gap-3">
<button className="w-full py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Xem lộ trình ôn tập</button>
<button className="w-full py-3 bg-white border border-primary text-primary rounded-2xl text-sm font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-xl">smart_toy</span>
                                    Hỏi thêm AI
                                </button>
</div>
</div>

<div className="m-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm shrink-0">
<span className="material-symbols-outlined text-2xl font-bold">local_fire_department</span>
</div>
<div>
<p className="text-xs font-bold text-orange-800 uppercase leading-tight">Streak 12 ngày!</p>
<p className="text-[11px] text-orange-600 font-medium">Bạn đang có phong độ rất ổn định. Cố lên!</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>



    </div>
      </>
  );
};

export default ThongKeHocTapChiTietSinhVien;
