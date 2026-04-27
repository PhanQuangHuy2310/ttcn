// src/pages/Teacher/ExamMatrices.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, EmptyState, ErrorBanner, Sk, PageHeader, fmtDate } from '../../components/ui';
import { examMatricesService } from '../../services/supabaseService';

const ExamMatrices = () => {
  const profile = useSelector(selectProfile);
  const [matrices, setMatrices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    examMatricesService.getByTeacher(profile.id).then(({ data, error: err }) => {
      if (err) setError('Không thể tải danh sách ma trận đề thi.');
      else setMatrices(data ?? []);
      setLoading(false);
    });
  }, [profile?.id]);

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Ma trận đề thi" subtitle="Quản lý cấu hình ma trận đề thi"
        actions={
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span> Tạo ma trận mới
          </button>
        }
      />
      {error && <ErrorBanner message={error} />}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
        ) : matrices.length === 0 ? (
          <EmptyState icon="grid_view" title="Chưa có ma trận đề thi nào" subtitle="Tạo ma trận đề thi để chuẩn hóa cấu trúc bài kiểm tra." />
        ) : (
          <div className="divide-y divide-slate-50">
            {matrices.map(m => (
              <div key={m.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-indigo-600">grid_view</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{m.name ?? 'Ma trận không tên'}</p>
                  <p className="text-xs text-slate-400">{fmtDate(m.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default ExamMatrices;
