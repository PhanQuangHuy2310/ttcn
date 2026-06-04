/**
 * FILE: apiEndpoints.ts
 * MÔ TẢ: Định nghĩa tập trung các hằng số về tên bảng Supabase và các đường dẫn API Backend.
 * CHỨC NĂNG: Đảm bảo tính nhất quán giữa Frontend và Backend, tránh lỗi gõ sai tên bảng hoặc sai đường dẫn API.
 */
// src/constant/apiEndpoints.ts
// Single source of truth for all table names and API routes.
// Fixes: pages were typing table names as raw strings — one typo breaks a query silently.

// ── Supabase table names ─────────────────────────────────────
export const SUPABASE_TABLES = {
  USERS:             'users',
  COURSES:           'courses',
  CLASSES:           'classes',
  STUDENT_CLASSES:   'student_classes',
  LESSONS:           'lessons',
  MATERIALS:         'materials',
  EXAMS:             'exams',
  QUESTIONS:         'questions',
  SUBMISSIONS:       'submissions',
  AUDIT_LOGS:        'audit_logs',
  FLASHCARD_SETS:    'flashcard_sets',
  FLASHCARDS:        'flashcards',
  NOTIFICATIONS:     'notifications',
  SYSTEM_SETTINGS:   'system_settings',
  EXAM_MATRICES:     'exam_matrices',
} as const;

// ── Spring Boot API base (for future integration) ────────────
export const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8085').replace(/\/api$/, '');

// ── Auth (Sử dụng Supabase Auth ở Client, không gọi qua Spring Boot nữa) ──────────
export const AUTH_API = {
  // Spring Boot Auth đã bị loại bỏ
} as const;

// ── Users ─────────────────────────────────────────────────────
export const USERS_API = {
  LIST:    `${API_BASE}/api/users`,
  ME:      `${API_BASE}/api/users/me`,
  DETAIL:  (id: string) => `${API_BASE}/api/users/${id}`,
} as const;

// ── Courses / Classes ─────────────────────────────────────────
export const COURSES_API = {
  LIST:   `${API_BASE}/api/v1/courses`,
  DETAIL: (id: string) => `${API_BASE}/api/v1/courses/${id}`,
} as const;

export const CLASSES_API = {
  LIST:   `${API_BASE}/api/classes`,
  DETAIL: (id: string) => `${API_BASE}/api/classes/${id}`,
} as const;

// ── Exams ─────────────────────────────────────────────────────
export const EXAMS_API = {
  LIST:   `${API_BASE}/api/exams`,
  DETAIL: (id: string) => `${API_BASE}/api/exams/${id}`,
} as const;

// ── Submissions ───────────────────────────────────────────────
export const SUBMISSIONS_API = {
  LIST:   `${API_BASE}/api/submissions`,
  DETAIL: (id: string) => `${API_BASE}/api/submissions/${id}`,
  SUBMIT: (examId: string) => `${API_BASE}/api/submissions/${examId}/submit`,
} as const;

// ── AI (Dành cho Giáo viên) ──────────────────────────────────
export const TEACHER_AI_API = {
  EXTRACT_QUESTIONS: `${API_BASE}/api/teacher/ai/extract-questions`,
  EXTRACT_QUESTIONS_URL: `${API_BASE}/api/teacher/ai/extract-questions/url`,
  SAVE_EXAM_DRAFT:   `${API_BASE}/api/teacher/exams/save-draft`,
  EXTRACT_FLASHCARDS_STREAM: `${API_BASE}/api/teacher/ai/extract-flashcards/stream`,
  EXTRACT_FLASHCARDS_URL: `${API_BASE}/api/teacher/ai/extract-flashcards/url`,
  SAVE_FLASHCARD_DRAFT: `${API_BASE}/api/teacher/flashcards/save-draft`,
} as const;

// ── Materials / Files ─────────────────────────────────────────
export const FILES_API = {
  UPLOAD:  `${API_BASE}/api/files/upload`,
  DETAIL:  (id: string) => `${API_BASE}/api/files/${id}`,
} as const;

// ── Audit logs ────────────────────────────────────────────────
export const AUDIT_API = {
  LIST:   `${API_BASE}/api/audit-logs`,
} as const;
