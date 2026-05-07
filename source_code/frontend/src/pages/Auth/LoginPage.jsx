// src/pages/Auth/LoginPage.jsx
// Fixes: removed hardcoded demo credentials (admin@dhdedu.edu.vn / Admin@123456 etc.)
// Clean auth form with proper validation and error handling.

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, selectAuthLoading, selectAuthError } from '../../features/authentication/authenticationSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const loading  = useSelector(selectAuthLoading);
  const authErr  = useSelector(selectAuthError);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [touched,  setTouched]  = useState({ email: false, password: false });

  const emailErr = touched.email && !email.includes('@') ? 'Email không hợp lệ' : '';
  const pwErr    = touched.password && password.length < 6 ? 'Mật khẩu quá ngắn' : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email.includes('@') || password.length < 6) return;
    dispatch(loginThunk({ email: email.trim(), password }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-container to-secondary relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">D</span>
            </div>
            <span className="text-3xl font-black text-white">
              DHD<span className="text-orange-400">edu</span>
            </span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Nền tảng học tập<br />thông minh hàng đầu
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Kết nối giảng viên và sinh viên. Quản lý lớp học, thi cử và theo dõi tiến độ học tập hiệu quả.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-wrap gap-3">
          {['Thi trực tuyến', 'Ngân hàng câu hỏi', 'Flashcard AI', 'Thống kê chi tiết', 'Báo cáo tự động'].map(f => (
            <span key={f} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium border border-white/20">
              {f}
            </span>
          ))}
        </div>

        {/* BG decoration */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-2xl font-black">
              <span className="text-primary">DHD</span><span className="text-orange-500">edu</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 mb-1">Đăng nhập</h1>
            <p className="text-slate-500">Chào mừng trở lại! Nhập thông tin để tiếp tục.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Server error */}
            {authErr && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-lg shrink-0">error</span>
                <p className="text-sm text-red-700 font-medium">
                  {authErr.includes('Invalid') || authErr.includes('credentials')
                    ? 'Email hoặc mật khẩu không đúng.'
                    : 'Đăng nhập thất bại. Vui lòng thử lại.'}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, email: true }))}
                  placeholder="email@truong.edu.vn"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    emailErr ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
              </div>
              {emailErr && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{emailErr}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, password: true }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    pwErr ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {pwErr && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{pwErr}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Nếu bạn gặp sự cố khi đăng nhập, vui lòng liên hệ bộ phận quản trị hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
