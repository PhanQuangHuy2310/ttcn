// src/pages/Student/MockExams.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Btn, Card, EmptyState, ErrorBanner, Sk, PageHeader, ScoreBadge, StatusBadge, fmtDateTime, fmtDuration } from '../../components/ui';
import { examsService, submissionsService } from '../../services/supabaseService';

const MockExamCard = ({ exam, submission, onStart }) => {
  const hasAttempt = !!submission;
  const isGraded = submission?.status === 'GRADED' || submission?.status === 'SUBMITTED';
  const score = submission?.score;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col">
      <div className={`h-2 ${hasAttempt ? 'bg-green-400' : 'bg-gradient-to-r from-orange-400 to-red-500'}`} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${hasAttempt ? 'bg-green-50' : 'bg-orange-50 group-hover:bg-orange-500 transition-colors'}`}>
            <span className={`material-symbols-outlined text-2xl ${hasAttempt ? 'text-green-600' : 'text-orange-500 group-hover:text-white'}`}>
              {hasAttempt ? 'task_alt' : 'model_training'}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={exam.status ?? 'ACTIVE'} />
            {hasAttempt && score !== null && <ScoreBadge score={score} />}
          </div>
        </div>
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 flex-1">
          {exam.title.replace('[Thi thử]', '').trim()}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 font-medium">
          <span className="material-symbols-outlined text-sm">schedule</span> {fmtDuration(exam.duration)} làm bài
        </div>
        {hasAttempt && (
          <div className="mb-5 px-4 py-3 bg-slate-50 rounded-xl text-xs">
            <p className="text-slate-500">Lần làm cuối: <span className="font-bold text-slate-700">{fmtDateTime(submission.submitted_at)}</span></p>
          </div>
        )}
        <div className="flex gap-3 mt-auto">
          {!hasAttempt ? (
            <Btn className="flex-1 bg-orange-500 hover:bg-orange-600 border-none" icon="play_arrow" onClick={() => onStart(exam.id)}>Bắt đầu thi thử</Btn>
          ) : (
            <>
              {exam.allow_review && isGraded && (
                <Btn variant="outline" icon="visibility" className="flex-1 border-slate-200" onClick={() => onStart(exam.id, 'review')}>Xem lại</Btn>
              )}
              <Btn variant="secondary" icon="refresh" className="flex-1 bg-slate-100 text-slate-700" onClick={() => onStart(exam.id)}>Làm lại</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MockExams = () => {
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const [examRes, subRes] = await Promise.all([
        examsService.getAll(),
        submissionsService.getByStudent(profile.id),
      ]);
      if (examRes.error) { setError('Không thể tải danh sách đề thi.'); setLoading(false); return; }

      // Chỉ lấy bài do giáo viên gán nhãn [Thi thử] và đang ACTIVE
      const mockExams = (examRes.data ?? []).filter(e => e.title.includes('[Thi thử]') && e.status === 'ACTIVE');

      setExams(mockExams);
      setSubmissions(subRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const getSubmission = examId => submissions.find(s => s.exam_id === examId || s.exams?.id === examId);

  const handleStart = (examId, mode) => {
    if (mode === 'review') navigate(`/student/review?id=${examId}`);
    else navigate(`/student/exam?id=${examId}`);
  };

  const attempted = exams.filter(e => !!getSubmission(e.id));
  const unattempted = exams.filter(e => !getSubmission(e.id));
  const displayed = filter === 'ALL' ? exams : filter === 'NEW' ? unattempted : attempted;

  const FILTERS = [
    { value: 'ALL', label: 'Tất cả', count: exams.length },
    { value: 'NEW', label: 'Chưa làm', count: unattempted.length },
    { value: 'ATTEMPTED', label: 'Đã làm', count: attempted.length },
  ];

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Thi thử & Tự luyện" subtitle="Danh sách các bộ đề thi thử do giáo viên thiết lập để luyện tập" />
      {error && <ErrorBanner message={error} />}

      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value} onClick={() => setFilter(f.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${filter === f.value ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f.label} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === f.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Sk key={i} className="h-64 w-full rounded-3xl" />)}
        </div>
      ) : displayed.length === 0 ? (
        <Card><EmptyState icon="assignment_turned_in" title="Chưa có đề thi thử nào" subtitle="Hiện tại chưa có đề thi thử nào đang mở." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map(exam => (
            <MockExamCard key={exam.id} exam={exam} submission={getSubmission(exam.id)} onStart={handleStart} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default MockExams;