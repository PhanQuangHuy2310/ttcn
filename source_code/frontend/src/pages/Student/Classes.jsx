// src/pages/Student/Classes.jsx
// ADDED: "Tham gia lớp học" button + join-by-code modal (Phase 3.1)
// Keeps all existing class card display logic

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../features/authentication/authenticationSlice';
import AppLayout from '../../components/AppLayout';
import { Btn, Card, EmptyState, ErrorBanner, Sk, PageHeader, Modal, Input } from '../../components/ui';
import { classesService } from '../../services/supabaseService';

// ── Join by code modal ────────────────────────────────────────
const JoinClassModal = ({ open, onClose, onJoined, studentId }) => {
  const [code,    setCode]    = useState('');
  const [joining, setJoining] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);

  const handleJoin = async e => {
    e.preventDefault();
    if (!code.trim()) { setError('Vui lòng nhập mã lớp.'); return; }
    setJoining(true);
    setError(null);
    setSuccess(null);

    const { data, error: err } = await classesService.joinByCode(studentId, code.trim());
    setJoining(false);

    if (err) { setError(err); return; }
    setSuccess('Tham gia lớp học thành công!');
    setCode('');
    setTimeout(() => {
      setSuccess(null);
      onJoined?.();
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Tham gia lớp học" maxWidth="max-w-md">
      <form onSubmit={handleJoin} className="space-y-4">
        {error   && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>{success}
        </p>}

        <Input
          label="Mã lớp học *"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="VD: LT01-2024"
          maxLength={20}
          required
          autoFocus
        />
        <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
          Mã lớp học được cung cấp bởi giảng viên phụ trách.
          Liên hệ giảng viên nếu bạn chưa có mã lớp.
        </p>

        <div className="flex gap-3 justify-end pt-2">
          <Btn variant="outline" type="button" onClick={handleClose}>Huỷ</Btn>
          <Btn type="submit" loading={joining} icon="login">
            {joining ? 'Đang tham gia...' : 'Tham gia lớp'}
          </Btn>
        </div>
      </form>
    </Modal>
  );
};

// ── Class card ────────────────────────────────────────────────
const ClassCard = ({ enrollment }) => {
  const cls    = enrollment.classes;
  const course = cls?.courses;
  if (!cls || !course) return null;

  const teacherName = course.users?.full_name;
  const subject     = course.subject ?? '—';

  const gradientMap = [
    'from-blue-500 to-primary',
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-orange-400 to-red-500',
    'from-green-500 to-teal-600',
  ];
  const grad = gradientMap[cls.name.charCodeAt(0) % gradientMap.length];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 overflow-hidden group">
      {/* Color bar */}
      <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

      <div className="p-6">
        {/* Icon + badge */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} bg-opacity-10 flex items-center justify-center`}>
            <span className="material-symbols-outlined text-white text-xl">menu_book</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">
            Đang học
          </span>
        </div>

        {/* Info */}
        <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {cls.name}
        </h3>
        <p className="text-sm text-slate-500">{subject}</p>
        {teacherName && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">person</span>
            GV: {teacherName}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-xs">tag</span>
            <span className="font-bold text-slate-600 tracking-wider">{cls.code}</span>
          </div>
          <span>HK {course.semester ?? '—'}</span>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────
const StudentClasses = () => {
  const profile = useSelector(selectProfile);
  const [enrollments, setEnrollments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [joinOpen,    setJoinOpen]    = useState(false);

  const load = async () => {
    if (!profile?.id) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await classesService.getEnrolledByStudent(profile.id);
    if (err) setError('Không thể tải danh sách lớp học.');
    else setEnrollments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile?.id]);

  return (
    <AppLayout role="STUDENT">
      <PageHeader
        title="Lớp học của tôi"
        subtitle={loading ? 'Đang tải...' : `${enrollments.length} lớp đang tham gia`}
        actions={
          <Btn icon="login" onClick={() => setJoinOpen(true)}>
            Tham gia lớp học
          </Btn>
        }
      />

      {error && <ErrorBanner message={error} onRetry={load} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Sk key={i} className="h-52 w-full rounded-2xl" />)}
        </div>
      ) : enrollments.length === 0 ? (
        <Card>
          <EmptyState
            icon="school"
            title="Bạn chưa đăng ký lớp học nào"
            subtitle="Nhập mã lớp để tham gia lớp học của giảng viên."
            action={
              <Btn icon="login" onClick={() => setJoinOpen(true)}>
                Tham gia lớp học ngay
              </Btn>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(en => (
            <ClassCard key={en.id} enrollment={en} />
          ))}
        </div>
      )}

      <JoinClassModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoined={load}
        studentId={profile?.id}
      />
    </AppLayout>
  );
};

export default StudentClasses;
