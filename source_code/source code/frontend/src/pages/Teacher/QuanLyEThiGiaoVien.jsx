// src/pages/Teacher/QuanLyEThiGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect, useCallback } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const QuanLyEThiGiaoVien = () => {
  const [exams,      setExams]      = useState([]);
  const [classes,    setClasses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [classFilter,setClassFilter]= useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [teacherId,  setTeacherId]  = useState(null);
  const [newExam,    setNewExam]    = useState({
    title: '', class_id: '', duration: 60, start_time: '', shuffle_questions: true, anti_cheat: false
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setTeacherId(user.id);

      const [examsRes, coursesRes] = await Promise.all([
        teacherService.getExams(user.id),
        teacherService.getCourses(user.id),
      ]);
      if (!examsRes.error)   setExams(examsRes.data ?? []);
      if (!coursesRes.error) {
        const allClasses = (coursesRes.data ?? []).flatMap(c => (c.classes ?? []).map(cl => ({ ...cl, courseName: c.name })));
        setClasses(allClasses);
      }
      setLoading(false);
    }
    init();
  }, []);

  const filtered = exams.filter(e => {
    const matchSearch  = !search      || e.title.toLowerCase().includes(search.toLowerCase());
    const matchClass   = !classFilter || e.class_id === classFilter;
    return matchSearch && matchClass;
  });

  const examStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end   = new Date(start.getTime() + exam.duration * 60000);
    if (!exam.start_time)  return { label: 'Bản nháp',     cls: 'bg-slate-100 text-slate-500' };
    if (now < start)        return { label: 'Sắp diễn ra',  cls: 'bg-blue-50 text-blue-700'   };
    if (now <= end)         return { label: 'Đang diễn ra', cls: 'bg-green-50 text-green-700' };
    return                         { label: 'Đã kết thúc',  cls: 'bg-gray-100 text-gray-500'  };
  };

  const handleCreate = async () => {
    if (!newExam.title || !newExam.class_id) return;
    setSubmitting(true);
    setError(null);
    // Find course_id for selected class
    const cls = classes.find(c => c.id === newExam.class_id);
    const course = await supabase.from('classes').select('course_id').eq('id', newExam.class_id).single();

    const { data, error: err } = await teacherService.createExam({
      ...newExam,
      course_id:  course.data?.course_id,
      start_time: newExam.start_time || null,
    });
    if (err) { setError(err.message); setSubmitting(false); return; }

    setExams(prev => [{ ...data, classes: { name: cls?.name }, questions: [], submissions: [] }, ...prev]);
    setShowModal(false);
    setNewExam({ title: '', class_id: '', duration: 60, start_time: '', shuffle_questions: true, anti_cheat: false });
    setSubmitting(false);
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const submitted = (exam) => (exam.submissions ?? []).filter(s => s.status === 'SUBMITTED').length;

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 min-h-screen">
        <TeacherHeader />
        <div className="p-8 space-y-8">

          {/* Hero banner */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-3xl font-headline font-bold mb-4">Tạo đề thi mới trong tích tắc</h2>
                <p className="text-primary-fixed mb-8 opacity-90">
                  Sử dụng công cụ AI thế hệ mới để tự động hóa quy trình soạn đề hoặc tự tay lựa chọn những câu hỏi tâm đắc nhất.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Tạo đề thi mới
                  </button>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 translate-x-1/4 translate-y-1/4 pointer-events-none">
                <span className="material-symbols-outlined text-[300px]">quiz</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-8 border-none shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-headline font-bold text-lg">Thống kê nhanh</span>
                <div className="mt-4 space-y-3">
                  {loading ? (
                    Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-4 w-full"/>)
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tổng đề thi</span>
                        <span className="font-bold">{exams.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Đang diễn ra</span>
                        <span className="font-bold text-green-600">{exams.filter(e => examStatus(e).label === 'Đang diễn ra').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Sắp diễn ra</span>
                        <span className="font-bold text-blue-600">{exams.filter(e => examStatus(e).label === 'Sắp diễn ra').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Đã kết thúc</span>
                        <span className="font-bold text-slate-400">{exams.filter(e => examStatus(e).label === 'Đã kết thúc').length}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm đề thi..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
            </div>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tất cả lớp</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Exam list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
              <p>Chưa có đề thi nào {search ? 'khớp tìm kiếm' : ''}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(exam => {
                const s = examStatus(exam);
                return (
                  <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                    <h3 className="font-bold text-on-surface mb-1 line-clamp-2 flex-1">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{exam.classes?.name ?? '—'} · {exam.duration} phút</p>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-slate-50 rounded-lg py-2">
                        <p className="text-lg font-black text-on-surface">{(exam.questions ?? []).length}</p>
                        <p className="text-[10px] text-slate-400">Câu hỏi</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg py-2">
                        <p className="text-lg font-black text-on-surface">{submitted(exam)}</p>
                        <p className="text-[10px] text-slate-400">Đã nộp</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg py-2">
                        <p className="text-lg font-black text-on-surface">{(exam.submissions ?? []).length}</p>
                        <p className="text-[10px] text-slate-400">Tổng</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{formatDate(exam.start_time)}</p>
                    <div className="flex gap-2 mt-4">
                      <a href={`/teacher/class-detailsteacher?classId=${exam.class_id}`}
                        className="flex-1 py-2 text-center bg-primary/5 text-primary rounded-lg text-xs font-bold hover:bg-primary/10 transition-colors">
                        Chi tiết
                      </a>
                      <a href={`/teacher/gradingteacher-mo-rong-khung-bai-lam?examId=${exam.id}`}
                        className="flex-1 py-2 text-center bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                        Chấm bài
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Tạo đề thi mới</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Tiêu đề đề thi *</label>
                <input type="text" value={newExam.title}
                  onChange={e => setNewExam(p => ({ ...p, title: e.target.value }))}
                  placeholder="Kiểm tra giữa kỳ..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Lớp học *</label>
                <select value={newExam.class_id}
                  onChange={e => setNewExam(p => ({ ...p, class_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.courseName})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Thời gian (phút)</label>
                  <input type="number" min="5" max="360" value={newExam.duration}
                    onChange={e => setNewExam(p => ({ ...p, duration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Thời gian bắt đầu</label>
                  <input type="datetime-local" value={newExam.start_time}
                    onChange={e => setNewExam(p => ({ ...p, start_time: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newExam.shuffle_questions}
                    onChange={e => setNewExam(p => ({ ...p, shuffle_questions: e.target.checked }))}
                    className="rounded text-primary"
                  />
                  <span className="text-sm text-slate-700">Trộn câu hỏi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newExam.anti_cheat}
                    onChange={e => setNewExam(p => ({ ...p, anti_cheat: e.target.checked }))}
                    className="rounded text-primary"
                  />
                  <span className="text-sm text-slate-700">Chống gian lận</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Hủy
              </button>
              <button onClick={handleCreate} disabled={submitting || !newExam.title || !newExam.class_id}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60">
                {submitting ? 'Đang tạo...' : 'Tạo đề thi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyEThiGiaoVien;
