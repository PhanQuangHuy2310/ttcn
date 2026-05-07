// src/pages/Teacher/ClassManagement.jsx
// UPGRADED: Full course CRUD + Lesson builder (Phase 3.2)
// Keeps all existing class management, adds course creation modal + lesson tab

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import {
  Btn, IconBtn, Card, CardHeader, EmptyState, ErrorBanner, Sk,
  PageHeader, Modal, Input, Select, Textarea, ConfirmDialog,
  FilterTabs, fmtDate,
} from '../../components/ui';
import {
  coursesService, classesService, lessonsService,
  studentClassesService,
} from '../../services/supabaseService';

// ── Create Course Modal ───────────────────────────────────────
const CreateCourseModal = ({ open, onClose, onCreated, profile }) => {
  const [form, setForm]   = useState({ name: '', subject: '', semester: '', grade_level: '', code: '' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vui lòng nhập tên khóa học.'); return; }
    setSaving(true);
    const { data, error: err } = await coursesService.create({
      ...form,
      teacher_id: profile.id,
      code: form.code.trim() || `CRS-${Date.now().toString(36).toUpperCase()}`,
    });
    setSaving(false);
    if (err) { setError('Không thể tạo khóa học. Vui lòng thử lại.'); return; }
    onCreated?.(data);
    setForm({ name: '', subject: '', semester: '', grade_level: '', code: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo khóa học mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
        <Input label="Tên khóa học *" value={form.name} onChange={set('name')} placeholder="Toán Giải Tích 1" required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Môn học" value={form.subject} onChange={set('subject')} placeholder="Toán" />
          <Input label="Mã khóa học" value={form.code} onChange={set('code')} placeholder="MATH101" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Học kỳ" value={form.semester} onChange={set('semester')}>
            <option value="">— Chọn HK —</option>
            {['1', '2', '3', 'Hè'].map(s => <option key={s} value={s}>Học kỳ {s}</option>)}
          </Select>
          <Input label="Khối / Năm học" value={form.grade_level} onChange={set('grade_level')} placeholder="Năm 1" />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Btn variant="outline" type="button" onClick={onClose}>Huỷ</Btn>
          <Btn type="submit" loading={saving} icon="add">Tạo khóa học</Btn>
        </div>
      </form>
    </Modal>
  );
};

// ── Create Class Modal ────────────────────────────────────────
const CreateClassModal = ({ open, onClose, onCreated, courseId }) => {
  const [form, setForm] = useState({ name: '', code: '', academic_year: '', max_students: 50 });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vui lòng nhập tên lớp.'); return; }
    setSaving(true);
    const { data, error: err } = await classesService.create({
      ...form,
      course_id:   courseId,
      max_students: parseInt(form.max_students) || 50,
      code: form.code.trim() || `CLS-${Date.now().toString(36).toUpperCase()}`,
    });
    setSaving(false);
    if (err) { setError('Không thể tạo lớp học. Vui lòng thử lại.'); return; }
    onCreated?.(data);
    setForm({ name: '', code: '', academic_year: '', max_students: 50 });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo lớp học mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
        <Input label="Tên lớp *" value={form.name} onChange={set('name')} placeholder="Lớp Toán A1" required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Mã lớp (chia sẻ cho SV)" value={form.code} onChange={set('code')} placeholder="MATH-A1-2024" />
          <Input label="Sĩ số tối đa" type="number" min={1} max={500} value={form.max_students} onChange={set('max_students')} />
        </div>
        <Input label="Năm học" value={form.academic_year} onChange={set('academic_year')} placeholder="2024-2025" />
        <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
          Sinh viên dùng <strong>mã lớp</strong> để tham gia. Chia sẻ mã này với sinh viên.
        </p>
        <div className="flex gap-3 justify-end pt-2">
          <Btn variant="outline" type="button" onClick={onClose}>Huỷ</Btn>
          <Btn type="submit" loading={saving} icon="add">Tạo lớp</Btn>
        </div>
      </form>
    </Modal>
  );
};

// ── Lesson builder ────────────────────────────────────────────
const LessonBuilder = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form,    setForm]    = useState({ title: '', description: '', video_url: '', order_index: 1 });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    lessonsService.getByCourse(courseId).then(({ data, error: err }) => {
      if (err) setError('Không thể tải bài học.');
      else setLessons(data ?? []);
      setLoading(false);
    });
  }, [courseId]);

  const handleCreate = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const { data, error: err } = await lessonsService.create({
      ...form,
      course_id:   courseId,
      order_index: parseInt(form.order_index) || lessons.length + 1,
    });
    setSaving(false);
    if (!err && data) {
      setLessons(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      setForm({ title: '', description: '', video_url: '', order_index: lessons.length + 2 });
      setAddOpen(false);
    }
  };

  const handleDelete = async id => {
    const { error: err } = await lessonsService.delete(id);
    if (!err) setLessons(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-slate-700">{lessons.length} bài học</p>
        <Btn size="sm" icon="add" onClick={() => setAddOpen(true)}>Thêm bài học</Btn>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <Sk key={i} className="h-14 w-full" />)}</div>
      ) : lessons.length === 0 ? (
        <EmptyState icon="menu_book" title="Chưa có bài học nào" subtitle="Thêm bài học để xây dựng nội dung khóa học."
          action={<Btn size="sm" icon="add" onClick={() => setAddOpen(true)}>Thêm bài học đầu tiên</Btn>}
        />
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                {lesson.order_index ?? idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{lesson.title}</p>
                {lesson.video_url && (
                  <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-0.5">
                    <span className="material-symbols-outlined text-xs">play_circle</span>Video
                  </a>
                )}
              </div>
              <IconBtn
                icon="delete" label="Xóa bài học" variant="danger" size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(lesson.id)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Thêm bài học" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Tên bài học *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Bài 1: Giới thiệu" required />
          <Input label="Số thứ tự" type="number" min={1} value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: e.target.value }))} />
          <Textarea label="Mô tả" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Nội dung tóm tắt..." />
          <Input label="URL Video (YouTube/Drive)" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://..." />
          <div className="flex gap-3 justify-end">
            <Btn variant="outline" type="button" onClick={() => setAddOpen(false)}>Huỷ</Btn>
            <Btn type="submit" loading={saving} icon="add">Thêm bài học</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ── Course detail panel ───────────────────────────────────────
const CourseDetail = ({ course, onRefresh }) => {
  const [tab,        setTab]        = useState('classes');
  const [classes,    setClasses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [classModal, setClassModal] = useState(false);
  const [confirmId,  setConfirmId]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    if (!course?.id) return;
    setLoading(true);
    classesService.getByCourse(course.id).then(({ data }) => {
      setClasses(data ?? []);
      setLoading(false);
    });
  }, [course?.id]);

  const handleDeleteClass = async () => {
    setDeleting(true);
    const { error: err } = await classesService.delete(confirmId);
    if (!err) setClasses(prev => prev.filter(c => c.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
  };

  const removeStudent = async (studentId, classId) => {
    await studentClassesService.remove(studentId, classId);
    setClasses(prev => prev.map(c => c.id === classId
      ? { ...c, student_classes: (c.student_classes ?? []).filter(sc => sc.student_id !== studentId) }
      : c
    ));
  };

  const tabs = [
    { key: 'classes', label: 'Danh sách lớp', icon: 'groups' },
    { key: 'lessons', label: 'Bài học',        icon: 'menu_book' },
  ];

  return (
    <Card>
      {/* Course header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-lg font-black text-slate-800">{course.name}</h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
          <span>{course.subject ?? '—'}</span>
          <span>·</span>
          <span>HK {course.semester ?? '—'}</span>
          <span>·</span>
          <span>Khối {course.grade_level ?? '—'}</span>
          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{course.code}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Classes tab */}
        {tab === 'classes' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-bold text-slate-700">{classes.length} lớp học</p>
              <Btn size="sm" icon="add" onClick={() => setClassModal(true)}>Tạo lớp mới</Btn>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <Sk key={i} className="h-20 w-full" />)}</div>
            ) : classes.length === 0 ? (
              <EmptyState icon="groups" title="Chưa có lớp học" subtitle="Tạo lớp để sinh viên tham gia."
                action={<Btn size="sm" icon="add" onClick={() => setClassModal(true)}>Tạo lớp đầu tiên</Btn>}
              />
            ) : (
              <div className="space-y-4">
                {classes.map(cls => {
                  const students = cls.student_classes ?? [];
                  return (
                    <div key={cls.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                      {/* Class header */}
                      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-800">{cls.name}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span>Mã lớp: <span className="font-mono font-black text-slate-700">{cls.code}</span></span>
                            <span>{students.length} / {cls.max_students ?? '∞'} sinh viên</span>
                          </div>
                        </div>
                        <IconBtn icon="delete" label="Xóa lớp" variant="danger" size="sm" onClick={() => setConfirmId(cls.id)} />
                      </div>
                      {/* Student list */}
                      {students.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                          {students.map(sc => (
                            <div key={sc.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors group">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {(sc.users?.full_name ?? 'S').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{sc.users?.full_name ?? '—'}</p>
                                <p className="text-xs text-slate-400">{sc.users?.email ?? '—'}</p>
                              </div>
                              <IconBtn
                                icon="person_remove" label="Xóa khỏi lớp" variant="danger" size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeStudent(sc.student_id, cls.id)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-4 text-center text-xs text-slate-400">
                          Chưa có sinh viên. Chia sẻ mã lớp <span className="font-mono font-black text-slate-600">{cls.code}</span> với sinh viên.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Lessons tab */}
        {tab === 'lessons' && <LessonBuilder courseId={course.id} />}
      </div>

      <CreateClassModal
        open={classModal}
        onClose={() => setClassModal(false)}
        onCreated={c => setClasses(prev => [...prev, { ...c, student_classes: [] }])}
        courseId={course.id}
      />

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeleteClass}
        loading={deleting}
        title="Xóa lớp học"
        message="Xóa lớp học này? Tất cả sinh viên trong lớp sẽ bị hủy ghi danh."
        confirmLabel="Xóa lớp"
      />
    </Card>
  );
};

// ── Main page ─────────────────────────────────────────────────
const ClassManagement = () => {
  const profile   = useSelector(selectProfile);
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get('id');

  const [courses,      setCourses]      = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [createCourse, setCreateCourse] = useState(false);
  const [confirmId,    setConfirmId]    = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data, error: err } = await coursesService.getByTeacher(profile.id);
    if (err) setError('Không thể tải danh sách khóa học.');
    else {
      setCourses(data ?? []);
      if (preselect) setSelected((data ?? []).find(c => c.id === preselect) ?? data?.[0] ?? null);
      else if (!selected && data?.length) setSelected(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  const handleDeleteCourse = async () => {
    setDeleting(true);
    const { error: err } = await coursesService.delete(confirmId);
    if (!err) {
      setCourses(prev => prev.filter(c => c.id !== confirmId));
      if (selected?.id === confirmId) setSelected(null);
    } else setError('Không thể xóa khóa học.');
    setDeleting(false);
    setConfirmId(null);
  };

  const totalClasses   = courses.reduce((a, c) => a + (c.classes ?? []).length, 0);
  const totalStudents  = courses.reduce((a, c) =>
    a + (c.classes ?? []).reduce((a2, cl) => a2 + (cl.student_classes?.length ?? 0), 0), 0);

  return (
    <AppLayout role="TEACHER">
      <PageHeader
        title="Quản lý lớp học"
        subtitle={`${courses.length} khóa học · ${totalClasses} lớp · ${totalStudents} sinh viên`}
        actions={<Btn icon="add" onClick={() => setCreateCourse(true)}>Tạo khóa học</Btn>}
      />

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="grid grid-cols-12 gap-6">
        {/* Left: course list */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardHeader title="Khóa học của tôi" />
            {loading ? (
              <div className="p-4 space-y-2">{[1,2,3].map(i => <Sk key={i} className="h-16 w-full" />)}</div>
            ) : courses.length === 0 ? (
              <EmptyState icon="school" title="Chưa có khóa học"
                action={<Btn size="sm" icon="add" onClick={() => setCreateCourse(true)}>Tạo ngay</Btn>}
              />
            ) : (
              <div className="divide-y divide-slate-50">
                {courses.map(course => {
                  const isActive = selected?.id === course.id;
                  const clsCnt   = (course.classes ?? []).length;
                  const stuCnt   = (course.classes ?? []).reduce((a, cl) => a + (cl.student_classes?.length ?? 0), 0);
                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelected(course)}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-all duration-150 group ${
                        isActive ? 'bg-primary/5 border-r-2 border-primary' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-primary/10' : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}>
                        <span className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : 'text-slate-400'}`}>school</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-slate-800'}`}>{course.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{clsCnt} lớp · {stuCnt} sinh viên</p>
                      </div>
                      <IconBtn
                        icon="delete" label="Xóa" variant="danger" size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={e => { e.stopPropagation(); setConfirmId(course.id); }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: detail */}
        <div className="col-span-12 md:col-span-8">
          {!selected ? (
            <Card>
              <EmptyState icon="arrow_back" title="Chọn khóa học" subtitle="Chọn một khóa học bên trái để xem chi tiết." />
            </Card>
          ) : (
            <CourseDetail course={selected} onRefresh={load} />
          )}
        </div>
      </div>

      <CreateCourseModal
        open={createCourse}
        onClose={() => setCreateCourse(false)}
        onCreated={c => { setCourses(prev => [{ ...c, classes: [] }, ...prev]); setSelected(c); }}
        profile={profile}
      />

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeleteCourse}
        loading={deleting}
        title="Xóa khóa học"
        message="Xóa khóa học này? Tất cả lớp học và dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        confirmLabel="Xóa khóa học"
      />
    </AppLayout>
  );
};

export default ClassManagement;
