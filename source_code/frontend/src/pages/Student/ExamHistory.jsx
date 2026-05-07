// src/pages/Student/ExamHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, StatusBadge, Sk, PageHeader, fmtDateTime } from '../../components/ui';
import { submissionsService } from '../../services/supabaseService';

const ScoreBadge = ({ score }) => {
  if (score === null || score === undefined) return <span className="text-xs text-slate-400">Chưa chấm</span>;
  const num = parseFloat(score);
  const cls = num >= 8 ? 'text-green-600 bg-green-50' : num >= 6.5 ? 'text-blue-600 bg-blue-50' : num >= 5 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50';
  return <span className={`text-sm font-black px-3 py-1 rounded-full ${cls}`}>{num.toFixed(1)}</span>;
};

const ExamHistory = () => {
  const profile = useSelector(selectProfile);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await submissionsService.getByStudent(profile.id);
      if (err) setError('Không thể tải lịch sử bài thi.');
      else setSubmissions(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const filtered = submissions.filter(s => {
    const matchFilter = filter === 'ALL' || s.status === filter;
    const matchSearch = !search || s.exams?.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const avgScore = (() => {
    const scored = submissions.filter(s => s.score !== null && s.score !== undefined);
    if (!scored.length) return null;
    return (scored.reduce((a, s) => a + parseFloat(s.score), 0) / scored.length).toFixed(1);
  })();

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Lịch sử làm bài"
        subtitle={`${submissions.length} bài thi đã thực hiện`}
      />
      {error && <ErrorBanner message={error} />}

      {!loading && submissions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng bài thi', value: submissions.length, icon: 'assignment', bg: 'bg-blue-50 text-blue-600' },
            { label: 'Đã nộp/Chấm xong', value: submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'GRADED').length, icon: 'task_alt', bg: 'bg-green-50 text-green-600' },
            { label: 'Đang làm', value: submissions.filter(s => s.status === 'IN_PROGRESS').length, icon: 'edit_note', bg: 'bg-orange-50 text-orange-600' },
            { label: 'Điểm trung bình', value: avgScore ?? '—', icon: 'grade', bg: 'bg-purple-50 text-purple-600' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} shrink-0`}>
                <span className="material-symbols-outlined">{c.icon}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className="text-xl font-black text-slate-800">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm đề thi..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter === s ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {s === 'ALL' ? 'Tất cả' : s === 'NOT_STARTED' ? 'Chưa làm' : s === 'IN_PROGRESS' ? 'Đang làm' : s === 'GRADED' ? 'Đã chấm' : 'Đã nộp'}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2, 3, 4].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="assignment"
            title="Không có bài thi nào"
            subtitle="Thử thay đổi bộ lọc hoặc tham gia kỳ thi mới."
            action={<Link to="/student/exams" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition">Xem kỳ thi</Link>}
          />
        ) : (
          <>
            <div className="px-6 py-3 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="col-span-5">Đề thi</span>
              <span className="col-span-2">Lớp</span>
              <span className="col-span-2">Nộp lúc</span>
              <span className="col-span-1">Điểm</span>
              <span className="col-span-1">Trạng thái</span>
              <span className="col-span-1"></span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map(sub => (
                <div key={sub.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-purple-600 text-lg">quiz</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{sub.exams?.title ?? '—'}</p>
                      <p className="text-xs text-slate-400">{sub.exams?.duration ?? '—'} phút</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-slate-500 truncate">{sub.exams?.classes?.name ?? '—'}</div>
                  <div className="col-span-2 text-xs text-slate-400">{fmtDateTime(sub.submitted_at)}</div>
                  <div className="col-span-1"><ScoreBadge score={sub.score} /></div>
                  <div className="col-span-1"><StatusBadge status={sub.status} /></div>
                  <div className="col-span-1 flex justify-end">

                    {/* Đã sửa URL và cho phép cả bài GRADED được xem lại */}
                    {sub.status === 'SUBMITTED' || sub.status === 'GRADED' ? (
                      <Link to={`/student/review?id=${sub.exam_id}`}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Xem lại bài làm"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </Link>
                    ) : sub.status === 'IN_PROGRESS' ? (
                      <Link to={`/student/exam?id=${sub.exam_id}`}
                        className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 transition"
                      >
                        Tiếp tục
                      </Link>
                    ) : null}

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </AppLayout>
  );
};

export default ExamHistory;