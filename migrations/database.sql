\-- 01_initial_schema.sql (Bản cập nhật DHDedu - Thống nhất Role TEACHER)

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Enums (Đã đổi LECTURER thành TEACHER)
CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE material_type AS ENUM ('PDF', 'VIDEO', 'AUDIO', 'SCORM');
CREATE TYPE question_type AS ENUM ('MCQ', 'ESSAY');

-- 1. Users table (Profile)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'STUDENT',
    full_name TEXT,
    email TEXT UNIQUE,
    student_id TEXT,
    teacher_code TEXT, -- Đổi từ lecturer_code thành teacher_code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 

-- Trigger to create user profile on signup (Cập nhật logic check teacher)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, teacher_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'is_teacher')::boolean THEN 'TEACHER'
      ELSE 'STUDENT'
    END,
    CASE 
      WHEN (NEW.raw_user_meta_data->>'is_teacher')::boolean 
      THEN NEW.raw_user_meta_data->>'teacher_code'
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Courses (Hỗ trợ lớp 1-12)
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users(id), -- Đồng bộ với Course.java
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    syllabus TEXT, -- Chuyển sang TEXT để khớp Backend
    grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12), -- Lớp 1-12
    subject TEXT, -- Toán, Lý, Hóa...
    semester TEXT,
    thumbnail_url TEXT, -- Link ảnh bìa khóa học từ Cloudinary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Lessons
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    video_url TEXT, -- Bổ sung link video bài giảng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Materials (Lưu link Cloudinary)
CREATE TABLE public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Link lưu từ Cloudinary (PDF, Video...)
    material_type material_type NOT NULL, -- Đổi tên cột type thành material_type để tránh lỗi syntax
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Classes
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    max_student INTEGER DEFAULT 40,
    academic_year TEXT
);

-- 6. Student Classes
CREATE TABLE public.student_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 7. Exams
CREATE TABLE public.exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in minutes
    password TEXT,
    shuffle_questions BOOLEAN DEFAULT true,
    anti_cheat BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Questions
CREATE TABLE public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type question_type NOT NULL,
    points DECIMAL(5,2) DEFAULT 1.0,
    options JSONB, -- For MCQ: [{"id": 1, "text": "..."}, ...]
    correct_answer TEXT, -- Index or text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Exam Results
CREATE TABLE public.exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id),
    score DECIMAL(5,2),
    time_spent INTEGER, -- in seconds
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Essay Answers (Cập nhật teacher)
CREATE TABLE public.essay_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_result_id UUID REFERENCES public.exam_results(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    teacher_note TEXT, -- Đổi từ lecturer_note
    teacher_score DECIMAL(5,2) -- Đổi từ lecturer_score
);

-- 11. Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHỈ MỤC TỐI ƯU TRUY VẤN
CREATE INDEX idx_courses_grade ON public.courses(grade_level);
CREATE INDEX idx_courses_subject ON public.courses(subject);

-- RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage own courses" ON public.courses FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Students can view enrolled courses" ON public.courses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.student_classes sc
        JOIN public.classes cl ON cl.id = sc.class_id
        WHERE cl.course_id = public.courses.id AND sc.student_id = auth.uid()
    )
);

-- ============================================================
-- DHDedu – 02_extended_schema.sql
-- Extends the initial schema with submissions, audit_logs,
-- flashcards, and additional indexes + RLS policies.
-- Run AFTER 01_initial_schema.sql
-- ============================================================

-- ─── ENUMS ───────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TYPE audit_action     AS ENUM (
  'LOGIN', 'LOGOUT',
  'CREATE_EXAM', 'UPDATE_EXAM', 'DELETE_EXAM',
  'START_EXAM', 'SUBMIT_EXAM',
  'GRADE_SUBMISSION',
  'CREATE_CLASS', 'UPDATE_CLASS',
  'ENROLL_STUDENT', 'REMOVE_STUDENT',
  'CREATE_QUESTION', 'DELETE_QUESTION',
  'UPLOAD_MATERIAL', 'DELETE_MATERIAL',
  'CREATE_USER', 'UPDATE_USER', 'DELETE_USER',
  'SYSTEM_SETTING_CHANGE'
);
CREATE TYPE entity_type AS ENUM (
  'user', 'exam', 'submission', 'class', 'course',
  'question', 'material', 'lesson', 'system'
);

-- ─── SUBMISSIONS ─────────────────────────────────────────────

 CREATE TABLE IF NOT EXISTS public.submissions (
  id            UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id       UUID  NOT NULL REFERENCES public.exams(id)  ON DELETE CASCADE,
  student_id    UUID  NOT NULL REFERENCES public.users(id)  ON DELETE CASCADE,
  status        submission_status NOT NULL DEFAULT 'NOT_STARTED',
  score         DECIMAL(5,2),
  answers       JSONB,            -- { question_id: answer_text }
  started_at    TIMESTAMP WITH TIME ZONE,
  submitted_at  TIMESTAMP WITH TIME ZONE,
  time_spent    INTEGER,          -- seconds
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_submissions_exam    ON public.submissions(exam_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);
CREATE INDEX idx_submissions_status  ON public.submissions(status);

-- ─── AUDIT LOGSCREATE TABLE ──────────────────────────────────────────────

CREATE TABLE public.audit_logs (
  id           UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID  REFERENCES public.users(id) ON DELETE SET NULL,
  role         user_role,
  action_type  audit_action  NOT NULL,
  entity_type  entity_type,
  entity_id    UUID,
  description  TEXT,
  metadata     JSONB,
  ip_address   INET,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user    ON public.audit_logs(user_id);
CREATE INDEX idx_audit_action  ON public.audit_logs(action_type);
CREATE INDEX idx_audit_entity  ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

-- ─── FLASHCARDS ──────────────────────────────────────────────

CREATE TABLE public.flashcard_sets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_by  UUID REFERENCES public.users(id)   ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.flashcards (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id     UUID NOT NULL REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text  TEXT NOT NULL,
  image_url  TEXT,
  "order"    INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── SYSTEM SETTINGS ─────────────────────────────────────────

CREATE TABLE public.system_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_by  UUID REFERENCES public.users(id),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.system_settings (key, value, description) VALUES
  ('site_name',           '"DHDedu"',         'Tên hệ thống'),
  ('max_exam_duration',   '180',               'Thời gian thi tối đa (phút)'),
  ('allow_registration',  'true',              'Cho phép tự đăng ký'),
  ('maintenance_mode',    'false',             'Chế độ bảo trì'),
  ('max_students_class',  '50',                'Số sinh viên tối đa mỗi lớp');

-- ─── EXAM MATRIX (MA TRẬN ĐỀ THI) ────────────────────────────

CREATE TABLE public.exam_matrices (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id      UUID REFERENCES public.exams(id)  ON DELETE CASCADE,
  created_by   UUID REFERENCES public.users(id)  ON DELETE SET NULL,
  title        TEXT NOT NULL,
  config       JSONB,   -- { chapters: [{id, name, easy, medium, hard}] }
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── NOTIFICATIONS EXTENDED ──────────────────────────────────

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS sender_id  UUID REFERENCES public.users(id);

-- ─── HELPER: LOG ACTION FUNCTION ─────────────────────────────

CREATE OR REPLACE FUNCTION public.log_action(
  p_user_id     UUID,
  p_role        user_role,
  p_action      audit_action,
  p_entity_type entity_type,
  p_entity_id   UUID,
  p_description TEXT,
  p_metadata    JSONB DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_logs
    (user_id, role, action_type, entity_type, entity_id, description, metadata)
  VALUES
    (p_user_id, p_role, p_action, p_entity_type, p_entity_id, p_description, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── TRIGGER: AUTO-LOG SUBMISSION STATUS CHANGES ─────────────

CREATE OR REPLACE FUNCTION public.trg_log_submission_change()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = NEW.student_id;

  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status = 'IN_PROGRESS' THEN
      PERFORM public.log_action(
        NEW.student_id, v_role, 'START_EXAM'::audit_action,
        'submission'::entity_type, NEW.id,
        'Sinh viên bắt đầu làm bài thi',
        jsonb_build_object('exam_id', NEW.exam_id)
      );
    ELSIF NEW.status = 'SUBMITTED' THEN
      PERFORM public.log_action(
        NEW.student_id, v_role, 'SUBMIT_EXAM'::audit_action,
        'submission'::entity_type, NEW.id,
        'Sinh viên nộp bài thi',
        jsonb_build_object('exam_id', NEW.exam_id, 'score', NEW.score)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_submission_status
  AFTER INSERT OR UPDATE ON public.submissions
  FOR EACH ROW EXECUTE PROCEDURE public.trg_log_submission_change();

-- ─── TRIGGER: AUTO-LOG EXAM CREATION ─────────────────────────

CREATE OR REPLACE FUNCTION public.trg_log_exam_change()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role
  FROM public.users
  WHERE id = (
    SELECT teacher_id FROM public.courses WHERE id = NEW.course_id
  );

  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_action(
      (SELECT teacher_id FROM public.courses WHERE id = NEW.course_id),
      v_role,
      'CREATE_EXAM'::audit_action,
      'exam'::entity_type,
      NEW.id,
      'Tạo kỳ thi mới: ' || NEW.title,
      jsonb_build_object('course_id', NEW.course_id, 'class_id', NEW.class_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_exam_created
  AFTER INSERT ON public.exams
  FOR EACH ROW EXECUTE PROCEDURE public.trg_log_exam_change();

-- ─── RLS POLICIES ────────────────────────────────────────────

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = student_id);
CREATE POLICY "Teachers see class submissions"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.id = public.submissions.exam_id
        AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Students update own submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = student_id);
CREATE POLICY "Students insert own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view all logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
  );
CREATE POLICY "Teachers view own logs"
  ON public.audit_logs FOR SELECT
  USING (user_id = auth.uid());

ALTER TABLE public.flashcards      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_sets  ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone enrolled can view flashcards"
  ON public.flashcard_sets FOR SELECT USING (true);
CREATE POLICY "Creators manage their sets"
  ON public.flashcard_sets FOR ALL USING (created_by = auth.uid());

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings"
  ON public.system_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Additional policies for existing tables
ALTER TABLE public.exams       ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own exams"
  ON public.exams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = public.exams.course_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Students see enrolled exams"
  ON public.exams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.student_classes sc
      JOIN public.classes cl ON cl.id = sc.class_id
      WHERE cl.id = public.exams.class_id AND sc.student_id = auth.uid()
    )
  );

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage questions on own exams"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.id = public.questions.exam_id AND c.teacher_id = auth.uid()
    )
  );
CREATE POLICY "Students see questions on active exams"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams e
      JOIN public.student_classes sc ON sc.class_id = e.class_id
      WHERE e.id = public.questions.exam_id AND sc.student_id = auth.uid()
    )
  );

ALTER TABLE public.classes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_classes  ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own classes"
  ON public.classes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = public.classes.course_id AND c.teacher_id = auth.uid())
  );
CREATE POLICY "Students see enrolled classes"
  ON public.classes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.student_classes sc WHERE sc.class_id = public.classes.id AND sc.student_id = auth.uid())
  );
CREATE POLICY "Admins see all classes"
  ON public.classes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Students see own enrollments"
  ON public.student_classes FOR SELECT
  USING (student_id = auth.uid());
CREATE POLICY "Teachers see class enrollments"
  ON public.student_classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes cl
      JOIN public.courses c ON c.id = cl.course_id
      WHERE cl.id = public.student_classes.class_id AND c.teacher_id = auth.uid()
    )
  );

-- Admins bypass all RLS
CREATE POLICY "Admins full access users"      ON public.users             FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Admins full access submissions" ON public.submissions       FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Admins full access exams"       ON public.exams             FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Admins full access classes"     ON public.classes           FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'));

GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO service_role;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "admin full access"
ON public.users
FOR ALL
USING (
  auth.jwt()->>'email' = 'admin@dhdedu.edu.vn'
)
WITH CHECK (
  auth.jwt()->>'email' = 'admin@dhdedu.edu.vn'
);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO authenticated;

GRANT SELECT
ON ALL TABLES IN SCHEMA public
TO anon;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO authenticated;

CREATE POLICY "Teachers manage own courses"
ON public.courses
FOR ALL
USING (teacher_id = auth.uid());

CREATE POLICY "Authenticated view courses"
ON public.courses
FOR SELECT
USING (true);
CREATE POLICY "Teacher own classes"
ON public.classes
FOR ALL
USING (true);
CREATE POLICY "Own enrollments"
ON public.student_classes
FOR SELECT
USING (student_id = auth.uid());

ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_classes DISABLE ROW LEVEL SECURITY;

CREATE TYPE exam_status AS ENUM (
  'DRAFT',
  'UPCOMING',
  'ACTIVE',
  'ENDED'
);

ALTER TABLE public.exams
ADD COLUMN status exam_status DEFAULT 'UPCOMING';

ALTER TABLE student_classes
DROP CONSTRAINT student_classes_student_id_fkey;

ALTER TABLE student_classes
ADD CONSTRAINT student_classes_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- =========================================================================================
-- BẢN CẬP NHẬT DATABASE HOÀN CHỈNH - DHDEDU (CHUẨN HÓA THEO PHÂN TÍCH HỆ THỐNG)
-- Chạy script này SAU KHI đã chạy bản 01_initial_schema.sql và 02_extended_schema.sql
-- =========================================================================================

-- -----------------------------------------------------------------------------------------
-- 1. TẠO CÁC ENUMS MỚI (CHẠY ĐỘC LẬP)
-- -----------------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE material_purpose AS ENUM ('THEORY', 'EXAM_SOURCE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE educational_level AS ENUM ('PRIMARY', 'SECONDARY', 'HIGH_SCHOOL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Thêm trạng thái GRADED (Đã chấm xong) vào enum submission_status hiện tại
ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'GRADED';


-- -----------------------------------------------------------------------------------------
-- 2. CẬP NHẬT CÁC BẢNG DỮ LIỆU (ALTER TABLES)
-- -----------------------------------------------------------------------------------------

-- 2.1. Bảng users: Thêm trạng thái tài khoản (Phục vụ chức năng Khóa tài khoản của Admin)
ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'ACTIVE';

-- 2.2. Bảng materials: Phục vụ tính năng kho học liệu và quét OCR
ALTER TABLE public.materials
    ADD COLUMN IF NOT EXISTS purpose material_purpose DEFAULT 'THEORY',
    ADD COLUMN IF NOT EXISTS educational_level educational_level,
    ADD COLUMN IF NOT EXISTS grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12);

-- 2.3. Bảng classes: Phục vụ quản lý sĩ số tự động
ALTER TABLE public.classes
    ADD COLUMN IF NOT EXISTS current_student INTEGER DEFAULT 0;

DO $$ BEGIN
    ALTER TABLE public.classes ADD CONSTRAINT check_max_student_positive CHECK (max_student > 0);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2.4. Bảng student_classes: Thêm trạng thái thành viên
ALTER TABLE public.student_classes
    ADD COLUMN IF NOT EXISTS status enrollment_status DEFAULT 'ACTIVE';

-- 2.5. Bảng questions: Chuẩn hóa kiến trúc Ngân hàng câu hỏi
ALTER TABLE public.questions
    ADD COLUMN IF NOT EXISTS source_material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- Gỡ bỏ ràng buộc NOT NULL của exam_id vì câu hỏi trong Ngân hàng chưa chắc đã thuộc kỳ thi nào
ALTER TABLE public.questions ALTER COLUMN exam_id DROP NOT NULL;


-- -----------------------------------------------------------------------------------------
-- 3. TẠO BẢNG TRUNG GIAN MỚI (DÀNH CHO NGÂN HÀNG CÂU HỎI VÀ KỲ THI)
-- -----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exam_questions (
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    question_order INTEGER,  -- Thứ tự câu hỏi trong đề thi
    points DECIMAL(5,2),     -- Điểm ghi đè riêng cho câu hỏi trong đề thi này
    PRIMARY KEY (exam_id, question_id)
);


-- -----------------------------------------------------------------------------------------
-- 4. CẬP NHẬT LOGIC TRIGGER & FUNCTIONS (QUẢN LÝ SĨ SỐ LỚP)
-- -----------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_and_update_class_capacity()
RETURNS TRIGGER AS $$
DECLARE
    v_max_student INTEGER;
    v_current_student INTEGER;
BEGIN
    -- Khi Học sinh ghi danh (INSERT)
    IF TG_OP = 'INSERT' THEN
        SELECT max_student, current_student INTO v_max_student, v_current_student
        FROM public.classes
        WHERE id = NEW.class_id
        FOR UPDATE; -- Khóa dòng để tránh lỗi Race Condition khi nhiều người cùng đăng ký

        IF v_current_student >= v_max_student THEN
            RAISE EXCEPTION 'Từ chối ghi danh: Lớp học đã đạt sĩ số tối đa (%).', v_max_student;
        END IF;

        UPDATE public.classes SET current_student = current_student + 1 WHERE id = NEW.class_id;
        RETURN NEW;
    END IF;

    -- Khi Học sinh rời lớp hoặc bị xóa (DELETE)
    IF TG_OP = 'DELETE' THEN
        UPDATE public.classes SET current_student = current_student - 1 WHERE id = OLD.class_id;
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_class_capacity ON public.student_classes;
CREATE TRIGGER trg_class_capacity
    BEFORE INSERT OR DELETE ON public.student_classes
    FOR EACH ROW EXECUTE PROCEDURE public.check_and_update_class_capacity();


-- -----------------------------------------------------------------------------------------
-- 5. CẬP NHẬT BẢO MẬT RLS (ROW LEVEL SECURITY)
-- -----------------------------------------------------------------------------------------
-- Bảo mật kho tài liệu: Học sinh chỉ thấy tài liệu LÝ THUYẾT của lớp đang theo học, 
-- KHÔNG được thấy tài liệu NGUỒN ĐỀ THI (OCR) của giáo viên.
DROP POLICY IF EXISTS "Students see materials of their classes" ON public.materials;

CREATE POLICY "Students see materials of their classes"
ON public.materials FOR SELECT
USING (
    purpose = 'THEORY' AND
    EXISTS (
        SELECT 1 FROM public.lessons l
        JOIN public.courses c ON c.id = l.course_id
        JOIN public.classes cl ON cl.course_id = c.id
        JOIN public.student_classes sc ON sc.class_id = cl.id
        WHERE l.id = public.materials.lesson_id 
        AND sc.student_id = auth.uid()
        AND sc.status = 'ACTIVE'
    )
);

-- Bật RLS cho bảng mới
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see exam questions of active exams"
ON public.exam_questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.exams e
        JOIN public.student_classes sc ON sc.class_id = e.class_id
        WHERE e.id = public.exam_questions.exam_id 
        AND sc.student_id = auth.uid()
        AND sc.status = 'ACTIVE'
    )
);

CREATE POLICY "Teachers manage exam questions"
ON public.exam_questions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.exams e
        JOIN public.courses c ON c.id = e.course_id
        WHERE e.id = public.exam_questions.exam_id 
        AND c.teacher_id = auth.uid()
    )
);


-- =========================================================================================
-- END OF SCRIPT
-- =========================================================================================
NOTIFY pgrst, 'reload schema';

-- submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS tab_switches INT DEFAULT 0;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS teacher_comment TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ;

-- exams
ALTER TABLE exams ADD COLUMN IF NOT EXISTS has_password BOOLEAN DEFAULT false;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT false;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS allow_review BOOLEAN DEFAULT true;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS pass_score NUMERIC DEFAULT 5;

-- users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'SYSTEM',
  read_status BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications REPLICA IDENTITY FULL;

