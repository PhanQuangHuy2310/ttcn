/**
 * FILE: AiQuestionGenerator.jsx
 * MÔ TẢ: Giao diện chính cho tính năng AI Generator dành cho Giáo viên.
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - Cho phép tải lên tài liệu PDF học tập để AI tự động bóc tách thành Đề thi trắc nghiệm/tự luận hoặc bộ thẻ học tập Flashcards.
 * - Xử lý truyền phát sự kiện tiến độ thời gian thực (Server-Sent Events - SSE) từ Backend bằng cách giải mã stream nhị phân (Binary Stream).
 */
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import QuestionReviewForm from '../../components/Teacher/QuestionReviewForm';
import FlashcardReviewForm from '../../components/Teacher/FlashcardReviewForm';
import { supabase } from '../../lib/supabase';
import { CLASSES_API, TEACHER_AI_API } from '../../constant/apiEndpoints';

const AiQuestionGenerator = () => {
    const profile = useSelector(selectProfile);
    const fileInputRef = useRef(null); // Tham chiếu tới thẻ input file ẩn để kích hoạt sự kiện click chọn file qua nút tự chế

    // ── Quản lý trạng thái ứng dụng ──────────────────────────────
    const [mode, setMode] = useState('QUESTION'); // Chế độ: 'QUESTION' (Tạo đề thi) hoặc 'FLASHCARD' (Tạo bộ thẻ Flashcard)
    const [file, setFile] = useState(null); // Lưu file PDF được người dùng chọn
    const [isExtracting, setIsExtracting] = useState(false); // Trạng thái đang đợi AI bóc tách nội dung
    const [progress, setProgress] = useState(null); // Lưu thông tin tiến độ xử lý hiện tại (Bước, Nội dung thông điệp, Phần trăm %)
    const [draftData, setDraftData] = useState(null); // Lưu kết quả danh sách câu hỏi hoặc flashcards thô do AI trả về
    const [draftId, setDraftId] = useState(null); // Lưu ID bản nháp duy nhất do server cung cấp (chỉ dùng cho Flashcards)
    const [isSaving, setIsSaving] = useState(false); // Trạng thái đang gửi yêu cầu lưu bản nháp vào Database
    const [classes, setClasses] = useState([]); // Danh sách lớp học thuộc quyền quản lý của giáo viên
    const [selectedClassId, setSelectedClassId] = useState(''); // ID lớp học được giáo viên lựa chọn trên màn hình

    // Tự động tải danh sách lớp học của giáo viên khi mới mở trang
    useEffect(() => {
        fetchClasses();
    }, []);

    /**
     * Tải danh sách lớp học của giáo viên từ Supabase.
     */
    const fetchClasses = async () => {
        try {
            // Lấy token phiên làm việc hiện tại của Supabase để kiểm tra xác thực người dùng
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) return;

            // Thực hiện câu truy vấn join bảng classes với bảng courses (lọc theo teacher_id là ID người đăng nhập)
            const { data: classList, error } = await supabase
                .from('classes')
                .select(`
                    id,
                    name,
                    code,
                    course:courses!inner (
                        id,
                        name,
                        teacher_id
                    )
                `)
                .eq('courses.teacher_id', session.user.id);

            if (error) throw error;

            setClasses(classList || []);
            // Mặc định chọn lớp đầu tiên trong danh sách nếu có
            if (classList && classList.length > 0) {
                setSelectedClassId(classList[0].id);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách lớp học:", error);
        }
    };

    /**
     * Sự kiện chọn file PDF từ máy tính.
     */
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Đảm bảo chỉ chấp nhận tệp định dạng PDF
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Vui lòng chọn file PDF hợp lệ!');
                return;
            }
            setFile(selectedFile);
        }
    };

    /**
     * Bắt đầu gửi file PDF lên server để AI xử lý.
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC VỀ LUỒNG SSE (STREAMING):
     * - Khi tạo Flashcard, ta sử dụng API Stream. API này không trả về kết quả ngay lập tức
     *   mà trả về một dòng chảy dữ liệu (ReadableStream).
     * - Ta sử dụng vòng lặp `while(true)` kết hợp `reader.read()` để đọc dần từng khối byte nhị phân được gửi đến.
     * - Sử dụng TextDecoder để biên dịch mảng byte nhị phân thành chuỗi văn bản UTF-8.
     * - Chuỗi văn bản được phân tích theo từng dòng (`\n`). Mỗi dòng bắt đầu bằng `data:` sẽ chứa thông tin tiến độ JSON.
     */
    const handleExtract = async () => {
        if (!file) return;
        setIsExtracting(true);
        setDraftData(null);
        setProgress({ step: 0, message: 'Đang khởi tạo kết nối...', percent: 0 });

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const formData = new FormData();
            formData.append('file', file); // Tạo định dạng form tải lên chứa file PDF

            if (mode === 'QUESTION') {
                // Chế độ tạo đề thi: Gọi API Request-Response thông thường
                const response = await fetch(TEACHER_AI_API.EXTRACT_QUESTIONS, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${session?.access_token}` },
                    body: formData
                });
                if (!response.ok) throw new Error('Không thể kết nối đến máy chủ AI');
                const data = await response.json();
                setDraftData(data);
                toast.success('AI đã bóc tách xong câu hỏi!');
                setIsExtracting(false);
            } else {
                // Chế độ tạo Flashcard: Gọi API Luồng Tiến độ SSE (Stream)
                const response = await fetch(TEACHER_AI_API.EXTRACT_FLASHCARDS_STREAM, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${session?.access_token}` },
                    body: formData
                });

                if (!response.ok) throw new Error('Không thể khởi tạo luồng dữ liệu tiến trình');

                // Lấy đối tượng đọc luồng dữ liệu (ReadableStream)
                const reader = response.body.getReader();
                const decoder = new TextDecoder(); // Giải mã mảng byte sang chuỗi UTF-8
                let buffer = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break; // Thoát vòng lặp khi luồng dữ liệu kết thúc

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Phần dư cuối cùng chưa trọn vẹn được giữ lại buffer

                    for (const line of lines) {
                        // SSE quy định mỗi dòng dữ liệu gửi về bắt đầu bằng chữ "data:"
                        if (line.startsWith('data:')) {
                            const dataStr = line.replace('data:', '').trim();
                            if (!dataStr) continue;
                            try {
                                const data = JSON.parse(dataStr);
                                
                                // TỐI ƯU HÓA/SỬA LỖI: Backend gửi mảng dữ liệu flashcards qua trường `flashcards`.
                                // Kiểm tra nếu có trường draftId chứng tỏ đã bóc tách xong thành công
                                if (data.draftId) {
                                    setDraftId(data.draftId);
                                    const cards = data.flashcards || data.drafts;
                                    if (cards) {
                                        setDraftData(cards);
                                        setIsExtracting(false);
                                        toast.success('AI bóc tách Flashcards thành công!');
                                    }
                                } else {
                                    // Ngược lại, nếu chưa xong, đây là thông tin phần trăm tiến độ gửi về
                                    setProgress(data);
                                }
                            } catch (e) {
                                console.error("Lỗi giải mã dòng dữ liệu SSE:", e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            toast.error(error.message);
            setIsExtracting(false);
        }
    };

    /**
     * Gửi yêu cầu lưu danh sách câu hỏi đề thi chính thức về Backend.
     */
    const handleSaveQuestions = async (finalData) => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Tìm lớp học và khóa học liên kết
            const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
            const courseId = selectedClass?.course?.id;

            const response = await fetch(TEACHER_AI_API.SAVE_EXAM_DRAFT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    ...finalData,
                    classId: selectedClass?.id,
                    courseId: courseId
                })
            });
            if (!response.ok) throw new Error('Không thể lưu đề thi vào CSDL');
            toast.success('Lưu đề thi thành công!');
            resetState();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Gửi yêu cầu lưu bộ thẻ Flashcard chính thức về Backend.
     */
    const handleSaveFlashcards = async (finalData) => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const selectedClass = classes.find(c => c.id === selectedClassId);
            const courseId = selectedClass?.course?.id;
            
            const response = await fetch(TEACHER_AI_API.SAVE_FLASHCARD_DRAFT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    ...finalData,
                    draftId: draftId, // SỬA LỖI: Bắt buộc gửi draftId để Backend xác minh bản nháp trong cache
                    courseId: courseId,
                    title: finalData.title || file?.name?.replace('.pdf', '') || 'Bộ Flashcard mới'
                })
            });
            if (!response.ok) throw new Error('Không thể lưu bộ Flashcard');
            toast.success('Lưu Flashcards và gửi thông báo tới học sinh thành công!');
            resetState();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Đưa các trạng thái về ban đầu để tải tài liệu mới
    const resetState = () => {
        setFile(null);
        setDraftData(null);
        setDraftId(null);
        setIsExtracting(false);
        setProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Tiêu đề trang và nút lựa chọn chế độ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
                        <span className="material-symbols-outlined text-indigo-600 text-4xl">auto_awesome</span>
                        AI Generator
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Biến tài liệu PDF thành Đề thi hoặc Flashcards trong tích tắc.</p>
                </div>

                {!draftData && !isExtracting && (
                    <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                        <button
                            onClick={() => setMode('QUESTION')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === 'QUESTION' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-lg">description</span> Đề thi
                        </button>
                        <button
                            onClick={() => setMode('FLASHCARD')}
                            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === 'FLASHCARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-lg">dashboard</span> Flashcards
                        </button>
                    </div>
                )}
            </div>

            {/* Bước 1: Giao diện kéo thả/tải file PDF */}
            {!draftData && !isExtracting ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={mode === 'QUESTION' ? 'lg:col-span-3 space-y-6' : 'lg:col-span-2 space-y-6'}>
                        <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-colors group">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-5xl">description</span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Tải lên tài liệu của bạn</h3>
                            <p className="text-slate-500 mb-8 max-w-sm">Hỗ trợ file PDF học thuật, giáo trình, hoặc bài tập. Tối đa 10MB.</p>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                ref={fileInputRef}
                            />

                            {file ? (
                                <div className="w-full max-w-md">
                                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                                        <div className="flex items-center gap-3 truncate">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                            </div>
                                            <span className="font-bold text-slate-700 truncate">{file.name}</span>
                                        </div>
                                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleExtract}
                                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Bắt đầu phân tích ngay <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-10 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all"
                                >
                                    Chọn File PDF
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cấu hình lớp học khi gán bộ Flashcards */}
                    {mode === 'FLASHCARD' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800 p-6 rounded-3xl text-white shadow-xl">
                                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">info</span> Cấu hình bóc tách
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Chọn lớp học liên kết</label>
                                        <select
                                            value={selectedClassId}
                                            onChange={(e) => setSelectedClassId(e.target.value)}
                                            className="w-full bg-slate-700 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                        >
                                            {classes.length > 0 ? classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                            )) : (
                                                <option value="" disabled>Đang tải lớp học...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="p-4 bg-slate-700/50 rounded-2xl border border-slate-600">
                                        <p className="text-sm text-slate-300 font-medium">
                                            AI sẽ tự động nhận diện kiến thức trọng tâm và tạo ra nội dung phù hợp với trình độ của lớp.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : isExtracting ? (
                /* Bước 2: Trạng thái chờ xử lý (Spinning progress bar) */
                <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-indigo-600">{progress?.percent || 0}%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-800">{progress?.message || 'Đang xử lý...'}</h2>
                        <p className="text-slate-500 font-medium">Gemini AI đang đọc và phân tích nội dung tài liệu của bạn. Việc này có thể mất tới 1 phút.</p>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden max-w-md mx-auto">
                        <div 
                            className="h-full bg-indigo-600 transition-all duration-500" 
                            style={{ width: `${progress?.percent || 0}%` }}
                        />
                    </div>
                </div>
            ) : (
                /* Bước 3: Xem lại và duyệt trước khi lưu bản chính thức (Review Mode) */
                <div className="space-y-6">
                    <button
                        onClick={resetState}
                        className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-2 transition"
                    >
                        ← Quay lại tải file
                    </button>
                    
                    {mode === 'QUESTION' ? (
                        <QuestionReviewForm draftQuestions={draftData} onSave={handleSaveQuestions} />
                    ) : (
                        <FlashcardReviewForm initialData={draftData} onSave={handleSaveFlashcards} onCancel={resetState} />
                    )}
                </div>
            )}

            {/* Màn hình chờ khóa giao diện khi đang lưu dữ liệu */}
            {isSaving && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800">Đang đồng bộ dữ liệu...</h3>
                            <p className="text-slate-500">Đang lưu bộ nội dung và gửi thông báo tới học sinh của lớp.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiQuestionGenerator;
