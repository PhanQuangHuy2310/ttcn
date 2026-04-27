// src/pages/Student/Practice.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { PageHeader } from '../../components/ui';

const MODES = [
  { icon: 'style',         title: 'Flashcard',         desc: 'Học với thẻ ghi nhớ', to: '/student/flashcards', color: 'from-orange-400 to-orange-600' },
  { icon: 'assignment',    title: 'Đề thi thử',        desc: 'Làm bài trắc nghiệm theo thời gian', to: '/student/mock-exams', color: 'from-blue-500 to-blue-700' },
  { icon: 'quiz',          title: 'Kỳ thi chính thức', desc: 'Danh sách kỳ thi đang mở', to: '/student/exams', color: 'from-purple-500 to-purple-700' },
  { icon: 'bar_chart',     title: 'Thống kê học tập',  desc: 'Xem tiến độ và kết quả', to: '/student/statistics', color: 'from-green-500 to-green-700' },
];

const Practice = () => (
  <AppLayout role="STUDENT">
    <PageHeader title="Luyện tập" subtitle="Chọn hình thức luyện tập phù hợp với bạn" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {MODES.map(m => (
        <Link key={m.to} to={m.to}
          className={`relative overflow-hidden group bg-gradient-to-br ${m.color} rounded-2xl p-8 text-white hover:scale-[1.01] transition-all duration-200 shadow-lg`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none" />
          <span className="material-symbols-outlined text-4xl mb-4 block opacity-90">{m.icon}</span>
          <h3 className="text-xl font-black mb-1">{m.title}</h3>
          <p className="text-white/80 text-sm">{m.desc}</p>
          <span className="material-symbols-outlined absolute bottom-6 right-6 text-white/50 group-hover:text-white transition-colors">arrow_forward</span>
        </Link>
      ))}
    </div>
  </AppLayout>
);

export default Practice;
