// src/pages/Student/Practice.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { PageHeader } from '../../components/ui';

const MODES = [
  {
    icon: 'style',
    title: 'Flashcard',
    desc: 'Học với thẻ ghi nhớ',
    to: '/student/flashcards',
    color: 'from-orange-400 to-orange-600'
  },
  {
    icon: 'assignment',
    title: 'Đề thi thử',
    desc: 'Luyện tập trắc nghiệm không giới hạn',
    to: '/student/mock-exams',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: 'quiz',
    title: 'Kỳ thi chính thức',
    desc: 'Danh sách các kỳ thi đang mở',
    to: '/student/exams',
    color: 'from-purple-500 to-purple-700'
  },
  {
    icon: 'bar_chart',
    title: 'Thống kê học tập',
    desc: 'Xem tiến độ và kết quả đánh giá',
    to: '/student/statistics',
    color: 'from-green-500 to-green-700'
  },
];

const Practice = () => (
  <AppLayout role="STUDENT">
    <PageHeader
      title="Luyện tập & Thi"
      subtitle="Chọn hình thức học tập phù hợp với mục tiêu của bạn"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
      {MODES.map(m => (
        <Link
          key={m.to}
          to={m.to}
          className={`relative overflow-hidden group bg-gradient-to-br ${m.color} rounded-3xl p-8 text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none transition-transform group-hover:scale-110" />

          {/* Content */}
          <span className="material-symbols-outlined text-5xl mb-5 block opacity-90 drop-shadow-sm">
            {m.icon}
          </span>
          <h3 className="text-2xl font-black mb-2 tracking-tight">{m.title}</h3>
          <p className="text-white/85 text-sm font-medium">{m.desc}</p>

          {/* Action icon */}
          <span className="material-symbols-outlined absolute bottom-8 right-8 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-3xl">
            arrow_forward
          </span>
        </Link>
      ))}
    </div>
  </AppLayout>
);

export default Practice;