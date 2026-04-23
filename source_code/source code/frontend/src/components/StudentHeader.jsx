// src/components/StudentHeader.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StudentHeader = () => {
  const [profile,  setProfile]  = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, notifs] = await Promise.all([
        supabase.from('users').select('full_name, role, student_id').eq('id', user.id).single(),
        supabase.from('notifications').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('read_status', false),
      ]);
      if (prof.data) setProfile(prof.data);
      setNotifCount(notifs.count ?? 0);
    }
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  };

  const firstName = profile?.full_name?.split(' ').pop() ?? '...';
  const initial   = (profile?.full_name ?? 'S').charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight">
          {greeting()}, {firstName}!
        </h1>
        <p className="text-tertiary text-sm mt-1">
          {profile ? `Sinh viên · Mã số: ${profile.student_id ?? '—'}` : 'Đang tải...'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-xl" data-icon="search">search</span>
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
            placeholder="Tìm kiếm tài liệu, lớp học..."
            type="text"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-surface-container rounded-full transition-colors relative">
          <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-surface-container">
          <div className="text-right">
            <p className="text-sm font-bold">{profile?.full_name ?? '...'}</p>
            <p className="text-xs text-tertiary">Sinh viên</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold border-2 border-primary-fixed">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
