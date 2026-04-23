// src/pages/Student/XemTruocBaiThiSinhVien.jsx
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

const XemTruocBaiThiSinhVien = () => {
  const [sp]      = useSearchParams();
  const examId    = sp.get('examId');
  const [exam,    setExam]    = useState(null);
  const [sub,     setSub]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function init() {
      if (!examId) { setLoading(false); return; }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const [examRes, subRes] = await Promise.all([
          supabase.from('exams').select(`
            id, title, duration, start_time, shuffle_questions, anti_cheat, password,
            questions(id, type, points),
            courses(name, subject, grade_level),
            classes(name)
          `).eq('id', examId).single(),
          user
            ? supabase.from('submissions').select('id, status, score, submitted_at')
                .eq('exam_id', examId).eq('student_id', user.id).maybeSingle()
            : { data: null },
        ]);
        if (examRes.error) throw examRes.error;
        setExam(examRes.data);
        setSub(subRes.data);
      } catch (err) {
        setError(err?.message ?? 'Lỗi tải dữ liệu');
      }
      setLoading(false);
    }
    init();
  }, [examId]);

  const qTotal  = (exam?.questions ?? []).length;
  const mcqCount = (exam?.questions ?? []).filter(q => q.type === 'MCQ').length;
  const essayCount = qTotal - mcqCount;
  const totalPts = (exam?.questions ?? []).reduce((acc, q) => acc + (q.points ?? 0), 0);

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Chưa lên lịch';

  const statusOf = () => {
    if (!exam?.start_time) return { label: 'Chưa lên lịch', cls: 'bg-slate-100 text-slate-500' };
    const now = new Date(), start = new Date(exam.start_time);
    const end = new Date(start.getTime() + exam.duration * 60000);
    if (now < start) return { label: 'Sắp diễn ra', cls: 'bg-blue-50 text-blue-700' };
    if (now <= end)  return { label: 'Đang diễn ra', cls: 'bg-green-50 text-green-700' };
    return               { label: 'Đã kết thúc', cls: 'bg-slate-100 text-slate-500' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <StudentHeader />
        <main className="flex-1 px-10 py-8 max-w-7xl mx-auto w-full">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-tertiary mb-6">
            <a className="hover:text-primary" href="/student/dashboard">Dashboard</a>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <a className="hover:text-primary" href="/student/mock-exams-student">Bài thi của tôi</a>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <span className="text-on-surface font-medium">{loading ? '...' : exam?.title}</span>
          </nav>

          {error && <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>}

          {!examId ? (
            <div className="p-16 bg-white rounded-2xl text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
              <p>Vui lòng thêm ?examId=... vào URL để xem trước đề thi</p>
            </div>
          ) : loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-80" />
              <div className="grid grid-cols-4 gap-4"><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /></div>
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {(() => { const s = statusOf(); return <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.cls}`}>{s.label}</span>; })()}
                    <span className="text-sm text-slate-400">{exam?.courses?.subject}</span>
                  </div>
                  <h1 className="text-3xl font-black text-on-surface mb-2">{exam?.title}</h1>
                  <p className="text-slate-500">{exam?.courses?.name} · {exam?.classes?.name}</p>
                </div>

                {/* Key info grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Thời gian làm',     value: `${exam?.duration} phút`,      icon: 'timer' },
                    { label: 'Số câu hỏi',         value: `${qTotal} câu`,               icon: 'quiz' },
                    { label: 'Thời gian bắt đầu',  value: fmtDate(exam?.start_time),    icon: 'event' },
                    { label: 'Tổng điểm',          value: `${totalPts} điểm`,           icon: 'grade' },
                  ].map((c, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">{c.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{c.label}</p>
                        <p className="font-bold text-sm text-on-surface">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Structure */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-4">Cấu trúc đề thi</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-base">list</span>
                        <span className="text-sm font-semibold text-blue-800">Trắc nghiệm</span>
                      </div>
                      <span className="text-sm font-black text-blue-700">{mcqCount} câu</span>
                    </div>
                    {essayCount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-purple-600 text-base">edit</span>
                          <span className="text-sm font-semibold text-purple-800">Tự luận</span>
                        </div>
                        <span className="text-sm font-black text-purple-700">{essayCount} câu</span>
                      </div>
                    )}
                    {exam?.shuffle_questions && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="material-symbols-outlined text-sm">shuffle</span>
                        <span>Câu hỏi được trộn ngẫu nhiên</span>
                      </div>
                    )}
                    {exam?.anti_cheat && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-sm">security</span>
                        <span>Chế độ chống gian lận được bật</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action panel */}
              <div className="space-y-5">
                {/* Submission status */}
                {sub && (
                  <div className={`p-5 rounded-2xl ${sub.status === 'SUBMITTED' ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                    <p className="text-sm font-bold mb-1">
                      {sub.status === 'SUBMITTED' ? '✅ Đã nộp bài' : '⏳ Đang làm dở'}
                    </p>
                    {sub.score !== null && (
                      <p className="text-2xl font-black text-primary">{sub.score}/10</p>
                    )}
                    {sub.submitted_at && (
                      <p className="text-xs text-slate-400 mt-1">Nộp lúc {fmtDate(sub.submitted_at)}</p>
                    )}
                  </div>
                )}

                {/* CTA */}
                {(!sub || sub.status !== 'SUBMITTED') && (
                  <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${examId}`}
                    className="block w-full py-4 bg-primary text-white rounded-2xl font-bold text-center text-base hover:opacity-90 shadow-lg shadow-primary/20 transition-opacity">
                    {sub?.status === 'IN_PROGRESS' ? '▶ Tiếp tục làm bài' : '▶ Bắt đầu làm bài'}
                  </a>
                )}

                {sub?.status === 'SUBMITTED' && (
                  <a href={`/student/review-chi-tietstudent?submissionId=${sub.id}`}
                    className="block w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-center hover:bg-slate-50 transition-colors">
                    Xem lại bài làm
                  </a>
                )}

                {/* Exam rules */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm mb-3">Lưu ý khi thi</h3>
                  <ul className="space-y-2 text-xs text-slate-500">
                    {[
                      'Không đóng tab hoặc thoát khỏi trang trong khi thi',
                      'Đảm bảo kết nối internet ổn định',
                      'Bài làm sẽ tự động nộp khi hết thời gian',
                      exam?.password ? 'Cần mật khẩu để vào phòng thi' : 'Không cần mật khẩu',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-xs mt-0.5 shrink-0">info</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default XemTruocBaiThiSinhVien;
