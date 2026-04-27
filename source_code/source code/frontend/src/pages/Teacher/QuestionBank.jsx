// src/pages/Teacher/QuestionBank.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Card, CardHeader, EmptyState, ErrorBanner, Sk, PageHeader } from '../../components/ui';
import { questionsService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { SUPABASE_TABLES } from '../../constant/apiEndpoints';

const TYPE_LABEL = { MCQ: 'Trắc nghiệm', ESSAY: 'Tự luận', TRUE_FALSE: 'Đúng/Sai' };

const QuestionBank = () => {
  const profile = useSelector(selectProfile);
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [typeFilter,setTypeFilter]= useState('ALL');

  useEffect(() => {
    if (!profile?.id) return;
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await questionsService.getByTeacher(profile.id);
      if (err) setError('Không thể tải ngân hàng câu hỏi.');
      else setQuestions(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile?.id]);

  const filtered = questions.filter(q => {
    const matchType = typeFilter === 'ALL' || q.type === typeFilter;
    const matchSearch = !search || q.content?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <AppLayout role="TEACHER">
      <PageHeader title="Ngân hàng câu hỏi" subtitle={`${questions.length} câu hỏi trong hệ thống`} />
      {error && <ErrorBanner message={error} />}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        {['ALL', 'MCQ', 'ESSAY', 'TRUE_FALSE'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${typeFilter === t ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t === 'ALL' ? 'Tất cả' : TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="help" title="Chưa có câu hỏi nào" subtitle="Thêm câu hỏi vào đề thi để chúng xuất hiện ở đây." />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(q => (
              <div key={q.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${
                  q.type === 'MCQ' ? 'bg-blue-100 text-blue-700' : q.type === 'ESSAY' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}>{TYPE_LABEL[q.type] ?? q.type}</span>
                <p className="text-sm text-slate-700 flex-1 line-clamp-2">{q.content}</p>
                <span className="text-xs text-slate-400 shrink-0">{q.points ?? 1} điểm</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default QuestionBank;
