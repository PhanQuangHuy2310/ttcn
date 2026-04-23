// src/pages/Teacher/TongHopKetQuaLopHocGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { supabase } from '../../lib/supabase';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TongHopKetQuaLopHocGiaoVien = () => {
  const [reports,   setReports]   = useState([]);
  const [selected,  setSelected]  = useState(null); // selected class
  const [exams,     setExams]     = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await teacherService.getReports(user.id);
      const courseList = data ?? [];
      // Flatten to classes
      const allClasses = courseList.flatMap(c =>
        (c.classes ?? []).map(cl => ({
          ...cl,
          courseName: c.name, subject: c.subject,
          exams: cl.exams ?? [],
          studentCount: cl.student_classes?.[0]?.count ?? 0,
        }))
      );
      setReports(allClasses);
      if (allClasses.length) {
        setSelected(allClasses[0]);
        setExams(allClasses[0].exams ?? []);
        if (allClasses[0].exams?.length) {
          setSelectedExam(allClasses[0].exams[0]);
          loadSubs(allClasses[0].exams[0].id);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const loadSubs = async (examId) => {
    setLoadingSubs(true);
    const { data } = await teacherService.getStudentStatusByExam(examId);
    setSubmissions((data ?? []).filter(s => s.status === 'SUBMITTED'));
    setLoadingSubs(false);
  };

  const handleSelectClass = (cls) => {
    setSelected(cls);
    setExams(cls.exams ?? []);
    setSubmissions([]);
    if (cls.exams?.length) {
      setSelectedExam(cls.exams[0]);
      loadSubs(cls.exams[0].id);
    } else setSelectedExam(null);
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    loadSubs(exam.id);
  };

  // Stats from submissions
  const scores      = submissions.map(s => s.score).filter(s => s !== null);
  const avgScore    = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const maxScore    = scores.length ? Math.max(...scores) : null;
  const minScore    = scores.length ? Math.min(...scores) : null;
  const passCount   = scores.filter(s => s >= 5).length;
  const failCount   = scores.filter(s => s < 5).length;
  const passRate    = scores.length ? Math.round((passCount / scores.length) * 100) : 0;

  const formatDate  = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '—';

  const scoreGrade  = (s) => {
    if (s === null) return { label: '—', cls: 'text-slate-400' };
    if (s >= 9)   return { label: 'Xuất sắc', cls: 'text-purple-700 bg-purple-50' };
    if (s >= 8)   return { label: 'Giỏi',     cls: 'text-blue-700 bg-blue-50' };
    if (s >= 7)   return { label: 'Khá',      cls: 'text-green-700 bg-green-50' };
    if (s >= 5)   return { label: 'Trung bình',cls: 'text-yellow-700 bg-yellow-50' };
    return              { label: 'Yếu',       cls: 'text-red-700 bg-red-50' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <TeacherHeader />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
                Tổng hợp Kết quả Lớp học
              </h1>
              <p className="text-tertiary">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-low transition-all font-medium text-sm">
                <span className="material-symbols-outlined text-sm">download</span>
                Xuất file Excel
              </button>
            </div>
          </div>

          {/* Class selector */}
          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-10 w-32 rounded-xl shrink-0"/>)}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {reports.map(cls => (
                <button key={cls.id} onClick={() => handleSelectClass(cls)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    selected?.id === cls.id ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/30'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          )}

          {selected && (
            <>
              {/* Exam selector */}
              {exams.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {exams.map(exam => (
                    <button key={exam.id} onClick={() => handleSelectExam(exam)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                        selectedExam?.id === exam.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary/20'
                      }`}
                    >
                      {exam.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Đã nộp bài', value: submissions.length, icon: 'assignment_turned_in', cls: 'bg-primary/10 text-primary' },
                  { label: 'Điểm trung bình', value: avgScore !== null ? `${avgScore}/10` : '—', icon: 'grade', cls: 'bg-blue-50 text-blue-600' },
                  { label: 'Tỷ lệ đạt', value: `${passRate}%`, icon: 'check_circle', cls: 'bg-green-50 text-green-600' },
                  { label: 'Chưa đạt', value: failCount, icon: 'cancel', cls: 'bg-red-50 text-red-500' },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.cls}`}>
                      <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{c.label}</p>
                      {loadingSubs ? <Skeleton className="h-7 w-16 mt-1"/> : (
                        <p className="text-2xl font-black text-on-surface">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Score distribution mini-bar */}
              {!loadingSubs && scores.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-bold mb-4">Phân phối điểm</h3>
                  <div className="flex items-end gap-1 h-20">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(score => {
                      const count = scores.filter(s => Math.floor(s) === score).length;
                      const pct   = scores.length ? Math.round((count / scores.length) * 100) : 0;
                      return (
                        <div key={score} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary/20 rounded-t-sm relative" style={{ height: `${Math.max(pct, 2)}%` }}>
                            {count > 0 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary">{count}</span>}
                          </div>
                          <span className="text-[9px] text-slate-400">{score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submission table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                  <h3 className="font-bold text-on-surface">
                    Chi tiết kết quả {selectedExam?.title && `— ${selectedExam.title}`}
                  </h3>
                </div>
                {loadingSubs ? (
                  <div className="p-5 space-y-3">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-10 rounded-xl"/>)}</div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block">assignment</span>
                    Chưa có bài nộp nào
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Sinh viên</th>
                        <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Ngày nộp</th>
                        <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Thời gian</th>
                        <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Điểm</th>
                        <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.sort((a, b) => (b.score ?? -1) - (a.score ?? -1)).map((sub, i) => {
                        const g = scoreGrade(sub.score);
                        return (
                          <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-xs font-bold">{(sub.users?.full_name ?? 'S').charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-on-surface">{sub.users?.full_name ?? '—'}</p>
                                  <p className="text-xs text-slate-400">{sub.users?.student_id ?? '—'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-500">{formatDate(sub.submitted_at)}</td>
                            <td className="p-4 text-sm text-slate-500">
                              {sub.time_spent ? `${Math.floor(sub.time_spent / 60)} phút` : '—'}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`text-lg font-black ${sub.score !== null ? (sub.score >= 5 ? 'text-green-600' : 'text-red-500') : 'text-slate-300'}`}>
                                {sub.score !== null ? sub.score : '—'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${g.cls}`}>{g.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TongHopKetQuaLopHocGiaoVien;
