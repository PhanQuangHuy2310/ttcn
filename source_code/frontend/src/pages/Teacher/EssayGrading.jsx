// src/pages/Teacher/EssayGrading.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Btn, Card, EmptyState, ErrorBanner, Sk, Select, PageHeader, Avatar, fmtDate, Input, Textarea } from '../../components/ui';
import { questionsService, examsService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';

const SubmissionGradeCard = ({ submission, questions, onGraded }) => {
  const [score, setScore] = useState(submission.score ?? '');
  const [comment, setComment] = useState(submission.teacher_comment ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isGraded = submission.status === 'GRADED';

  const handleSave = async () => {
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setError('Điểm số phải nằm trong khoảng từ 0 đến 10.');
      return;
    }
    setSaving(true);
    setError(null);

    const { error: err } = await supabase
      .from('submissions')
      .update({
        score: numScore,
        teacher_comment: comment.trim() || null,
        status: 'GRADED',
        graded_at: new Date().toISOString()
      })
      .eq('id', submission.id);

    if (!err && submission.student_id) {
      await supabase.from('notifications').insert({
        user_id: submission.student_id,
        title: '📝 Bài tự luận đã có điểm!',
        message: `Giảng viên đã chấm và nhận xét bài thi của bạn.`,
        type: 'GRADE', action_url: `/student/review?id=${submission.exam_id}`, read_status: false
      });
    }

    setSaving(false);
    if (err) { setError('Lỗi lưu điểm: ' + err.message); return; }

    // Báo lên component cha để cập nhật giao diện ngay lập tức
    onGraded?.(submission.id, numScore, comment.trim());
  };

  const student = submission.users;
  const essayQuestions = questions.filter(q => q.type === 'ESSAY');
  const answers = submission.answers ?? {};

  return (
    <Card className="overflow-visible print:shadow-none print:border-slate-300 mb-6">
      <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <Avatar name={student?.full_name ?? 'Sinh viên'} size="md" />
          <div>
            <p className="font-bold text-slate-800">{student?.full_name}</p>
            <p className="text-xs text-slate-500">Nộp lúc: {fmtDate(submission.submitted_at)}</p>
          </div>
        </div>
        {isGraded && <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Đã chấm</span>}
      </div>

      <div className="p-6 space-y-6">
        {essayQuestions.map((q, i) => (
          <div key={q.id} className="space-y-3">
            <p className="text-sm font-semibold">Câu {i + 1}: {q.content}</p>
            <div className="ml-4 p-4 bg-slate-50 border rounded-xl text-sm whitespace-pre-wrap">
              {answers[q.id] || <span className="text-orange-500 italic">Bỏ trống</span>}
            </div>
          </div>
        ))}

        <div className="border-t pt-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 mb-3 rounded">{error}</p>}
          <div className="grid grid-cols-3 gap-5">
            <Input label="Điểm tổng (Hệ 10) *" type="number" min={0} max={10} step={0.1} value={score} onChange={e => setScore(e.target.value)} required />
            <div className="col-span-2">
              <Textarea label="Nhận xét" value={comment} onChange={e => setComment(e.target.value)} rows={2} />
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <Btn onClick={handleSave} loading={saving} variant={isGraded ? 'success' : 'primary'} icon={isGraded ? 'check' : 'save'}>
              {isGraded ? 'Cập nhật điểm' : 'Chốt điểm'}
            </Btn>
          </div>
        </div>
      </div>
    </Card>
  );
};

const EssayGrading = () => {
  const [params, setParams] = useSearchParams();
  const examId = params.get('examId');
  const navigate = useNavigate();
  const profile = useSelector(selectProfile);

  const [allExams, setAllExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    if (profile?.id) examsService.getByTeacher(profile.id).then(({ data }) => setAllExams(data ?? []));
  }, [profile?.id]);

  const loadSubmissions = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    const [qRes, subRes] = await Promise.all([
      questionsService.getByExam(examId),
      supabase.from('submissions').select('*, users!inner(id, full_name, email)').eq('exam_id', examId).order('submitted_at', { ascending: false })
    ]);
    setQuestions(qRes.data ?? []);
    setSubmissions(subRes.data ?? []);
    setLoading(false);
  }, [examId]);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  // Cập nhật state list lập tức khi chấm xong 1 bài (Không cần f5)
  const handleGraded = (submissionId, score, comment) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, score, teacher_comment: comment, status: 'GRADED' } : s));
  };

  const essayQuestions = questions.filter(q => q.type === 'ESSAY');
  const filtered = filter === 'PENDING' ? submissions.filter(s => s.status !== 'GRADED') : submissions;

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Chấm bài & Đánh giá" back={() => navigate(-1)} />
      <div className="max-w-xl mb-6">
        <Select value={examId || ''} onChange={e => setParams(e.target.value ? { examId: e.target.value } : {})}>
          <option value="">-- Chọn đề thi --</option>
          {allExams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
        </Select>
      </div>

      {examId && !loading && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter('PENDING')} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === 'PENDING' ? 'bg-primary text-white' : 'bg-white'}`}>Chờ chấm ({submissions.filter(s => s.status !== 'GRADED').length})</button>
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === 'ALL' ? 'bg-primary text-white' : 'bg-white'}`}>Tất cả ({submissions.length})</button>
        </div>
      )}

      {loading ? <Sk className="h-64 w-full" /> : filtered.map(sub => (
        <SubmissionGradeCard key={sub.id} submission={sub} questions={essayQuestions} onGraded={handleGraded} />
      ))}
    </AppLayout>
  );
};
export default EssayGrading;