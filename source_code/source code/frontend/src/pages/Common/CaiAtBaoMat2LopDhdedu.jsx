// src/pages/Common/CaiAtBaoMat2LopDhdedu.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const CaiAtBaoMat2LopDhdedu = () => {
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [newPass,  setNewPass]  = useState('');
  const [confPass, setConfPass] = useState('');
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await studentService.getProfile(user.id);
      setProfile(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleChangePassword = async () => {
    if (!newPass || newPass !== confPass) { setError('Mật khẩu không khớp'); return; }
    if (newPass.length < 8) { setError('Mật khẩu phải có ít nhất 8 ký tự'); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: newPass });
    if (err) { setError(err.message); setSaving(false); return; }
    setNewPass('');
    setConfPass('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <CommonHeader />
      <main className="ml-64 p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex gap-2 text-xs font-semibold text-tertiary mb-2 uppercase tracking-widest">
              <span>Tài khoản</span>
              <span>/</span>
              <span className="text-primary">Bảo mật</span>
            </nav>
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              Cài đặt Bảo mật 2 lớp
            </h2>
          </div>
        </div>

        {success && <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✅ Đã cập nhật thành công</div>}
        {error   && <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Change password */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-7">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lock</span>
              Đổi mật khẩu
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">Mật khẩu mới</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1.5">Xác nhận mật khẩu</label>
                <input type="password" value={confPass} onChange={e => setConfPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {newPass && confPass && newPass !== confPass && (
                <p className="text-xs text-red-500">Mật khẩu không khớp</p>
              )}
              <button onClick={handleChangePassword}
                disabled={saving || !newPass || !confPass || newPass !== confPass}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
                {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </div>

          {/* 2FA info */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-7">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">security</span>
              Xác thực 2 lớp (2FA)
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                Bật xác thực 2 lớp để tăng cường bảo mật cho tài khoản của bạn. Mỗi lần đăng nhập, bạn sẽ cần nhập mã OTP.
              </p>
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-600 text-base">info</span>
                  Tính năng đang phát triển
                </p>
                <p className="text-xs text-yellow-600 mt-1">2FA qua email/SMS sẽ sớm được triển khai</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-700 mb-1">Thông tin tài khoản</p>
                <p className="text-xs text-slate-400">Email: {profile?.email ?? '—'}</p>
                <p className="text-xs text-slate-400 mt-0.5">Vai trò: {profile?.role ?? '—'}</p>
              </div>
            </div>
          </div>

          {/* Security tips */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl shadow-sm p-7">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shield</span>
              Lời khuyên bảo mật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: 'lock',      title: 'Mật khẩu mạnh',       desc: 'Sử dụng ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' },
                { icon: 'devices',   title: 'Đăng xuất an toàn',    desc: 'Luôn đăng xuất khi dùng xong, đặc biệt trên thiết bị công cộng.' },
                { icon: 'phishing',  title: 'Tránh lừa đảo',        desc: 'Không chia sẻ mật khẩu. DHDedu không bao giờ hỏi mật khẩu qua email.' },
                { icon: 'update',    title: 'Cập nhật định kỳ',     desc: 'Đổi mật khẩu 3 tháng/lần để bảo vệ tài khoản tốt hơn.' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-base">{tip.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">{tip.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaiAtBaoMat2LopDhdedu;
