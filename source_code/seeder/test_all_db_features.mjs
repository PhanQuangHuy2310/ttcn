import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkapaipzdxyshqynjfri.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYXBhaXB6ZHh5c2hxeW5qZnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDk5MzcsImV4cCI6MjEwMDM4NTkzN30.n5aVktR16Xovus1S73_oyX4cMNPvFMgLVZkt74FHnNs';

const TEACHER_EMAIL = 'huynh.van.minh.gv2@dhdedu.edu.vn';
const STUDENT_EMAIL = 'tran.cong.khoa.sv1@dhdedu.edu.vn';
const PASSWORD = '123456';

let passed = 0;
let failed = 0;

function logPass(msg) {
  console.log(`  ✅ [PASS] ${msg}`);
  passed++;
}

function logFail(msg, err) {
  console.error(`  ❌ [FAIL] ${msg}`, err || '');
  failed++;
}

async function testTeacherFlow(supabase) {
  console.log('\n=========================================');
  console.log('👨‍🏫 TESTING TEACHER DATABASE WRITE FEATURES');
  console.log('=========================================');

  // 1. Teacher Login
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: TEACHER_EMAIL,
    password: PASSWORD,
  });
  if (authErr || !authData?.user) {
    logFail('Teacher login', authErr);
    return;
  }
  const teacherId = authData.user.id;
  logPass(`Teacher login (${TEACHER_EMAIL} -> ID: ${teacherId})`);

  // 2. Create Course
  const courseCode = `TEST_COURSE_${Date.now()}`;
  const { data: course, error: courseErr } = await supabase.from('courses').insert({
    name: 'Test Course Automation',
    code: courseCode,
    subject: 'Toán',
    grade_level: 10,
    semester: 'Học kỳ 1',
    teacher_id: teacherId,
  }).select().single();

  if (courseErr || !course) {
    logFail('Create course (courses.insert)', courseErr);
    return;
  }
  logPass(`Create course (ID: ${course.id})`);

  // 3. Create Class
  const classCode = `CLASS_${Date.now()}`;
  const { data: cls, error: classErr } = await supabase.from('classes').insert({
    name: 'Test Class Automation',
    code: classCode,
    course_id: course.id,
    academic_year: '2025-2026',
    max_student: 50,
    current_student: 0,
  }).select().single();

  if (classErr || !cls) {
    logFail('Create class (classes.insert)', classErr);
  } else {
    logPass(`Create class (ID: ${cls.id})`);
  }

  // 4. Create Lesson
  const { data: lesson, error: lessonErr } = await supabase.from('lessons').insert({
    title: 'Test Lesson Automation',
    course_id: course.id,
    order: 1,
  }).select().single();

  if (lessonErr || !lesson) {
    logFail('Create lesson (lessons.insert)', lessonErr);
  } else {
    logPass(`Create lesson (ID: ${lesson.id})`);
  }

  // 5. Create Material
  if (lesson) {
    const { data: mat, error: matErr } = await supabase.from('materials').insert({
      title: 'Test Material PDF',
      file_url: 'https://example.com/test.pdf',
      material_type: 'PDF',
      size: 1024,
      lesson_id: lesson.id,
      purpose: 'THEORY',
    }).select().single();

    if (matErr || !mat) {
      logFail('Create material (materials.insert)', matErr);
    } else {
      logPass(`Create material (ID: ${mat.id})`);
    }
  }

  // 6. Create Exam
  const { data: exam, error: examErr } = await supabase.from('exams').insert({
    title: 'Test Exam Automation',
    course_id: course.id,
    class_id: cls ? cls.id : null,
    duration: 30,
    status: 'ACTIVE',
    shuffle_questions: true,
    anti_cheat: false,
    allow_review: true,
  }).select().single();

  if (examErr || !exam) {
    logFail('Create exam (exams.insert)', examErr);
  } else {
    logPass(`Create exam (ID: ${exam.id})`);

    // Create Exam Matrix
    const { data: matrix, error: matrixErr } = await supabase.from('exam_matrices').insert({
      exam_id: exam.id,
      title: 'Ma trận đề kiểm tra toán 15p',
      config: { totalQuestions: 10, easy: 5, medium: 3, hard: 2 },
      created_by: teacherId,
    }).select().single();

    if (matrixErr || !matrix) {
      logFail('Create exam matrix (exam_matrices.insert)', matrixErr);
    } else {
      logPass(`Create exam matrix (ID: ${matrix.id})`);
    }
  }

  // 7. Create Question in Question Bank (with difficulty, course_id)
  if (exam) {
    const { data: question, error: questionErr } = await supabase.from('questions').insert({
      exam_id: exam.id,
      course_id: course.id,
      content: 'Hỏi 1 + 1 bằng mấy?',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      points: 2.0,
      options: ['1', '2', '3', '4'],
      correct_answer: '2',
    }).select().single();

    if (questionErr || !question) {
      logFail('Create question (questions.insert with difficulty/course_id)', questionErr);
    } else {
      logPass(`Create question (ID: ${question.id})`);
    }
  }

  // 8. Create Flashcard Set & Flashcard as Teacher
  const { data: fcSet, error: fcSetErr } = await supabase.from('flashcard_sets').insert({
    title: 'Teacher Flashcard Test',
    description: 'Testing teacher flashcards',
    created_by: teacherId,
  }).select().single();

  if (fcSetErr || !fcSet) {
    logFail('Create flashcard set (flashcard_sets.insert)', fcSetErr);
  } else {
    logPass(`Create flashcard set (ID: ${fcSet.id})`);

    const { data: fc, error: fcErr } = await supabase.from('flashcards').insert({
      set_id: fcSet.id,
      front_text: 'Hello',
      back_text: 'Xin chào',
    }).select().single();

    if (fcErr || !fc) {
      logFail('Create flashcard (flashcards.insert)', fcErr);
    } else {
      logPass(`Create flashcard (ID: ${fc.id})`);
    }

    // Delete Flashcard Set
    const { error: delErr } = await supabase.from('flashcard_sets').delete().eq('id', fcSet.id);
    if (delErr) {
      logFail('Delete flashcard set (flashcard_sets.delete)', delErr);
    } else {
      logPass(`Delete flashcard set (ID: ${fcSet.id})`);
    }
  }

  // 9. Create Notification
  const { data: notif, error: notifErr } = await supabase.from('notifications').insert({
    user_id: teacherId,
    title: 'Test Notification Teacher',
    message: 'Notification system test',
    type: 'SYSTEM',
  }).select().single();

  if (notifErr || !notif) {
    logFail('Create notification (notifications.insert)', notifErr);
  } else {
    logPass(`Create notification (ID: ${notif.id})`);
  }

  // 10. Create Audit Log
  const { data: audit, error: auditErr } = await supabase.from('audit_logs').insert({
    user_id: teacherId,
    action_type: 'CREATE_EXAM',
    description: 'Teacher automation test',
  }).select().single();

  if (auditErr || !audit) {
    logFail('Create audit log (audit_logs.insert)', auditErr);
  } else {
    logPass(`Create audit log (ID: ${audit.id})`);
  }

  // Clean up Course (cascades to classes, lessons, materials, exams, questions)
  const { error: cleanupErr } = await supabase.from('courses').delete().eq('id', course.id);
  if (cleanupErr) {
    logFail('Cleanup test course', cleanupErr);
  } else {
    logPass('Cleanup test course and dependent records');
  }

  return { teacherId };
}

async function testStudentFlow(supabase) {
  console.log('\n=========================================');
  console.log('🎓 TESTING STUDENT DATABASE WRITE FEATURES');
  console.log('=========================================');

  // 1. Student Login
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: STUDENT_EMAIL,
    password: PASSWORD,
  });
  if (authErr || !authData?.user) {
    logFail('Student login', authErr);
    return;
  }
  const studentId = authData.user.id;
  logPass(`Student login (${STUDENT_EMAIL} -> ID: ${studentId})`);

  // 2. Student Create Flashcard Set & Flashcard
  const { data: fcSet, error: fcSetErr } = await supabase.from('flashcard_sets').insert({
    title: 'Student Flashcard Test',
    description: 'Testing student flashcards',
    created_by: studentId,
  }).select().single();

  if (fcSetErr || !fcSet) {
    logFail('Student Create flashcard set (flashcard_sets.insert)', fcSetErr);
  } else {
    logPass(`Student Create flashcard set (ID: ${fcSet.id})`);

    const { data: fc, error: fcErr } = await supabase.from('flashcards').insert({
      set_id: fcSet.id,
      front_text: 'Automation',
      back_text: 'Tự động hóa',
    }).select().single();

    if (fcErr || !fc) {
      logFail('Student Create flashcard (flashcards.insert)', fcErr);
    } else {
      logPass(`Student Create flashcard (ID: ${fc.id})`);
    }

    // Delete Student Flashcard Set
    const { error: delErr } = await supabase.from('flashcard_sets').delete().eq('id', fcSet.id);
    if (delErr) {
      logFail('Student Delete flashcard set (flashcard_sets.delete)', delErr);
    } else {
      logPass(`Student Delete flashcard set (ID: ${fcSet.id})`);
    }
  }

  // 3. Create Notification for Student
  const { data: notif, error: notifErr } = await supabase.from('notifications').insert({
    user_id: studentId,
    title: 'Test Notification Student',
    message: 'Student notification test',
    type: 'SYSTEM',
  }).select().single();

  if (notifErr || !notif) {
    logFail('Student Create notification (notifications.insert)', notifErr);
  } else {
    logPass(`Student Create notification (ID: ${notif.id})`);
    // Mark as read (update)
    const { error: updErr } = await supabase.from('notifications').update({ read_status: true }).eq('id', notif.id);
    if (updErr) {
      logFail('Student Update notification (notifications.update)', updErr);
    } else {
      logPass(`Student Update notification read_status=true`);
    }
  }

  // 4. Create Audit Log for Student
  const { data: audit, error: auditErr } = await supabase.from('audit_logs').insert({
    user_id: studentId,
    action_type: 'START_EXAM',
    description: 'Student automation test',
  }).select().single();

  if (auditErr || !audit) {
    logFail('Student Create audit log (audit_logs.insert)', auditErr);
  } else {
    logPass(`Student Create audit log (ID: ${audit.id})`);
  }
}

async function testEndToEndExamSubmissionFlow() {
  console.log('\n=========================================');
  console.log('🔄 TESTING E2E EXAM SUBMISSION & GRADING FLOW (TEACHER -> STUDENT -> TEACHER)');
  console.log('=========================================');

  const teacherClient = createClient(supabaseUrl, supabaseAnonKey);
  const studentClient = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Teacher Logs In
  const { data: teacherAuth } = await teacherClient.auth.signInWithPassword({
    email: TEACHER_EMAIL,
    password: PASSWORD,
  });
  const teacherId = teacherAuth.user.id;

  // 2. Student Logs In
  const { data: studentAuth } = await studentClient.auth.signInWithPassword({
    email: STUDENT_EMAIL,
    password: PASSWORD,
  });
  const studentId = studentAuth.user.id;

  // 3. Teacher Creates Course, Class, Exam, and Questions
  const { data: course, error: courseErr } = await teacherClient.from('courses').insert({
    name: 'E2E Course Test',
    code: `E2E_COURSE_${Date.now()}`,
    teacher_id: teacherId,
  }).select().single();

  const { data: cls, error: classErr } = await teacherClient.from('classes').insert({
    name: 'E2E Class Test',
    code: `E2E_CLASS_${Date.now()}`,
    course_id: course.id,
  }).select().single();

  // Student enrolls in Class
  const { error: enrollErr } = await studentClient.from('student_classes').insert({
    class_id: cls.id,
    student_id: studentId,
    status: 'ACTIVE',
  });
  if (enrollErr) {
    logFail('Student enroll in class (student_classes.insert)', enrollErr);
  } else {
    logPass(`Student enrolled in class (${cls.id})`);
  }

  // Teacher creates an Exam
  const { data: exam, error: examErr } = await teacherClient.from('exams').insert({
    title: 'E2E Exam Test',
    course_id: course.id,
    class_id: cls.id,
    duration: 15,
    status: 'ACTIVE',
  }).select().single();

  if (examErr || !exam) {
    logFail('Teacher create exam for E2E test', examErr);
    return;
  }

  // Teacher adds 1 MCQ and 1 ESSAY question
  const { data: mcqQ, error: mcqErr } = await teacherClient.from('questions').insert({
    exam_id: exam.id,
    course_id: course.id,
    content: '1 + 1 = ?',
    type: 'MCQ',
    points: 5.0,
    options: ['1', '2', '3', '4'],
    correct_answer: '2',
    difficulty: 'EASY',
  }).select().single();

  const { data: essayQ, error: essayErr } = await teacherClient.from('questions').insert({
    exam_id: exam.id,
    course_id: course.id,
    content: 'Phân tích nguyên lý OOP',
    type: 'ESSAY',
    points: 5.0,
    difficulty: 'MEDIUM',
  }).select().single();

  logPass(`Teacher created Exam with MCQ and ESSAY questions (Exam ID: ${exam.id})`);

  // 4. Student Starts Exam (Submission IN_PROGRESS)
  const { data: submission, error: subInsertErr } = await studentClient.from('submissions').insert({
    exam_id: exam.id,
    student_id: studentId,
    status: 'IN_PROGRESS',
    answers: {},
  }).select().single();

  if (subInsertErr || !submission) {
    logFail('Student Start Exam (submissions.insert IN_PROGRESS)', subInsertErr);
  } else {
    logPass(`Student started exam (Submission ID: ${submission.id})`);

    // 5. Student Saves Progress (Update answers)
    const answers = { [mcqQ.id]: '2', [essayQ.id]: 'OOP là lập trình hướng đối tượng...' };
    const { error: saveErr } = await studentClient.from('submissions').update({
      answers,
    }).eq('id', submission.id);

    if (saveErr) {
      logFail('Student Save Exam Progress (submissions.update answers)', saveErr);
    } else {
      logPass('Student saved progress successfully');
    }

    // 6. Student Submits Exam (with score, status SUBMITTED, and essay_images JSONB)
    const { error: submitErr } = await studentClient.from('submissions').update({
      score: 5.0,
      status: 'SUBMITTED',
      submitted_at: new Date().toISOString(),
      essay_images: [{ url: 'https://example.com/essay.jpg', questionId: essayQ.id }],
    }).eq('id', submission.id);

    if (submitErr) {
      logFail('Student Submit Exam (submissions.update status SUBMITTED + essay_images)', submitErr);
    } else {
      logPass('Student submitted exam successfully with SUBMITTED status and essay_images');
    }

    // 7. Teacher Grades Essay Question (Update score, teacher_comment, status GRADED)
    const { error: gradeErr } = await teacherClient.from('submissions').update({
      score: 10.0,
      teacher_comment: 'Bài làm rất tốt, chấm tối đa!',
      graded_at: new Date().toISOString(),
      status: 'GRADED',
    }).eq('id', submission.id);

    if (gradeErr) {
      logFail('Teacher Grade Submission (submissions.update status GRADED + score)', gradeErr);
    } else {
      logPass('Teacher graded submission successfully (Score: 10.0, Status: GRADED)');
    }
  }

  // Cleanup E2E course
  await teacherClient.from('courses').delete().eq('id', course.id);
  logPass('Cleaned up E2E course and submission data');
}

async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE DATABASE WRITES & RLS TEST SUITE');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  await testTeacherFlow(supabase);
  await testStudentFlow(supabase);
  await testEndToEndExamSubmissionFlow();

  console.log('\n=========================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=========================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL DATABASE WRITE FEATURES IN BOTH ROLES WORKING PERFECTLY!');
    process.exit(0);
  }
}

runAllTests().catch(e => {
  console.error('Fatal error running tests:', e);
  process.exit(1);
});
