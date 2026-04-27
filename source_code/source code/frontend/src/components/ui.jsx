// src/components/ui.jsx
// Shared primitive components used across all pages.

import React from 'react';

// Loading skeleton
export const Sk = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

// Stat card — used in all dashboards
export const StatCard = ({ icon, iconBg, label, value, sub, loading, onClick }) => (
  <div
    className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200' : ''}`}
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</p>
      {loading
        ? <Sk className="h-7 w-16 mt-1" />
        : <p className="text-2xl font-black text-slate-800 mt-0.5">{value ?? '—'}</p>
      }
      {sub && !loading && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// Empty state
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">{icon}</span>
    <p className="text-slate-600 font-semibold">{title}</p>
    {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Error banner
export const ErrorBanner = ({ message, onRetry }) => (
  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 mb-6">
    <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
    <p className="text-sm text-red-700 font-medium flex-1">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="text-xs font-bold text-red-600 hover:text-red-800 underline shrink-0">
        Thử lại
      </button>
    )}
  </div>
);

// Section card wrapper
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

// Card header with optional action
export const CardHeader = ({ title, action }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
    <h3 className="text-base font-bold text-slate-800">{title}</h3>
    {action}
  </div>
);

// Status badge
export const StatusBadge = ({ status }) => {
  const map = {
    DRAFT:        { label: 'Nháp',       cls: 'bg-slate-100 text-slate-600' },
    PUBLISHED:    { label: 'Đã mở',      cls: 'bg-green-100 text-green-700' },
    CLOSED:       { label: 'Đã đóng',    cls: 'bg-red-100 text-red-700' },
    GRADING:      { label: 'Đang chấm',  cls: 'bg-orange-100 text-orange-700' },
    NOT_STARTED:  { label: 'Chưa làm',   cls: 'bg-slate-100 text-slate-600' },
    IN_PROGRESS:  { label: 'Đang làm',   cls: 'bg-blue-100 text-blue-700' },
    SUBMITTED:    { label: 'Đã nộp',     cls: 'bg-green-100 text-green-700' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500' };
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// Role badge
export const RoleBadge = ({ role }) => {
  const map = {
    ADMIN:   { label: 'Admin',     cls: 'bg-red-50 text-red-700' },
    TEACHER: { label: 'Giáo viên', cls: 'bg-blue-50 text-blue-700' },
    STUDENT: { label: 'Sinh viên', cls: 'bg-green-50 text-green-700' },
  };
  const { label, cls } = map[role] ?? { label: role, cls: 'bg-slate-100 text-slate-500' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

// Avatar with fallback initials
export const Avatar = ({ name, avatarUrl, size = 'md', colorClass = 'from-slate-300 to-slate-400' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initial = (name ?? 'U').charAt(0).toUpperCase();
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold shrink-0 overflow-hidden`}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        : initial
      }
    </div>
  );
};

// Page header section
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-black font-headline text-slate-800 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </div>
);

// Time ago helper
export const timeAgo = iso => {
  if (!iso) return '—';
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1)    return 'Vừa xong';
  if (d < 60)   return `${d} phút trước`;
  if (d < 1440) return `${Math.floor(d / 60)} giờ trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
};

// Format date
export const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Format datetime
export const fmtDateTime = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};
