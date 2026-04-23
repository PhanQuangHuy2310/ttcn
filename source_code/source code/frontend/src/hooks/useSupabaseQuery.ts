// src/hooks/useSupabaseQuery.ts
// ─────────────────────────────────────────────────────────────
// Generic async query hook + typed service helpers for every
// data entity used across Admin / Teacher / Student pages.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── GENERIC QUERY HOOK ───────────────────────────────────────

export function useQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  deps: unknown[] = []
) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await queryFn();
    if (err) setError(String(err));
    else     setData(result);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, refetch: run };
}

// ─── AUTH HELPERS ─────────────────────────────────────────────

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };
  return supabase.from('users').select('*').eq('id', user.id).single();
}

export async function logAuditAction(
  userId: string,
  role: string,
  actionType: string,
  entityType: string,
  entityId: string | null,
  description: string,
  metadata?: Record<string, unknown>
) {
  return supabase.from('audit_logs').insert({
    user_id: userId, role, action_type: actionType,
    entity_type: entityType, entity_id: entityId,
    description, metadata
  });
}

// ─── ADMIN SERVICES ───────────────────────────────────────────

export const adminService = {

  getDashboardStats: async () => {
    const [users, classes, exams, submissions] = await Promise.all([
      supabase.from('users').select('role', { count: 'exact', head: false }),
      supabase.from('classes').select('id', { count: 'exact', head: false }),
      supabase.from('exams').select('id, start_time, duration', { count: 'exact', head: false }),
      supabase.from('submissions').select('status', { count: 'exact', head: false }),
    ]);

    const userRows       = users.data ?? [];
    const totalUsers     = userRows.length;
    const totalTeachers  = userRows.filter((u: { role: string }) => u.role === 'TEACHER').length;
    const totalStudents  = userRows.filter((u: { role: string }) => u.role === 'STUDENT').length;
    const totalClasses   = classes.data?.length ?? 0;
    const totalExams     = exams.data?.length ?? 0;
    const totalSubs      = submissions.data?.length ?? 0;
    const submittedSubs  = (submissions.data ?? []).filter((s: { status: string }) => s.status === 'SUBMITTED').length;

    // Active exams: started and not yet past end time
    const now = new Date();
    const activeExams = (exams.data ?? []).filter((e: { start_time: string; duration: number }) => {
      const start = new Date(e.start_time);
      const end   = new Date(start.getTime() + e.duration * 60000);
      return start <= now && now <= end;
    }).length;

    return {
      data: { totalUsers, totalTeachers, totalStudents, totalClasses, totalExams, activeExams, totalSubs, submittedSubs },
      error: users.error ?? classes.error ?? exams.error ?? submissions.error
    };
  },

  getUsers: async (filters?: { role?: string; search?: string; page?: number; limit?: number }) => {
    let q = supabase.from('users').select('*', { count: 'exact' });
    if (filters?.role)   q = q.eq('role', filters.role);
    if (filters?.search) q = q.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    const limit = filters?.limit ?? 20;
    const page  = filters?.page  ?? 0;
    q = q.range(page * limit, (page + 1) * limit - 1).order('created_at', { ascending: false });
    return q;
  },

  getAuditLogs: async (filters?: {
    userId?: string; role?: string; actionType?: string;
    from?: string; to?: string; page?: number; limit?: number
  }) => {
    let q = supabase
      .from('audit_logs')
      .select('*, users(full_name, email, role)', { count: 'exact' });
    if (filters?.userId)     q = q.eq('user_id', filters.userId);
    if (filters?.role)       q = q.eq('role', filters.role);
    if (filters?.actionType) q = q.eq('action_type', filters.actionType);
    if (filters?.from)       q = q.gte('created_at', filters.from);
    if (filters?.to)         q = q.lte('created_at', filters.to);
    const limit = filters?.limit ?? 25;
    const page  = filters?.page  ?? 0;
    q = q.range(page * limit, (page + 1) * limit - 1).order('created_at', { ascending: false });
    return q;
  },

  getSystemSettings: async () =>
    supabase.from('system_settings').select('*').order('key'),

  updateSystemSetting: async (key: string, value: unknown, userId: string) =>
    supabase.from('system_settings')
      .update({ value, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('key', key),

  updateUser: async (id: string, updates: Record<string, unknown>) =>
    supabase.from('users').update(updates).eq('id', id),

  deleteUser: async (id: string) =>
    supabase.auth.admin.deleteUser(id),
};

// ─── TEACHER SERVICES ─────────────────────────────────────────

export const teacherService = {

  getDashboardStats: async (teacherId: string) => {
    const [courses, submissions] = await Promise.all([
      supabase.from('courses').select(`
        id,
        classes(
          id,
          student_classes(student_id),
          exams(id, title, start_time, duration)
        )
      `).eq('teacher_id', teacherId),
      supabase.from('submissions').select(`
        id, status, score,
        exams!inner(course_id, courses!inner(teacher_id))
      `).eq('exams.courses.teacher_id', teacherId),
    ]);

    const courseList    = courses.data ?? [];
    const totalClasses  = courseList.flatMap((c: { classes?: unknown[] }) => c.classes ?? []).length;
    const totalStudents = new Set(
      courseList.flatMap((c: { classes?: Array<{ student_classes?: Array<{ student_id: string }> }> }) =>
        (c.classes ?? []).flatMap(cls => (cls.student_classes ?? []).map(sc => sc.student_id))
      )
    ).size;
    const totalExams    = courseList.flatMap((c: { classes?: Array<{ exams?: unknown[] }> }) =>
      (c.classes ?? []).flatMap(cls => cls.exams ?? [])
    ).length;
    const subList = submissions.data ?? [];
    const pendingGrade  = subList.filter((s: { status: string; score: unknown }) => s.status === 'SUBMITTED' && s.score === null).length;

    return {
      data: { totalCourses: courseList.length, totalClasses, totalStudents, totalExams, pendingGrade },
      error: courses.error ?? submissions.error
    };
  },

  getCourses: async (teacherId: string) =>
    supabase.from('courses').select('*, classes(id, name, code, student_classes(count))').eq('teacher_id', teacherId),

  getClassDetail: async (classId: string) =>
    supabase.from('classes').select(`
      *,
      courses(name, subject, grade_level),
      student_classes(
        enrolled_at,
        users(id, full_name, email, student_id)
      ),
      exams(id, title, start_time, duration,
        submissions(student_id, status, score)
      )
    `).eq('id', classId).single(),

  getExams: async (teacherId: string, filters?: { classId?: string; search?: string }) => {
    let q = supabase.from('exams').select(`
      *,
      courses!inner(teacher_id, name, subject),
      classes(name),
      questions(count),
      submissions(status, score)
    `).eq('courses.teacher_id', teacherId);
    if (filters?.classId) q = q.eq('class_id', filters.classId);
    if (filters?.search)  q = q.ilike('title', `%${filters.search}%`);
    return q.order('start_time', { ascending: false });
  },

  createExam: async (exam: Record<string, unknown>) =>
    supabase.from('exams').insert(exam).select().single(),

  getQuestions: async (examId: string) =>
    supabase.from('questions').select('*').eq('exam_id', examId).order('created_at'),

  createQuestion: async (q: Record<string, unknown>) =>
    supabase.from('questions').insert(q).select().single(),

  deleteQuestion: async (id: string) =>
    supabase.from('questions').delete().eq('id', id),

  getStudentStatusByExam: async (examId: string) =>
    supabase.from('submissions').select(`
      status, score, started_at, submitted_at, time_spent,
      users(id, full_name, student_id, email)
    `).eq('exam_id', examId),

  gradeSubmission: async (submissionId: string, score: number, teacherId: string) => {
    const result = await supabase.from('submissions')
      .update({ score })
      .eq('id', submissionId)
      .select().single();

    if (!result.error) {
      await logAuditAction(teacherId, 'TEACHER', 'GRADE_SUBMISSION',
        'submission', submissionId, `Chấm bài với điểm ${score}`, { score });
    }
    return result;
  },

  getReports: async (teacherId: string) =>
    supabase.from('courses').select(`
      id, name, subject, grade_level,
      classes(
        id, name,
        student_classes(count),
        exams(
          id, title, start_time,
          submissions(status, score)
        )
      )
    `).eq('teacher_id', teacherId),

  getQuestionBank: async (teacherId: string, filters?: { subject?: string; type?: string; search?: string }) => {
    let q = supabase.from('questions').select(`
      *,
      exams!inner(course_id, courses!inner(teacher_id))
    `).eq('exams.courses.teacher_id', teacherId);
    if (filters?.type)   q = q.eq('type', filters.type);
    if (filters?.search) q = q.ilike('content', `%${filters.search}%`);
    return q.order('created_at', { ascending: false });
  },

  getMaterials: async (teacherId: string) =>
    supabase.from('materials').select(`
      *,
      lessons!inner(
        course_id,
        courses!inner(teacher_id)
      )
    `).eq('lessons.courses.teacher_id', teacherId),
};

// ─── STUDENT SERVICES ─────────────────────────────────────────

export const studentService = {

  getDashboardStats: async (studentId: string) => {
    const [enroll, subs] = await Promise.all([
      supabase.from('student_classes').select('class_id, classes(name, courses(name))').eq('student_id', studentId),
      supabase.from('submissions').select('status, score, submitted_at, exams(title, duration)').eq('student_id', studentId),
    ]);

    const classList = enroll.data ?? [];
    const subList   = subs.data   ?? [];
    const scores    = subList.filter((s: { score: number | null }) => s.score !== null).map((s: { score: number }) => s.score);
    const avgScore  = scores.length ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : null;
    const submitted = subList.filter((s: { status: string }) => s.status === 'SUBMITTED').length;
    const inProgress = subList.filter((s: { status: string }) => s.status === 'IN_PROGRESS').length;

    return {
      data: {
        totalClasses: classList.length,
        totalSubmissions: subList.length,
        submitted, inProgress,
        avgScore: avgScore ? parseFloat(avgScore) : null
      },
      error: enroll.error ?? subs.error
    };
  },

  getMyClasses: async (studentId: string) =>
    supabase.from('student_classes').select(`
      enrolled_at,
      classes(
        id, name, code, academic_year,
        courses(name, subject, grade_level, thumbnail_url,
          users(full_name)
        )
      )
    `).eq('student_id', studentId),

  getExamDetail: async (examId: string, studentId: string) => {
    const [exam, submission] = await Promise.all([
      supabase.from('exams').select(`
        *, questions(id, content, type, points, options),
        classes(name), courses(name, subject)
      `).eq('id', examId).single(),
      supabase.from('submissions').select('*')
        .eq('exam_id', examId).eq('student_id', studentId).maybeSingle()
    ]);
    return { data: { exam: exam.data, submission: submission.data }, error: exam.error ?? submission.error };
  },

  startExam: async (examId: string, studentId: string) => {
    const result = await supabase.from('submissions').upsert({
      exam_id: examId, student_id: studentId,
      status: 'IN_PROGRESS', started_at: new Date().toISOString()
    }, { onConflict: 'exam_id,student_id' }).select().single();

    if (!result.error) {
      await logAuditAction(studentId, 'STUDENT', 'START_EXAM',
        'submission', result.data.id, 'Bắt đầu làm bài thi', { exam_id: examId });
    }
    return result;
  },

  submitExam: async (examId: string, studentId: string, answers: Record<string, string>, score: number, timeSpent: number) => {
    // Get submission id first
    const { data: sub } = await supabase.from('submissions')
      .select('id').eq('exam_id', examId).eq('student_id', studentId).single();

    const result = await supabase.from('submissions').update({
      status: 'SUBMITTED', answers, score,
      submitted_at: new Date().toISOString(), time_spent: timeSpent
    }).eq('exam_id', examId).eq('student_id', studentId).select().single();

    if (!result.error) {
      await logAuditAction(studentId, 'STUDENT', 'SUBMIT_EXAM',
        'submission', sub?.id ?? examId, 'Nộp bài thi', { exam_id: examId, score });
    }
    return result;
  },

  getHistory: async (studentId: string) =>
    supabase.from('submissions').select(`
      id, status, score, started_at, submitted_at, time_spent,
      exams(id, title, duration, start_time,
        courses(name, subject),
        classes(name)
      )
    `).eq('student_id', studentId).order('submitted_at', { ascending: false }),

  getFlashcardSets: async (studentId: string) =>
    supabase.from('flashcard_sets').select(`
      *, flashcards(count),
      courses(name, subject,
        student_classes!inner(student_id)
      )
    `).eq('courses.student_classes.student_id', studentId),

  getFlashcards: async (setId: string) =>
    supabase.from('flashcards').select('*').eq('set_id', setId).order('order'),

  getMockExams: async (studentId: string) =>
    supabase.from('exams').select(`
      id, title, duration, start_time,
      courses(name, subject),
      classes!inner(student_classes!inner(student_id)),
      questions(count),
      submissions(status, score)
    `).eq('classes.student_classes.student_id', studentId),

  getProfile: async (userId: string) =>
    supabase.from('users').select('*').eq('id', userId).single(),

  updateProfile: async (userId: string, updates: Record<string, unknown>) =>
    supabase.from('users').update(updates).eq('id', userId).select().single(),
};

// ─── COMMON HOOKS ─────────────────────────────────────────────

export function useAdminStats() {
  return useQuery(() => adminService.getDashboardStats());
}

export function useTeacherStats(teacherId: string) {
  return useQuery(() => teacherService.getDashboardStats(teacherId), [teacherId]);
}

export function useStudentStats(studentId: string) {
  return useQuery(() => studentService.getDashboardStats(studentId), [studentId]);
}

export function useAuditLogs(filters?: Parameters<typeof adminService.getAuditLogs>[0]) {
  return useQuery(
    () => adminService.getAuditLogs(filters),
    [JSON.stringify(filters)]
  );
}

export function useUsers(filters?: Parameters<typeof adminService.getUsers>[0]) {
  return useQuery(() => adminService.getUsers(filters), [JSON.stringify(filters)]);
}

export function useTeacherExams(teacherId: string, filters?: { classId?: string; search?: string }) {
  return useQuery(() => teacherService.getExams(teacherId, filters), [teacherId, JSON.stringify(filters)]);
}

export function useStudentClasses(studentId: string) {
  return useQuery(() => studentService.getMyClasses(studentId), [studentId]);
}

export function useStudentHistory(studentId: string) {
  return useQuery(() => studentService.getHistory(studentId), [studentId]);
}
