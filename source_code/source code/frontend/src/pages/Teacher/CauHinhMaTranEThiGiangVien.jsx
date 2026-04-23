// src/pages/Teacher/CauHinhMaTranEThiGiangVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const DEFAULT_CHAPTERS = [
  { id: 1, name: 'Chương 1', easy: 2, medium: 2, hard: 1 },
  { id: 2, name: 'Chương 2', easy: 2, medium: 2, hard: 1 },
  { id: 3, name: 'Chương 3', easy: 1, medium: 2, hard: 1 },
];

const CauHinhMaTranEThiGiangVien = () => {
  const [sp]        = useSearchParams();
  const matrixId    = sp.get('matrixId');
  const [exams,     setExams]     = useState([]);
  const [selExam,   setSelExam]   = useState('');
  const [title,     setTitle]     = useState('Ma trận đề thi mới');
  const [chapters,  setChapters]  = useState(DEFAULT_CHAPTERS);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [userId,    setUserId]    = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const examRes = await teacherService.getExams(user.id);
      setExams(examRes.data ?? []);

      if (matrixId) {
        const { data } = await supabase.from('exam_matrices').select('*').eq('id', matrixId).single();
        if (data) {
          setTitle(data.title);
          setSelExam(data.exam_id ?? '');
          if (data.config?.chapters) setChapters(data.config.chapters);
        }
      }
      setLoading(false);
    }
    init();
  }, [matrixId]);

  const updateChapter = (idx, field, val) => {
    setChapters(prev => prev.map((c, i) => i === idx ? { ...c, [field]: parseInt(val) || 0 } : c));
  };

  const addChapter = () => {
    setChapters(prev => [...prev, { id: prev.length + 1, name: `Chương ${prev.length + 1}`, easy: 1, medium: 1, hard: 1 }]);
  };

  const removeChapter = (idx) => {
    setChapters(prev => prev.filter((_, i) => i !== idx));
  };

  const totalQ = chapters.reduce((acc, c) => acc + c.easy + c.medium + c.hard, 0);

  const handleSave = async () => {
    if (!selExam) return;
    setSaving(true);
    await supabase.from('exam_matrices').upsert({
      ...(matrixId ? { id: matrixId } : {}),
      exam_id: selExam, created_by: userId,
      title, config: { chapters }
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  };

  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold">
            <span className="text-blue-800">DHD</span><span className="text-orange-500">edu</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1 rounded-lg" href="/teacher/dashboard">Dashboard</a>
            <a className="text-blue-700 font-bold border-b-2 border-blue-600 px-3 py-1" href="#">Ma trận</a>
          </div>
        </div>
      </nav>

      <div className="pt-16 p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-on-surface">Cấu hình Ma trận Đề thi</h1>
            <p className="text-slate-500 text-sm mt-1">Thiết lập phân phối câu hỏi theo chương và độ khó</p>
          </div>
          <div className="flex gap-3">
            {success && <span className="text-green-600 text-sm font-semibold flex items-center gap-1"><span className="material-symbols-outlined text-base">check_circle</span>Đã lưu!</span>}
            <button onClick={handleSave} disabled={saving || !selExam}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 flex items-center gap-2">
              {saving ? 'Đang lưu...' : (<><span className="material-symbols-outlined text-base">save</span>Lưu ma trận</>)}
            </button>
          </div>
        </div>

        {/* Config */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Tiêu đề ma trận</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1.5">Kỳ thi áp dụng</label>
              {loading ? <Skeleton className="h-10 rounded-xl" /> : (
                <select value={selExam} onChange={e => setSelExam(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">-- Chọn kỳ thi --</option>
                  {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-4 p-4 bg-primary/5 rounded-xl">
            <div className="text-center px-4">
              <p className="text-2xl font-black text-primary">{totalQ}</p>
              <p className="text-xs text-slate-500">Tổng câu</p>
            </div>
            {['easy', 'medium', 'hard'].map(d => {
              const cnt = chapters.reduce((acc, c) => acc + (c[d] ?? 0), 0);
              return (
                <div key={d} className="text-center px-4">
                  <p className={`text-2xl font-black ${d === 'easy' ? 'text-green-600' : d === 'medium' ? 'text-yellow-600' : 'text-red-500'}`}>{cnt}</p>
                  <p className="text-xs text-slate-500">{d === 'easy' ? 'Dễ' : d === 'medium' ? 'TB' : 'Khó'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chapter table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h3 className="font-bold">Phân phối theo chương ({chapters.length} chương)</h3>
            <button onClick={addChapter} className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline">
              <span className="material-symbols-outlined text-base">add</span> Thêm chương
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left p-4 text-xs font-bold text-slate-400">Chương</th>
                <th className="text-center p-4 text-xs font-bold text-green-600">Dễ</th>
                <th className="text-center p-4 text-xs font-bold text-yellow-600">Trung bình</th>
                <th className="text-center p-4 text-xs font-bold text-red-500">Khó</th>
                <th className="text-center p-4 text-xs font-bold text-slate-400">Tổng</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {chapters.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="p-4">
                    <input type="text" value={c.name}
                      onChange={e => updateChapter(i, 'name', e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </td>
                  {['easy', 'medium', 'hard'].map(d => (
                    <td key={d} className="p-4">
                      <input type="number" min="0" max="20" value={c[d]}
                        onChange={e => updateChapter(i, d, e.target.value)}
                        className="w-16 text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mx-auto block"
                      />
                    </td>
                  ))}
                  <td className="p-4 text-center font-bold text-primary">{c.easy + c.medium + c.hard}</td>
                  <td className="p-4">
                    <button onClick={() => removeChapter(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default CauHinhMaTranEThiGiangVien;
