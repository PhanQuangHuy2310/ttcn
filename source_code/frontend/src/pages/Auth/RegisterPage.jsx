import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const schema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            is_teacher: role === 'TEACHER',
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Email này đã được đăng ký!');
        } else {
          toast.error('Đăng ký thất bại: ' + error.message);
        }
      } else {
        toast.success('Đăng ký thành công!', { duration: 3000 });
        navigate('/login');
      }
    } catch (error) {
      toast.error('Lỗi!');
    }
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
            Bắt đầu hành trình<br />học tập của bạn
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Tham gia cùng hàng ngàn giáo viên và học sinh trên nền tảng giáo dục hiện đại.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-wrap gap-3">
          {['Miễn phí đăng ký', 'Tài liệu đa dạng', 'Lộ trình cá nhân hóa', 'Hỗ trợ 24/7'].map(f => (
            <span key={f} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-medium border border-white/20">
              {f}
            </span>
          ))}
        </div>

        {/* BG decoration */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Right: register form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-2xl font-black">
              <span className="text-primary">DHD</span><span className="text-orange-500">edu</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 mb-1">Đăng ký</h1>
            <p className="text-slate-500">Tạo tài khoản mới để trải nghiệm hệ thống.</p>
          </div>

          {/* Role selection tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'STUDENT' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tôi là Học sinh
            </button>
            <button
              type="button"
              onClick={() => setRole('TEACHER')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'TEACHER' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tôi là Giáo viên
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Họ và tên</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="Nguyễn Văn A"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="email@truong.edu.vn"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
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
              {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">{showConfirmPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isSubmitting ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
