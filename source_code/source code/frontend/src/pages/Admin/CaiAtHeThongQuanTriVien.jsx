// src/pages/Admin/CaiAtHeThongQuanTriVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import { supabase } from '../../lib/supabase';
import { adminService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const CaiAtHeThongQuanTriVien = () => {
  const [settings,  setSettings]  = useState({});
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState(null);
  const [success,   setSuccess]   = useState(false);
  const [userId,    setUserId]    = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
      const { data, error: err } = await adminService.getSystemSettings();
      if (err) { setError(err.message); setLoading(false); return; }
      // Convert array of {key, value} to object
      const map = {};
      (data ?? []).forEach(s => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await adminService.updateSystemSetting(key, value, userId);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.message ?? 'Lỗi lưu cài đặt');
    }
    setSaving(false);
  };

  const get = (key, fallback = '') => {
    const v = settings[key];
    if (v === undefined || v === null) return fallback;
    if (typeof v === 'string') return v.replace(/^"|"$/g, '');
    return v;
  };

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          <AdminHeader />
          <div className="p-8 max-w-7xl mx-auto w-full space-y-10">

            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Cấu hình chung</h2>
              <p className="text-slate-500 font-body max-w-2xl">
                Quản lý các thiết lập cơ bản của hệ thống, nhận diện thương hiệu và trạng thái hoạt động của nền tảng.
              </p>
            </div>

            {error   && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}
            {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✅ Đã lưu cài đặt thành công</div>}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Main settings */}
              <section className="lg:col-span-8 bg-surface-container-lowest rounded-[24px] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" data-icon="info">info</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">Thông tin cơ bản</h3>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Tên hệ thống</label>
                        <input
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                          type="text"
                          value={get('site_name', 'DHDedu')}
                          onChange={e => set('site_name', `"${e.target.value}"`)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Thời gian thi tối đa (phút)</label>
                        <input
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                          type="number" min="15" max="360"
                          value={get('max_exam_duration', 180)}
                          onChange={e => set('max_exam_duration', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Số sinh viên tối đa / lớp</label>
                        <input
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                          type="number" min="1" max="200"
                          value={get('max_students_class', 50)}
                          onChange={e => set('max_students_class', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Cho phép tự đăng ký</label>
                        <select
                          className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                          value={String(get('allow_registration', true))}
                          onChange={e => set('allow_registration', e.target.value === 'true')}
                        >
                          <option value="true">Có</option>
                          <option value="false">Không</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Chế độ bảo trì</label>
                      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                        <div
                          onClick={() => set('maintenance_mode', !get('maintenance_mode', false))}
                          className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${get('maintenance_mode', false) ? 'bg-error' : 'bg-slate-200'} relative`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow ${get('maintenance_mode', false) ? 'right-1' : 'left-1'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {get('maintenance_mode', false) ? '⚠️ Hệ thống đang bảo trì' : 'Hệ thống hoạt động bình thường'}
                          </p>
                          <p className="text-xs text-slate-400">Khi bật, người dùng sẽ thấy trang thông báo bảo trì</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Quick actions sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Trạng thái hệ thống</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Database',  status: 'Hoạt động', ok: true },
                      { label: 'Supabase Auth', status: 'Hoạt động', ok: true },
                      { label: 'Storage',   status: 'Hoạt động', ok: true },
                      { label: 'Edge Functions', status: 'Sẵn sàng', ok: true },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{s.label}</span>
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${s.ok ? 'text-green-600' : 'text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">refresh</span>Đang lưu...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">save</span>Lưu cài đặt</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaiAtHeThongQuanTriVien;
