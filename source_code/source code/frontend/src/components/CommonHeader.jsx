// src/components/CommonHeader.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CommonHeader = () => {
  const [profile,    setProfile]    = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, notifs] = await Promise.all([
        supabase.from('users').select('full_name, role').eq('id', user.id).single(),
        supabase.from('notifications').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('read_status', false),
      ]);
      if (prof.data) setProfile(prof.data);
      setNotifCount(notifs.count ?? 0);
    }
    load();
  }, []);

  const initial = (profile?.full_name ?? 'U').charAt(0).toUpperCase();
  const roleLabel = (r) => ({ ADMIN: 'Quản trị viên', TEACHER: 'Giáo viên', STUDENT: 'Sinh viên' }[r] ?? 'Người dùng');

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
        <Link to="/common/profile-dhdedu" className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">{profile?.full_name ?? '...'}</p>
            <p className="text-xs text-slate-400">{roleLabel(profile?.role)}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default CommonHeader;
