// src/pages/Common/Profile.jsx
// Replaces HoSoCaNhanDhdedu + HoSoCaNhanDhdeduVietHoa (both had hardcoded "Nguyễn Văn An").
// Profile data comes from selectProfile (Redux store), updates via usersService.

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfile, setProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { ErrorBanner, PageHeader } from '../../components/ui';
import { usersService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';

const ROLE_LABELS = { ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Sinh viên' };

const Profile = () => {
  const profile  = useSelector(selectProfile);
  const dispatch = useDispatch();
  const role     = profile?.role ?? 'STUDENT';

  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);

  const [form, setForm] = useState({
    full_name:    profile?.full_name ?? '',
    student_id:   profile?.student_id ?? '',
    teacher_code: profile?.teacher_code ?? '',
  });

  // Change password
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState(null);
  const [pwOk,    setPwOk]    = useState(false);
  const [pwSaving,setPwSaving]= useState(false);

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    const updates = { full_name: form.full_name.trim() };
    if (role === 'STUDENT')  updates.student_id   = form.student_id.trim();
    if (role === 'TEACHER')  updates.teacher_code = form.teacher_code.trim();

    const { data, error: err } = await usersService.updateProfile(profile.id, updates);
    if (err) setError('Cập nhật thất bại. Vui lòng thử lại.');
    else {
      dispatch(setProfile({ ...profile, ...updates }));
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    if (pwForm.next !== pwForm.confirm) { setPwError('Mật khẩu xác nhận không khớp.'); return; }
    if (pwForm.next.length < 8)         { setPwError('Mật khẩu mới phải có ít nhất 8 ký tự.'); return; }
    setPwSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password: pwForm.next });
    if (err) setPwError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
    else { setPwOk(true); setPwForm({ current: '', next: '', confirm: '' }); }
    setPwSaving(false);
  };

  const initial = (profile?.full_name ?? role).charAt(0).toUpperCase();

  return (
    <AppLayout role={role}>
      <PageHeader title="Hồ sơ cá nhân" subtitle="Quản lý thông tin tài khoản của bạn" />

      {error   && <ErrorBanner message={error} />}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-green-500">check_circle</span>
          <p className="text-sm text-green-700 font-medium">Cập nhật thông tin thành công!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar + summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg">
            {initial}
          </div>
          <h2 className="text-xl font-black text-slate-800">{profile?.full_name ?? '—'}</h2>
          <p className="text-sm text-slate-500 mt-1">{profile?.email}</p>
          <span className="mt-3 text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
            {ROLE_LABELS[role] ?? role}
          </span>
          {(profile?.student_id || profile?.teacher_code) && (
            <p className="mt-4 font-mono text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
              {profile.student_id ?? profile.teacher_code}
            </p>
          )}
        </div>

        {/* Info form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Thông tin cơ bản</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* Full name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Họ và tên</label>
                {editing ? (
                  <input
                    type="text" value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-800 font-medium">{profile?.full_name ?? '—'}</p>
                )}
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-500">{profile?.email ?? '—'}</p>
              </div>

              {/* Role-specific ID */}
              {role === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mã sinh viên</label>
                  {editing ? (
                    <input
                      type="text" value={form.student_id}
                      onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))}
                      placeholder="Ví dụ: SV2024001"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-mono text-slate-700">{profile?.student_id ?? '—'}</p>
                  )}
                </div>
              )}

              {role === 'TEACHER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mã giảng viên</label>
                  {editing ? (
                    <input
                      type="text" value={form.teacher_code}
                      onChange={e => setForm(p => ({ ...p, teacher_code: e.target.value }))}
                      placeholder="Ví dụ: GV001"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-mono text-slate-700">{profile?.teacher_code ?? '—'}</p>
                  )}
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Vai trò</label>
                <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-500">{ROLE_LABELS[role] ?? role}</p>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Đổi mật khẩu</h3>
            </div>
            <div className="p-6 space-y-4">
              {pwError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 font-medium">{pwError}</div>
              )}
              {pwOk && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Đổi mật khẩu thành công!
                </div>
              )}
              {[
                { key: 'next',    label: 'Mật khẩu mới' },
                { key: 'confirm', label: 'Xác nhận mật khẩu mới' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <input
                    type="password"
                    value={pwForm[key]}
                    onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <button
                onClick={handlePasswordChange}
                disabled={!pwForm.next || !pwForm.confirm || pwSaving}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition"
              >
                {pwSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
