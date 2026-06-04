// src/App.jsx
// Router chính - quản lý định tuyến sạch sẽ cho toàn bộ hệ thống.
// Tất cả các route được bảo vệ thông qua các bộ lọc quyền truy cập RequireAuth.

import React, { Suspense, lazy } from 'react';
/**
 * FILE: App.jsx
 * MÔ TẢ: Cấu hình định tuyến (Routing) chính cho ứng dụng Frontend React.
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - BrowserRouter: Cung cấp lịch sử trình duyệt (HTML5 History API) để React Router đồng bộ URL với giao diện mà không cần load lại trang.
 * - Routes & Route: Khai báo danh sách các đường dẫn và Component React tương ứng hiển thị khi khớp đường dẫn đó.
 * - lazy & Suspense: Kỹ thuật phân tách mã nguồn (Code Splitting). Thay vì tải toàn bộ code 50+ trang web ngay trong lần đầu truy cập (làm web chạy chậm),
 *   React sẽ chỉ tải code của trang hiện tại khi người dùng click vào trang đó. Suspense hiển thị PageLoader trong lúc tải file code.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile, selectIsAuthenticated } from './features/authentication/authenticationSlice';

// ── Tải Eager (Tải trước ngay lập tức) các trang Đăng nhập / Đăng ký vì đây là trang đầu vào
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// ── Tải Lazy (Tải động khi cần) cho các trang tính năng ──────────────────────────────
// Các trang dành cho Quản trị viên (Admin)
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const AdminSecurity = lazy(() => import('./pages/Admin/Security'));
const SystemSettings = lazy(() => import('./pages/Admin/SystemSettings'));

// Các trang dành cho Giáo viên (Teacher)
const TeacherDashboard = lazy(() => import('./pages/Teacher/Dashboard'));
const ClassManagement = lazy(() => import('./pages/Teacher/ClassManagement'));
const ExamBank = lazy(() => import('./pages/Teacher/ExamBank'));
const QuestionBank = lazy(() => import('./pages/Teacher/QuestionBank'));
const MaterialLibrary = lazy(() => import('./pages/Teacher/MaterialLibrary'));
const TeacherReports = lazy(() => import('./pages/Teacher/Reports'));
const ExamMatrices = lazy(() => import('./pages/Teacher/ExamMatrices'));
const EssayGrading = lazy(() => import('./pages/Teacher/EssayGrading'));
const AiQuestionGenerator = lazy(() => import('./pages/Teacher/AiQuestionGenerator'));

// Các trang dành cho Học sinh (Student)
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const StudentClasses = lazy(() => import('./pages/Student/Classes'));
const StudentClassDetail = lazy(() => import('./pages/Student/ClassDetail'));
const ExamList = lazy(() => import('./pages/Student/ExamList'));
const ExamTaking = lazy(() => import('./pages/Student/ExamTaking'));
const ExamReview = lazy(() => import('./pages/Student/ExamReview'));
const ExamHistory = lazy(() => import('./pages/Student/ExamHistory'));
const Practice = lazy(() => import('./pages/Student/Practice'));
const Flashcards = lazy(() => import('./pages/Student/Flashcards'));
const MockExams = lazy(() => import('./pages/Student/MockExams'));
const Statistics = lazy(() => import('./pages/Student/Statistics'));

// Trang chung (Common)
const Profile = lazy(() => import('./pages/Common/Profile'));

/**
 * Component hiển thị màn hình chờ khi tải động các component ở trên (Page Loader).
 */
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      {/* Vòng xoay CSS Tailwind để báo hiệu trạng thái loading */}
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Đang tải...</p>
    </div>
  </div>
);

/**
 * Route Guard (Người gác cổng bảo vệ đường dẫn): Yêu cầu người dùng phải ĐĂNG NHẬP (Require Auth).
 * 
 * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
 * - Nếu người dùng chưa đăng nhập, tự động chuyển hướng (Redirect) về trang `/login`.
 * - Nếu người dùng đã đăng nhập nhưng không có vai trò phù hợp trong mảng `allowedRoles`,
 *   tự động chuyển họ về Dashboard tương ứng của vai trò của họ.
 * - Nếu thỏa mãn tất cả điều kiện, hiển thị các Component con (`children`).
 */
const RequireAuth = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated); // Lấy trạng thái đăng nhập từ Redux Store
  const profile = useSelector(selectProfile);                 // Lấy hồ sơ người dùng hiện tại

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // replace để không lưu trang bị chặn vào lịch sử nút Back của trình duyệt
  }
  
  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    // Nếu sai quyền hạn, đưa về đúng trang Dashboard mặc định của họ
    const roleHome = { 
      ADMIN: '/admin/dashboard', 
      TEACHER: '/teacher/dashboard', 
      STUDENT: '/student/dashboard' 
    };
    return <Navigate to={roleHome[profile.role] ?? '/login'} replace />;
  }
  return children;
};

/**
 * Route Guard ngăn cản người đã đăng nhập truy cập lại trang Login/Register (Require Guest).
 * GIẢI THÍCH: Khi đã đăng nhập thành công, nếu cố tình gõ URL `/login` trên thanh địa chỉ, 
 * hệ thống sẽ tự động đá (redirect) họ về Dashboard chứ không cho đăng nhập lại.
 */
const RequireGuest = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  if (!isAuthenticated) return children;
  
  const roleHome = { 
    ADMIN: '/admin/dashboard', 
    TEACHER: '/teacher/dashboard', 
    STUDENT: '/student/dashboard' 
  };
  return <Navigate to={roleHome[profile?.role] ?? '/student/dashboard'} replace />;
};

/**
 * Component App chứa toàn bộ luồng cấu hình Route của dự án.
 */
const App = () => (
  <BrowserRouter>
    {/* Bọc toàn bộ Router trong Suspense để hỗ trợ việc Lazy Load components ở trên */}
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Trang chủ gốc `/` - Tự động định hướng tùy vai trò của người dùng */}
        <Route path="/" element={<RootRedirect />} />

        {/* Cấu hình các route Auth dành cho khách vãng lai */}
        <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />
        <Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} />

        {/* ─── Phân hệ ADMIN (Yêu cầu quyền ADMIN) ───────────────────────────────────────── */}
        <Route path="/admin" element={<RequireAuth allowedRoles={['ADMIN']}><Navigate to="/admin/dashboard" replace /></RequireAuth>} />
        <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={['ADMIN']}><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth allowedRoles={['ADMIN']}><UserManagement /></RequireAuth>} />
        <Route path="/admin/security" element={<RequireAuth allowedRoles={['ADMIN']}><AdminSecurity /></RequireAuth>} />
        <Route path="/admin/settings" element={<RequireAuth allowedRoles={['ADMIN']}><SystemSettings /></RequireAuth>} />

        {/* ─── Phân hệ GIÁO VIÊN (Yêu cầu quyền TEACHER) ─────────────────────────────────────── */}
        <Route path="/teacher" element={<RequireAuth allowedRoles={['TEACHER']}><Navigate to="/teacher/dashboard" replace /></RequireAuth>} />
        <Route path="/teacher/dashboard" element={<RequireAuth allowedRoles={['TEACHER']}><TeacherDashboard /></RequireAuth>} />
        <Route path="/teacher/classes" element={<RequireAuth allowedRoles={['TEACHER']}><ClassManagement /></RequireAuth>} />
        <Route path="/teacher/exams" element={<RequireAuth allowedRoles={['TEACHER']}><ExamBank /></RequireAuth>} />
        <Route path="/teacher/questions" element={<RequireAuth allowedRoles={['TEACHER']}><QuestionBank /></RequireAuth>} />
        <Route path="/teacher/materials" element={<RequireAuth allowedRoles={['TEACHER']}><MaterialLibrary /></RequireAuth>} />
        <Route path="/teacher/reports" element={<RequireAuth allowedRoles={['TEACHER']}><TeacherReports /></RequireAuth>} />
        <Route path="/teacher/exam-matrices" element={<RequireAuth allowedRoles={['TEACHER']}><ExamMatrices /></RequireAuth>} />
        <Route path="/teacher/essay-grading" element={<RequireAuth allowedRoles={['TEACHER']}><EssayGrading /></RequireAuth>} />
        <Route path="/teacher/ai-generator" element={<RequireAuth allowedRoles={['TEACHER']}><AiQuestionGenerator /></RequireAuth>} />

        {/* ─── Phân hệ HỌC SINH (Yêu cầu quyền STUDENT) ─────────────────────────────────────── */}
        <Route path="/student" element={<RequireAuth allowedRoles={['STUDENT']}><Navigate to="/student/dashboard" replace /></RequireAuth>} />
        <Route path="/student/dashboard" element={<RequireAuth allowedRoles={['STUDENT']}><StudentDashboard /></RequireAuth>} />
        <Route path="/student/classes" element={<RequireAuth allowedRoles={['STUDENT']}><StudentClasses /></RequireAuth>} />
        <Route path="/student/classes/:classId" element={<RequireAuth allowedRoles={['STUDENT']}><StudentClassDetail /></RequireAuth>} />
        <Route path="/student/exams" element={<RequireAuth allowedRoles={['STUDENT']}><ExamList /></RequireAuth>} />
        <Route path="/student/exam" element={<RequireAuth allowedRoles={['STUDENT']}><ExamTaking /></RequireAuth>} />
        <Route path="/student/review" element={<RequireAuth allowedRoles={['STUDENT']}><ExamReview /></RequireAuth>} />
        <Route path="/student/history" element={<RequireAuth allowedRoles={['STUDENT']}><ExamHistory /></RequireAuth>} />
        <Route path="/student/practice" element={<RequireAuth allowedRoles={['STUDENT']}><Practice /></RequireAuth>} />
        <Route path="/student/flashcards" element={<RequireAuth allowedRoles={['STUDENT']}><Flashcards /></RequireAuth>} />
        <Route path="/student/mock-exams" element={<RequireAuth allowedRoles={['STUDENT']}><MockExams /></RequireAuth>} />
        <Route path="/student/statistics" element={<RequireAuth allowedRoles={['STUDENT']}><Statistics /></RequireAuth>} />

        {/* ─── Route chung dành cho bất kỳ ai đã đăng nhập ─────────────── */}
        <Route path="/common/profile" element={<RequireAuth><Profile /></RequireAuth>} />

        {/* Catch-all: Nếu gõ bừa URL không khớp với bất kỳ Route nào ở trên, hiển thị trang NotFound 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

/**
 * Xử lý điều hướng tại trang chủ gốc `/`.
 */
const RootRedirect = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const roleHome = { 
    ADMIN: '/admin/dashboard', 
    TEACHER: '/teacher/dashboard', 
    STUDENT: '/student/dashboard' 
  };
  return <Navigate to={roleHome[profile?.role] ?? '/login'} replace />;
};

/**
 * Giao diện trang báo lỗi 404 - Không tìm thấy trang.
 */
const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="text-center max-w-sm">
      <p className="text-8xl font-black text-slate-200 mb-4">404</p>
      <h1 className="text-2xl font-black text-slate-800 mb-2">Trang không tìm thấy</h1>
      <p className="text-slate-500 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <a href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition">
        Về trang chủ
      </a>
    </div>
  </div>
);

export default App;