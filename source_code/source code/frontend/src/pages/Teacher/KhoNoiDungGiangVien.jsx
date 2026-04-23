// src/pages/Teacher/KhoNoiDungGiangVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TYPE_ICONS = { PDF: 'picture_as_pdf', VIDEO: 'play_circle', AUDIO: 'audio_file', SCORM: 'folder_zip' };
const TYPE_COLORS = { PDF: 'text-red-500 bg-red-50', VIDEO: 'text-blue-500 bg-blue-50', AUDIO: 'text-purple-500 bg-purple-50', SCORM: 'text-orange-500 bg-orange-50' };

const KhoNoiDungGiangVien = () => {
  const [materials, setMaterials] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [typeFilter,setTypeFilter]= useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error: err } = await teacherService.getMaterials(user.id);
      if (err) setError(err.message);
      else setMaterials(data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = materials.filter(m => {
    const matchSearch = !search     || m.title?.toLowerCase().includes(search.toLowerCase());
    const matchType   = !typeFilter || m.material_type === typeFilter;
    return matchSearch && matchType;
  });

  const fmtSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Kho nội dung</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <span className="hover:text-primary cursor-pointer">Tài liệu</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span>Tất cả</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">upload</span>
              Tải lên tài liệu
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {['PDF', 'VIDEO', 'AUDIO', 'SCORM'].map(type => {
              const count = materials.filter(m => m.material_type === type).length;
              return (
                <div key={type} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_COLORS[type]}`}>
                    <span className="material-symbols-outlined text-xl">{TYPE_ICONS[type]}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{type}</p>
                    {loading ? <Skeleton className="h-5 w-8 mt-1" /> : <p className="font-black text-on-surface">{count}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tất cả loại</option>
              {['PDF', 'VIDEO', 'AUDIO', 'SCORM'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Material list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">folder_open</span>
              <p>Chưa có tài liệu nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(m => {
                const tc = TYPE_COLORS[m.material_type] ?? 'text-slate-500 bg-slate-100';
                const ti = TYPE_ICONS[m.material_type] ?? 'description';
                return (
                  <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tc}`}>
                      <span className="material-symbols-outlined text-2xl">{ti}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-on-surface truncate">{m.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{fmtSize(m.size)} · {m.material_type}</p>
                      <a href={m.file_url} target="_blank" rel="noreferrer"
                        className="text-xs font-bold text-primary mt-1.5 inline-block hover:underline">
                        Xem tài liệu →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KhoNoiDungGiangVien;
