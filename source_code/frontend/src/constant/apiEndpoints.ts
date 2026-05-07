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
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// ── Auth ─────────────────────────────────────────────────────
export const AUTH_API = {
  LOGIN:   `${API_BASE}/api/auth/login`,
  LOGOUT:  `${API_BASE}/api/auth/logout`,
  REFRESH: `${API_BASE}/api/auth/refresh`,
  ME:      `${API_BASE}/api/auth/me`,
} as const;

// ── Users ─────────────────────────────────────────────────────
export const USERS_API = {
  LIST:    `${API_BASE}/api/users`,
  ME:      `${API_BASE}/api/users/me`,
  DETAIL:  (id: string) => `${API_BASE}/api/users/${id}`,
} as const;

// ── Courses / Classes ─────────────────────────────────────────
export const COURSES_API = {
  LIST:   `${API_BASE}/api/courses`,
  DETAIL: (id: string) => `${API_BASE}/api/courses/${id}`,
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
} as const;

// ── AI ────────────────────────────────────────────────────────
export const AI_API = {
  GENERATE_QUESTIONS: `${API_BASE}/api/ai/generate-questions`,
  SUMMARIZE:          `${API_BASE}/api/ai/summarize`,
  CHAT:               `${API_BASE}/api/ai/chat`,
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
