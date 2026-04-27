// src/pages/Admin/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, ErrorBanner, Sk, PageHeader } from '../../components/ui';
import { settingsService } from '../../services/supabaseService';

const SETTING_GROUPS = [
  {
    group: 'Hệ thống',
    icon: 'settings',
    keys: [
      { key: 'site_name',        label: 'Tên hệ thống',          placeholder: 'DHDedu',    type: 'text' },
      { key: 'site_description', label: 'Mô tả hệ thống',        placeholder: 'Nền tảng học tập trực tuyến', type: 'text' },
      { key: 'maintenance_mode', label: 'Chế độ bảo trì',        placeholder: 'false',      type: 'select', options: ['false', 'true'] },
    ],
  },
  {
    group: 'Kỳ thi',
    icon: 'quiz',
    keys: [
      { key: 'exam_default_duration', label: 'Thời gian thi mặc định (phút)', placeholder: '60',  type: 'number' },
      { key: 'exam_max_attempts',     label: 'Số lần thi tối đa',            placeholder: '1',   type: 'number' },
      { key: 'exam_auto_submit',      label: 'Tự nộp khi hết giờ',           placeholder: 'true', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    group: 'Người dùng',
    icon: 'person',
    keys: [
      { key: 'allow_registration',    label: 'Cho phép đăng ký tự do',        placeholder: 'false', type: 'select', options: ['false', 'true'] },
      { key: 'session_timeout_hours', label: 'Hết phiên sau (giờ)',           placeholder: '24',    type: 'number' },
    ],
  },
];

const SystemSettings = () => {
  const [settings, setSettings] = useState({});   // { key: value }
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [dirty,    setDirty]    = useState({});    // track changed keys

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await settingsService.getAll();
    if (err) { setError('Không thể tải cài đặt hệ thống.'); setLoading(false); return; }
    const map = {};
    (data ?? []).forEach(s => { map[s.key] = s.value; });
    setSettings(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (key, value) => {
    setSettings(p => ({ ...p, [key]: value }));
    setDirty(p => ({ ...p, [key]: true }));
    setSuccess(false);
  };

  const handleSave = async () => {
    const changedKeys = Object.keys(dirty);
    if (!changedKeys.length) return;
    setSaving(true);
    setError(null);
    const upsertRows = changedKeys.map(key => ({ key, value: settings[key] ?? '' }));
    const { error: err } = await settingsService.upsert(upsertRows);
    if (err) setError('Lưu cài đặt thất bại. Vui lòng thử lại.');
    else { setSuccess(true); setDirty({}); setTimeout(() => setSuccess(false), 3000); }
    setSaving(false);
  };

  const hasDirty = Object.keys(dirty).length > 0;

  return (
    <AppLayout role="ADMIN">
      <PageHeader
        title="Cài đặt hệ thống"
        subtitle="Quản lý cấu hình tổng thể của nền tảng DHDedu"
        actions={
          <button
            onClick={handleSave}
            disabled={!hasDirty || saving}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-40 transition flex items-center gap-2"
          >
            {saving
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu...</>
              : <><span className="material-symbols-outlined text-lg">save</span>Lưu thay đổi</>
            }
          </button>
        }
      />

      {error   && <ErrorBanner message={error} onRetry={load} />}
      {success  && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-green-500">check_circle</span>
          <p className="text-sm text-green-700 font-medium">Cài đặt đã được lưu thành công!</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <Sk key={i} className="h-48 w-full rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-6">
          {SETTING_GROUPS.map(group => (
            <Card key={group.group}>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">{group.icon}</span>
                    {group.group}
                  </span>
                }
              />
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.keys.map(({ key, label, placeholder, type, options }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {label}
                      {dirty[key] && <span className="ml-2 text-orange-500 normal-case font-normal tracking-normal text-[10px]">● Chưa lưu</span>}
                    </label>
                    {type === 'select' ? (
                      <select
                        value={settings[key] ?? placeholder}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                      >
                        {options.map(o => (
                          <option key={o} value={o}>{o === 'true' ? 'Bật' : o === 'false' ? 'Tắt' : o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        value={settings[key] ?? ''}
                        onChange={e => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    )}
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{key}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Danger zone */}
          <Card>
            <CardHeader title={
              <span className="flex items-center gap-2 text-red-600">
                <span className="material-symbols-outlined text-lg">warning</span>
                Vùng nguy hiểm
              </span>
            } />
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Các thao tác dưới đây không thể hoàn tác. Hãy cẩn thận trước khi thực hiện.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled
                  className="px-4 py-2.5 border-2 border-red-200 text-red-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">delete_forever</span>
                  Xóa toàn bộ dữ liệu thi
                </button>
                <button
                  disabled
                  className="px-4 py-2.5 border-2 border-orange-200 text-orange-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">restart_alt</span>
                  Đặt lại hệ thống
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3">Tính năng này bị vô hiệu hóa để bảo vệ dữ liệu sản xuất.</p>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};

export default SystemSettings;
