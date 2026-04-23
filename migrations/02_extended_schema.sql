-- ============================================================
-- DHDedu – 02_extended_schema.sql
-- Extends the initial schema with submissions, audit_logs,
-- flashcards, and additional indexes + RLS policies.
-- Run AFTER 01_initial_schema.sql
-- ============================================================

-- ─── ENUMS ───────────────────────────────────────────────────

CREATE TYPE submission_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED');
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

CREATE TABLE public.submissions (
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

-- ─── AUDIT LOGS ──────────────────────────────────────────────

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
