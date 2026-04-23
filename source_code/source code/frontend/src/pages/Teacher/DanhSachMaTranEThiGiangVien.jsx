// src/pages/Teacher/DanhSachMaTranEThiGiangVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DanhSachMaTranEThiGiangVien = () => {
  const [matrices, setMatrices] = useState([]);
  const [exams,    setExams]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [matRes, examRes] = await Promise.all([
        supabase.from('exam_matrices')
          .select('*, exams(title, courses(name, subject))')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('exams')
          .select('id, title, courses!inner(teacher_id, name, subject)')
          .eq('courses.teacher_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      setMatrices(matRes.data ?? []);
      setExams(examRes.data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '—';

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-on-surface mb-2">Danh sách Ma trận đề thi</h2>
              <p className="text-tertiary">Quản lý và thiết kế các cấu trúc đề thi chuẩn hóa cho từng học kỳ.</p>
            </div>
            <a href="/teacher/exam-matrix-config"
              className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">add</span>
              Tạo ma trận mới
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
            </div>
          ) : matrices.length === 0 ? (
            <div className="p-16 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">grid_view</span>
              <p>Chưa có ma trận đề thi nào</p>
              <p className="text-xs mt-2">Tạo ma trận để quản lý cấu trúc đề thi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matrices.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">grid_view</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(m.created_at)}</span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-1">{m.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{m.exams?.title ?? '—'} · {m.exams?.courses?.subject ?? '—'}</p>
                  <div className="flex gap-2">
                    <a href={`/teacher/exam-matrix-config?matrixId=${m.id}`}
                      className="flex-1 py-2 text-center bg-primary/5 text-primary rounded-lg text-xs font-bold hover:bg-primary/10">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DanhSachMaTranEThiGiangVien;
