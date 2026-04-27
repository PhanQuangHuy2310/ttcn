// src/pages/Student/MockExams.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { EmptyState, PageHeader } from '../../components/ui';
import { Card } from '../../components/ui';

// Mock exams are a subset of published exams available for practice.
// For now, redirect to ExamList — can be expanded with a "is_mock" flag in exams table.
const MockExams = () => (
  <AppLayout role="STUDENT">
    <PageHeader title="Đề thi thử" subtitle="Luyện tập với các đề thi mẫu" />
    <Card>
      <EmptyState
        icon="assignment"
        title="Đề thi thử sẽ sớm ra mắt"
        subtitle="Tính năng này đang được phát triển. Bạn có thể luyện tập với flashcard hoặc làm kỳ thi chính thức."
        action={
          <div className="flex gap-3">
            <Link to="/student/flashcards" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
              Học Flashcard
            </Link>
            <Link to="/student/exams" className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Kỳ thi chính thức
            </Link>
          </div>
        }
      />
    </Card>
  </AppLayout>
);

export default MockExams;
