import React from "react";

const StudentHeader = () => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight">
          Chào buổi sáng, Minh!
        </h1>
        <p className="text-tertiary text-sm mt-1">
          Hôm nay bạn có 2 bài kiểm tra sắp tới.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span
              className="material-symbols-outlined text-xl"
              data-icon="search"
            >
              search
            </span>
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
            placeholder="Tìm kiếm tài liệu, lớp học..."
            type="text"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
        </button>
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-surface-container">
          <div className="text-right">
            <p className="text-sm font-bold">Nguyễn Văn Minh</p>
            <p className="text-xs text-tertiary">Sinh viên năm 3</p>
          </div>
          <img
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed"
            data-alt="User profile avatar of a male student"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhosvuDhozVraGcfS66HdqiSHmrHGBAOCb8SPIf6fmvoe3heCMGA-EkO93vlfLkHyclVsj2Z3oqm2Cn6icz3QJxnPVdYRTx1OvNGmh63DcrHlzcV-MOG2dizSbJQUIpyyoxpHHZnOMjpkVyvNaH6KTR--Do5V5fumm0VZ0lZrr8o_2uDLr0pXU6vTkQ1c65lO7ciOLQG48IhxloWMZNp7GJ0NoppQ5dbgLqetEks4WNtLDWmLbQEgUj63Jc2DqokpAtJ7rVq7Ha0Y"
          />
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
