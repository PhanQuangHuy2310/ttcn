import React, { useState } from 'react';
import toast from 'react-hot-toast';

const QuestionReviewForm = ({ draftQuestions, onSave }) => {
  const [questions, setQuestions] = useState(draftQuestions);
  const [examTitle, setExamTitle] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = value;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        options: ['A. ', 'B. ', 'C. ', 'D. '],
        correctAnswer: 'A. '
      }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!examTitle.trim()) {
      toast.error('Vui lòng nhập tên Bài Kiểm Tra');
      return;
    }
    // Validation
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].content.trim()) {
        toast.error(`Câu hỏi số ${i + 1} không được để trống nội dung`);
        return;
      }
      if (questions[i].type === 'MCQ' && (!questions[i].correctAnswer || !questions[i].correctAnswer.trim())) {
        toast.error(`Câu hỏi trắc nghiệm số ${i + 1} phải có đáp án đúng`);
        return;
      }
    }
    
    onSave({ examTitle, questions });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
      <h2 className="text-2xl font-black text-slate-800 mb-6">Review & Chỉnh sửa Câu hỏi</h2>

      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Tên Bài Kiểm Tra <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          placeholder="Ví dụ: Kiểm tra 15 phút môn Lịch sử..."
          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
        />
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-5 border border-slate-200 rounded-xl bg-slate-50 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => removeQuestion(qIndex)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Xóa câu hỏi"
              >
                Xóa
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Câu {qIndex + 1} - Loại
                </label>
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="MCQ">Trắc nghiệm (MCQ)</option>
                  <option value="ESSAY">Tự luận (ESSAY)</option>
                </select>
              </div>
              <div className="w-32">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Điểm
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={q.points}
                  onChange={(e) => handleQuestionChange(qIndex, 'points', parseFloat(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Nội dung câu hỏi
              </label>
              <textarea
                value={q.content}
                onChange={(e) => handleQuestionChange(qIndex, 'content', e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white min-h-[80px]"
                rows="3"
              />
            </div>

            {q.type === 'MCQ' ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Các lựa chọn (Options)
                </label>
                {q.options?.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                ))}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Đáp án đúng (Copy chính xác nội dung)
                  </label>
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-green-200 bg-green-50 text-green-700 font-medium"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Đáp án gợi ý (Tự luận)
                </label>
                <textarea
                  value={q.correctAnswer || ''}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                  className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium min-h-[80px]"
                  rows="3"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-6">
        <button
          onClick={addQuestion}
          className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
        >
          + Thêm câu hỏi
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/30"
        >
          Xác nhận & Lưu Đề Thi
        </button>
      </div>
    </div>
  );
};

export default QuestionReviewForm;
