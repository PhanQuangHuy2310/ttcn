// src/pages/Student/ChiTietLopHocSinhVienVietHoaFontMoi.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import StudentHeader from '../../components/StudentHeader';
import { supabase } from '../../lib/supabase';
import { studentService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ChiTietLopHocSinhVienVietHoaFontMoi = () => {
  const [sp]      = useSearchParams();
  const classId   = sp.get('classId');
  const [cls,     setCls]     = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId,  setUserId]  = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: myC } = await studentService.getMyClasses(user.id);
      setMyClasses(myC ?? []);

      const targetId = classId ?? myC?.[0]?.classes?.id;
      if (targetId) {
        const { data } = await supabase.from('classes').select(`
          id, name, code, academic_year,
          courses(name, subject, grade_level, users(full_name)),
          student_classes(count),
          exams(id, title, start_time, duration,
            submissions(student_id, status, score)
          )
        `).eq('id', targetId).single();
        setCls(data);
      }
      setLoading(false);
    }
    init();
  }, [classId]);

  const exams      = cls?.exams ?? [];
  const myExams    = exams.map(e => {
    const mySub = (e.submissions ?? []).find(s => s.student_id === userId);
    const status = mySub?.status ?? 'NOT_STARTED';
    return { ...e, myStatus: status, myScore: mySub?.score ?? null };
  });

  const submitted  = myExams.filter(e => e.myStatus === 'SUBMITTED').length;
  const completion = exams.length ? Math.round(submitted / exams.length * 100) : 0;

  const STATUS_CFG = {
    SUBMITTED:   { label: 'Đã nộp',   cls: 'bg-green-50 text-green-700'  },
    IN_PROGRESS: { label: 'Đang làm', cls: 'bg-yellow-50 text-yellow-700'},
    NOT_STARTED: { label: 'Chưa làm', cls: 'bg-slate-100 text-slate-500' },
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <StudentHeader />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
          <StudentSidebar />

          <div className="flex-1 bg-background-light dark:bg-background-dark p-6 lg:p-10">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
              <a href="/student/overviewstudent-viet-hoa" className="hover:text-primary">Lớp học</a>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-on-surface font-semibold">{cls?.name ?? '—'}</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
              </div>
            ) : !cls ? (
              <div className="p-16 text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">school</span>
                <p>Lớp học không tồn tại hoặc bạn chưa đăng ký</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header */}
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
                  <div>
                    <h1 className="text-3xl font-black text-on-surface">{cls.name}</h1>
                    <p className="text-slate-500 mt-1">{cls.courses?.name} · {cls.courses?.subject} · {cls.academic_year}</p>
                    <p className="text-sm text-slate-400 mt-0.5">Giáo viên: {cls.courses?.users?.full_name ?? '—'}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center px-4 py-2 bg-white border border-slate-100 rounded-xl">
                      <p className="text-2xl font-black text-primary">{completion}%</p>
                      <p className="text-xs text-slate-400">Hoàn thành</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-white border border-slate-100 rounded-xl">
                      <p className="text-2xl font-black text-on-surface">{exams.length}</p>
                      <p className="text-xs text-slate-400">Đề thi</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Tiến độ làm bài</span>
                    <span className="text-sm font-bold text-primary">{submitted}/{exams.length} đề thi</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                  </div>
                </div>

                {/* Exam list */}
                <div>
                  <h3 className="font-bold text-on-surface mb-4">Danh sách đề thi</h3>
                  {exams.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 block">quiz</span>
                      <p>Chưa có đề thi nào</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myExams.map(exam => {
                        const s = STATUS_CFG[exam.myStatus] ?? STATUS_CFG.NOT_STARTED;
                        return (
                          <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-primary">quiz</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-on-surface">{exam.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {exam.start_time ? new Date(exam.start_time).toLocaleDateString('vi-VN') : 'Chưa lên lịch'} · {exam.duration} phút
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {exam.myStatus === 'SUBMITTED' && exam.myScore !== null && (
                                <span className={`font-black text-lg ${exam.myScore >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                                  {exam.myScore}<span className="text-xs text-slate-400">/10</span>
                                </span>
                              )}
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                              {exam.myStatus !== 'SUBMITTED' && (
                                <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${exam.id}`}
                                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">
                                  {exam.myStatus === 'IN_PROGRESS' ? 'Tiếp tục' : 'Làm bài'}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChiTietLopHocSinhVienVietHoaFontMoi;
