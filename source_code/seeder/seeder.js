import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ================= CONFIG =================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// ================= CONFLICT MAP =================
const TABLE_CONFLICT = {
  courses: 'code',
  classes: 'code',
  student_classes: 'class_id,student_id',
  submissions: 'exam_id,student_id',
  exams: 'id'
};

// ================= RETRY =================
async function retry(fn, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

// ================= SAFE WRAPPER =================
async function safe(label, fn) {
  try {
    return await retry(fn);
  } catch (e) {
    console.log(`❌ ${label}:`, e.message);
    return null;
  }
}

// ================= UPSERT SAFE =================
async function upsertSafe(table, data) {
  const conflict = TABLE_CONFLICT[table] || 'id';

  return await retry(async () => {
    const { data: result, error } = await supabase
      .from(table)
      .upsert(data, { onConflict: conflict })
      .select();

    if (error) throw error;
    return result;
  });
}

// ================= BATCH UPSERT =================
async function batchUpsert(table, rows) {
  if (!rows.length) return;

  const conflict = TABLE_CONFLICT[table] || 'id';

  return await retry(async () => {
    const { error } = await supabase
      .from(table)
      .upsert(rows, { onConflict: conflict });

    if (error) throw error;
  });
}

// ================= NAME GENERATOR =================
const HO = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan'];
const TEN = ['Minh', 'Tuan', 'Hung', 'Dung', 'Long', 'Khai', 'Quan', 'Khoa', 'Duc', 'Bao'];
const DEM = ['Van', 'Duc', 'Cong', 'Quoc', 'Huu', 'Trung'];

const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rng(0, arr.length - 1)];

const genName = () => `${pick(HO)} ${pick(DEM)} ${pick(TEN)}`;

const normalize = str =>
  str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '');

const genEmail = (name, suffix) =>
  normalize(name).replace(/\s+/g, '.') + `.${suffix}@dhdedu.edu.vn`;

// ================= USER =================
async function syncProfile(id, email, full_name, role) {
  await safe(`syncProfile ${email}`, async () => {
    const finalRole = role || meta?.role || 'STUDENT';
    const { error } = await supabase.from('users').upsert({
      id,
      email,
      full_name,
      role: finalRole
    }, {
      onConflict: 'id'
    });

    if (error) throw error;
  });
}

async function createUserSafe({ email, password, meta, role }) {
  return await safe(`createUser ${email}`, async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: meta
    });

    if (error) {
      if (error.message?.includes('already')) {
        const { data: list } = await supabase.auth.admin.listUsers();
        const found = list.users.find(u => u.email === email);
        if (!found) return null;

        await syncProfile(found.id, email, meta.full_name, role);
        return found;
      }
      throw error;
    }

    await syncProfile(data.user.id, email, meta.full_name, role);
    return data.user;
  });
}

// ================= MAIN =================
async function seed() {
  console.log('\n🚀 START SEEDING (PRODUCTION SAFE)\n');

  // ===== TEACHERS =====
  const teachers = [];

  for (let i = 1; i <= 5; i++) {
    const name = genName();

    const u = await createUserSafe({
      email: genEmail(name, `gv${i}`),
      password: '123456',
      meta: { full_name: name, is_teacher: true },
      role: 'TEACHER'
    });

    if (u) teachers.push(u.id);
  }

  console.log('👨‍🏫 Teachers:', teachers.length);

  // ===== STUDENTS =====
  const students = [];

  for (let i = 1; i <= 30; i++) {
    const name = genName();

    const u = await createUserSafe({
      email: genEmail(name, `sv${i}`),
      password: '123456',
      meta: { full_name: name },
      role: 'STUDENT'
    });

    if (u) students.push(u.id);
  }

  console.log('🎓 Students:', students.length);

  if (!teachers.length || !students.length) {
    console.log('❌ STOP: missing users');
    return;
  }

  // ===== COURSES =====
  const courses = [];

  for (let i = 0; i < teachers.length; i++) {
    const data = await upsertSafe('courses', {
      teacher_id: teachers[i],
      code: `C${i + 1}`,
      name: `Khóa học ${i + 1}`,
      grade_level: rng(6, 12),
      subject: 'Toán'
    });

    if (data) courses.push(data[0]);
  }

  console.log('📚 Courses:', courses.length);

  // ===== CLASSES =====
  const classes = [];

  for (let i = 0; i < courses.length; i++) {
    const data = await upsertSafe('classes', {
      course_id: courses[i].id,
      name: `Lớp ${i + 1}`,
      code: `L${i + 1}`,
      academic_year: '2024-2025'
    });

    if (data) classes.push(data[0]);
  }

  console.log('🏫 Classes:', classes.length);

  // ===== ENROLLMENT (BATCH) =====
  for (const cls of classes) {
    const list = [...students]
      .sort(() => 0.5 - Math.random())
      .slice(0, rng(10, 20));

    const rows = list.map(student_id => ({
      class_id: cls.id,
      student_id
    }));

    await safe('enroll batch', async () =>
      batchUpsert('student_classes', rows)
    );
  }

  console.log('📋 Enrollment done');

  // ===== EXAMS =====
  const exams = [];

  for (const cls of classes) {
    const data = await upsertSafe('exams', {
      course_id: cls.course_id,
      class_id: cls.id,
      title: 'Kiểm tra 1',
      duration: 60
    });

    if (data) exams.push(data[0]);
  }

  console.log('📝 Exams:', exams.length);

  // ===== SUBMISSIONS (BATCH) =====
  for (const exam of exams) {
    const { data: enrolled } = await supabase
      .from('student_classes')
      .select('student_id')
      .eq('class_id', exam.class_id);

    if (!enrolled) continue;

    const rows = enrolled.map(e => {
      const roll = Math.random();

      return {
        exam_id: exam.id,
        student_id: e.student_id,
        status: roll > 0.3 ? 'SUBMITTED' : 'NOT_STARTED',
        score: roll > 0.3 ? (rng(50, 100) / 10).toFixed(1) : null
      };
    });

    await safe('submission batch', async () =>
      batchUpsert('submissions', rows)
    );
  }

  console.log('\n✅ SEED COMPLETE (IDEMPOTENT + PRODUCTION READY)');
}

seed();