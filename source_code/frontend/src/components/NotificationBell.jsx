// src/components/NotificationBell.jsx
// PHASE 3.9: Real-time notification bell for AppLayout header
// Replaces the static bell icon in AppLayout

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/authentication/authenticationSlice';
import { useNotifications } from '../hooks/useNotifications';
import { timeAgo } from './ui';

const NOTIF_ICONS = {
  EXAM_OPEN:    { icon: 'quiz',              color: 'text-purple-600', bg: 'bg-purple-50' },
  EXAM_GRADED:  { icon: 'grade',             color: 'text-green-600',  bg: 'bg-green-50'  },
  CLASS_JOIN:   { icon: 'group_add',         color: 'text-blue-600',   bg: 'bg-blue-50'   },
  MATERIAL:     { icon: 'folder_open',       color: 'text-orange-600', bg: 'bg-orange-50' },
  SYSTEM:       { icon: 'notifications',     color: 'text-slate-600',  bg: 'bg-slate-100' },
};

const NotificationBell = () => {
  const profile   = useSelector(selectProfile);
  const [open,    setOpen]    = useState(false);
  const panelRef  = useRef(null);

  const { notifications, unreadCount, markRead, markAllRead, loading } =
    useNotifications(profile?.id);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (notif) => {
    if (!notif.read_status) await markRead(notif.id);
    if (notif.link) window.location.href = notif.link;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Thông báo"
      >
        <span className="material-symbols-outlined text-slate-500 text-xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-800">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <span className="material-symbols-outlined text-slate-300 text-3xl animate-spin">progress_activity</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <span className="material-symbols-outlined text-slate-200 text-4xl">notifications_off</span>
                <p className="text-slate-400 text-xs mt-2">Không có thông báo</p>
              </div>
            ) : (
              notifications.map(notif => {
                const conf = NOTIF_ICONS[notif.type] ?? NOTIF_ICONS.SYSTEM;
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none ${
                      !notif.read_status ? 'bg-primary/3' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${conf.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`material-symbols-outlined text-base ${conf.color}`}>{conf.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!notif.read_status ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.body}</p>
                      )}
                      <p className="text-[10px] text-slate-300 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                    {!notif.read_status && (
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
