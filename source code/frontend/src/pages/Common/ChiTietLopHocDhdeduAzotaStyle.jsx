import React from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';

const ChiTietLopHocDhdeduAzotaStyle = () => {
  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      
      

<CommonSidebar />

<main className="ml-64 min-h-screen">

<CommonHeader />

<div className="max-w-[1440px] mx-auto px-8 py-8 flex gap-8">

<div className="flex-1">

<div className="flex gap-8 mb-8 border-b border-surface-container">
<button className="pb-4 text-[#005ea5] font-semibold border-b-2 border-[#005ea5] transition-all">Thông báo</button>
<button className="pb-4 text-slate-500 hover:text-[#005ea5] font-medium transition-all">Bài tập &amp; Kiểm tra</button>
<button className="pb-4 text-slate-500 hover:text-[#005ea5] font-medium transition-all">Tài liệu học tập</button>
<button className="pb-4 text-slate-500 hover:text-[#005ea5] font-medium transition-all">Giáo viên &amp; Thành viên</button>
</div>

<div className="grid grid-cols-1 gap-6">

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-primary">campaign</span>
</div>
<div>
<h3 className="font-bold text-lg text-on-surface">Cập nhật lịch thi cuối kỳ</h3>
<p className="text-xs text-slate-400">Đăng bởi Dr. Nguyen Van A • 2 giờ trước</p>
</div>
</div>
<span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Quan trọng</span>
</div>
<p className="text-on-surface-variant leading-relaxed mb-4">
                            Chào các em, lịch thi cuối kỳ cho môn Thiết kế Giao diện đã được chốt vào ngày 15/06/2024 tại phòng Lab 402. Các em lưu ý xem lại danh sách nhóm và chuẩn bị file thuyết trình kỹ lưỡng.
                        </p>
<div className="flex gap-3">
<div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-surface-container-high cursor-pointer transition-colors">
<span className="material-symbols-outlined text-sm">attach_file</span>
                                Lich_thi_cuoi_ky.pdf
                            </div>
</div>
</div>

<div className="grid grid-cols-2 gap-6">
<div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<h3 className="font-bold text-headline text-on-surface">Bài tập sắp đến hạn</h3>
<span className="material-symbols-outlined text-amber-500">timer</span>
</div>
<div className="space-y-4">
<div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
<h4 className="text-sm font-semibold">Project Phase 2: Wireframing</h4>
<div className="flex justify-between items-center mt-2">
<span className="text-[11px] text-error font-medium">Hết hạn trong: 2 ngày</span>
<button className="text-primary text-xs font-bold hover:underline">Nộp bài</button>
</div>
</div>
<div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
<h4 className="text-sm font-semibold">Quiz: UX Research Principles</h4>
<div className="flex justify-between items-center mt-2">
<span className="text-[11px] text-slate-500 font-medium">Hết hạn: 31/05/2024</span>
<button className="text-primary text-xs font-bold hover:underline">Bắt đầu</button>
</div>
</div>
</div>
</div>
<div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<h3 className="font-bold text-headline text-on-surface">Hoạt động mới</h3>
<span className="material-symbols-outlined text-secondary">history</span>
</div>
<div className="space-y-3">
<div className="flex gap-3 items-start">
<div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-sm text-secondary">forum</span>
</div>
<div>
<p className="text-xs text-on-surface-variant"><span className="font-bold">Lan Anh</span> đã trả lời thảo luận của bạn.</p>
<span className="text-[10px] text-slate-400">15 phút trước</span>
</div>
</div>
<div className="flex gap-3 items-start">
<div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-sm text-tertiary">picture_as_pdf</span>
</div>
<div>
<p className="text-xs text-on-surface-variant">Tài liệu <span className="font-bold">Chapter 4: Visual Design</span> đã được tải lên.</p>
<span className="text-[10px] text-slate-400">1 giờ trước</span>
</div>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-low/50 border-2 border-dashed border-outline-variant/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-4xl text-outline-variant mb-3">add_comment</span>
<h3 className="font-bold text-slate-600">Bắt đầu một cuộc thảo luận mới</h3>
<p className="text-sm text-slate-400 max-w-sm mt-1">Hỏi đáp với giảng viên hoặc trao đổi với bạn bè cùng lớp về bài học hôm nay.</p>
<button className="mt-4 px-6 py-2 bg-white text-primary border border-primary/20 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all">Tạo bài đăng</button>
</div>
</div>
</div>

<aside className="w-80 flex flex-col gap-6">

<div className="bg-white rounded-3xl p-6 shadow-[0px_12px_32px_rgba(0,28,56,0.06)]">
<h3 className="font-headline font-bold text-xl mb-6 text-on-surface">Kết quả học tập</h3>
<div className="space-y-6">

<div className="flex items-center gap-4">
<div className="relative w-16 h-16">
<svg className="w-full h-full" viewbox="0 0 36 36">
<path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="100, 100" strokeWidth="3" /></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3" /></path>
</svg>
<div className="absolute inset-0 flex items-center justify-center font-bold text-primary">8.5</div>
</div>
<div>
<p className="text-xs text-slate-500 font-medium">Điểm trung bình</p>
<p className="text-lg font-bold">Xếp loại: Giỏi</p>
</div>
</div>

<div className="bg-surface-container-low p-4 rounded-2xl">
<div className="flex justify-between items-center mb-2">
<span className="text-xs font-semibold text-slate-600">Chuyên cần</span>
<span className="text-xs font-bold text-primary">92%</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" ></div>
</div>
<p className="text-[10px] text-slate-400 mt-2 italic">* Vắng: 02 buổi (Có phép)</p>
</div>

<div className="space-y-3">
<div className="flex items-center justify-between text-xs">
<span className="text-slate-500">Bài tập đã hoàn thành</span>
<span className="font-bold text-on-surface">12/15</span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="text-slate-500">Dự án nhóm</span>
<span className="font-bold text-amber-600">Đang thực hiện</span>
</div>
</div>
</div>
<button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-xl text-xs font-bold text-slate-600 hover:bg-surface-container transition-all">Xem bảng điểm chi tiết</button>
</div>

<div className="bg-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
<div className="relative z-10">
<h3 className="font-bold mb-4 opacity-80 text-xs uppercase tracking-widest">Giảng viên hướng dẫn</h3>
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden">
<img alt="Professor" className="w-full h-full object-cover" data-alt="Professor profile headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBou2f-aM-yZp_0a-1kjamyjwdQGs06CIH1cJ6BRpYsrPHFzTMAkHkROuGrmDt7B_Ipc2r_tEfHjIcd0-xQriG93TPMAwRwL9fwrOrTSpLelp4JErCxt4-H5HFps9YTUPRYG68XDT30E6Qr9dpzO_TmsLAWL3aPRtNLMiCxTi6uPWiNZkZiSUyb1RqtKYGvGxUVTXgbKW4q_N9zVQzlxvcb6EYig9XBBXdVY9DTzoJ_PnI2nIM27SbEKtw5rEHsbellu6Jl11_lcL4"/>
</div>
<div>
<h4 className="font-bold">Dr. Nguyen Van A</h4>
<p className="text-[11px] opacity-80">Phòng Nghiên cứu HCI</p>
</div>
</div>
<div className="flex gap-2 mt-6">
<button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-lg text-xs font-semibold transition-all">Nhắn tin</button>
<button className="px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-lg transition-all">
<span className="material-symbols-outlined text-sm">mail</span>
</button>
</div>
</div>

<div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
</div>

<div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container">
<h3 className="font-bold text-sm mb-4">Lối tắt tài liệu</h3>
<ul className="space-y-4">
<li className="flex items-center gap-3 group cursor-pointer">
<span className="material-symbols-outlined text-red-500 p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">description</span>
<div>
<p className="text-[13px] font-semibold group-hover:text-primary transition-colors">Syllabus_UI_CS302.pdf</p>
<p className="text-[10px] text-slate-400">Tải về: 1.2 MB</p>
</div>
</li>
<li className="flex items-center gap-3 group cursor-pointer">
<span className="material-symbols-outlined text-blue-500 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">slideshow</span>
<div>
<p className="text-[13px] font-semibold group-hover:text-primary transition-colors">Lecture_01_Introduction.pptx</p>
<p className="text-[10px] text-slate-400">Tải về: 4.5 MB</p>
</div>
</li>
</ul>
</div>
</aside>
</div>
</main>

<div className="fixed bottom-8 right-8 z-50 md:hidden">
<button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-2xl" >auto_awesome</span>
</button>
</div>

    </div>
      </>
  );
};

export default ChiTietLopHocDhdeduAzotaStyle;
