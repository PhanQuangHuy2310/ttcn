import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { Blob } from 'buffer';

const supabaseUrl = 'https://oxqeacydayefsvtsqams.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWVhY3lkYXllZnN2dHNxYW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTUwNDAsImV4cCI6MjA5MTczMTA0MH0.dNlUVLLo3Y1MJlXYf5H6duYXUSxB-maQQEWe0ziJtXI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    console.log("1. Đăng nhập tài khoản giáo viên...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'le.cong.dung.gv3@dhdedu.edu.vn',
        password: '123456'
    });

    if (authError) {
        console.error("Đăng nhập thất bại:", authError.message);
        return;
    }

    const session = authData.session;
    const token = session.access_token;
    const userId = session.user.id;
    console.log("Đăng nhập thành công! User ID:", userId);

    console.log("2. Lấy danh sách lớp học trực tiếp từ Supabase...");
    const { data: classes, error: classError } = await supabase
        .from('classes')
        .select(`
            id,
            name,
            code,
            course:courses!inner (
                id,
                name,
                teacher_id
            )
        `)
        .eq('courses.teacher_id', userId);

    if (classError) {
        console.error("Lỗi lấy danh sách lớp học:", classError.message);
        return;
    }

    console.log("Tìm thấy", classes.length, "lớp học:");
    classes.forEach(c => console.log(`- Lớp: ${c.name} (${c.code}), Khóa: ${c.course?.name}`));

    if (classes.length === 0) {
        console.error("Giáo viên không quản lý lớp học nào!");
        return;
    }

    const selectedClass = classes[0];

    console.log("3. Đọc file test.pdf và gửi yêu cầu bóc tách câu hỏi...");
    const fileBuffer = fs.readFileSync('d:/ttcn/ttcn/source_code/test.pdf');
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', fileBlob, 'test.pdf');

    const extractResponse = await fetch('http://localhost:8085/api/teacher/ai/extract-questions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!extractResponse.ok) {
        const errText = await extractResponse.text();
        console.error("Lỗi bóc tách câu hỏi:", extractResponse.status, errText);
        console.error("Response headers:", Object.fromEntries(extractResponse.headers.entries()));
        return;
    }

    const questions = await extractResponse.json();
    console.log("Bóc tách thành công! Số lượng câu hỏi:", questions.length);
    console.log(JSON.stringify(questions, null, 2));

    console.log("4. Gửi yêu cầu lưu đề thi...");
    const savePayload = {
        examTitle: 'Đề thi thử nghiệm AI 1',
        questions: questions,
        classId: selectedClass.id,
        courseId: selectedClass.course?.id
    };

    const saveResponse = await fetch('http://localhost:8085/api/teacher/exams/save-draft', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(savePayload)
    });

    if (!saveResponse.ok) {
        const errText = await saveResponse.text();
        console.error("Lỗi lưu đề thi:", saveResponse.status, errText);
        return;
    }

    const saveResult = await saveResponse.json();
    console.log("Lưu đề thi thành công! Kết quả:", saveResult);
}

main().catch(console.error);
