// src/pages/Teacher/NganHangCauHoiGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect, useCallback } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NganHangCauHoiGiaoVien = () => {
  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [teacherId,  setTeacherId]  = useState(null);
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stats,      setStats]      = useState({ total: 0, mcq: 0, essay: 0 });

  const load = useCallback(async (tId) => {
    setLoading(true);
    const { data, error: err } = await teacherService.getQuestionBank(tId, {
      type:   typeFilter || undefined,
      search: search     || undefined,
    });
    if (err) setError(err.message);
    else {
      setQuestions(data ?? []);
      setStats({
        total: data?.length ?? 0,
        mcq:   data?.filter(q => q.type === 'MCQ').length ?? 0,
        essay: data?.filter(q => q.type === 'ESSAY').length ?? 0,
      });
    }
    setLoading(false);
  }, [typeFilter, search]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setTeacherId(user.id);
      load(user.id);
    }
    init();
  }, []);

  useEffect(() => {
    if (teacherId) load(teacherId);
  }, [teacherId, load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xoá câu hỏi?')) return;
    await teacherService.deleteQuestion(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
    setStats(s => ({ ...s, total: s.total - 1 }));
  };

  const difficultyConfig = {
    EASY:   { label: 'Dễ',    cls: 'bg-green-50 text-green-700' },
    MEDIUM: { label: 'Trung bình', cls: 'bg-yellow-50 text-yellow-700' },
    HARD:   { label: 'Khó',   cls: 'bg-red-50 text-red-700' },
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8">

          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">Ngân hàng câu hỏi</h2>
              <p className="text-slate-500 font-medium">Quản lý và tổ chức hệ thống câu hỏi học liệu chuyên nghiệp.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-container text-white rounded-xl shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">Gợi ý từ AI</h3>
                  <p className="text-xs text-slate-600 mb-3">Tạo câu hỏi tự động từ văn bản hoặc tài liệu của bạn.</p>
                  <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all shadow-sm">
                    Bắt đầu tạo với AI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Tổng câu hỏi', value: stats.total,  icon: 'quiz',   cls: 'text-primary bg-primary/10' },
              { label: 'Trắc nghiệm',  value: stats.mcq,    icon: 'list',   cls: 'text-blue-600 bg-blue-50'  },
              { label: 'Tự luận',      value: stats.essay,  icon: 'edit',   cls: 'text-purple-600 bg-purple-50' },
            ].map((c, i) => (
              <div key={i} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.cls}`}>
                  <span className="material-symbols-outlined text-xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  {loading ? <Skeleton className="h-6 w-12 mt-1"/> : <p className="text-xl font-black">{c.value}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="min-w-40">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Loại câu hỏi</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
                    <option value="">Tất cả</option>
                    <option value="MCQ">Trắc nghiệm</option>
                    <option value="ESSAY">Tự luận</option>
                  </select>
                </div>
                <div className="flex-1 min-w-48">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Tìm kiếm</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Từ khoá trong nội dung câu hỏi..."
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Question list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : questions.length === 0 ? (
            <div className="p-16 bg-surface-container-lowest rounded-2xl shadow-sm text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
              <p>Chưa có câu hỏi nào{search ? ` khớp với "${search}"` : ''}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const diff = difficultyConfig[q.difficulty] ?? { label: '—', cls: 'bg-slate-50 text-slate-400' };
                return (
                  <div key={q.id} className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface mb-2 line-clamp-2">{q.content}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.type === 'MCQ' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                          {q.type === 'MCQ' ? 'Trắc nghiệm' : 'Tự luận'}
                        </span>
                        {q.difficulty && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.cls}`}>{diff.label}</span>
                        )}
                        <span className="text-[10px] text-slate-400">{q.points} điểm</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(q.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NganHangCauHoiGiaoVien;
