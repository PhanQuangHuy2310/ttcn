// src/pages/Student/ExamTaking.jsx
/**
 * FILE: ExamTaking.jsx
 * MÔ TẢ: Giao diện làm bài thi trực tuyến dành cho Sinh viên.
 * CHỨC NĂNG: Hiển thị câu hỏi, quản lý thời gian, chống gian lận (tab switch), tự động lưu bài và nộp bài kèm ảnh tự luận.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import { examsService, questionsService, submissionsService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { ErrorBanner, Sk, Input, Btn } from '../../components/ui';
import { useDebounce } from '../../hooks/useDebounce';
import { auditLog, AUDIT_ACTIONS } from '../../utils/auditLog';
import { sendNotification } from '../../utils/notification';

// ── LocalStorage helpers ──────────────────────────────────────
// MỤC ĐÍCH: Lưu trữ tạm thời đáp án của sinh viên xuống LocalStorage của trình duyệt.
// Giúp sinh viên không bị mất bài nếu lỡ tay F5 hoặc rớt mạng đột ngột (hoạt động song song với Auto-save lên Server).

/**
 * Tạo key duy nhất cho mỗi đề thi để lưu vào LocalStorage
 * @param {string} examId - ID của đề thi
 * @returns {string} Key lưu trữ
 */
const LS_KEY = (examId) => `exam_answers_${examId}`;

/**
 * Lưu đáp án hiện tại vào LocalStorage
 * @param {string} examId - ID của đề thi
 * @param {Object} answers - Object chứa đáp án (vd: { "questionId1": "A", "questionId2": "B" })
 */
const saveToLS = (examId, answers) => {
  try { localStorage.setItem(LS_KEY(examId), JSON.stringify(answers)); } catch {}
};

/**
 * Khôi phục đáp án từ LocalStorage khi sinh viên quay lại hoặc F5
 * @param {string} examId - ID của đề thi
 * @returns {Object|null} Object đáp án hợp lệ hoặc null nếu không có / bị lỗi
 */
const loadFromLS = (examId) => {
  try {
    const raw = localStorage.getItem(LS_KEY(examId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate an toàn: Đảm bảo dữ liệu parse ra phải là Object thuần túy (không phải mảng, null, hay string).
    // Giúp ứng dụng không bị Crash (Vòng lặp vô tận) nếu LocalStorage bị can thiệp sai cấu trúc.
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      localStorage.removeItem(LS_KEY(examId));
      return null;
    }
    return parsed;
  } catch {
    // Nếu JSON.parse lỗi (dữ liệu rác), tự động dọn dẹp để ứng dụng an toàn.
    try { localStorage.removeItem(LS_KEY(examId)); } catch {}
    return null;
  }
};

/**
 * Xóa sạch dữ liệu bài làm trong LocalStorage (Thường gọi sau khi nộp bài thành công)
 */
const clearLS = (examId) => {
  try { localStorage.removeItem(LS_KEY(examId)); } catch {}
};

// ── Exam Password Gate ────────────────────────────────────────
// MỤC ĐÍCH: Giao diện chặn ở cửa phòng thi. Nếu đề thi yêu cầu mật khẩu (has_password = true),
// sinh viên buộc phải nhập đúng mật khẩu mới được load đề thi và bắt đầu tính giờ.

const PasswordGate = ({ onPass }) => {
  const [pw, setPw] = useState(''); // Lưu mật khẩu sinh viên nhập
  const [err, setErr] = useState(null); // Lưu thông báo lỗi nếu nhập thiếu/sai

  // Xử lý sự kiện khi ấn nút "Vào phòng thi"
  const handleSubmit = e => {
    e.preventDefault(); // Chặn hành vi load lại trang mặc định của form
    if (!pw.trim()) { 
      setErr('Vui lòng nhập mật khẩu phòng thi.'); 
      return; 
    }
    onPass(pw.trim()); // Đẩy mật khẩu lên component cha để gọi API kiểm tra
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-orange-600 text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Phòng thi có mật khẩu</h2>
        <p className="text-slate-500 text-sm mb-6">Nhập mật khẩu do giảng viên cung cấp để vào phòng thi.</p>
        {err && <p className="text-sm text-red-600 mb-4">{err}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* YÊU CẦU 9: Giới hạn độ dài tối đa của mật khẩu phòng thi là 50 ký tự để chống spam Payload */}
          <Input type="password" placeholder="Mật khẩu phòng thi" value={pw} onChange={e => setPw(e.target.value)} maxLength={50} autoFocus />
          <Btn type="submit" className="w-full">Vào phòng thi</Btn>
        </form>
      </div>
    </div>
  );
};

// ── Anti-cheat warning overlay ────────────────────────────────
// MỤC ĐÍCH: Giao diện cảnh báo đỏ toàn màn hình khi phát hiện sinh viên rời khỏi tab làm bài.
// Component này đè lên trên mọi thứ (z-[150]) và buộc sinh viên phải click xác nhận mới được làm tiếp.

const AntiCheatWarning = ({ count, onDismiss }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border-4 border-red-500 animate-pulse">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-red-600 text-5xl">gavel</span>
      </div>
      <h2 className="text-2xl font-black text-red-600 mb-2 uppercase">Cảnh báo vi phạm!</h2>
      <p className="text-slate-800 font-bold text-base mb-2">Bạn vừa rời khỏi màn hình làm bài.</p>
      <p className="text-slate-600 text-sm mb-6 bg-red-50 p-3 rounded-lg border border-red-100">
        Hành vi thu nhỏ trình duyệt, mở tab khác hoặc dùng phần mềm khác đã bị hệ thống ghi nhận.
        <br/><br/>
        Vi phạm lần: <span className="font-black text-red-600 text-xl">{count}</span>
      </p>
      <Btn variant="danger" onClick={onDismiss} className="w-full">Tôi đã hiểu và quay lại làm bài</Btn>
    </div>
  </div>
);

// ── Hàm hỗ trợ parse mảng options an toàn ─────────────────────
// MỤC ĐÍCH: Vì trường `options` trong Database (Supabase) có thể được lưu dưới dạng JSON String 
// hoặc một mảng (Array) thực sự, hàm này đảm bảo luôn trả về một mảng để React .map() không bị crash.

const getOptionsArray = (opts) => {
  if (Array.isArray(opts)) return opts; // Nếu đã là mảng thì trả về luôn
  if (typeof opts === 'string') {
    // Thử parse JSON từ chuỗi, nếu thất bại (dữ liệu lỗi) thì trả về mảng rỗng để không sập giao diện
    try { return JSON.parse(opts); } catch (e) { return []; }
  }
  return []; // Backup an toàn nhất
};

// ── Main component ────────────────────────────────────────────
// Component `ExamTaking` chứa toàn bộ logic về quá trình làm bài thi của Sinh viên.
const ExamTaking = () => {
  const [params] = useSearchParams();
  const examId = params.get('id');
  const profile = useSelector(selectProfile);
  const navigate = useNavigate();

  // 1. STATE LƯU TRỮ DỮ LIỆU ĐỀ THI
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false); // Sinh viên đã vào làm bài chưa
  const [current, setCurrent] = useState(0); // Vị trí câu hỏi hiện tại đang hiển thị
  const [answers, setAnswers] = useState({}); // Object lưu đáp án: { questionId: answer }
  const [flags, setFlags] = useState({}); // TÍNH NĂNG MỚI: Object lưu cờ đánh dấu { questionId: boolean }
  const [essayImages, setEssayImages] = useState({}); // Object lưu ảnh tự luận: { questionId: [url1, url2] }
  const [timeLeft, setTimeLeft] = useState(null); // Thời gian còn lại (tính bằng giây)lại
  
  // 2. STATE TRẠNG THÁI HIỂN THỊ
  const [loading, setLoading] = useState(true); // Cờ báo hiệu đang tải dữ liệu
  const [submitting, setSubmitting] = useState(false); // Cờ báo hiệu đang nộp bài
  const [submitted, setSubmitted] = useState(false); // Cờ báo hiệu đã nộp xong
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu tải đề thất bại
  const [submitResult, setSubmitResult] = useState(null); // Chứa kết quả sau khi nộp (điểm, số câu đúng...)

  // 3. STATE ĐẾM NGƯỢC & FORCE SUBMIT
  const [endTimeMs, setEndTimeMs] = useState(null); // Mốc thời gian kết thúc (Server time) để chống hack F5
  const [isTimeUp, setIsTimeUp] = useState(false); // Cờ báo hiệu đã hết giờ

  // 4. STATE CHỐNG GIAN LẬN & MẬT KHẨU
  const [cheatWarnings, setCheatWarnings] = useState(0); // Số lần vi phạm chuyển tab
  const [showWarning, setShowWarning] = useState(false); // Hiện pop-up cảnh báo đỏ
  const [needsPassword, setNeedsPassword] = useState(false); // Đề thi có mật khẩu không?
  const [passwordPassed, setPasswordPassed] = useState(false); // Sinh viên đã nhập đúng pass chưa?

  const timerRef = useRef(null); // Ref lưu trữ setInterval đếm ngược
  const answersRef = useRef({}); // Ref lưu trữ đáp án (giúp Auto-save lấy được đáp án mới nhất mà không phụ thuộc render)

  // ── Debounced Auto-Save State ──────────────────────────────────
  // Trạng thái đồng bộ tự động lên máy chủ: 'idle' | 'saving' | 'saved' | 'error'
  const [syncStatus, setSyncStatus] = useState('idle');
  const syncTimerRef = useRef(null);

  // ── EFFECT 1: Chống gian lận (Rời tab / Thu nhỏ màn hình) ───────
  // Hoạt động: Lắng nghe sự kiện `visibilitychange` và `blur` của toàn bộ window.
  useEffect(() => {
    if (submitted || isTimeUp) return; // Nếu nộp bài hoặc hết giờ rồi thì thôi không canh nữa
    const handleAntiCheat = () => {
      // Bắt cả sự kiện rời tab (hidden) và mất focus (blur)
      if (document.hidden || !document.hasFocus()) { 
        setCheatWarnings(n => {
          const newCount = n + 1;
          // YÊU CẦU 3: Tự động thu bài nếu vi phạm quy chế quá 3 lần
          if (newCount > 3) {
            alert("Bạn đã vi phạm quy chế thi (thoát màn hình) quá 3 lần. Hệ thống tự động thu bài!");
            handleSubmit();
          } else {
            setShowWarning(true); 
          }
          return newCount;
        }); 
      }
    };
    
    // Gắn listener
    window.addEventListener('visibilitychange', handleAntiCheat);
    window.addEventListener('blur', handleAntiCheat);
    
    // Xóa listener khi component unmount (dọn dẹp bộ nhớ)
    return () => {
      window.removeEventListener('visibilitychange', handleAntiCheat);
      window.removeEventListener('blur', handleAntiCheat);
    };
  }, [submitted, isTimeUp]);

  // ── EFFECT 2: Chống Copy / Paste ─────────────────────────────────
  // Ngăn sinh viên copy câu hỏi lên mạng hỏi hoặc paste đáp án từ ngoài vào.
  useEffect(() => {
    const block = e => { if (!submitted) e.preventDefault(); };
    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
    };
  }, [submitted]);

  // ── EFFECT 3: Khởi tạo dữ liệu Đề thi và Câu hỏi ──────────────────
  // Hoạt động: Chạy 1 lần khi component mount hoặc khi sinh viên đã nhập đúng pass.
  useEffect(() => {
    // YÊU CẦU 6: Bắt lỗi cứng nếu URL bị mất tham số ID đề thi, tự động đuổi ra ngoài tránh loading vô tận
    if (!examId || examId === 'undefined' || !profile?.id) {
      navigate('/student/exams');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        // Gọi API song song để lấy thông tin đề thi và danh sách câu hỏi
        const [examRes, qRes] = await Promise.all([
          examsService.getById(examId),
          questionsService.getByExam(examId),
        ]);
        
        // Xử lý lỗi nếu ID bài thi không tồn tại
        if (examRes?.error || !examRes?.data) {
          setError('Không tìm thấy đề thi. Vui lòng kiểm tra lại.');
          setLoading(false); return;
        }
        
        const e = examRes.data;
        const qs = Array.isArray(qRes?.data) ? qRes.data : [];
        
        // Trộn câu hỏi nếu cấu hình đề thi yêu cầu (shuffle_questions = true)
        const orderedQs = e?.shuffle_questions ? [...qs].sort(() => Math.random() - 0.5) : qs;

        setExam(e);
        setQuestions(orderedQs);
        setTimeLeft((e?.duration ?? 60) * 60);

        // Chặn cửa nếu bài thi yêu cầu mật khẩu mà sinh viên chưa nhập đúng
        if (e?.has_password && !passwordPassed) {
          setNeedsPassword(true); setLoading(false); return;
        }

        // Tạo mới (hoặc lấy lại) bản ghi bài làm (submission) trên Database
        const { data: sub } = await submissionsService.startExam(examId, profile.id);
        
        // Phục hồi đáp án (Ưu tiên: Đáp án trên Database > Đáp án ở LocalStorage > Rỗng)
        const lsAnswers = loadFromLS(examId);
        const dbAnswers = (sub?.answers && typeof sub.answers === 'object' && !Array.isArray(sub.answers) && Object.keys(sub.answers).length > 0) ? sub.answers : null;
        const restored = dbAnswers || lsAnswers || {};
        
        // Kiểm tra xem bài thi này sinh viên đã nộp chưa? (Chống thi lại 2 lần)
        if (sub?.status === 'SUBMITTED' || sub?.status === 'GRADED' || sub?.status === 'PENDING_ESSAY_GRADING') {
          setSubmitted(true);
        } else if (sub?.started_at || sub?.created_at) {
          // Tính toán lại thời gian còn lại (Server Time) để chống cheat
          const startMs = new Date(sub.started_at || sub.created_at || Date.now()).getTime();
          const durationMs = (e?.duration ?? 60) * 60 * 1000;
          let endMs = startMs + durationMs;
          
          // YÊU CẦU 2: Ràng buộc nếu đề thi có giờ đóng tuyệt đối (end_time)
          if (e?.end_time) {
            const absoluteEndMs = new Date(e.end_time).getTime();
            if (endMs > absoluteEndMs) {
              endMs = absoluteEndMs; // Cắt bớt thời gian làm bài nếu sát giờ đóng đề
            }
          }
          
          setEndTimeMs(endMs);
          
          const remaining = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
          setTimeLeft(remaining);
          
          // Nếu tính ra hết giờ luôn rồi thì cưỡng chế nộp bài
          if (remaining <= 0) setIsTimeUp(true);
        }
      } catch (loadErr) {
        console.error('[ExamTaking] load() crashed:', loadErr);
        // FIX: Xóa sạch dữ liệu bộ nhớ đệm nếu bị corrupt để tránh vòng lặp crash (Crash Loop)
        clearLS(examId);
        setError('Đã xảy ra lỗi khi tải đề thi. Dữ liệu cache đã được dọn dẹp, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId, profile?.id, passwordPassed]);
  const fmtTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── syncDraftToServer: Đồng bộ đáp án lên server (Debounced) ──
  // Dùng useRef + setTimeout thủ công để debounce 1000ms,
  // đảm bảo không spam API khi user click đáp án liên tục.
  const syncDraftToServer = useCallback(async (eid, studentId, currentAnswers) => {
    if (!eid || !studentId || !currentAnswers) return;
    if (Object.keys(currentAnswers).length === 0) return;
    setSyncStatus('saving');
    try {
      const { error } = await submissionsService.saveProgress(eid, studentId, currentAnswers);
      if (error) {
        console.error('[AutoSave] sync error:', error);
        setSyncStatus('error');
      } else {
        setSyncStatus('saved');
      }
    } catch (err) {
      console.error('[AutoSave] sync crashed:', err);
      setSyncStatus('error');
    }
  }, []);

  // Debounce ref: clear timer cũ mỗi lần gọi, chỉ fire sau 1000ms idle
  const debouncedSync = useCallback((eid, studentId, currentAnswers) => {
    // Hiển thị ngay trạng thái "đang chờ lưu" khi user thao tác
    setSyncStatus('saving');
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncDraftToServer(eid, studentId, currentAnswers);
    }, 1000); // Debounce 1 giây
  }, [syncDraftToServer]);

  // ── XỬ LÝ CHỌN ĐÁP ÁN (handleAnswer) ──────────────────────────
  // Hoạt động: Kích hoạt mỗi khi sinh viên click vào một lựa chọn A, B, C, D hoặc gõ Text (tự luận).
  const handleAnswer = useCallback((questionId, choice) => {
    if (isTimeUp || submitted) return; // Nếu hết giờ hoặc đã nộp thì chặn thao tác

    try {
      if (!questionId) return; // Guard: Không lưu nếu ID câu hỏi rỗng

      // Cập nhật State cục bộ
      const next = { ...answersRef.current, [questionId]: choice };
      answersRef.current = next;
      setAnswers(next);
      // Lưu vào localStorage chống mất dữ liệu (đồng bộ, instant)
      if (examId) saveToLS(examId, next);
      // Đồng bộ lên server (debounced 1000ms)
      if (examId && profile?.id && !submitted) {
        debouncedSync(examId, profile.id, next);
      }
    } catch (err) {
      console.error('[ExamTaking] handleAnswer error:', err);
    }
  }, [examId, profile?.id, submitted, debouncedSync]);

  // ── UPLOAD ẢNH TỰ LUẬN ─────────────────────────────────────────
  // Hoạt động: Đẩy ảnh sinh viên đính kèm lên Supabase Storage (phần tự luận).
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (questionId, file) => {
    if (!file || !examId || !profile?.id || isTimeUp || submitted) return;
    setUploading(true);
    
    // Khởi tạo đường dẫn duy nhất trên bucket Supabase
    const path = `essay-images/${examId}/${profile.id}/${questionId}_${Date.now()}_${file.name}`;
    const { data, error: upErr } = await supabase.storage.from('ttcn').upload(path, file);
    if (!upErr && data?.path) {
      const { data: urlData } = supabase.storage.from('ttcn').getPublicUrl(data.path);
      const url = urlData?.publicUrl;
      if (url) {
        setEssayImages(prev => ({
          ...prev,
          [questionId]: [...(prev[questionId] || []), url]
        }));
      }
    }
    setUploading(false);
  };

  // ── NỘP BÀI THI (handleSubmit) ──────────────────────────────────
  // Hoạt động: Có thể được gọi bằng 2 cách:
  // 1. Sinh viên chủ động bấm nút "Nộp bài".
  // 2. Hệ thống gọi ép buộc (Force Submit) khi đếm ngược về 0.
  const handleSubmit = useCallback(async () => {
    if (submitted || submitting) return; // Chặn spam click
    clearTimeout(timerRef.current); // Dừng đếm ngược
    setSubmitting(true);

    const { data, error: err } = await submissionsService.submitWithScore(examId, profile.id, answersRef.current, cheatWarnings);
    if (err) { setError('Nộp bài thất bại. Vui lòng thử lại.'); setSubmitting(false); return; }

    // Ghi nhật ký bảo mật và gửi thông báo xác nhận cho sinh viên
    auditLog(profile.id, AUDIT_ACTIONS.EXAM_SUBMIT, `Nộp bài thi: ${exam?.title || examId}`, { exam_id: examId, score: data?.mcqScore });
    sendNotification(profile.id, 'Nộp bài thi thành công', `Bạn đã hoàn thành bài thi "${exam?.title || 'Đề thi'}".`, 'EXAM_OPEN', '/student/history');

    // Xóa localStorage sau khi nộp thành công
    clearLS(examId);

    // Lưu ảnh tự luận (nếu có)
    if (Object.keys(essayImages).length > 0) {
      try {
        await supabase.from('submissions').update({ essay_images: essayImages }).eq('exam_id', examId).eq('student_id', profile.id);
      } catch {}
    }

    // GỬI THÔNG BÁO CHO GIÁO VIÊN
    try {
      if (exam?.course_id) {
        const { data: courseData } = await supabase.from('courses').select('teacher_id').eq('id', exam.course_id).single();
        if (courseData?.teacher_id) {
          await supabase.from('notifications').insert({
            user_id: courseData.teacher_id,
            title: data?.hasEssay ? '📝 Bài thi cần chấm tự luận' : '📝 Sinh viên nộp bài',
            message: `Sinh viên ${profile?.full_name || 'ẩn danh'} vừa nộp bài thi "${exam.title}".${data?.hasEssay ? ' Bài có phần tự luận cần chấm.' : ` Điểm: ${data?.mcqScore}`}`,
            type: 'SUBMISSION',
            action_url: `/teacher/essay-grading?examId=${exam.id}`,
            read_status: false
          });
        }
      }
    } catch (e) {
      console.error('Lỗi gửi thông báo cho GV', e);
    }

    setSubmitResult(data);
    setSubmitted(true);
    setSubmitting(false);
  }, [submitted, submitting, examId, profile, cheatWarnings, exam, essayImages]);

  // FIX: Countdown dựa trên Server-Time (endTimeMs), không trừ 1s thuần túy
  useEffect(() => {
    if (!endTimeMs || submitted || loading || isTimeUp) return;
    
    const interval = setInterval(() => {
      const remaining = Math.floor((endTimeMs - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsTimeUp(true);
        clearInterval(interval);
        // Force submit khi hết giờ
        handleSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endTimeMs, submitted, loading, isTimeUp, handleSubmit]);

  // Auto-save fallback: vẫn giữ interval 60s như bảo hiểm phòng trường hợp
  // debounced sync bị miss (ví dụ user chọn đáp án rồi để yên không thao tác gì).
  useEffect(() => {
    const interval = setInterval(() => {
      if (!submitted && Object.keys(answersRef.current).length > 0 && examId && profile?.id) {
        syncDraftToServer(examId, profile.id, answersRef.current);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [examId, profile?.id, submitted, syncDraftToServer]);

  // Cleanup debounce timer khi component unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);

  // FIX: Auto-sanitize currentQuestionIndex khi nó vượt ngoài mảng questions
  // Ngăn trường hợp state persist giữ index cũ từ lần thi trước (nhiều câu hơn) 
  // dẫn đến truy cập questions[outOfBound] = undefined → crash.
  useEffect(() => {
    if (questions.length > 0 && current >= questions.length) {
      console.warn(`[ExamTaking] currentIndex (${current}) >= questions.length (${questions.length}). Auto-reset to 0.`);
      setCurrent(0);
    }
  }, [current, questions.length]);

  if (needsPassword && !passwordPassed) return <PasswordGate onPass={() => { setNeedsPassword(false); setPasswordPassed(true); }} />;
  if (!examId || examId === 'undefined') return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Mã đề thi không hợp lệ</div>;
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Sk className="h-64 w-full max-w-3xl" /></div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><ErrorBanner message={error} /></div>;

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${submitResult?.hasEssay ? 'bg-amber-100' : 'bg-green-100'}`}>
          <span className={`material-symbols-outlined text-4xl ${submitResult?.hasEssay ? 'text-amber-600' : 'text-green-600'}`}>
            {submitResult?.hasEssay ? 'pending' : 'task_alt'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Nộp bài thành công!</h2>
        <p className="text-slate-500 mb-6">
          {submitResult?.hasEssay
            ? 'Phần trắc nghiệm đã được chấm tự động. Phần tự luận sẽ được giảng viên chấm và thông báo kết quả.'
            : 'Bài thi đã được chấm điểm tự động.'}
        </p>
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Đề thi</span><span className="font-semibold">{exam?.title}</span></div>
          {submitResult?.totalMcq > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trắc nghiệm</span>
              <span className="font-bold text-primary">{submitResult.correctMcq}/{submitResult.totalMcq} câu đúng</span>
            </div>
          )}
          {submitResult?.mcqScore !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{submitResult?.hasEssay ? 'Điểm TN (tạm)' : 'Điểm số'}</span>
              <span className="text-2xl font-black text-primary">{submitResult.mcqScore}</span>
            </div>
          )}
          {submitResult?.hasEssay && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trạng thái</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">Chờ chấm tự luận</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" onClick={() => navigate('/student/history')} className="flex-1">Lịch sử bài thi</Btn>
          <Btn onClick={() => navigate('/student/dashboard')} className="flex-1">Về trang chủ</Btn>
        </div>
      </div>
    </div>
  );

  // FIX: Clamp current index để tránh truy cập ngoài mảng
  const safeIndex = Math.max(0, Math.min(current, questions.length - 1));
  const q = questions.length > 0 ? questions[safeIndex] : null;
  const answeredCount = answers && typeof answers === 'object' ? Object.keys(answers).length : 0;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isUrgent = timeLeft !== null && timeLeft < 300;

  // Lấy danh sách options một cách an toàn (q có thể null)
  const optionsArray = getOptionsArray(q?.options);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      {showWarning && <AntiCheatWarning count={cheatWarnings} onDismiss={() => setShowWarning(false)} />}

      {/* Force Submit Modal khi hết giờ */}
      {isTimeUp && !submitted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="material-symbols-outlined text-red-600 text-3xl">timer_off</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Hết giờ làm bài!</h2>
            {error ? (
              <>
                <p className="text-red-600 text-sm font-bold mb-4">{error}</p>
                <Btn onClick={handleSubmit} loading={submitting} className="w-full">Thử nộp lại</Btn>
              </>
            ) : (
              <>
                <p className="text-slate-600 text-sm mb-6">Hệ thống đang tự động nộp bài...</p>
                <div className="flex justify-center">
                  <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xl font-black"><span className="text-primary">DHD</span><span className="text-orange-500">edu</span></div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 truncate max-w-xs">{exam?.title}</p>
              <p className="text-xs text-slate-400">{questions.length} câu · {exam?.duration} phút</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* ── Auto-Save Status Indicator ── */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              syncStatus === 'saving' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
              syncStatus === 'saved'  ? 'bg-green-50 text-green-600 border border-green-200' :
              syncStatus === 'error'  ? 'bg-red-50 text-red-500 border border-red-200' :
                                        'bg-slate-50 text-slate-400 border border-slate-100'
            }`}>
              <span className={`material-symbols-outlined text-sm ${syncStatus === 'saving' ? 'animate-spin' : ''}`}>
                {syncStatus === 'saving' ? 'sync' :
                 syncStatus === 'saved'  ? 'cloud_done' :
                 syncStatus === 'error'  ? 'cloud_off' : 'cloud_queue'}
              </span>
              {syncStatus === 'saving' ? 'Đang lưu...' :
               syncStatus === 'saved'  ? 'Đã lưu nháp' :
               syncStatus === 'error'  ? 'Lỗi lưu' : ''}
            </div>
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono font-bold text-lg ${isUrgent ? 'bg-red-50 text-red-600 animate-pulse border border-red-200' : 'bg-slate-100 text-slate-700'}`}>
              <span className="material-symbols-outlined text-base">{isUrgent ? 'timer_off' : 'timer'}</span>
              {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
            </div>
            <Btn onClick={handleSubmit} loading={submitting}>Nộp bài</Btn>
          </div>
        </div>
        <div className="h-1 bg-slate-100"><div className="h-1 bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} /></div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 gap-6 py-6">
        <main className="flex-1 min-w-0">
          {!q ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
              <span className="material-symbols-outlined text-slate-300 text-5xl">quiz</span>
              <p className="text-slate-500 mt-3">Đề thi này chưa có câu hỏi nào.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">Câu {safeIndex + 1} / {questions.length}</span>
                  <span className="text-xs text-slate-400 font-medium">{q?.points ?? 1} điểm</span>
                </div>
                {/* TÍNH NĂNG MỚI: Nút Đánh dấu xem lại (Flag for review) */}
                <button 
                  onClick={() => setFlags(prev => ({ ...prev, [q?.id]: !prev[q?.id] }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${flags[q?.id] ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <span className="material-symbols-outlined text-sm">{flags[q?.id] ? 'flag' : 'outlined_flag'}</span>
                  {flags[q?.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
                </button>
              </div>
              <div className="px-8 py-6">
                <p className="text-base font-semibold text-slate-800 leading-relaxed mb-6">{q?.content ?? ''}</p>

                {/* SỬA LỖI Ở ĐÂY: Sử dụng mảng optionsArray đã được chuẩn hóa */}
                {q?.type === 'MCQ' && (
                  <div className="space-y-3">
                    {optionsArray.map((choice, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      
                      // Kiểm tra xem `choice` là chuỗi hay object {id, text} do AI gen ra
                      const isObject = typeof choice === 'object' && choice !== null;
                      const choiceText = isObject ? (choice.text || choice.content || choice.value || JSON.stringify(choice)) : choice;
                      
                      // Khi so sánh đáp án đã chọn (phòng trường hợp answers đang lưu object)
                      let picked = false;
                      const currentAnswer = answers[q?.id];
                      if (isObject && typeof currentAnswer === 'object' && currentAnswer !== null) {
                        picked = currentAnswer.id === choice.id || currentAnswer.text === choice.text;
                      } else {
                        picked = currentAnswer === choice;
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isTimeUp}
                          onClick={() => q?.id && handleAnswer(q.id, choice)}
                          className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-150 ${picked ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                            } ${isTimeUp ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${picked ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{letter}</span>
                          <span className="text-sm leading-relaxed">{choiceText ?? ''}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {q?.type === 'ESSAY' && q?.id && (
                  <div className="space-y-3">
                    <textarea
                      disabled={isTimeUp}
                      value={answers[q.id] ?? ''}
                      onChange={e => handleAnswer(q.id, e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={6}
                      className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none ${isTimeUp ? 'bg-slate-50 opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {/* Upload ảnh cho tự luận */}
                    <div className="flex items-center gap-3">
                      <label className={`flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-colors ${isTimeUp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <span className="material-symbols-outlined text-base">image</span>
                        Đính kèm ảnh
                        <input type="file" disabled={isTimeUp} accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(q.id, e.target.files[0])} />
                      </label>
                      {uploading && <span className="text-xs text-slate-400">Đang tải ảnh...</span>}
                    </div>
                    {/* Hiện ảnh đã upload */}
                    {essayImages[q.id]?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {(essayImages[q.id] || []).map((url, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                            <img src={url} alt={`Ảnh ${i+1}`} className="w-full h-full object-cover" />
                            <button onClick={() => setEssayImages(prev => ({ ...prev, [q.id]: (prev[q.id] || []).filter((_, j) => j !== i) }))} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="px-8 py-4 border-t border-slate-100 flex justify-between gap-3 bg-slate-50/30">
                <Btn variant="outline" icon="arrow_back" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>Câu trước</Btn>
                <span className="text-xs text-slate-400 self-center">{answeredCount} / {questions.length} câu đã trả lời</span>
                {current < questions.length - 1 ? (
                  <Btn iconRight="arrow_forward" onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}>Câu tiếp</Btn>
                ) : (
                  <Btn variant="success" onClick={handleSubmit} disabled={isTimeUp} loading={submitting} icon="task_alt">Nộp bài</Btn>
                )}
              </div>
            </div>
          )}
        </main>

        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-28">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách câu hỏi</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((qItem, idx) => {
                const qId = qItem?.id;
                const isAnswered = qId && answers && answers[qId];
                const isFlagged = qId && flags[qId];
                return (
                  <button
                    key={idx} onClick={() => setCurrent(idx)}
                    className={`relative w-full aspect-square rounded-lg text-xs font-bold transition-all ${idx === safeIndex ? 'bg-primary text-white ring-2 ring-primary/30' : isAnswered ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white" title="Đã đánh dấu" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExamTaking;