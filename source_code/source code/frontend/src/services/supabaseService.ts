// src/services/supabaseService.ts

import { supabase } from '../lib/supabase';
import { SUPABASE_TABLES } from '../constant/apiEndpoints';

export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};

// ================= COMMON =================

async function run<T>(query: any): Promise<ServiceResult<T>> {
  const { data, error } = await query;
  return {
    data: error ? null : data,
    error: error?.message ?? null,
  };
}

async function countRows(table: string): Promise<ServiceResult<number>> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  return {
    data: error ? null : count ?? 0,
    error: error?.message ?? null,
  };
}

// ================= USERS =================

export const usersService = {
  getAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.USERS)
        .select('*')
        .order('created_at', { ascending: false })
    ),

  getRecent: (limit = 5) =>
    run(
      supabase
        .from(SUPABASE_TABLES.USERS)
        .select('id,full_name,email,role,created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
    ),

  getById: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.USERS)
        .select('*')
        .eq('id', id)
        .single()
    ),

  countByRole: async () => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.USERS)
      .select('role');

    if (error) return { data: null, error: error.message };

    const users = data || [];

    return {
      data: {
        total: users.length,
        admins: users.filter(x => x.role === 'ADMIN').length,
        teachers: users.filter(x => x.role === 'TEACHER').length,
        students: users.filter(x => x.role === 'STUDENT').length,
      },
      error: null,
    };
  },

  updateProfile: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.USERS)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  deleteUser: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.USERS)
        .delete()
        .eq('id', id)
    ),
};

// ================= COURSES =================

export const coursesService = {
  getAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .select('*')
        .order('created_at', { ascending: false })
    ),

  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .select(`
        id,
        name,
        subject,
        semester,
        created_at,
        classes(
          id,
          code,
          academic_year,
          student_classes(
            id
          )
        )
      `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  getById: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .select('*')
        .eq('id', id)
        .single()
    ),

  countAll: () => countRows(SUPABASE_TABLES.COURSES),

  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .insert(payload)
        .select()
        .single()
    ),

  update: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.COURSES)
        .delete()
        .eq('id', id)
    ),
};

// ================= CLASSES =================

export const classesService = {
  getAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.CLASSES)
        .select('*')
    ),
  getEnrolledByStudent: (studentId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.STUDENT_CLASSES)
        .select(`
        id,
        enrolled_at,
        class_id,
        classes(
          id,
          name,
          code,
          academic_year,
          courses(
            id,
            name,
            subject,
            semester,
            teacher_id,
            users(full_name)
          )
        )
      `)
        .eq('student_id', studentId)
        .order('enrolled_at', { ascending: false })
    ),
  getByCourse: async (courseId: string) => {
    const { data, error } = await supabase
      .from("classes")
      .select(`
      id,
      name,
      code,

      student_classes (
        id,
        student_id,
        enrolled_at,

        users!student_classes_student_id_fkey (
          id,
          full_name,
          email,
          student_id
        )
      )
    `)
      .eq("course_id", courseId);

    return {
      data: error ? null : data,
      error: error?.message ?? null
    };
  },
  countAll: () => countRows(SUPABASE_TABLES.CLASSES),
  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.CLASSES)
        .insert(payload)
        .select()
        .single()
    ),

  update: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.CLASSES)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.CLASSES)
        .delete()
        .eq('id', id)
    ),
};

// ================= EXAMS =================

export const examsService = {
  getAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .select('*')
        .order('created_at', { ascending: false })
    ),
  getUpcoming: (limit = 5) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .select(`
        id,
        title,
        start_time,
        duration,
        class_id,
        classes(name)
      `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit)
    ),
  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .select(`
        id,
        title,
        duration,
        start_time,
        status,
        created_at,
        courses!inner(
          id,
          name,
          teacher_id
        )
      `)
        .eq('courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  getById: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .select('*')
        .eq('id', id)
        .single()
    ),

  countAll: async () => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.EXAMS)
      .select('id,start_time,duration');

    if (error) return { data: null, error: error.message };

    const exams = data || [];
    const now = new Date();

    const active = exams.filter((e: any) => {
      if (!e.start_time) return false;
      const start = new Date(e.start_time);
      const end = new Date(start.getTime() + (e.duration || 60) * 60000);
      return now >= start && now <= end;
    }).length;

    return {
      data: {
        total: exams.length,
        active,
      },
      error: null,
    };
  },
};

// ================= QUESTIONS =================
// ĐÃ FIX: Bao gồm đầy đủ các hàm lấy (GET), thêm (CREATE), sửa (UPDATE), xóa (DELETE)
export const questionsService = {
  getByExam: (examId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .select('*')
        .eq('exam_id', examId)
    ),

  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .select(`
          id,
          content,
          type,
          points,
          created_at,
          exams!inner(
            id,
            title,
            courses!inner(
              id,
              teacher_id,
              name
            )
          )
        `)
        .eq('exams.courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  countByTeacher: async (teacherId: string) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.QUESTIONS)
      .select(`
      id,
      exams!inner(
        courses!inner(
          teacher_id
        )
      )
    `)
      .eq('exams.courses.teacher_id', teacherId);

    return {
      data: error ? null : (data?.length || 0),
      error: error?.message ?? null
    };
  },

  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .insert(payload)
        .select()
        .single()
    ),

  update: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.QUESTIONS)
        .delete()
        .eq('id', id)
    ),
};

// ================= SUBMISSIONS =================

export const submissionsService = {
  getByStudent: (studentId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('*, exams(id, title)')
        .eq('student_id', studentId)
    ),
  getPendingByTeacher: (teacherId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select(`
        id,
        status,
        score,
        submitted_at,
        exams!inner(
          title,
          courses!inner(
            teacher_id
          )
        )
      `)
        .eq('status', 'SUBMITTED')
        .eq('exams.courses.teacher_id', teacherId)
        .order('submitted_at', { ascending: false })
    ),
  getByExam: (examId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('*')
        .eq('exam_id', examId)
    ),

  studentStats: async (studentId: string) => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SUBMISSIONS)
      .select('id,status,score')
      .eq('student_id', studentId);

    if (error) return { data: null, error: error.message };

    const rows = data || [];
    const submitted = rows.filter(x => x.status === 'SUBMITTED');

    const avgScore =
      submitted.length > 0
        ? (
          submitted.reduce((a, b) => a + (b.score || 0), 0) /
          submitted.length
        ).toFixed(1)
        : null;

    return {
      data: {
        total: rows.length,
        submitted: submitted.length,
        avgScore,
      },
      error: null,
    };
  },
  countAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .select('*')
    ),

  upsert: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SUBMISSIONS)
        .upsert(payload, {
          onConflict: 'exam_id,student_id',
        })
        .select()
        .single()
    ),

  startExam: async (examId: string, studentId: string) => {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('submissions')
        .select('*')
        .eq('exam_id', examId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'NOT_STARTED') {
          const { data, error } = await supabase
            .from('submissions')
            .update({ status: 'IN_PROGRESS', started_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();
          return { data, error };
        }
        return { data: existing, error: null };
      }

      const { data, error } = await supabase
        .from('submissions')
        .insert({
          exam_id: examId,
          student_id: studentId,
          status: 'IN_PROGRESS',
          started_at: new Date().toISOString(),
          answers: {}
        })
        .select()
        .single();

      return { data, error };
    } catch (error: any) {
      return { data: null, error: error.message || error };
    }
  },

  saveProgress: async (examId: string, studentId: string, answers: any) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({ answers })
        .eq('exam_id', examId)
        .eq('student_id', studentId)
        .select()
        .single();
      return { data, error };
    } catch (error: any) {
      return { data: null, error: error.message || error };
    }
  },

  submitWithScore: async (examId: string, studentId: string, answers: any, tabSwitches: number) => {
    try {
      const { data: questions } = await supabase
        .from('questions')
        .select('id, type, points, correct_answer')
        .eq('exam_id', examId);

      let score = 0;
      let totalPoints = 0;
      let hasEssay = false;

      if (questions && questions.length > 0) {
        questions.forEach(q => {
          const p = parseFloat(q.points || 1);
          totalPoints += p;

          if (q.type === 'ESSAY') {
            hasEssay = true;
          } else if (answers[q.id] === q.correct_answer) {
            score += p;
          }
        });
      }

      let finalScore = totalPoints > 0 ? (score / totalPoints) * 10 : 0;
      finalScore = Math.round(finalScore * 10) / 10;

      const newStatus = hasEssay ? 'SUBMITTED' : 'GRADED';

      const { data, error } = await supabase
        .from('submissions')
        .update({
          answers,
          status: newStatus,
          score: hasEssay ? null : finalScore,
          tab_switches: tabSwitches || 0,
          submitted_at: new Date().toISOString()
        })
        .eq('exam_id', examId)
        .eq('student_id', studentId)
        .select()
        .single();

      return { data: { ...data, hasEssay, score: finalScore }, error };
    } catch (error: any) {
      return { data: null, error: error.message || error };
    }
  }
};

// ================= AUDIT LOGS =================

export const auditLogsService = {
  getRecent: (limit = 10) =>
    run(
      supabase
        .from(SUPABASE_TABLES.AUDIT_LOGS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
    ),
};

// ================= FLASHCARDS =================

export const flashcardsService = {
  getSets: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARD_SETS)
        .select(`
        *,
        flashcards(count)
        `)
    ),

  getCards: async (setId: string) => {
    return await supabase
      .from('flashcards')
      .select('*')
      .eq('set_id', setId)
      .order('order', { ascending: true });
  }
};
export const flashcardSetsService = {
  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARD_SETS)
        .insert(payload)
        .select()
        .single()
    ),

  update: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARD_SETS)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.FLASHCARD_SETS)
        .delete()
        .eq('id', id)
    ),
};

// ================= SETTINGS =================

export const settingsService = {
  getAll: () =>
    run(
      supabase
        .from(SUPABASE_TABLES.SYSTEM_SETTINGS)
        .select('*')
    ),

  upsert: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.SYSTEM_SETTINGS)
        .upsert(payload)
    ),
};

// ================= NOTIFICATIONS =================

export const notificationsService = {
  getForUser: (userId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.NOTIFICATIONS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ),

  markRead: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.NOTIFICATIONS)
        .update({ read_status: true })
        .eq('id', id)
    ),
};

// ================= MATERIALS =================

export const materialsService = {
  getByLesson: (lessonId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.MATERIALS)
        .select('*')
        .eq('lesson_id', lessonId)
    ),

  getByTeacher: (teacherId: string) =>
    run(
      supabase
        .from('materials')
        .select(`
          id,
          title,
          file_url,
          material_type,
          size,
          created_at,
          lessons!inner(
            id,
            title,
            course_id,
            courses!inner(
              id,
              name,
              teacher_id
            )
          )
        `)
        .eq('lessons.courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  create: (payload: any) =>
    run(
      supabase
        .from('materials')
        .insert(payload)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from('materials')
        .delete()
        .eq('id', id)
    ),
};

// ================= EXAMS ADMIN =================

export const examsAdminService = {
  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .insert(payload)
        .select(`
          *,
          courses(id,name)
        `)
        .single()
    ),

  updateStatus: (id: string, status: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .update({ status })
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.EXAMS)
        .delete()
        .eq('id', id)
    ),
};

export const examMatricesService = {
  getByTeacher: async (teacherId: string) =>
    run(
      supabase
        .from('exam_matrices')
        .select(`
          id,
          title,
          config,
          created_at,
          exams!inner(
            id,
            title,
            course_id,
            courses!inner(
              id,
              name,
              teacher_id
            )
          )
        `)
        .eq('exams.courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    ),

  create: async (payload: any) =>
    run(
      supabase
        .from('exam_matrices')
        .insert(payload)
        .select()
        .single()
    ),

  update: async (id: string, payload: any) =>
    run(
      supabase
        .from('exam_matrices')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: async (id: string) =>
    run(
      supabase
        .from('exam_matrices')
        .delete()
        .eq('id', id)
    ),
};

// ================= CLASS MANAGEMENT (for Teachers) =================

export const teacherClassesService = {
  getByTeacher: async (teacherId: string) => {
    return run(
      supabase
        .from('classes')
        .select(`
          id,
          code,
          name,
          year_level,
          course_id,
          courses!inner(
            id,
            name,
            teacher_id
          )
        `)
        .eq('courses.teacher_id', teacherId)
        .order('created_at', { ascending: false })
    );
  },

  getStudents: async (classId: string) => {
    return run(
      supabase
        .from('student_classes')
        .select(`
          id,
          student_id,
          students!inner(
            id,
            full_name,
            email,
            created_at
          )
        `)
        .eq('class_id', classId)
    );
  },

  addStudentsByCode: async (classId: string, classCode: string) => {
    return run(
      supabase
        .from('student_classes')
        .insert([
          {
            class_id: classId,
            student_id: classCode,
          },
        ])
        .select()
        .single()
    );
  },

  removeStudent: async (studentClassId: string) => {
    return run(
      supabase
        .from('student_classes')
        .delete()
        .eq('id', studentClassId)
    );
  },
};

// ================= STUDENT CLASS MANAGEMENT (for Students) =================

export const studentClassesService = {
  getByStudent: async (studentId: string) => {
    return run(
      supabase
        .from('student_classes')
        .select(`
          id,
          class_id,
          classes!inner(
            id,
            code,
            name,
            year_level,
            courses!inner(
              id,
              name,
              teacher_id,
              teachers!inner(
                id,
                full_name,
                email
              )
            )
          )
        `)
        .eq('student_id', studentId)
        .order('classes.created_at', { ascending: false })
    );
  },

  joinByCode: async (studentId: string, classCode: string) => {
    return run(
      supabase
        .from('student_classes')
        .insert({
          student_id: studentId,
          class_id: classCode,
        })
        .select()
        .single()
    );
  },

  leaveClass: async (studentClassId: string) => {
    return run(
      supabase
        .from('student_classes')
        .delete()
        .eq('id', studentClassId)
    );
  },
};

// ================= LESSONS =================

export const lessonsService = {
  getByCourse: (courseId: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.LESSONS)
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
    ),

  create: (payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.LESSONS)
        .insert(payload)
        .select()
        .single()
    ),

  update: (id: string, payload: any) =>
    run(
      supabase
        .from(SUPABASE_TABLES.LESSONS)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ),

  delete: (id: string) =>
    run(
      supabase
        .from(SUPABASE_TABLES.LESSONS)
        .delete()
        .eq('id', id)
    ),
};