// src/components/CourseBuilder.tsx
// ─── ONLY LOGIC CHANGED — UI STRUCTURE PRESERVED ────────────
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Lesson {
  id: string;
  title: string;
  chapter: number;
  order: number;
  description: string;
  video_url?: string;
}

interface CourseBuilderProps {
  courseId?: string;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ courseId }) => {
  const [lessons,  setLessons]  = useState<Lesson[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    supabase.from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order')
      .then(({ data }) => {
        setLessons(data ?? []);
        setLoading(false);
      });
  }, [courseId]);

  const addLesson = async () => {
    if (!newTitle.trim() || !courseId) return;
    setSaving(true);
    const { data } = await supabase.from('lessons').insert({
      course_id: courseId,
      title: newTitle.trim(),
      chapter: Math.max(...lessons.map(l => l.chapter), 0) + 1,
      order: lessons.length + 1,
      description: '',
    }).select().single();
    if (data) setLessons(prev => [...prev, data]);
    setNewTitle('');
    setSaving(false);
  };

  const removeLesson = async (id: string) => {
    await supabase.from('lessons').delete().eq('id', id);
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Xây dựng chương trình học</h2>
        <button
          onClick={addLesson}
          disabled={saving || !newTitle.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Thêm bài học
        </button>
      </div>

      {/* Add lesson input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addLesson()}
          placeholder="Tên bài học mới..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))
        ) : lessons.length === 0 ? (
          <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-2 block">add_circle</span>
            <p className="text-sm">Chưa có bài học nào. Thêm bài học đầu tiên!</p>
          </div>
        ) : lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold shrink-0">
              {lesson.chapter}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-700 truncate">{lesson.title}</h3>
              {lesson.description && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{lesson.description}</p>
              )}
            </div>
            {lesson.video_url && (
              <a href={lesson.video_url} target="_blank" rel="noreferrer"
                className="text-primary text-xs font-semibold hover:underline shrink-0">
                Video
              </a>
            )}
            <button
              onClick={() => removeLesson(lesson.id)}
              className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseBuilder;
