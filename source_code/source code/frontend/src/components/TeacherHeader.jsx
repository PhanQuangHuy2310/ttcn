// src/components/TeacherHeader.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TeacherHeader = () => {
  const [profile,    setProfile]    = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, notifs] = await Promise.all([
        supabase.from('users').select('full_name, role, teacher_code').eq('id', user.id).single(),
        supabase.from('notifications').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('read_status', false),
      ]);
      if (prof.data) setProfile(prof.data);
      setNotifCount(notifs.count ?? 0);
    }
    load();
  }, []);

  const initial = (profile?.full_name ?? 'T').charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
            placeholder="Tìm kiếm tài liệu, lớp học, sinh viên..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <span className="material-symbols-outlined">notifications</span>
          {notifCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{profile?.full_name ?? '...'}</p>
            <p className="text-xs text-slate-500">Giáo viên{profile?.teacher_code ? ` · ${profile.teacher_code}` : ''}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
