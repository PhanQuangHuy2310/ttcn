// src/pages/Student/NganHangBaiThiThuSinhVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NganHangBaiThiThuSinhVien = () => {
  const [exams,   setExams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error: err } = await studentService.getMockExams(user.id);
      if (err) { setError(err.message); setLoading(false); return; }
      const list = data ?? [];
      setExams(list);
      // Extract unique subjects
      const uniqueSubjects = [...new Set(list.map(e => e.courses?.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = exams.filter(e => {
    const matchSearch  = !search        || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subjectFilter || e.courses?.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const examStatus = (exam) => {
    const sub = (exam.submissions ?? []).find(s => s);
    if (!sub || sub.status === 'NOT_STARTED') return { label: 'Chưa làm',   cls: 'bg-slate-100 text-slate-500', canStart: true };
    if (sub.status === 'IN_PROGRESS')         return { label: 'Đang làm',   cls: 'bg-yellow-50 text-yellow-700', canStart: false };
    return                                           { label: 'Đã nộp',     cls: 'bg-green-50 text-green-700',  canStart: false, score: sub.score };
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '—';

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="md:ml-64 min-h-screen">
        <StudentHeader />
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">

          <section className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface">Ngân hàng bài thi thử</h2>
            <p className="text-tertiary font-body">
              Hệ thống tổng hợp đề thi chất lượng cao, cá nhân hóa theo lớp học của bạn.
            </p>
          </section>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm đề thi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tất cả môn học</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Exam grid */}
          <section className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
                <p>Không tìm thấy đề thi nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(exam => {
                  const s = examStatus(exam);
                  const qCount = typeof exam.questions === 'number' ? exam.questions : (exam.questions?.[0]?.count ?? 0);
                  return (
                    <div key={exam.id} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">quiz</span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                      </div>
                      <h3 className="font-bold text-on-surface mb-1 line-clamp-2 flex-1">{exam.title}</h3>
                      <p className="text-xs text-slate-400 mb-1">{exam.courses?.name} · {exam.courses?.subject}</p>
                      <p className="text-xs text-slate-300 mb-4">{formatDate(exam.start_time)}</p>

                      <div className="grid grid-cols-3 gap-2 text-center mb-4">
                        {[
                          { label: 'Câu hỏi',  value: qCount },
                          { label: 'Phút',      value: exam.duration },
                          { label: s.score !== undefined ? 'Điểm' : 'Lần thi', value: s.score !== undefined ? s.score : (exam.submissions ?? []).length },
                        ].map((c, i) => (
                          <div key={i} className="bg-slate-50 rounded-lg py-2">
                            <p className="text-base font-black text-on-surface">{c.value ?? '—'}</p>
                            <p className="text-[10px] text-slate-400">{c.label}</p>
                          </div>
                        ))}
                      </div>

                      {s.canStart ? (
                        <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${exam.id}`}
                          className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl text-center hover:opacity-90 transition-opacity">
                          Bắt đầu làm bài
                        </a>
                      ) : (
                        <div className="flex gap-2">
                          {s.label === 'Đang làm' && (
                            <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${exam.id}`}
                              className="flex-1 py-2.5 bg-yellow-500 text-white text-sm font-bold rounded-xl text-center hover:opacity-90">
                              Tiếp tục
                            </a>
                          )}
                          <a href={`/student/preview?examId=${exam.id}`}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl text-center hover:bg-slate-200">
                            Xem lại
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NganHangBaiThiThuSinhVien;
