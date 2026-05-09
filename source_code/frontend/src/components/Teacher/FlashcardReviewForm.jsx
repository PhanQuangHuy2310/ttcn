import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';


/**
 * Component Form cho phép giáo viên kiểm duyệt và chỉnh sửa Flashcards do AI tạo ra.
 * @param {Array} initialData - Danh sách flashcards nháp từ AI
 * @param {Function} onSave - Hàm xử lý khi bấm Lưu
 * @param {Function} onCancel - Hàm xử lý khi bấm Hủy
 */
const FlashcardReviewForm = ({ initialData, onSave, onCancel }) => {
    // Sử dụng React Hook Form để quản lý trạng thái form và validate
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '', // Tiêu đề bộ thẻ
            description: '', // Mô tả bộ thẻ
            flashcards: initialData || [] // Danh sách các thẻ
        }
    });

    // Quản lý mảng các trường (fields) động (thêm/xóa thẻ)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "flashcards"
    });

    // Xử lý khi submit form
    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            {/* Header của Form Review */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Kiểm duyệt Flashcards</h2>
                <div className="space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-md"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        Xác nhận & Lưu
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Thông tin cơ bản của bộ Flashcard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bộ Flashcard</label>
                        <input
                            {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                            placeholder="VD: Từ vựng Tiếng Anh - Bài 1"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (không bắt buộc)</label>
                        <input
                            {...register("description")}
                            placeholder="VD: Các từ vựng về chủ đề môi trường"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* Danh sách các thẻ Flashcard */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
                        Danh sách thẻ ({fields.length})
                        <button
                            type="button"
                            onClick={() => append({ front: '', back: '', hint: '' })}
                            className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span> Thêm thẻ mới
                        </button>
                    </h3>

                    {/* Vùng hiển thị danh sách thẻ có scroll */}
                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                                {/* Nút xóa thẻ */}
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nội dung mặt trước */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mặt trước (Câu hỏi/Thuật ngữ)</label>
                                        <textarea
                                            {...register(`flashcards.${index}.front`, { required: true })}
                                            rows="2"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        />
                                    </div>
                                    {/* Nội dung mặt sau */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mặt sau (Đáp án/Định nghĩa)</label>
                                        <textarea
                                            {...register(`flashcards.${index}.back`, { required: true })}
                                            rows="2"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                                {/* Gợi ý bổ sung */}
                                <div className="mt-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gợi ý (tùy chọn)</label>
                                    <input
                                        {...register(`flashcards.${index}.hint`)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FlashcardReviewForm;
