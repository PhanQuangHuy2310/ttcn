// src/components/ui.jsx
// DHDedu design system — single source of truth for all UI primitives.
// UPDATED: Added Button component, Modal, ConfirmDialog, Toast helpers, improved Skeleton.

import React, { useEffect, useRef } from 'react';

// ── Button ─────────────────────────────────────────────────────
// Usage: <Btn>Primary</Btn>  <Btn variant="outline">Cancel</Btn>
//        <Btn variant="danger" icon="delete">Delete</Btn>
//        <Btn loading>Saving...</Btn>
export const Btn = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled,
  className = '',
  type = 'button',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 focus-visible:ring-primary shadow-md shadow-primary/20',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 shadow-sm',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md shadow-red-600/20',
    ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-md shadow-green-600/20',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400',
  };

  const sizes = {
    xs: 'h-7  px-3   text-xs',
    sm: 'h-8  px-3.5 text-xs',
    md: 'h-10 px-5   text-sm',
    lg: 'h-12 px-6   text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
        : icon && <span className="material-symbols-outlined text-[18px] shrink-0">{icon}</span>
      }
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="material-symbols-outlined text-[18px] shrink-0">{iconRight}</span>}
    </button>
  );
};

// Icon-only button
export const IconBtn = ({ icon, label, variant = 'ghost', size = 'md', loading, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-slate-400',
    danger: 'text-red-500 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-400',
    primary: 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary',
  };
  const sizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-10 h-10' };
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        : <span className="material-symbols-outlined text-[18px]">{icon}</span>
      }
    </button>
  );
};

// ── Loading skeleton ────────────────────────────────────────────
export const Sk = ({ className = '' }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

// Row skeleton for tables
export const SkRow = ({ cols = 1 }) => (
  <tr className="animate-pulse border-b border-slate-50">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded-md w-full"></div>
      </td>
    ))}
  </tr>
);

// ── Stat card ───────────────────────────────────────────────────
export const StatCard = ({ icon, iconBg, label, value, sub, loading, onClick, trend }) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary' : ''
      }`}
    onClick={onClick}
    onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</p>
      {loading
        ? <Sk className="h-7 w-20 mt-1" />
        : (
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-800 mt-0.5 tabular-nums">{value ?? '—'}</p>
            {trend !== undefined && (
              <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
              </span>
            )}
          </div>
        )
      }
      {sub && !loading && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Empty state ─────────────────────────────────────────────────
export const EmptyState = ({ icon = 'inbox', title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-slate-300 text-3xl">{icon}</span>
    </div>
    <p className="text-slate-700 font-semibold">{title}</p>
    {subtitle && <p className="text-slate-400 text-sm mt-1 max-w-xs">{subtitle}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// ── Error banner ────────────────────────────────────────────────
export const ErrorBanner = ({ message, onRetry }) => (
  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-red-500 text-lg">error</span>
    </div>
    <p className="text-sm text-red-700 font-medium flex-1">{message}</p>
    {onRetry && (
      <Btn variant="ghost" size="xs" onClick={onRetry} icon="refresh" className="text-red-600 hover:bg-red-100 shrink-0">
        Thử lại
      </Btn>
    )}
  </div>
);

// ── Card ────────────────────────────────────────────────────────
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
    <div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// ── Modal ───────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current) onClose?.(); }}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <IconBtn icon="close" label="Đóng" onClick={onClose} />
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ── Confirm dialog ──────────────────────────────────────────────
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmLabel = 'Xác nhận',
  confirmVariant = 'danger',
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
    <p className="text-sm text-slate-600 leading-relaxed mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Btn variant="outline" onClick={onClose} disabled={loading}>Huỷ</Btn>
      <Btn variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmLabel}</Btn>
    </div>
  </Modal>
);

// ── Status badge ────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    DRAFT: { label: 'Nháp', cls: 'bg-slate-100 text-slate-600' },
    PUBLISHED: { label: 'Đã mở', cls: 'bg-green-100 text-green-700' },
    CLOSED: { label: 'Đã đóng', cls: 'bg-red-100 text-red-700' },
    GRADING: { label: 'Đang chấm', cls: 'bg-orange-100 text-orange-700' },
    NOT_STARTED: { label: 'Chưa làm', cls: 'bg-slate-100 text-slate-600' },
    IN_PROGRESS: { label: 'Đang làm', cls: 'bg-blue-100 text-blue-700' },
    SUBMITTED: { label: 'Đã nộp', cls: 'bg-green-100 text-green-700' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500' };
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
};

// ── Role badge ──────────────────────────────────────────────────
export const RoleBadge = ({ role }) => {
  const map = {
    ADMIN: { label: 'Admin', cls: 'bg-red-50 text-red-700' },
    TEACHER: { label: 'Giáo viên', cls: 'bg-blue-50 text-blue-700' },
    STUDENT: { label: 'Sinh viên', cls: 'bg-green-50 text-green-700' },
  };
  const { label, cls } = map[role] ?? { label: role, cls: 'bg-slate-100 text-slate-500' };
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
};

// ── Avatar ──────────────────────────────────────────────────────
export const Avatar = ({ name, avatarUrl, size = 'md', colorClass = 'from-slate-400 to-slate-500' }) => {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initial = (name ?? 'U').trim().charAt(0).toUpperCase();
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold shrink-0 overflow-hidden`}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        : initial
      }
    </div>
  );
};

// ── Page header ─────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions, back }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
    <div>
      {back && (
        <button onClick={back} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 mb-2 transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Quay lại
        </button>
      )}
      <h1 className="text-3xl font-black font-headline text-slate-800 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
  </div>
);

// ── Input / Select / Textarea ───────────────────────────────────
export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-400 transition-all ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
        } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Select = React.forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white ${error ? 'border-red-300' : 'border-slate-200'
        } ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = 'Select';

export const Textarea = React.forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-400 transition-all resize-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
        } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// ── Search input ────────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = 'Tìm kiếm...', className = '' }) => (
  <div className={`relative ${className}`}>
    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">search</span>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    )}
  </div>
);

// ── Filter tabs ─────────────────────────────────────────────────
export const FilterTabs = ({ options, value, onChange }) => (
  <div className="flex gap-1.5 flex-wrap">
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${value === opt.value
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
          }`}
      >
        {opt.label}
        {opt.count !== undefined && (
          <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${value === opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
            {opt.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ── Table helpers ───────────────────────────────────────────────
export const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">{children}</table>
  </div>
);

export const Th = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-6 py-3.5 border-b border-slate-50 ${className}`}>{children}</td>
);

// ── Score badge ─────────────────────────────────────────────────
export const ScoreBadge = ({ score }) => {
  if (score === null || score === undefined) return <span className="text-xs text-slate-400">Chưa chấm</span>;
  const num = parseFloat(score);
  const cls = num >= 8 ? 'text-green-700 bg-green-50 border-green-100'
    : num >= 6.5 ? 'text-blue-700 bg-blue-50 border-blue-100'
      : num >= 5 ? 'text-orange-700 bg-orange-50 border-orange-100'
        : 'text-red-700 bg-red-50 border-red-100';
  return (
    <span className={`inline-flex items-center justify-center w-14 h-7 text-xs font-black rounded-lg border ${cls}`}>
      {num.toFixed(1)}
    </span>
  );
};

// ── Divider ─────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px bg-slate-100" />
    {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ── Progress bar ────────────────────────────────────────────────
export const ProgressBar = ({ value, max = 100, colorClass = 'bg-primary', className = '' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-2 bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ── Helpers ─────────────────────────────────────────────────────
export const timeAgo = iso => {
  if (!iso) return '—';
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return 'Vừa xong';
  if (d < 60) return `${d} phút trước`;
  if (d < 1440) return `${Math.floor(d / 60)} giờ trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
};

export const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const fmtDateTime = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export const fmtDuration = minutes => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} phút`;
  return `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? ` ${minutes % 60}p` : ''}`;
};
