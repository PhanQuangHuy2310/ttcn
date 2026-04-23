import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ===== CONFIG =====
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ===== UTILS =====
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan'];
const TEN = ['Minh', 'Tuấn', 'Hùng', 'Dũng', 'Long', 'Khải', 'Quân', 'Khoa', 'Đức', 'Bảo'];
const DEM = ['Văn', 'Đức', 'Công', 'Quốc', 'Hữu', 'Trung'];

const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rng(0, arr.length - 1)];

const genName = () => `${pick(HO)} ${pick(DEM)} ${pick(TEN)}`;

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function genEmail(name, suffix) {
  const clean = removeVietnameseTones(name)
    .toLowerCase()
    .replace(/\s+/g, '.');

  return `${clean}.${suffix}@dhdedu.edu.vn`;
}

const pickN = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

// ===== SAFE WRAPPERS =====
async function safeCreateUser(payload) {
  try {
    const { data, error } = await supabase.auth.admin.createUser(payload);

    if (error) {
      if (error.message?.includes('already')) return null;
      console.error('❌ createUser:', payload.email, error.message);
      return null;
    }

    return data?.user || null;
  } catch (e) {
    console.error('❌ createUser crash:', e.message);
    return null;
  }
}

async function safeInsert(table, row) {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(row)
      .select()
      .single();

    if (error || !data) {
      console.error(`❌ insert ${table}:`, error?.message);
      return null;
    }

    return data;
  } catch (e) {
    console.error(`❌ insert ${table} crash:`, e.message);
    return null;
  }
}

// ===== MAIN =====
async function seed() {
  console.log('🚀 START SEEDING (NO CRASH)...');

  // ===== ADMIN =====
  await safeCreateUser({
    email: 'admin@dhdedu.edu.vn',
    password: 'Admin@123456',
    email_confirm: true,
    user_metadata: { full_name: 'Admin', is_teacher: false }
  });

  // ===== TEACHERS =====
  const teachers = [];
  for (let i = 1; i <= 5; i++) {
    const name = genName();

    const user = await safeCreateUser({
      email: genEmail(name, 'gv' + i),
      password: '123456',
      email_confirm: true,
      user_metadata: { full_name: name, is_teacher: true }
    });

    if (user) teachers.push(user.id);
  }

  console.log('👨‍🏫 Teachers:', teachers.length);

  // ===== STUDENTS =====
  const students = [];
  for (let i = 1; i <= 30; i++) {
    const name = genName();

    const user = await safeCreateUser({
      email: genEmail(name, 'sv' + i),
      password: '123456',
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (user) students.push(user.id);
  }

  console.log('🎓 Students:', students.length);

  // ===== COURSES =====
  const courses = [];
  for (let i = 0; i < teachers.length; i++) {
    const course = await safeInsert('courses', {
      teacher_id: teachers[i],
      code: `C${i + 1}`,
      name: `Khóa học ${i + 1}`,
      grade_level: rng(6, 12),
      subject: 'Toán'
    });

    if (course) courses.push(course);
  }

  console.log('📚 Courses:', courses.length);

  // ===== CLASSES =====
  const classes = [];
  for (let i = 0; i < courses.length; i++) {
    const cls = await safeInsert('classes', {
      course_id: courses[i].id,
      name: `Lớp ${i + 1}`,
      code: `L${i + 1}`,
      academic_year: '2024-2025'
    });

    if (cls) classes.push(cls);
  }

  console.log('🏫 Classes:', classes.length);

  // ===== ENROLL =====
  for (const cls of classes) {
    const list = pickN(students, rng(10, 20));

    for (const sid of list) {
      await safeInsert('student_classes', {
        class_id: cls.id,
        student_id: sid
      });
    }
  }

  console.log('📋 Enrollment done');

  // ===== EXAMS =====
  const exams = [];
  for (const cls of classes) {
    const exam = await safeInsert('exams', {
      course_id: cls.course_id,
      class_id: cls.id,
      title: 'Kiểm tra 1',
      duration: 60
    });

    if (exam) exams.push(exam);
  }

  console.log('📝 Exams:', exams.length);

  // ===== SUBMISSIONS =====
  for (const exam of exams) {
    const { data, error } = await supabase
      .from('student_classes')
      .select('student_id')
      .eq('class_id', exam.class_id);

    if (error || !data) {
      console.error('❌ fetch enroll:', error?.message);
      continue;
    }

    for (const e of data) {
      const roll = Math.random();

      let status = 'NOT_STARTED';
      let score = null;

      if (roll > 0.3) {
        status = 'SUBMITTED';
        score = (rng(50, 100) / 10).toFixed(1);
      }

      await safeInsert('submissions', {
        exam_id: exam.id,
        student_id: e.student_id,
        status,
        score
      });
    }
  }

  console.log('✅ DONE SEEDING (SAFE)');
}

seed();