// src/pages/Teacher/MaterialLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate } from '../../components/ui';
import { materialsService } from '../../services/supabaseService';

const SIZE_LABEL = bytes => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

const MaterialLibrary = () => {
  const profile = useSelector(selectProfile);
  const [materials, setMaterials] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await materialsService.getByTeacher(profile.id);
      if (err) setError('Không thể tải kho tài liệu.');
      else setMaterials(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const ICON_MAP = { PDF: 'picture_as_pdf', VIDEO: 'play_circle', AUDIO: 'headphones', IMAGE: 'image', OTHER: 'attach_file' };

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Kho tài liệu" subtitle={`${materials.length} tài liệu`}
        actions={
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">upload</span> Tải lên tài liệu
          </button>
        }
      />
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Sk key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <span className="material-symbols-outlined text-slate-200 text-6xl">folder_open</span>
          <p className="text-slate-600 font-semibold mt-4">Kho tài liệu trống</p>
          <p className="text-slate-400 text-sm mt-1">Tải lên tài liệu để chia sẻ với sinh viên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(m => (
            <a key={m.id} href={m.file_url ?? '#'} target="_blank" rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/20 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-red-500">{ICON_MAP[m.material_type] ?? 'attach_file'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{m.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{SIZE_LABEL(m.size)} · {fmtDate(m.created_at)}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">open_in_new</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default MaterialLibrary;
