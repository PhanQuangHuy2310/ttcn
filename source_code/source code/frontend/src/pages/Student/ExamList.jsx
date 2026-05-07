// src/pages/Student/ExamList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, StatusBadge, Sk, PageHeader, fmtDateTime } from '../../components/ui';
import { examsService } from '../../services/supabaseService';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';

const ExamList = () => {
  const profile = useSelector(selectProfile);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;

    const load = async () => {
      setLoading(true);
      // Lấy toàn bộ đề thi mà học sinh này có quyền xem (thông qua RLS lớp học)
      const { data, error: err } = await examsService.getAll();

      if (err) {
        setError('Không thể tải danh sách kỳ thi.');
      } else {
        // LỌC: Chỉ lấy bài THI CHÍNH THỨC (không chứa từ Thi thử) VÀ PHẢI ĐANG MỞ (ACTIVE)
        const officialExams = (data ?? []).filter(exam => {
          const isMock = exam.title.toLowerCase().includes('thi thử') || exam.title.toLowerCase().includes('luyện tập');
          // Học sinh chỉ thấy bài thi khi trạng thái là ACTIVE (Mở)
          return !isMock && exam.status === 'ACTIVE';
        });
        setExams(officialExams);
      }
      setLoading(false);
    };

    load();
  }, [profile?.id]);

  return (
    <AppLayout role="STUDENT">
      <PageHeader title="Kỳ thi Chính thức" subtitle="Danh sách các kỳ thi đang MỞ để lấy điểm" />
      {error && <ErrorBanner message={error} />}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1, 2, 3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
        ) : exams.length === 0 ? (
          <EmptyState icon="event_available" title="Không có kỳ thi nào đang mở" subtitle="Hiện tại giáo viên chưa mở kỳ thi nào hoặc kỳ thi đã kết thúc." />
        ) : (
          <div className="divide-y divide-slate-50">
            {exams.map(exam => (
              <div key={exam.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-purple-600">quiz</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{exam.title}</p>
                  <p className="text-xs text-slate-400">
                    {exam.duration} phút
                    {exam.start_time ? ` · Mở lúc: ${fmtDateTime(exam.start_time)}` : ' · Đang mở tự do'}
                  </p>
                </div>
                <StatusBadge status={exam.status} />

                {/* Nút vào thi chỉ hiện khi ACTIVE, nhưng do đã lọc ở trên nên chắc chắn hiện */}
                <Link to={`/student/exam?id=${exam.id}`}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition whitespace-nowrap"
                >
                  Vào thi
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default ExamList;