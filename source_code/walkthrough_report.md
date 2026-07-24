# Walkthrough: Hoàn thành Giai đoạn 1 và 2 (Unit Tests)

Tôi đã hoàn tất Giai đoạn 1 và 2 theo kế hoạch `implementation_plan.md`. Sau đây là chi tiết các công việc đã thực hiện và kết quả:

## Giai đoạn 2: Frontend Unit Tests (Hoàn thành)

Đã cài đặt môi trường test (Vitest + React Testing Library) cho Frontend React và hoàn thành viết test cho 3 nhóm Component quan trọng:

1. **LoginPage.test.jsx (Component Biểu mẫu / Validation)**:
   - `should show error when email does not contain @`: Bắt lỗi email sai định dạng.
   - `should show error when password is less than 6 characters`: Bắt lỗi độ dài mật khẩu.
   - `should not submit and show errors if form is invalid on submit`: Chặn nộp form khi lỗi.
   - `should dispatch login action when form is valid`: Chấp nhận form đúng.

2. **Classes.test.jsx (Danh sách khóa học)**:
   - `should render loading state initially`: Hiển thị Skeleton loading.
   - `should render empty state when no classes`: Hiển thị Empty state.
   - `should render class cards when enrollments exist`: Render danh sách thẻ khóa học thành công.

3. **ExamTaking.test.jsx (Giao diện bài thi trắc nghiệm)**:
   - `should render password gate if exam has password and not passed`: Bắt buộc nhập pass phòng thi.
   - `should render questions after loading without password`: Render câu hỏi thành công.
   - `should handle answer selection and trigger saveProgress`: Xử lý lưu đáp án và gọi API Auto-save.

**Kết quả Validation:** 10/10 Test cases đều Pass.
*Trong quá trình test tôi phát hiện và đã fix một lỗi lặp khai báo biến `essayImages` gây Crash trong Component ExamTaking.*

## Giai đoạn 1: Backend Unit Tests (Đã hoàn thành trước đó)

Đã xây dựng bộ Unit Test toàn diện (JUnit 5 + Mockito) cho 5 service cốt lõi: `AutoGradeService`, `CourseService`, `AiExamService`, `AiFlashcardService`, `UserService`.
**Kết quả Validation:** 16/16 Test cases đều Pass.

## Giai đoạn 3: Integration Tests (Hoàn thành)

Đã cấu hình và viết các Integration Test để đảm bảo các thành phần tích hợp hoạt động đúng:
1. **UserRepositoryIntegrationTest**: 
   - Sử dụng `@DataJpaTest` và H2 In-memory Database.
   - Kiểm tra các thao tác thực tế với Database (Save, FindByEmail, Delete).
   - Tự động tạo schema (DDL) và clean up sau khi test.
2. **TeacherAiControllerIntegrationTest**:
   - Sử dụng `@SpringBootTest` kết hợp `MockMvc` và `@MockBean` (Mockito) cho luồng API gọi AI.
   - Upload một file PDF giả lập qua endpoint `multipart("/api/teacher/ai/extract-questions")`.
   - Bắt lỗi khi người dùng không phải giáo viên, hoặc file không đúng định dạng.
   - Xác thực dữ liệu trả về chuẩn xác theo format `AiQuestionDraftResponse`.

**Kết quả Validation:** 100% Tests Pass. Quá trình CI (chạy bằng Maven qua command line) thành công.

## Giai đoạn 4: System & Performance Tests (Hoàn thành)

1. **System E2E Tests (Playwright):**
   - Đã khởi tạo thành công Playwright Test project ở thư mục `frontend`.
   - Viết kịch bản test luồng chính (Main flow) tại `frontend/tests/main-flow.spec.js` với 3 kịch bản: 
     - Học sinh đăng nhập thành công.
     - Vào xem danh sách khoá học.
     - Kiểm tra luồng vào phòng thi có mật khẩu bảo vệ.
   - Các kịch bản này sẵn sàng để chạy bằng lệnh `npx playwright test`.

2. **Performance Tests (Artillery):**
   - Đã tạo thư mục `performance` với kịch bản chịu tải viết bằng YAML: `performance/artillery.yml`.
   - Kịch bản mô phỏng đồng thời 2 luồng: 
     - **Giáo viên:** Liên tục gửi request bóc tách AI từ PDF URL (chiếm 20% tải).
     - **Học sinh:** Liên tục nộp bài trắc nghiệm (chiếm 80% tải).
   - Ramp-up load lên 50 user ảo/giây, sau đó duy trì trong 2 phút. Sẵn sàng chạy bằng lệnh `npx artillery run artillery.yml`.

> [!TIP]
> Toàn bộ 4 giai đoạn của kế hoạch Kiểm thử phần mềm đã hoàn tất. Dự án của bạn hiện đã được trang bị Unit Tests (Backend + Frontend), Integration Tests, E2E Tests (Playwright) và cấu hình Performance Tests (Artillery), đáp ứng đầy đủ yêu cầu cho học phần Đảm bảo chất lượng phần mềm.
