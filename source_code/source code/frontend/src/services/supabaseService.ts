// src/services/supabaseService.ts
// Centralized data access layer. All pages import from here — never from supabase directly.
// Fixes: scattered raw queries, wrong table columns, missing teacher_id on classes, missing progress on student_classes.

import { supabase } from '../lib/supabase';
import { SUPABASE_TABLES } from '../constant/apiEndpoints';

// ─── TYPE HELPERS ────────────────────────────────────────────

export type ServiceResult<T> = { data: T | null; error: string | null };

async function run<T>(promise: Promise<{ data: T | null; error: { message: string } | null }>): Promise<ServiceResult<T>> {
  const { data, error } = await promise;
  return { data: error ? null : data, error: error?.message ?? null };
}

// ─── USERS ───────────────────────────────────────────────────

export const usersService = {
  getAll: () => run(supabase.from(SUPABASE_TABLES.USERS).select('id, full_name, email, role, student_id, teacher_code, created_at').order('created_at', { ascending: false })),

  getRecent: (limit = 5) => run(supabase.from(SUPABASE_TABLES.USERS).select('id, full_name, email, role, created_at').order('created_at', { ascending: false }).limit(limit)),

  countByRole: async () => {
    const { data, error } = await supabase.from(SUPABASE_TABLES.USERS).select('id, role');
    if (error) return { data: null, error: error.message };
    const users = data ?? [];
    return {
      data: {
        total:    users.length,
        admins:   users.filter(u => u.role === 'ADMIN').length,
        teachers: users.filter(u => u.role === 'TEACHER').length,
        students: users.filter(u => u.role === 'STUDENT').length,
      },
      error: null,
    };
  },

  updateProfile: (userId: string, updates: { full_name?: string; student_id?: string; teacher_code?: string }) =>
    run(supabase.from(SUPABASE_TABLES.USERS).update(updates).eq('id', userId).select().single()),

  deleteUser: (userId: string) =>
    run(supabase.from(SUPABASE_TABLES.USERS).delete().eq('id', userId)),
};

// ─── COURSES (maps to what frontend calls "classes" — schema clarification) ──
// The DB has: courses (teacher_id, name, subject, semester) → classes (course_id, code, academic_year) → student_classes
// Frontend was querying classes.teacher_id which doesn't exist. Fix: query courses + join classes.

export const coursesService = {
  // Teacher: get all courses owned by this teacher with student count via student_classes
  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .select('id, name, subject, semester, grade_level, created_at, classes(id, code, max_student, academic_year, student_classes(count))')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  getById: (courseId: string) =>
    run(supabase.from(SUPABASE_TABLES.COURSES).select('*, classes(*, student_classes(count))').eq('id', courseId).single()),

  // Admin: total count
  countAll: () =>
    run(supabase.from(SUPABASE_TABLES.COURSES).select('id', { count: 'exact', head: true })),
};

// ─── CLASSES ─────────────────────────────────────────────────

export const classesService = {
  // Get classes for a course with enrolled students
  getByCourse: (courseId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.CLASSES)
        .select('id, name, code, max_student, academic_year, student_classes(id, student_id, enrolled_at, users(id, full_name, email, student_id))')
        .eq('course_id', courseId)
    ),

  // Student: get all classes the student is enrolled in
  getEnrolledByStudent: (studentId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.STUDENT_CLASSES)
        .select('id, enrolled_at, class_id, classes(id, name, code, academic_year, courses(id, name, subject, semester, teacher_id, users!courses_teacher_id_fkey(full_name)))')
        .eq('student_id', studentId)
        .order('enrolled_at', { ascending: false })
    ),

  countAll: () =>
    run(supabase.from(SUPABASE_TABLES.CLASSES).select('id', { count: 'exact', head: true })),
};

// ─── EXAMS ───────────────────────────────────────────────────

export const examsService = {
  // Teacher: get exams by teacher (via courses.teacher_id)
  getByTeacher: (teacherId: string, limit?: number) => {
    let q = supabase
      .from(SUPABASE_TABLES.EXAMS)
      .select('id, title, start_time, duration, status, created_at, course_id, class_id, courses!inner(id, name, teacher_id)')
      .eq('courses.teacher_id', teacherId)
      .order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);
    return run(q);
  },

  getUpcoming: (limit = 5) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .select('id, title, start_time, duration, status, class_id, classes(name, courses(name, subject))')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit)
    ),

  getById: (examId: string) =>
    run(supabase.from(SUPABASE_TABLES.EXAMS).select('*, questions(*)').eq('id', examId).single()),

  countAll: async () => {
    const { data, error } = await supabase.from(SUPABASE_TABLES.EXAMS).select('id, start_time, duration, status');
    if (error) return { data: null, error: error.message };
    const exams = data ?? [];
    const now = new Date();
    const active = exams.filter(e => {
      if (!e.start_time) return false;
      const s = new Date(e.start_time);
      const end = new Date(s.getTime() + (e.duration ?? 60) * 60000);
      return now >= s && now <= end;
    }).length;
    return { data: { total: exams.length, active }, error: null };
  },
};

// ─── QUESTIONS ───────────────────────────────────────────────

export const questionsService = {
  getByExam: (examId: string) =>
    run(supabase.from(SUPABASE_TABLES.QUESTIONS).select('*').eq('exam_id', examId).order('created_at')),

  // Teacher: all questions across teacher's exams
  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .select('id, content, type, points, created_at, exams!inner(course_id, courses!inner(teacher_id))')
        .eq('exams.courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  countByTeacher: async (teacherId: string) => {
    const { data, error } = await questionsService.getByTeacher(teacherId);
    return { data: data ? data.length : null, error };
  },
};

// ─── SUBMISSIONS ─────────────────────────────────────────────

export const submissionsService = {
  getByStudent: (studentId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('id, status, score, started_at, submitted_at, time_spent, exam_id, exams(title, duration, class_id, classes(name))')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
    ),

  getByExam: (examId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('id, status, score, submitted_at, student_id, users(full_name, email, student_id)')
        .eq('exam_id', examId)
        .order('submitted_at', { ascending: false })
    ),

  // Teacher: all pending (SUBMITTED, needs grading)
  getPendingByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('id, status, score, submitted_at, student_id, exam_id, exams!inner(title, course_id, courses!inner(teacher_id))')
        .eq('exams.courses.teacher_id', teacherId)
        .eq('status', 'SUBMITTED')
        .order('submitted_at', { ascending: false })
    ),

  countAll: () =>
    run(supabase.from(SUPABASE_TABLES.SUBMISSIONS).select('id, status')),

  studentStats: async (studentId: string) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SUBMISSIONS)
      .select('id, status, score')
      .eq('student_id', studentId);
    if (error) return { data: null, error: error.message };
    const subs = data ?? [];
    const submitted = subs.filter(s => s.status === 'SUBMITTED');
    const avgScore = submitted.length > 0
      ? parseFloat((submitted.reduce((a, s) => a + (s.score ?? 0), 0) / submitted.length).toFixed(1))
      : null;
    return { data: { total: subs.length, submitted: submitted.length, avgScore }, error: null };
  },

  upsert: (submission: { exam_id: string; student_id: string; status: string; answers?: Record<string, string>; score?: number }) =>
    run(supabase.from(SUPABASE_TABLES.SUBMISSIONS).upsert(submission, { onConflict: 'exam_id,student_id' }).select().single()),
};

// ─── AUDIT LOGS ──────────────────────────────────────────────

export const auditLogsService = {
  getRecent: (limit = 8) =>
    run(
      supabase
        .from(SUPABASE_TABLES.AUDIT_LOGS)
        .select('id, action_type, description, created_at, user_id, users(full_name, role)')
        .order('created_at', { ascending: false })
        .limit(limit)
    ),
};

// ─── FLASHCARDS ──────────────────────────────────────────────

export const flashcardsService = {
  getSets: (userId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARD_SETS)
        .select('id, title, description, created_at, flashcards(count)')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
    ),

  getCards: (setId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARDS)
        .select('id, front, back, hint, difficulty')
        .eq('set_id', setId)
        .order('created_at')
    ),
};

// ─── SYSTEM SETTINGS ─────────────────────────────────────────

export const settingsService = {
  getAll: () =>
    run(supabase.from(SUPABASE_TABLES.SYSTEM_SETTINGS).select('*')),

  upsert: (settings: { key: string; value: string; description?: string }[]) =>
    run(supabase.from(SUPABASE_TABLES.SYSTEM_SETTINGS).upsert(settings)),
};

// ─── NOTIFICATIONS ───────────────────────────────────────────

export const notificationsService = {
  getForUser: (userId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.NOTIFICATIONS)
        .select('id, title, message, type, read_status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
    ),

  markRead: (notificationId: string) =>
    run(supabase.from(SUPABASE_TABLES.NOTIFICATIONS).update({ read_status: true }).eq('id', notificationId)),
};

// ─── MATERIALS ───────────────────────────────────────────────

export const materialsService = {
  getByLesson: (lessonId: string) =>
    run(supabase.from(SUPABASE_TABLES.MATERIALS).select('*').eq('lesson_id', lessonId).order('created_at')),

  // Teacher: all materials across their courses
  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.MATERIALS)
        .select('id, title, file_url, material_type, size, created_at, lessons!inner(course_id, courses!inner(teacher_id))')
        .eq('lessons.courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),
};

// ─── EXAM MATRICES ───────────────────────────────────────────

export const examMatricesService = {
  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAM_MATRICES)
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),
};

// ─── EXAMS extended CRUD (for ExamBank page) ─────────────────

export const examsAdminService = {
  create: (exam: { title: string; duration: number; status: string; course_id: string }) =>
    run(supabase.from(SUPABASE_TABLES.EXAMS).insert(exam).select().single()),

  updateStatus: (examId: string, status: string) =>
    run(supabase.from(SUPABASE_TABLES.EXAMS).update({ status }).eq('id', examId).select().single()),

  delete: (examId: string) =>
    run(supabase.from(SUPABASE_TABLES.EXAMS).delete().eq('id', examId)),
};

// ─── FLASHCARD SET creation ───────────────────────────────────

export const flashcardSetsService = {
  create: (set: { title: string; description?: string | null; created_by: string }) =>
    run(supabase.from(SUPABASE_TABLES.FLASHCARD_SETS).insert(set).select().single()),
};
