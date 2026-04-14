-- 01_initial_schema.sql (Bản cập nhật DHDedu - Thống nhất Role TEACHER)

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE 
            WHEN (NEW.raw_user_meta_data->>'is_teacher')::boolean = true THEN 'TEACHER'::user_role -- Đổi LECTURER thành TEACHER
            ELSE 'STUDENT'::user_role
        END
    );
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