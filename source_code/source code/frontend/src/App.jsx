// src/App.jsx
// Clean router — one canonical route per feature. Removes 40+ duplicate/hardcoded pages.
// All routes protected by role-specific PrivateRoute wrappers.

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile, selectIsAuthenticated } from './features/authentication/authenticationSlice';

// ── Auth pages (eager — needed immediately) ──────────────────
import LoginPage from './pages/Auth/LoginPage';

// ── Lazy load all feature pages ──────────────────────────────
// Admin
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const AdminSecurity = lazy(() => import('./pages/Admin/Security'));
const SystemSettings = lazy(() => import('./pages/Admin/SystemSettings'));

// Teacher
const TeacherDashboard = lazy(() => import('./pages/Teacher/Dashboard'));
const ClassManagement = lazy(() => import('./pages/Teacher/ClassManagement'));
const ExamBank = lazy(() => import('./pages/Teacher/ExamBank'));
const QuestionBank = lazy(() => import('./pages/Teacher/QuestionBank'));
const MaterialLibrary = lazy(() => import('./pages/Teacher/MaterialLibrary'));
const TeacherReports = lazy(() => import('./pages/Teacher/Reports'));
const ExamMatrices = lazy(() => import('./pages/Teacher/ExamMatrices'));
const EssayGrading = lazy(() => import('./pages/Teacher/EssayGrading'));
// Student
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const StudentClasses = lazy(() => import('./pages/Student/Classes'));
const ExamList = lazy(() => import('./pages/Student/ExamList'));
const ExamTaking = lazy(() => import('./pages/Student/ExamTaking'));
const ExamReview = lazy(() => import('./pages/Student/ExamReview'));
const ExamHistory = lazy(() => import('./pages/Student/ExamHistory'));
const Practice = lazy(() => import('./pages/Student/Practice'));
const Flashcards = lazy(() => import('./pages/Student/Flashcards'));
const MockExams = lazy(() => import('./pages/Student/MockExams'));
const Statistics = lazy(() => import('./pages/Student/Statistics'));

// Common
const Profile = lazy(() => import('./pages/Common/Profile'));

// ── Loading fallback ─────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Đang tải...</p>
    </div>
  </div>
);

// ── Route guards ─────────────────────────────────────────────
const RequireAuth = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    // Redirect to correct dashboard for the user's role
    const roleHome = { ADMIN: '/admin/dashboard', TEACHER: '/teacher/dashboard', STUDENT: '/student/dashboard' };
    return <Navigate to={roleHome[profile.role] ?? '/login'} replace />;
  }
  return children;
};

const RequireGuest = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  if (!isAuthenticated) return children;
  const roleHome = { ADMIN: '/admin/dashboard', TEACHER: '/teacher/dashboard', STUDENT: '/student/dashboard' };
  return <Navigate to={roleHome[profile?.role] ?? '/student/dashboard'} replace />;
};

// ── App ──────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth */}
        <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />

        {/* ─── Admin ───────────────────────────────────────── */}
        <Route path="/admin" element={<RequireAuth allowedRoles={['ADMIN']}><Navigate to="/admin/dashboard" replace /></RequireAuth>} />
        <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={['ADMIN']}><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth allowedRoles={['ADMIN']}><UserManagement /></RequireAuth>} />
        <Route path="/admin/security" element={<RequireAuth allowedRoles={['ADMIN']}><AdminSecurity /></RequireAuth>} />
        <Route path="/admin/settings" element={<RequireAuth allowedRoles={['ADMIN']}><SystemSettings /></RequireAuth>} />

        {/* ─── Teacher ─────────────────────────────────────── */}
        <Route path="/teacher" element={<RequireAuth allowedRoles={['TEACHER']}><Navigate to="/teacher/dashboard" replace /></RequireAuth>} />
        <Route path="/teacher/dashboard" element={<RequireAuth allowedRoles={['TEACHER']}><TeacherDashboard /></RequireAuth>} />
        <Route path="/teacher/classes" element={<RequireAuth allowedRoles={['TEACHER']}><ClassManagement /></RequireAuth>} />
        <Route path="/teacher/exams" element={<RequireAuth allowedRoles={['TEACHER']}><ExamBank /></RequireAuth>} />
        <Route path="/teacher/questions" element={<RequireAuth allowedRoles={['TEACHER']}><QuestionBank /></RequireAuth>} />
        <Route path="/teacher/materials" element={<RequireAuth allowedRoles={['TEACHER']}><MaterialLibrary /></RequireAuth>} />
        <Route path="/teacher/reports" element={<RequireAuth allowedRoles={['TEACHER']}><TeacherReports /></RequireAuth>} />
        <Route path="/teacher/exam-matrices" element={<RequireAuth allowedRoles={['TEACHER']}><ExamMatrices /></RequireAuth>} />
        {/* Sửa lại props allowedRoles cho chuẩn */}
        <Route path="/teacher/essay-grading" element={<RequireAuth allowedRoles={['TEACHER']}><EssayGrading /></RequireAuth>} />

        {/* ─── Student ─────────────────────────────────────── */}
        <Route path="/student" element={<RequireAuth allowedRoles={['STUDENT']}><Navigate to="/student/dashboard" replace /></RequireAuth>} />
        <Route path="/student/dashboard" element={<RequireAuth allowedRoles={['STUDENT']}><StudentDashboard /></RequireAuth>} />
        <Route path="/student/classes" element={<RequireAuth allowedRoles={['STUDENT']}><StudentClasses /></RequireAuth>} />
        <Route path="/student/exams" element={<RequireAuth allowedRoles={['STUDENT']}><ExamList /></RequireAuth>} />

        {/* SỬA LỖI 404 Ở ĐÂY: Đổi đường dẫn cho khớp với component gọi đến */}
        <Route path="/student/exam" element={<RequireAuth allowedRoles={['STUDENT']}><ExamTaking /></RequireAuth>} />
        <Route path="/student/review" element={<RequireAuth allowedRoles={['STUDENT']}><ExamReview /></RequireAuth>} />

        <Route path="/student/history" element={<RequireAuth allowedRoles={['STUDENT']}><ExamHistory /></RequireAuth>} />
        <Route path="/student/practice" element={<RequireAuth allowedRoles={['STUDENT']}><Practice /></RequireAuth>} />
        <Route path="/student/flashcards" element={<RequireAuth allowedRoles={['STUDENT']}><Flashcards /></RequireAuth>} />
        <Route path="/student/mock-exams" element={<RequireAuth allowedRoles={['STUDENT']}><MockExams /></RequireAuth>} />
        <Route path="/student/statistics" element={<RequireAuth allowedRoles={['STUDENT']}><Statistics /></RequireAuth>} />

        {/* ─── Common (any authenticated user) ─────────────── */}
        <Route path="/common/profile" element={<RequireAuth><Profile /></RequireAuth>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

// ── Helpers ──────────────────────────────────────────────────
const RootRedirect = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const roleHome = { ADMIN: '/admin/dashboard', TEACHER: '/teacher/dashboard', STUDENT: '/student/dashboard' };
  return <Navigate to={roleHome[profile?.role] ?? '/login'} replace />;
};

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