// src/pages/Teacher/ChiTietLopHocGiaoVien.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import TeacherHeader from '../../components/TeacherHeader';
import { teacherService } from '../../hooks/useSupabaseQuery';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const STATUS_CONFIG = {
  SUBMITTED:   { label: 'Đã nộp',   cls: 'bg-green-50 text-green-700',  dot: 'bg-green-500' },
  IN_PROGRESS: { label: 'Đang làm', cls: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-400' },
  NOT_STARTED: { label: 'Chưa làm', cls: 'bg-slate-100 text-slate-500',  dot: 'bg-slate-300' },
};

const ChiTietLopHocGiaoVien = () => {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');

  const [classData,    setClassData]    = useState(null);
  const [activeTab,    setActiveTab]    = useState('students');
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentStats, setStudentStats] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await teacherService.getClassDetail(classId);
      if (err) setError(err.message);
      else {
        setClassData(data);
        if (data?.exams?.length) setSelectedExam(data.exams[0].id);
      }
      setLoading(false);
    }
    load();
  }, [classId]);

  useEffect(() => {
    if (!selectedExam) return;
    async function loadStats() {
      setLoadingStats(true);
      const { data } = await teacherService.getStudentStatusByExam(selectedExam);
      setStudentStats(data ?? []);
      setLoadingStats(false);
    }
    loadStats();
  }, [selectedExam]);

  const students     = classData?.student_classes ?? [];
  const exams        = classData?.exams ?? [];
  const completionPct = studentStats.length
    ? Math.round((studentStats.filter(s => s.status === 'SUBMITTED').length / studentStats.length) * 100)
    : 0;

  const formatTime = (iso) => iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  const TABS = [
    { key: 'students', label: 'Danh sách sinh viên' },
    { key: 'exams',    label: 'Bài tập & Kiểm tra' },
    { key: 'stats',    label: 'Thống kê lớp học' },
  ];

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 ml-64 p-8">
        <TeacherHeader />

        {!classId ? (
          <div className="mt-8 p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">school</span>
            <p>Vui lòng chọn lớp học từ menu hoặc thêm ?classId=... vào URL</p>
          </div>
        ) : loading ? (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">⚠️ {error}</div>
        ) : (
          <>
            {/* Class Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-black text-on-surface">
                {classData?.name ?? '—'}
                <span className="ml-2 text-base font-normal text-slate-400">· {classData?.courses?.name}</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Mã lớp: {classData?.code} · {students.length} sinh viên · Năm học {classData?.academic_year}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-4 px-2 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'text-primary font-bold border-b-2 border-primary'
                      : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab: Students ── */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left p-4 text-sm font-bold text-slate-500">Sinh viên</th>
                      <th className="text-left p-4 text-sm font-bold text-slate-500">Email</th>
                      <th className="text-left p-4 text-sm font-bold text-slate-500">Mã SV</th>
                      <th className="text-left p-4 text-sm font-bold text-slate-500">Ngày đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={4} className="p-12 text-center text-slate-400">Chưa có sinh viên</td></tr>
                    ) : students.map(sc => (
                      <tr key={sc.users?.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary text-xs font-bold">
                                {(sc.users?.full_name ?? 'S').charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-sm">{sc.users?.full_name ?? '—'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{sc.users?.email ?? '—'}</td>
                        <td className="p-4 text-sm font-mono text-slate-500">{sc.users?.student_id ?? '—'}</td>
                        <td className="p-4 text-sm text-slate-400">{formatTime(sc.enrolled_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Tab: Exams / Student Status ── */}
            {activeTab === 'exams' && (
              <div className="grid grid-cols-12 gap-6">
                {/* Exam selector */}
                <div className="col-span-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Chọn kỳ thi</h3>
                  {exams.length === 0 ? (
                    <p className="text-slate-400 text-sm">Chưa có kỳ thi nào</p>
                  ) : exams.map(exam => (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedExam(exam.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedExam === exam.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-primary/30'
                      }`}
                    >
                      <p className="font-semibold text-sm text-on-surface">{exam.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatTime(exam.start_time)} · {exam.duration} phút</p>
                    </button>
                  ))}
                </div>

                {/* Student status list */}
                <div className="col-span-8">
                  {selectedExam && (
                    <>
                      {/* Completion bar */}
                      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-600">Tỷ lệ hoàn thành</span>
                          <span className="text-sm font-bold text-primary">{completionPct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                        </div>
                        <div className="flex gap-4 mt-3">
                          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                              {cfg.label}: {studentStats.filter(s => s.status === key).length}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="text-left p-4 text-sm font-bold text-slate-500">Sinh viên</th>
                              <th className="text-left p-4 text-sm font-bold text-slate-500">Trạng thái</th>
                              <th className="text-left p-4 text-sm font-bold text-slate-500">Điểm</th>
                              <th className="text-left p-4 text-sm font-bold text-slate-500">Thời gian nộp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loadingStats ? (
                              Array.from({length: 5}).map((_, i) => (
                                <tr key={i}><td colSpan={4} className="p-4"><Skeleton className="h-4 w-full" /></td></tr>
                              ))
                            ) : studentStats.length === 0 ? (
                              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Chưa có dữ liệu</td></tr>
                            ) : studentStats.map(sub => {
                              const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.NOT_STARTED;
                              return (
                                <tr key={sub.users?.id} className="border-b border-slate-50 hover:bg-slate-50">
                                  <td className="p-4 text-sm font-medium">{sub.users?.full_name ?? '—'}</td>
                                  <td className="p-4">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                                      {cfg.label}
                                    </span>
                                  </td>
                                  <td className="p-4 text-sm font-bold">
                                    {sub.score !== null ? `${sub.score}/10` : '—'}
                                  </td>
                                  <td className="p-4 text-sm text-slate-400">
                                    {formatTime(sub.submitted_at)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab: Stats ── */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Tổng sinh viên',  value: students.length,                                 icon: 'group' },
                  { label: 'Số kỳ thi',        value: exams.length,                                    icon: 'quiz' },
                  { label: 'Tỷ lệ nộp bài',    value: `${completionPct}%`,                            icon: 'check_circle' },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">{c.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{c.label}</p>
                      <p className="text-2xl font-black text-on-surface">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ChiTietLopHocGiaoVien;
