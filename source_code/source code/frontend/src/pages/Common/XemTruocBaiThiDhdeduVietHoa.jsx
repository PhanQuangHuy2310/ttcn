// src/pages/Common/XemTruocBaiThiDhdeduVietHoa.jsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonSidebar from '../../components/CommonSidebar';
import CommonHeader from '../../components/CommonHeader';
import { supabase } from '../../lib/supabase';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const XemTruocBaiThiDhdeduVietHoa = () => {
  const [sp]      = useSearchParams();
  const examId    = sp.get('examId');
  const [exam,    setExam]    = useState(null);
  const [sub,     setSub]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!examId) { setLoading(false); return; }
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const [examRes, subRes] = await Promise.all([
          supabase.from('exams').select(`
            id, title, duration, start_time, shuffle_questions, anti_cheat,
            questions(id, type, points),
            courses(name, subject, grade_level),
            classes(name)
          `).eq('id', examId).single(),
          user
            ? supabase.from('submissions')
                .select('id, status, score, submitted_at')
                .eq('exam_id', examId)
                .eq('student_id', user.id)
                .maybeSingle()
            : Promise.resolve({ data: null }),
        ]);
        if (examRes.error) throw examRes.error;
        setExam(examRes.data);
        setSub(subRes.data);
      } catch (err) {
        setError(err?.message ?? 'Không thể tải dữ liệu');
      }
      setLoading(false);
    }
    init();
  }, [examId]);

  const qTotal    = (exam?.questions ?? []).length;
  const mcqCount  = (exam?.questions ?? []).filter(q => q.type === 'MCQ').length;
  const totalPts  = (exam?.questions ?? []).reduce((a, q) => a + (q.points ?? 0), 0);

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Chưa lên lịch';

  const statusOf = () => {
    if (!exam?.start_time) return { label: 'Chưa lên lịch', cls: 'bg-slate-100 text-slate-500' };
    const now = new Date(), start = new Date(exam.start_time);
    const end = new Date(start.getTime() + exam.duration * 60000);
    if (now < start) return { label: 'Sắp diễn ra',  cls: 'bg-blue-50 text-blue-700' };
    if (now <= end)  return { label: 'Đang diễn ra', cls: 'bg-green-50 text-green-700' };
    return               { label: 'Đã kết thúc',  cls: 'bg-slate-100 text-slate-500' };
  };

  return (
    <div className="stitch-screen w-full h-full min-h-screen bg-gray-50">
      <CommonSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <CommonHeader />
        <main className="flex-1 px-10 py-8 max-w-7xl mx-auto w-full">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-tertiary mb-6">
            <a className="hover:text-primary" href="#">Bảng điều khiển</a>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <a className="hover:text-primary" href="#">Bài thi của tôi</a>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <span className="text-on-surface font-semibold">Xem trước bài thi</span>
          </nav>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
          )}

          {!examId ? (
            <div className="p-16 bg-white rounded-2xl text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">quiz</span>
              <p>Thêm ?examId=... vào URL để xem trước đề thi</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-8">

              {/* Main left panel */}
              <div className="col-span-12 lg:col-span-8 space-y-8">

                {/* Exam info card */}
                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0px_12px_32px_rgba(0,28,56,0.04)] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                  <div className="relative z-10">
                    {loading ? (
                      <div className="space-y-4">
                        <div className="flex gap-3"><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /></div>
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          {(() => { const s = statusOf(); return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.cls}`}>{s.label}</span>; })()}
                          {exam?.courses?.subject && (
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                              {exam.courses.subject}
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl font-headline font-bold text-on-surface mb-4 leading-tight">
                          {exam?.title ?? '—'}
                        </h2>
                        <p className="text-slate-500">
                          {exam?.courses?.name} · {exam?.classes?.name}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Exam details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                    : [
                        { label: 'Thời gian',    value: `${exam?.duration} phút`,       icon: 'timer',   color: 'text-blue-600 bg-blue-50' },
                        { label: 'Số câu hỏi',   value: `${qTotal} câu`,               icon: 'quiz',    color: 'text-purple-600 bg-purple-50' },
                        { label: 'Tổng điểm',    value: `${totalPts} điểm`,            icon: 'grade',   color: 'text-green-600 bg-green-50' },
                        { label: 'Bắt đầu',      value: fmtDate(exam?.start_time),     icon: 'event',   color: 'text-orange-600 bg-orange-50' },
                      ].map((c, i) => (
                        <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                            <span className="material-symbols-outlined text-2xl">{c.icon}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">{c.label}</p>
                          <p className="font-bold text-sm text-on-surface mt-0.5">{c.value}</p>
                        </div>
                      ))
                  }
                </div>

                {/* Structure breakdown */}
                {!loading && (
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold mb-4">Cấu trúc đề thi</h3>
                    <div className="space-y-3">
                      {mcqCount > 0 && (
                        <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600">list</span>
                            <span className="font-semibold text-sm text-blue-800">Trắc nghiệm (MCQ)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-blue-700">{mcqCount} câu</span>
                          </div>
                        </div>
                      )}
                      {qTotal - mcqCount > 0 && (
                        <div className="flex items-center justify-between p-3.5 bg-purple-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-purple-600">edit</span>
                            <span className="font-semibold text-sm text-purple-800">Tự luận (Essay)</span>
                          </div>
                          <span className="font-black text-purple-700">{qTotal - mcqCount} câu</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {exam?.shuffle_questions && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="material-symbols-outlined text-sm">shuffle</span>
                          Câu hỏi trộn ngẫu nhiên
                        </div>
                      )}
                      {exam?.anti_cheat && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="material-symbols-outlined text-sm">security</span>
                          Chống gian lận bật
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar panel */}
              <div className="col-span-12 lg:col-span-4 space-y-5">

                {/* My submission status */}
                {!loading && sub && (
                  <div className={`p-5 rounded-2xl border ${sub.status === 'SUBMITTED' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                    <p className="text-sm font-bold mb-1">
                      {sub.status === 'SUBMITTED' ? '✅ Đã hoàn thành' : '⏳ Đang làm dở'}
                    </p>
                    {sub.score !== null && (
                      <p className="text-3xl font-black text-primary">{sub.score}<span className="text-lg text-slate-400">/10</span></p>
                    )}
                    {sub.submitted_at && (
                      <p className="text-xs text-slate-400 mt-1">Nộp lúc {fmtDate(sub.submitted_at)}</p>
                    )}
                  </div>
                )}

                {/* CTA buttons */}
                {!loading && (
                  <div className="space-y-3">
                    {(!sub || sub.status !== 'SUBMITTED') && (
                      <a href={`/student/online-exam-dhdedu-viet-hoa?examId=${examId}`}
                        className="block w-full py-4 bg-primary text-white rounded-2xl font-bold text-center text-base hover:opacity-90 shadow-lg shadow-primary/20 transition-opacity">
                        {sub?.status === 'IN_PROGRESS' ? '▶ Tiếp tục làm bài' : '▶ Bắt đầu làm bài'}
                      </a>
                    )}
                    {sub?.status === 'SUBMITTED' && (
                      <a href={`/student/review-chi-tietstudent?submissionId=${sub.id}`}
                        className="block w-full py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-center hover:bg-slate-50 transition-colors">
                        Xem lại bài làm
                      </a>
                    )}
                  </div>
                )}

                {/* Exam rules */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">info</span>
                    Lưu ý quan trọng
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {[
                      'Không đóng tab hoặc thoát khỏi trang trong khi thi.',
                      'Bài làm sẽ tự động nộp khi hết thời gian.',
                      'Đảm bảo kết nối internet ổn định trước khi bắt đầu.',
                      'Không được phép sử dụng tài liệu ngoài (trừ khi được cho phép).',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course info */}
                {!loading && exam?.courses && (
                  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm">Thông tin môn học</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Môn học',  value: exam.courses.name    },
                        { label: 'Chủ đề',   value: exam.courses.subject },
                        { label: 'Lớp',      value: exam.classes?.name   },
                      ].map((c, i) => c.value && (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">{c.label}</span>
                          <span className="text-xs font-semibold text-on-surface">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default XemTruocBaiThiDhdeduVietHoa;
