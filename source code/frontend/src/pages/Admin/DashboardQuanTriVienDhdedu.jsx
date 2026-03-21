import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

const DashboardQuanTriVienDhdedu = () => {
  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      
      

<AdminSidebar />

<AdminHeader />

<main className="ml-64 pt-16 p-8 min-h-screen">
<div className="max-w-7xl mx-auto space-y-8">

<section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">Chào buổi sáng, Quản trị viên</h1>
<p className="text-outline mt-1">Dưới đây là tổng quan hiệu suất hệ thống DHDedu hôm nay.</p>
</div>
<div className="flex gap-3">
<button className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface shadow-sm hover:bg-surface-container transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
                        Xuất báo cáo
                    </button>
<button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="add">add</span>
                        Tạo kỳ thi mới
                    </button>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
<div className="flex justify-between items-start">
<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-2xl" data-icon="person">person</span>
</div>
<span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
</div>
<div className="mt-4">
<p className="text-outline text-sm font-medium">Tổng người dùng</p>
<h3 className="text-3xl font-black font-headline mt-1">12,482</h3>
<div className="flex gap-4 mt-2">
<span className="text-[11px] text-outline">GV: 840</span>
<span className="text-[11px] text-outline">SV: 11,642</span>
</div>
</div>
</div>
<div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
<div className="flex justify-between items-start">
<div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-2xl" data-icon="school">school</span>
</div>
<span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4.5%</span>
</div>
<div className="mt-4">
<p className="text-outline text-sm font-medium">Số lớp học</p>
<h3 className="text-3xl font-black font-headline mt-1">358</h3>
<p className="text-[11px] text-outline mt-2">24 lớp mới trong tuần này</p>
</div>
</div>
<div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
<div className="flex justify-between items-start">
<div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-2xl" data-icon="quiz">quiz</span>
</div>
<span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">-2.1%</span>
</div>
<div className="mt-4">
<p className="text-outline text-sm font-medium">Số kỳ thi</p>
<h3 className="text-3xl font-black font-headline mt-1">1,204</h3>
<p className="text-[11px] text-outline mt-2">42 kỳ thi đang diễn ra</p>
</div>
</div>
<div className="p-6 rounded-[2rem] bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-white">
<div className="flex justify-between items-start">
<div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-2xl" data-icon="database">database</span>
</div>
<span className="text-xs font-bold text-on-surface bg-surface-container px-2 py-1 rounded-full">82%</span>
</div>
<div className="mt-4">
<p className="text-outline text-sm font-medium">Dung lượng lưu trữ</p>
<h3 className="text-3xl font-black font-headline mt-1">4.1 <span className="text-lg font-bold">TB</span></h3>
<div className="w-full bg-surface-container rounded-full h-1.5 mt-3">
<div className="bg-primary h-1.5 rounded-full" ></div>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm border border-white relative overflow-hidden">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="text-xl font-black font-headline tracking-tight">Lượng truy cập hệ thống</h3>
<p className="text-xs text-outline font-medium">Thống kê theo thời gian thực 7 ngày gần nhất</p>
</div>
<select className="bg-surface-container border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-0">
<option>7 ngày qua</option>
<option>30 ngày qua</option>
</select>
</div>
<div className="h-64 flex items-end justify-between gap-2 relative">

<div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
<svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 400 100">
<path className="text-primary" d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10" fill="none" stroke="currentColor" strokeWidth="4" /></path>
</svg>
</div>

<div className="w-full h-full flex items-end justify-between px-2">
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[40%]"></div>
<span className="text-[10px] font-bold text-outline">T2</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[65%]"></div>
<span className="text-[10px] font-bold text-outline">T3</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary rounded-t-lg transition-all h-[90%]"></div>
<span className="text-[10px] font-bold text-primary">T4</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[55%]"></div>
<span className="text-[10px] font-bold text-outline">T5</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[75%]"></div>
<span className="text-[10px] font-bold text-outline">T6</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[45%]"></div>
<span className="text-[10px] font-bold text-outline">T7</span>
</div>
<div className="group relative w-full flex flex-col items-center gap-2">
<div className="w-4/5 bg-primary/10 rounded-t-lg transition-all group-hover:bg-primary/30 h-[30%]"></div>
<span className="text-[10px] font-bold text-outline">CN</span>
</div>
</div>
</div>
</div>

<div className="p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm border border-white">
<h3 className="text-xl font-black font-headline tracking-tight mb-6">Phân bổ người dùng</h3>
<div className="flex flex-col items-center">

<div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center mb-8">
<div className="absolute inset-0 rounded-full border-[16px] border-primary border-r-transparent border-b-transparent -rotate-45"></div>
<div className="text-center">
<p className="text-2xl font-black font-headline">12.4k</p>
<p className="text-[10px] font-bold uppercase text-outline">Tổng số</p>
</div>
</div>
<div className="w-full space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-sm font-medium">Sinh viên</span>
</div>
<span className="text-sm font-bold">92%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-orange-400"></span>
<span className="text-sm font-medium">Giáo viên</span>
</div>
<span className="text-sm font-bold">6%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-slate-300"></span>
<span className="text-sm font-medium">Quản trị</span>
</div>
<span className="text-sm font-bold">2%</span>
</div>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="p-8 rounded-[2.5rem] bg-surface-container-lowest shadow-sm border border-white">
<div className="flex items-center justify-between mb-8">
<h3 className="text-xl font-black font-headline tracking-tight">Hoạt động gần đây</h3>
<button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
</div>
<div className="space-y-6">
<div className="flex gap-4">
<div className="mt-1 w-10 h-10 rounded-full bg-green-50 text-green-600 flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="login">login</span>
</div>
<div>
<p className="text-sm font-bold">Giáo viên <span className="text-primary">Nguyễn Văn A</span> đã đăng nhập</p>
<p className="text-xs text-outline mt-0.5">2 phút trước • Từ IP: 192.168.1.1</p>
</div>
</div>
<div className="flex gap-4">
<div className="mt-1 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="cloud_upload">cloud_upload</span>
</div>
<div>
<p className="text-sm font-bold">Hệ thống đã sao lưu dữ liệu tự động</p>
<p className="text-xs text-outline mt-0.5">45 phút trước • Kích thước: 1.2GB</p>
</div>
</div>
<div className="flex gap-4">
<div className="mt-1 w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="warning">warning</span>
</div>
<div>
<p className="text-sm font-bold">Phát hiện truy cập bất thường</p>
<p className="text-xs text-outline mt-0.5">2 giờ trước • Tài khoản sv_test_01</p>
</div>
</div>
<div className="flex gap-4">
<div className="mt-1 w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-lg" data-icon="settings_suggest">settings_suggest</span>
</div>
<div>
<p className="text-sm font-bold">Cập nhật cấu hình bảo mật hệ thống</p>
<p className="text-xs text-outline mt-0.5">5 giờ trước • Bởi Admin</p>
</div>
</div>
</div>
</div>

<div className="p-8 rounded-[2.5rem] bg-surface-container-low/50 shadow-inner space-y-4">
<h3 className="text-xl font-black font-headline tracking-tight mb-4 px-2">Quản lý nhanh</h3>
<a className="flex items-center justify-between p-5 bg-white rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all duration-300" href="#">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="admin_panel_settings">admin_panel_settings</span>
</div>
<div>
<p className="font-bold">Phân quyền người dùng</p>
<p className="text-xs text-outline">Quản lý vai trò và quyền truy cập</p>
</div>
</div>
<span className="material-symbols-outlined text-outline" data-icon="chevron_right">chevron_right</span>
</a>
<a className="flex items-center justify-between p-5 bg-white rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all duration-300" href="#">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="settings_input_component">settings_input_component</span>
</div>
<div>
<p className="font-bold">Cấu hình hệ thống</p>
<p className="text-xs text-outline">Tham số máy chủ, API và Email</p>
</div>
</div>
<span className="material-symbols-outlined text-outline" data-icon="chevron_right">chevron_right</span>
</a>
<a className="flex items-center justify-between p-5 bg-white rounded-3xl hover:shadow-md hover:-translate-y-1 transition-all duration-300" href="#">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="security">security</span>
</div>
<div>
<p className="font-bold">Trung tâm Bảo mật</p>
<p className="text-xs text-outline">Nhật ký truy cập và SSL certificates</p>
</div>
</div>
<span className="material-symbols-outlined text-outline" data-icon="chevron_right">chevron_right</span>
</a>
<div className="pt-2">
<div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
<div className="flex items-center gap-3 mb-3">
<span className="material-symbols-outlined text-primary" data-icon="info">info</span>
<p className="text-sm font-bold text-primary">Tình trạng hệ thống</p>
</div>
<div className="flex justify-between items-center text-xs">
<span className="text-on-surface-variant">Uptime: 99.98%</span>
<span className="flex items-center gap-1 text-green-600">
<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Đang hoạt động tốt
                                </span>
</div>
</div>
</div>
</div>
</section>
</div>
</main>

    </div>
      </>
  );
};

export default DashboardQuanTriVienDhdedu;
