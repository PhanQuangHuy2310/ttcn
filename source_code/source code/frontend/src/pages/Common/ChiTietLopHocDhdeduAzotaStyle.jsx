// src/pages/Common/ChiTietLopHocDhdeduAzotaStyle.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ChiTietLopHocDhdeduAzotaStyle = () => {
  const [sp]      = useSearchParams();
  const classId   = sp.get('classId');
  const [cls,     setCls]     = useState(null);
  const [selTab,  setSelTab]  = useState('students');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    supabase.from('classes').select(`
      id, name, code, academic_year,
      courses(name, subject, grade_level, users(full_name)),
      student_classes(users(id, full_name, student_id), enrolled_at),
      exams(id, title, start_time, duration, submissions(student_id, status, score))
    `).eq('id', classId).single()
      .then(({ data }) => { setCls(data); setLoading(false); });
  }, [classId]);

  const students = cls?.student_classes ?? [];
  const exams    = cls?.exams ?? [];

  const statusOf = (exam) => {
    if (!exam.start_time) return { label: 'Chưa lên lịch', cls: 'bg-slate-100 text-slate-500' };
    const now = new Date(), start = new Date(exam.start_time), end = new Date(start.getTime() + exam.duration * 60000);
    if (now < start) return { label: 'Sắp tới',  cls: 'bg-blue-50 text-blue-700' };
    if (now <= end)  return { label: 'Đang thi', cls: 'bg-green-50 text-green-700' };
    return               { label: 'Kết thúc',  cls: 'bg-slate-100 text-slate-500' };
  };

  return (
    <>
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <main className="ml-64 min-h-screen">
        <CommonHeader />
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex gap-8">
          <div className="flex-1">

            {/* Header */}
            {loading ? <Skeleton className="h-8 w-64 mb-6" /> : (
              <div className="mb-8">
                <h1 className="text-2xl font-black text-on-surface">{cls?.name ?? 'Lớp học'}</h1>
                <p className="text-slate-500 text-sm mt-1">{cls?.courses?.name} · {cls?.courses?.subject} · {cls?.academic_year}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200 mb-6">
              {[{ key: 'students', label: 'Sinh viên' }, { key: 'exams', label: 'Kỳ thi' }].map(tab => (
                <button key={tab.key} onClick={() => setSelTab(tab.key)}
                  className={`pb-3 text-sm font-semibold transition-colors ${selTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {selTab === 'students' && (
              loading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              : students.length === 0 ? (
                <div className="p-10 bg-white rounded-2xl text-center text-slate-400">Chưa có sinh viên nào</div>
              ) : (
                <div className="space-y-2">
                  {students.map(sc => (
                    <div key={sc.users?.id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary text-sm font-bold">{(sc.users?.full_name ?? 'S').charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{sc.users?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400 font-mono">{sc.users?.student_id ?? '—'}</p>
                      </div>
                      <span className="text-xs text-slate-300">
                        {sc.enrolled_at ? new Date(sc.enrolled_at).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {selTab === 'exams' && (
              loading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              : exams.length === 0 ? (
                <div className="p-10 bg-white rounded-2xl text-center text-slate-400">Chưa có kỳ thi nào</div>
              ) : (
                <div className="space-y-3">
                  {exams.map(e => {
                    const s = statusOf(e);
                    const submitCnt = (e.submissions ?? []).filter(sub => sub.status === 'SUBMITTED').length;
                    return (
                      <div key={e.id} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">quiz</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{e.title}</p>
                          <p className="text-xs text-slate-400">{e.duration} phút · {submitCnt} nộp bài</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Sidebar info */}
          {cls && (
            <aside className="w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-4">
                <div>
                  <p className="text-xs text-slate-400">Môn học</p>
                  <p className="font-bold">{cls.courses?.subject ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Giáo viên</p>
                  <p className="font-bold">{cls.courses?.users?.full_name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Năm học</p>
                  <p className="font-bold">{cls.academic_year ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Sĩ số</p>
                  <p className="font-bold">{students.length} / {cls.max_student ?? '?'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Mã lớp</p>
                  <p className="font-mono font-bold text-sm">{cls.code}</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
    </>
  );
};

export default ChiTietLopHocDhdeduAzotaStyle;
