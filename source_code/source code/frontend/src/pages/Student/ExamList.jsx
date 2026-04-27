// src/pages/Student/ExamList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, StatusBadge, Sk, PageHeader, fmtDateTime } from '../../components/ui';
import { examsService } from '../../services/supabaseService';

const ExamList = () => {
  const [exams,   setExams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    examsService.getUpcoming(20).then(({ data, error: err }) => {
      if (err) setError('Không thể tải danh sách kỳ thi.');
      else setExams(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Kỳ thi" subtitle="Danh sách các kỳ thi sắp diễn ra" />
      {error && <ErrorBanner message={error} />}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
        ) : exams.length === 0 ? (
          <EmptyState icon="event_available" title="Không có kỳ thi nào sắp tới" subtitle="Kiểm tra lại sau hoặc liên hệ giảng viên." />
        ) : (
          <div className="divide-y divide-slate-50">
            {exams.map(exam => (
              <div key={exam.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-purple-600">quiz</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{exam.title}</p>
                  <p className="text-xs text-slate-400">{exam.classes?.name ?? '—'} · {exam.duration} phút · {fmtDateTime(exam.start_time)}</p>
                </div>
                <StatusBadge status={exam.status ?? 'DRAFT'} />
                {exam.status === 'PUBLISHED' && (
                  <Link to={`/student/exams/take?id=${exam.id}`}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition whitespace-nowrap"
                  >
                    Vào thi
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default ExamList;
