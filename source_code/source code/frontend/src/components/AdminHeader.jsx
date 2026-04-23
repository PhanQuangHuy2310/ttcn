// src/components/AdminHeader.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminHeader = () => {
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

  const initial = (profile?.full_name ?? 'A').charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8">
      <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 w-96">
        <span className="material-symbols-outlined text-outline text-sm mr-2" data-icon="search">search</span>
        <input
          className="bg-transparent text-sm focus:outline-none w-full text-on-surface placeholder-outline"
          placeholder="Tìm kiếm người dùng, lớp, bài thi..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface leading-none">{profile?.full_name ?? '...'}</p>
            <p className="text-xs text-outline mt-0.5">Quản trị viên</p>
          </div>
          <Link to="/common/profile-dhdedu">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform">
              {initial}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
