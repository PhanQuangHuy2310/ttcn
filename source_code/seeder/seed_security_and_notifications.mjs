import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nkapaipzdxyshqynjfri.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYXBhaXB6ZHh5c2hxeW5qZnJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgwOTkzNywiZXhwIjoyMTAwMzg1OTM3fQ.nCI2dFQpHYrX0g9f_funKx5RyREU2UpWQlgwrtDnl2U';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function run() {
  console.log('=== BẮT ĐẦU SEED AUDIT LOGS & NOTIFICATIONS CHO CẢ 3 ROLE ===');

  // 1. Get all users
  const { data: users, error: uErr } = await supabase.from('users').select('id, email, full_name, role');
  if (uErr || !users) {
    console.error('Lỗi khi tải users:', uErr);
    return;
  }
  console.log(`Đã tải ${users.length} người dùng từ database.`);

  const admins = users.filter(u => u.role === 'ADMIN');
  const teachers = users.filter(u => u.role === 'TEACHER');
  const students = users.filter(u => u.role === 'STUDENT');

  // 2. SEED AUDIT LOGS for ALL categories: LOGIN, EXAM, USER, CLASS
  const auditLogs = [];
  const now = new Date();

  // LOGIN logs
  users.slice(0, 20).forEach((u, i) => {
    const time = new Date(now.getTime() - (i + 1) * 3600_000).toISOString();
    auditLogs.push({
      user_id: u.id,
      action_type: i % 4 === 0 ? 'LOGOUT' : 'LOGIN',
      description: `${u.role === 'ADMIN' ? 'Quản trị viên' : u.role === 'TEACHER' ? 'Giảng viên' : 'Sinh viên'} ${u.full_name} đăng nhập hệ thống thành công`,
      metadata: { ip: `192.168.1.${10 + i}`, browser: 'Chrome / Windows' },
      created_at: time
    });
  });

  // USER logs
  admins.concat(teachers.slice(0, 5)).forEach((u, i) => {
    const time = new Date(now.getTime() - (i + 5) * 7200_000).toISOString();
    auditLogs.push({
      user_id: u.id,
      action_type: i % 2 === 0 ? 'CREATE_USER' : 'UPDATE_USER',
      description: i % 2 === 0 ? `Tạo mới tài khoản người dùng: sv_test_${i}@dhdedu.edu.vn` : `Cập nhật hồ sơ cho người dùng ID ${u.id.slice(0, 8)}...`,
      metadata: { target_role: i % 2 === 0 ? 'STUDENT' : u.role },
      created_at: time
    });
  });

  // CLASS logs
  teachers.slice(0, 6).forEach((u, i) => {
    const time = new Date(now.getTime() - (i + 2) * 86400_000).toISOString();
    auditLogs.push({
      user_id: u.id,
      action_type: i % 2 === 0 ? 'CREATE_CLASS' : 'UPLOAD_MATERIAL',
      description: i % 2 === 0 ? `Giảng viên tạo lớp học mới: Lớp Lập trình Web ${i + 1}` : `Tải lên tài liệu mới cho lớp học: Bài giảng chương ${i + 1}.pdf`,
      metadata: { class_name: `Lớp Lập trình Web ${i + 1}` },
      created_at: time
    });
  });

  // EXAM logs
  teachers.slice(0, 6).forEach((u, i) => {
    const time = new Date(now.getTime() - (i + 1) * 14400_000).toISOString();
    auditLogs.push({
      user_id: u.id,
      action_type: 'CREATE_EXAM',
      description: `Tạo đề thi mới: Kiểm tra giữa kỳ môn Toán Lớp ${i + 1}`,
      metadata: { exam_title: `Kiểm tra giữa kỳ môn Toán Lớp ${i + 1}`, duration: 45 },
      created_at: time
    });
    auditLogs.push({
      user_id: u.id,
      action_type: 'UPDATE_EXAM',
      description: `Cập nhật cấu hình đề thi: Kiểm tra giữa kỳ môn Toán Lớp ${i + 1}`,
      metadata: { exam_title: `Kiểm tra giữa kỳ môn Toán Lớp ${i + 1}` },
      created_at: new Date(now.getTime() - (i + 1) * 14000_000).toISOString()
    });
  });

  console.log(`Đang chèn ${auditLogs.length} bản ghi vào audit_logs...`);
  const { error: logErr } = await supabase.from('audit_logs').insert(auditLogs);
  if (logErr) {
    console.error('Lỗi insert audit_logs:', logErr);
  } else {
    console.log('=> Thành công chèn audit logs!');
  }

  // 3. SEED NOTIFICATIONS for EVERY user in the database
  const notifications = [];
  users.forEach((u, i) => {
    const baseTime = now.getTime() - (i * 300_000);
    if (u.role === 'ADMIN') {
      notifications.push(
        {
          user_id: u.id,
          title: 'Hệ thống bảo mật hoạt động ổn định',
          message: 'Tất cả các dịch vụ, xác thực và cơ sở dữ liệu Supabase đang hoạt động bình thường.',
          type: 'SYSTEM',
          read_status: false,
          created_at: new Date(baseTime).toISOString(),
          action_url: '/admin/security'
        },
        {
          user_id: u.id,
          title: 'Báo cáo hoạt động người dùng',
          message: 'Hôm nay có 15 lượt đăng nhập và 8 bài thi mới được tạo trong hệ thống.',
          type: 'SYSTEM',
          read_status: false,
          created_at: new Date(baseTime - 3600_000).toISOString(),
          action_url: '/admin/users'
        },
        {
          user_id: u.id,
          title: 'Cập nhật cấu hình hệ thống',
          message: 'Cấu hình thời gian làm bài thi tự động lưu và chế độ chống trôi bài đã được kích hoạt.',
          type: 'SYSTEM',
          read_status: true,
          created_at: new Date(baseTime - 86400_000).toISOString(),
          action_url: '/admin/settings'
        }
      );
    } else if (u.role === 'TEACHER') {
      notifications.push(
        {
          user_id: u.id,
          title: 'Bài nộp mới cần chấm tự luận',
          message: 'Sinh viên vừa nộp bài làm cho đề thi Kiểm tra 1. Vui lòng kiểm tra và chấm điểm tự luận.',
          type: 'EXAM_GRADED',
          read_status: false,
          created_at: new Date(baseTime).toISOString(),
          action_url: '/teacher/essay-grading'
        },
        {
          user_id: u.id,
          title: 'Đề thi đã sẵn sàng phát hành',
          message: 'Đề thi trắc nghiệm lập trình nâng cao đã được lưu vào ngân hàng đề thi.',
          type: 'EXAM_OPEN',
          read_status: false,
          created_at: new Date(baseTime - 7200_000).toISOString(),
          action_url: '/teacher/exam-bank'
        },
        {
          user_id: u.id,
          title: 'Học viên mới tham gia lớp học',
          message: 'Có 3 sinh viên mới vừa tham gia vào danh sách lớp của Quý thầy/cô.',
          type: 'CLASS_JOIN',
          read_status: true,
          created_at: new Date(baseTime - 86400_000).toISOString(),
          action_url: '/teacher/classes'
        }
      );
    } else {
      // STUDENT
      notifications.push(
        {
          user_id: u.id,
          title: 'Đề thi mới trong lớp học',
          message: 'Giảng viên vừa đăng đề thi: Kiểm tra giữa kỳ 1. Thời gian làm bài: 60 phút.',
          type: 'EXAM_OPEN',
          read_status: false,
          created_at: new Date(baseTime).toISOString(),
          action_url: '/student/exams'
        },
        {
          user_id: u.id,
          title: 'Bài tự luận đã có kết quả',
          message: 'Bài làm tự luận của bạn đã được Giảng viên chấm điểm. Nhấp để xem chi tiết lời phê.',
          type: 'EXAM_GRADED',
          read_status: false,
          created_at: new Date(baseTime - 3600_000).toISOString(),
          action_url: '/student/history'
        },
        {
          user_id: u.id,
          title: 'Tài liệu học tập mới',
          message: 'Giảng viên vừa đăng tải bài giảng chương mới vào Thư viện tài liệu.',
          type: 'MATERIAL',
          read_status: true,
          created_at: new Date(baseTime - 86400_000).toISOString(),
          action_url: '/student/classes'
        }
      );
    }
  });

  console.log(`Đang chèn ${notifications.length} thông báo cho toàn bộ người dùng...`);
  const { error: notifErr } = await supabase.from('notifications').insert(notifications);
  if (notifErr) {
    console.error('Lỗi insert notifications:', notifErr);
  } else {
    console.log('=> Thành công chèn notifications cho toàn bộ 3 role!');
  }

  console.log('=== HOÀN TẤT SEED! ===');
}

run();
