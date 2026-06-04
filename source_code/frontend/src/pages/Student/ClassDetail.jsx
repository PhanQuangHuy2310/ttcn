// src/pages/Student/ClassDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { supabase } from '../../lib/supabase';
import {
  Btn, Card, EmptyState, ErrorBanner, Sk, PageHeader, StatusBadge, ScoreBadge, Avatar,
  fmtDateTime, fmtDuration
} from '../../components/ui';

const sizeLabel = bytes => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

const ICON_MAP = {
  PDF: { icon: 'picture_as_pdf', bg: 'bg-red-50 border-red-100', color: 'text-red-500' },
  VIDEO: { icon: 'play_circle', bg: 'bg-blue-50 border-blue-100', color: 'text-blue-500' },
  AUDIO: { icon: 'headphones', bg: 'bg-purple-50 border-purple-100', color: 'text-purple-500' },
  IMAGE: { icon: 'image', bg: 'bg-green-50 border-green-100', color: 'text-green-500' },
  OTHER: { icon: 'attach_file', bg: 'bg-slate-100 border-slate-200', color: 'text-slate-500' },
};

const StudentClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const profile = useSelector(selectProfile);

  const [tab, setTab] = useState('exams'); // 'exams' | 'materials' | 'students'
  const [classInfo, setClassInfo] = useState(null);
  const [exams, setExams] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Load Class & Course details
  useEffect(() => {
    if (!classId) return;

    const loadClassDetails = async () => {
      setLoadingClass(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('classes')
          .select(`
            id,
            name,
            code,
            academic_year,
            course_id,
            courses (
              id,
              name,
              subject,
              semester,
              grade_level,
              teacher_id,
              users (
                full_name,
                email
              )
            )
          `)
          .eq('id', classId)
          .single();

        if (err) throw err;
        setClassInfo(data);
      } catch (err) {
        console.error('Error loading class details:', err);
        setError('Không thể tải thông tin lớp học. Bạn có thể không có quyền truy cập.');
      } finally {
        setLoadingClass(false);
      }
    };

    loadClassDetails();
  }, [classId]);

  // Load Tab Content Data
  useEffect(() => {
    if (!classInfo || !profile?.id) return;

    const loadTabData = async () => {
      setLoadingData(true);
      try {
        if (tab === 'exams') {
          // Fetch exams
          const { data: examsData, error: examsErr } = await supabase
            .from('exams')
            .select('*')
            .eq('class_id', classId)
            .order('created_at', { ascending: false });
          if (examsErr) throw examsErr;

          // Fetch student submissions
          const { data: subsData, error: subsErr } = await supabase
            .from('submissions')
            .select('*')
            .eq('student_id', profile.id);
          if (subsErr) throw subsErr;

          // Chỉ hiển thị các bài thi đã được giảng viên mở (ACTIVE) hoặc đóng (ENDED), bỏ qua các bài thi nháp/seeded sẵn ở dạng UPCOMING
          const visibleExams = (examsData ?? []).filter(exam => exam.status === 'ACTIVE' || exam.status === 'ENDED');

          // Enrich exams with submissions
          const enriched = visibleExams.map(exam => {
            const sub = (subsData ?? []).find(s => s.exam_id === exam.id);
            return {
              ...exam,
              submission: sub
            };
          });
          setExams(enriched);
        } else if (tab === 'materials') {
          // Fetch lessons in the course
          const { data: lessonsData, error: lessonsErr } = await supabase
            .from('lessons')
            .select('id, title')
            .eq('course_id', classInfo.course_id);
          if (lessonsErr) throw lessonsErr;

          const lessonIds = lessonsData?.map(l => l.id) || [];
          if (lessonIds.length > 0) {
            // Fetch materials for these lessons with purpose THEORY
            const { data: matsData, error: matsErr } = await supabase
              .from('materials')
              .select('*')
              .in('lesson_id', lessonIds)
              .eq('purpose', 'THEORY')
              .order('created_at', { ascending: false });
            if (matsErr) throw matsErr;

            const enrichedMats = (matsData ?? []).map(mat => {
              const lesson = lessonsData.find(l => l.id === mat.lesson_id);
              return {
                ...mat,
                lesson_title: lesson?.title || 'Tài liệu chung'
              };
            });
            setMaterials(enrichedMats);
          } else {
            setMaterials([]);
          }
        } else if (tab === 'students') {
          // Fetch students list
          const { data: studentsData, error: studentsErr } = await supabase
            .from('student_classes')
            .select(`
              id,
              student_id,
              enrolled_at,
              users!student_classes_student_id_fkey (
                id,
                full_name,
                email
              )
            `)
            .eq('class_id', classId)
            .order('enrolled_at', { ascending: true });
          if (studentsErr) throw studentsErr;
          setStudents(studentsData ?? []);
        }
      } catch (err) {
        console.error(`Error loading data for tab ${tab}:`, err);
      } finally {
        setLoadingData(false);
      }
    };

    loadTabData();
  }, [classInfo, tab, profile?.id, classId]);

  if (loadingClass) {
    return (
      <AppLayout role="STUDENT">
        <div className="flex items-center gap-3 mb-6">
          <Sk className="h-6 w-24 rounded-lg" />
        </div>
        <Sk className="h-10 w-96 mb-2 rounded-xl" />
        <Sk className="h-5 w-64 mb-6 rounded-xl" />
        
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 max-w-sm mb-6">
          <Sk className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Sk className="h-3 w-28 rounded" />
            <Sk className="h-4 w-40 rounded" />
          </div>
        </div>

        <div className="h-12 w-full bg-white border-b border-slate-100 flex gap-4 px-2 mb-6">
          <Sk className="h-full w-24" />
          <Sk className="h-full w-24" />
          <Sk className="h-full w-24" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Sk className="h-20 w-full rounded-2xl" />
          <Sk className="h-20 w-full rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout role="STUDENT">
        <PageHeader title="Lớp học" back={() => navigate('/student/classes')} />
        <ErrorBanner message={error} onRetry={() => window.location.reload()} />
      </AppLayout>
    );
  }

  const course = classInfo?.courses;
  const teacher = course?.users;
  const teacherName = teacher?.full_name ?? '—';
  const teacherEmail = teacher?.email ?? '';

  const tabs = [
    { key: 'exams', label: 'Bài kiểm tra', icon: 'assignment' },
    { key: 'materials', label: 'Tài liệu học tập', icon: 'description' },
    { key: 'students', label: 'Danh sách lớp', icon: 'groups' }
  ];

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title={classInfo.name}
        subtitle={`${course?.name ?? ''} · Môn học: ${course?.subject ?? '—'} · Mã lớp: ${classInfo.code}`}
        back={() => navigate('/student/classes')}
      />

      {/* Teacher Box (Top-Left Info) */}
      <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mb-8">
        <Avatar name={teacherName} size="md" colorClass="from-primary to-indigo-600" />
        <div className="min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Giảng viên giảng dạy</p>
          <p className="text-sm font-bold text-slate-800 truncate">{teacherName}</p>
          {teacherEmail && <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-xs">mail</span>{teacherEmail}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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

      {/* Tab Contents */}
      <div>
        {loadingData ? (
          <div className="space-y-3">
            {[1, 2].map(i => <Sk key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* 1. EXAMS TAB */}
            {tab === 'exams' && (
              <Card>
                {exams.length === 0 ? (
                  <EmptyState
                    icon="event_available"
                    title="Chưa có bài kiểm tra nào"
                    subtitle="Giảng viên chưa tạo bài kiểm tra nào cho lớp học này."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {exams.map(exam => {
                      const sub = exam.submission;
                      const hasSub = !!sub;
                      const isClosed = exam.status === 'CLOSED';
                      const isActive = exam.status === 'ACTIVE';

                      return (
                        <div key={exam.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                              <span className="material-symbols-outlined text-purple-600">quiz</span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{exam.title}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                                <span>{fmtDuration(exam.duration)}</span>
                              {exam.start_time && (
                                  <>
                                    <span>·</span>
                                    <span>Mở lúc: {fmtDateTime(exam.start_time)}</span>
                                  </>
                                )}
                              </div>
                              {/* Hiển thị nhận xét của giáo viên nếu có */}
                              {hasSub && sub.teacher_comment && (
                                <div className="mt-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs">
                                  <p className="font-bold text-blue-800 flex items-center gap-1 mb-0.5">
                                    <span className="material-symbols-outlined text-xs">rate_review</span>
                                    Nhận xét từ giảng viên:
                                  </p>
                                  <p className="text-blue-700 whitespace-pre-wrap">{sub.teacher_comment}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                            <div className="flex flex-col items-end gap-1">
                              {/* Show submission score if graded/submitted */}
                              {hasSub ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">Kết quả:</span>
                                  <ScoreBadge score={sub.score} />
                                  <StatusBadge status={sub.status} />
                                </div>
                              ) : (
                                <StatusBadge status={exam.status} />
                              )}
                            </div>

                            {/* Actions button */}
                            {hasSub ? (
                              (sub.status === 'SUBMITTED' || sub.status === 'GRADED' || sub.status === 'PENDING_ESSAY_GRADING') ? (
                                <Link
                                  to={`/student/review?id=${exam.id}`}
                                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">visibility</span> Xem bài làm
                                </Link>
                              ) : sub.status === 'IN_PROGRESS' ? (
                                <Link
                                  to={`/student/exam?id=${exam.id}`}
                                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">edit</span> Tiếp tục
                                </Link>
                              ) : null
                            ) : (
                              isActive ? (
                                <Link
                                  to={`/student/exam?id=${exam.id}`}
                                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">play_arrow</span> Vào thi
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
                                >
                                  Chưa mở
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* 2. MATERIALS TAB */}
            {tab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.length === 0 ? (
                  <div className="col-span-full">
                    <Card>
                      <EmptyState
                        icon="folder_open"
                        title="Không có tài liệu nào"
                        subtitle="Giảng viên chưa đăng tải học liệu lý thuyết nào cho khóa học này."
                      />
                    </Card>
                  </div>
                ) : (
                  materials.map(mat => {
                    const { icon, bg, color } = ICON_MAP[mat.material_type] ?? ICON_MAP.OTHER;
                    return (
                      <div key={mat.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col group justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-10 h-10 ${bg} border rounded-xl flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm truncate group-hover:text-primary transition-colors" title={mat.title}>
                              {mat.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                              Bài: {mat.lesson_title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {sizeLabel(mat.size)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100/70 flex justify-end">
                          <a
                            href={mat.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">download</span> Tải tài liệu
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 3. STUDENTS TAB */}
            {tab === 'students' && (
              <Card>
                {students.length === 0 ? (
                  <EmptyState
                    icon="groups"
                    title="Chưa có học sinh nào"
                    subtitle="Lớp học này hiện tại chưa có học viên nào tham gia."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/12 text-center">STT</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Họ và Tên</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ngày tham gia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.map((sc, idx) => {
                          const user = sc.users;
                          const name = user?.full_name ?? '—';
                          const email = user?.email ?? '—';

                          return (
                            <tr key={sc.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-6 py-4 text-center font-bold text-slate-400 text-xs">{idx + 1}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar name={name} size="sm" colorClass="from-slate-400 to-slate-500" />
                                  <span className="font-semibold text-slate-800">{name}</span>
                                  {user?.id === profile?.id && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-primary/10 text-primary rounded uppercase tracking-wider">Bạn</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500 font-medium">{email}</td>
                              <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                                {sc.enrolled_at ? new Date(sc.enrolled_at).toLocaleDateString('vi-VN') : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentClassDetail;
