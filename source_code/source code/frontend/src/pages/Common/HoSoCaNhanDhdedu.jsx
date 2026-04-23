// src/pages/Common/HoSoCaNhanDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
// Same logic as HoSoCaNhanDhdeduVietHoa — different outer wrapper (pt-16 flex)
import React, { useState, useEffect } from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const HoSoCaNhanDhdedu = () => {
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [form,     setForm]     = useState({ full_name: '' });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await studentService.getProfile(user.id);
      setProfile(data);
      setForm({ full_name: data?.full_name ?? '' });
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data } = await studentService.updateProfile(profile.id, { full_name: form.full_name });
    setProfile(data);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  };

  const roleLabel = (role) => ({ ADMIN: 'Quản trị viên', TEACHER: 'Giáo viên', STUDENT: 'Sinh viên' }[role] ?? role);
  const initial   = (n) => (n ?? 'U').split(' ').pop().charAt(0).toUpperCase();

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonHeader />
      <div className="flex pt-16">
        <CommonSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-surface p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✅ Đã cập nhật hồ sơ</div>}

            {/* Cover + avatar */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,28,56,0.06)] overflow-hidden relative">
              <div className="h-48 w-full bg-gradient-to-r from-primary to-primary-container relative">
                <div className="absolute inset-0 opacity-20" />
              </div>
              <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6 relative">
                <div className="relative shrink-0">
                  {loading ? <Skeleton className="w-32 h-32 rounded-2xl border-4 border-white" /> : (
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-4xl font-black">{initial(profile?.full_name)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  {loading ? (
                    <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-32" /></div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-black text-on-surface">{profile?.full_name ?? '—'}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${profile?.role === 'TEACHER' ? 'bg-blue-50 text-blue-700' : profile?.role === 'ADMIN' ? 'bg-red-50 text-red-700' : 'bg-primary/10 text-primary'}`}>
                          {roleLabel(profile?.role)}
                        </span>
                        <span className="text-sm text-slate-500">{profile?.email}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="pb-2">
                  {editing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50">Hủy</button>
                      <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60">
                        {saving ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-high transition-all">
                      <span className="material-symbols-outlined text-base">edit</span>
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8">
              <h2 className="text-lg font-bold mb-6">Thông tin cá nhân</h2>
              {loading ? (
                <div className="grid grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Họ và tên</label>
                    {editing ? (
                      <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-surface-container-low rounded-xl text-sm">{profile?.full_name ?? '—'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Email</label>
                    <p className="px-4 py-3 bg-surface-container-low rounded-xl text-sm text-slate-400">{profile?.email ?? '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Vai trò</label>
                    <p className="px-4 py-3 bg-surface-container-low rounded-xl text-sm">{roleLabel(profile?.role)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Mã số</label>
                    <p className="px-4 py-3 bg-surface-container-low rounded-xl text-sm font-mono text-slate-400">
                      {profile?.student_id ?? profile?.teacher_code ?? '—'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Ngày tham gia</label>
                    <p className="px-4 py-3 bg-surface-container-low rounded-xl text-sm text-slate-400">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { dateStyle: 'long' }) : '—'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HoSoCaNhanDhdedu;
