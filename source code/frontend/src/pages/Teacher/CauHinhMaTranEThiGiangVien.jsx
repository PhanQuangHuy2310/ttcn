import React from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';

const CauHinhMaTranEThiGiangVien = () => {
  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      
      

<nav className="fixed top-0 w-full z-50 sticky bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16 w-full max-w-full">
<div className="flex items-center gap-8">
<div className="text-xl font-bold">
<span className="text-blue-800">DHD</span><span className="text-orange-500">edu</span>
</div>
<div className="hidden md:flex gap-6">
<a className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1 rounded-lg" href="#">Dashboard</a>
<a className="text-blue-700 font-bold border-b-2 border-blue-600 px-3 py-1" href="#">Exams</a>
<a className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1 rounded-lg" href="#">Reports</a>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="help">help</span>
</button>
<div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
<img alt="Teacher Profile Avatar" className="w-full h-full object-cover" data-alt="Teacher professional profile headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa3VAEz749SzSwf4xemC4ikb_DRv6WDoKfizhSf3DD39_TLKLIZA44aULOYypzsavolXjkLU_iQ7GpM_aJ2VLVO20CkzxuY5fFnACVX7jOfnwJFUhBXNCi2_fuZzayKcW12scr8i09MkxeWze-8MYWJwVf5_0gJUiTE9TckyWB2qyPWQjJRNKBmBos3k4oBlpWYARfL76RE-bR_uOEDiqaW7-zNEmSRniqhW5qN-wvgfheSoczRxxquicT_KK7PpwbJ3KLNXL7bG8"/>
</div>
</div>
</nav>
<div className="flex min-h-screen">

<TeacherSidebar />

<main className="flex-1 md:ml-64 p-8 pt-24 bg-surface">

<div className="mb-8">
<nav className="flex text-sm text-slate-500 mb-2 gap-2 items-center">
<a className="hover:text-primary" href="#">Trang chủ</a>
<span className="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
<a className="hover:text-primary" href="#">Ngân hàng đề thi</a>
<span className="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
<span className="text-on-surface font-medium">Cấu hình ma trận</span>
</nav>
<div className="flex justify-between items-end">
<h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Cấu hình Ma trận Đề thi</h1>
<button className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-200 text-primary font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm ring-2 ring-blue-500/10">
<span className="material-symbols-outlined text-orange-500" data-icon="auto_awesome" >auto_awesome</span>
                        AI Gợi ý Ma trận
                    </button>
</div>
</div>

<div className="grid grid-cols-12 gap-8">

<div className="col-span-12 lg:col-span-8 space-y-8">
<section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm ghost-border">
<h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
<span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Thông tin chung
                        </h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên ma trận</label>
<input className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all" placeholder="Nhập tên ma trận đề thi..." type="text"/>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Môn học</label>
<select className="w-full bg-surface-container border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface transition-all appearance-none">
<option>Toán học lớp 12</option>
<option>Vật lý lớp 12</option>
<option>Hóa học lớp 12</option>
</select>
</div>
<div className="grid grid-cols-3 gap-4 md:col-span-2">
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số câu</label>
<input className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-bold text-primary" type="number" value="40"/>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng điểm</label>
<input className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-bold text-primary" type="number" value="10"/>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian (phút)</label>
<input className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-bold text-primary" type="number" value="90"/>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm ghost-border overflow-x-auto">
<h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
<span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Bảng Ma trận chi tiết
                        </h3>
<table className="w-full border-separate border-spacing-y-2">
<thead>
<tr className="text-left">
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase">Chương / Kiến thức</th>
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center bg-blue-50/50 rounded-t-lg">Nhận biết</th>
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center bg-green-50/50 rounded-t-lg">Thông hiểu</th>
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center bg-orange-50/50 rounded-t-lg">Vận dụng</th>
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center bg-red-50/50 rounded-t-lg">Vận dụng cao</th>
<th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center">Tổng cộng</th>
</tr>
</thead>
<tbody className="text-sm">

<tr className="bg-surface-container-low transition-colors hover:bg-surface-container">
<td className="py-4 px-4 font-bold rounded-l-xl border-l-4 border-primary">Chương I: Hàm số</td>
<td className="py-4 px-2 text-center bg-blue-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="4"/>
<span className="text-[10px] text-slate-400">1.0đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-green-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="3"/>
<span className="text-[10px] text-slate-400">0.75đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-orange-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="2"/>
<span className="text-[10px] text-slate-400">0.5đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-red-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="1"/>
<span className="text-[10px] text-slate-400">0.25đ</span>
</div>
</td>
<td className="py-4 px-4 text-center font-bold text-primary rounded-r-xl">10 câu</td>
</tr>

<tr className="bg-surface-container-low transition-colors hover:bg-surface-container">
<td className="py-4 px-4 font-bold rounded-l-xl border-l-4 border-primary">Chương II: Mũ &amp; Lôgarit</td>
<td className="py-4 px-2 text-center bg-blue-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="3"/>
<span className="text-[10px] text-slate-400">0.75đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-green-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="2"/>
<span className="text-[10px] text-slate-400">0.5đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-orange-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="2"/>
<span className="text-[10px] text-slate-400">0.5đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-red-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="0"/>
<span className="text-[10px] text-slate-400">0đ</span>
</div>
</td>
<td className="py-4 px-4 text-center font-bold text-primary rounded-r-xl">7 câu</td>
</tr>

<tr className="bg-surface-container-low transition-colors hover:bg-surface-container">
<td className="py-4 px-4 font-bold rounded-l-xl border-l-4 border-primary">Chương III: Nguyên hàm</td>
<td className="py-4 px-2 text-center bg-blue-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="5"/>
<span className="text-[10px] text-slate-400">1.25đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-green-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="4"/>
<span className="text-[10px] text-slate-400">1.0đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-orange-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="3"/>
<span className="text-[10px] text-slate-400">0.75đ</span>
</div>
</td>
<td className="py-4 px-2 text-center bg-red-50/20">
<div className="flex flex-col gap-1 items-center">
<input className="w-12 h-8 text-center bg-white border-none rounded shadow-sm text-xs p-1" type="number" value="1"/>
<span className="text-[10px] text-slate-400">0.25đ</span>
</div>
</td>
<td className="py-4 px-4 text-center font-bold text-primary rounded-r-xl">13 câu</td>
</tr>
</tbody>
<tfoot>
<tr className="font-headline font-bold">
<td className="py-6 px-4">Tổng số câu</td>
<td className="py-6 text-center text-blue-700">12 (30%)</td>
<td className="py-6 text-center text-green-700">9 (22.5%)</td>
<td className="py-6 text-center text-orange-700">7 (17.5%)</td>
<td className="py-6 text-center text-red-700">2 (5%)</td>
<td className="py-6 text-center bg-primary text-white rounded-xl shadow-lg">30/40</td>
</tr>
</tfoot>
</table>
</section>
</div>

<div className="col-span-12 lg:col-span-4 space-y-8">

<section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm ghost-border">
<h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
<span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                            Tỷ lệ nhận thức
                        </h3>
<div className="relative flex items-center justify-center py-8">

<svg className="w-48 h-48 transform -rotate-90" viewbox="0 0 36 36">
<circle className="stroke-slate-100" cx="18" cy="18" fill="none" r="16" strokeWidth="4" /></circle>
<circle className="stroke-blue-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="40 100" strokeWidth="4" /></circle>
<circle className="stroke-green-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="30 100" strokeDashoffset="-40" strokeWidth="4" /></circle>
<circle className="stroke-orange-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="20 100" strokeDashoffset="-70" strokeWidth="4" /></circle>
<circle className="stroke-red-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="4" /></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-3xl font-extrabold text-on-surface">10.0</span>
<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Điểm tối đa</span>
</div>
</div>
<div className="grid grid-cols-2 gap-4 mt-6">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-blue-500"></div>
<span className="text-xs font-medium text-slate-600">Nhận biết: 40%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-green-500"></div>
<span className="text-xs font-medium text-slate-600">Thông hiểu: 30%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-orange-500"></div>
<span className="text-xs font-medium text-slate-600">Vận dụng: 20%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-red-500"></div>
<span className="text-xs font-medium text-slate-600">Vận dụng cao: 10%</span>
</div>
</div>
</section>

<section className="flex flex-col gap-4">
<button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
<span className="material-symbols-outlined" data-icon="save">save</span>
                            Lưu ma trận
                        </button>
<button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-on-surface font-bold py-4 rounded-xl hover:bg-slate-50 transition-all">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
                            Xuất file PDF
                        </button>
<button className="w-full flex items-center justify-center gap-3 bg-secondary text-white font-bold py-4 rounded-xl shadow-md hover:bg-secondary/90 transition-all">
<span className="material-symbols-outlined" data-icon="quiz">quiz</span>
                            Tạo đề thi ngay
                        </button>
</section>

<section className="bg-tertiary-fixed p-6 rounded-2xl">
<div className="flex gap-4">
<span className="material-symbols-outlined text-tertiary" data-icon="lightbulb">lightbulb</span>
<div className="space-y-1">
<h4 className="font-bold text-on-tertiary-fixed text-sm">Lời khuyên sư phạm</h4>
<p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">Đảm bảo tỷ lệ câu hỏi vận dụng cao không vượt quá 15% đối với các bài kiểm tra định kỳ để duy trì tính phân hóa tốt.</p>
</div>
</div>
</section>
</div>
</div>
</main>
</div>

    </div>
      </>
  );
};

export default CauHinhMaTranEThiGiangVien;
