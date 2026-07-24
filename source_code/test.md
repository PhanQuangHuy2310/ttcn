# Kế hoạch & Chiến lược Kiểm thử (Master Test Plan)

Tài liệu này mô tả chi tiết chiến lược kiểm thử đa cấp độ cho dự án DHDedu, đảm bảo chất lượng, hiệu năng và bảo mật của toàn bộ hệ thống từ mức mã nguồn đến trải nghiệm người dùng cuối.

---

## 1. Unit Test (Kiểm thử đơn vị)
- **Đối tượng kiểm thử**: Các hàm nghiệp vụ cô lập, logic tính toán, cấu trúc điều khiển tầng Backend và Frontend.
- **Nhân sự chịu trách nhiệm**: 
  - Phan Quang Huy (Developer Backend)
  - Nguyễn Mạnh Đạt (Developer Frontend)

### Mục tiêu chất lượng cam kết
- Đạt tỷ lệ bao phủ mã nguồn (Unit Test Coverage) tối thiểu **≥80%** đối với các hàm xử lý nghiệp vụ lõi.
- **100%** các ca kiểm thử độc lập phải vượt qua (Pass) trước khi thực hiện merge code vào nhánh chính.

### Phạm vi / Kịch bản kiểm thử chính
- Kiểm thử tính chính xác tuyệt đối (sai sót bằng 0%) của thuật toán chấm điểm trắc nghiệm dựa trên ma trận đáp án đã thiết lập.
- Kiểm tra giá trị biên của thang điểm.
- Kiểm tra tính hợp lệ (validation) của dữ liệu đầu vào trên các biểu mẫu.

---

## 2. Integration Test (Kiểm thử tích hợp)
- **Đối tượng kiểm thử**: Kết nối dữ liệu giữa các tầng kiến trúc (Modular Monolith), các API nội bộ và các dịch vụ bên thứ ba (Google Gemini AI, Redis Cache, Cloudinary).
- **Nhân sự chịu trách nhiệm**: 
  - Phan Quang Huy (Backend)
  - Nguyễn Nam Phương (Frontend)
  - Vi Hải Nam (Automation Tester)

### Mục tiêu chất lượng cam kết
- **100%** các kết nối truyền tải dữ liệu qua giao thức HTTPS phải tuân thủ chuẩn mã hóa bảo mật an toàn TLS 1.3.
- Đảm bảo tính nguyên tử (atomic) của giao dịch lưu điểm và cập nhật tiến độ học tập (không xảy ra tình trạng lưu thiếu/mất dữ liệu).

### Phạm vi / Kịch bản kiểm thử chính
- **Kiểm tra luồng đồng bộ dữ liệu AI**: Giảng viên upload file đề thi thô (Word/PDF/Ảnh) ➔ Hệ thống gọi API kết nối Gemini AI bóc tách trích xuất thành công cấu trúc câu hỏi ➔ Lưu tạm thời vào Redis Cache.
- **Thanh toán & Cấp quyền**: Học viên hoàn tất thanh toán học phí ➔ Kích hoạt quyền truy cập khóa học tự động trong vòng **≤3 giây**.

---

## 3. System Test (Kiểm thử hệ thống)
- **Đối tượng kiểm thử**: Toàn bộ ứng dụng phần mềm DHDedu khép kín bao gồm cả 3 phân hệ giao diện: Admin, Giảng viên và Học viên.
- **Nhân sự chịu trách nhiệm**: 
  - Vi Hải Nam (Automation Tester)
  - Nguyễn Mạnh Đạt (Manual Tester)

### Mục tiêu chất lượng cam kết
- Đảm bảo hệ thống thực hiện đúng và đầy đủ các nghiệp vụ cốt lõi theo đặc tả tài liệu SRS.
- Vá triệt để **100%** các lỗ hổng thuộc danh mục OWASP Top 10 (SQL Injection, XSS, CSRF, Broken Access Control).
- Phát hiện và xử lý **0 lỗi nghiêm trọng** (Critical/Fatal).

### Phạm vi / Kịch bản kiểm thử chính
- **Thực hiện kịch bản liên thông end-to-end**: 
  1. Admin duyệt xuất bản khóa học.
  2. Giảng viên biên soạn học liệu, xếp lịch thi trực tuyến.
  3. Học viên vào không gian lớp học LMS, xem video streaming bài giảng, tham gia phòng thi trực tuyến.
  4. Hệ thống tự động khóa ca thi, ghi nhận kết quả và kết xuất file báo cáo phổ điểm.

---

## 4. Performance & Security (Hiệu năng & Bảo mật)
- **Đối tượng kiểm thử**: Hạ tầng máy chủ Cloud, cơ sở dữ liệu PostgreSQL và các endpoints API có tải trọng lớn.
- **Nhân sự chịu trách nhiệm**: 
  - Vi Hải Nam (Automation Tester)
  - Phan Quang Huy (Project Manager / DevOps)

### Mục tiêu chất lượng cam kết
- Hệ thống duy trì hoạt động ổn định với tối thiểu **≥1.000 học viên** truy cập và nộp bài thi cùng lúc tại giờ cao điểm, tỷ lệ lỗi phản hồi (5xx) = 0%.
- Thời gian phản hồi API thông thường **≤2 giây**.
- Tốc độ phản hồi hiển thị kết quả bài thi trắc nghiệm **<1 giây**.
- Chỉ số Core Web Vitals đạt chuẩn tối ưu UX: `LCP ≤ 2.0 giây`, `CLS ≤ 0.1`.
- Tốc độ truyền phát bài giảng (Video Streaming) khởi tạo ban đầu **≤1.5 giây**, tỷ lệ giật/lag **≤0.5%**.

### Phạm vi / Kịch bản kiểm thử chính
- **Stress Test / Load Test**: Sử dụng công cụ JMeter giả lập tải cao điểm, bắn đồng thời 1.000 requests nộp bài thi trắc nghiệm (`/api/v1/student/submit`) trong cùng một giây để đo lường độ trễ và khả năng nghẽn hệ thống.
- **Security Audit**: Thực hiện quét bảo mật hộp đen, rà soát lỗ hổng phân quyền nâng cao, chống brute-force mật khẩu hoặc tấn công chèn mã độc đầu vào.

---

## 5. User Acceptance Test (Kiểm thử chấp nhận)
- **Đối tượng kiểm thử**: Kịch bản sử dụng thực tế tại môi trường vận hành bởi Giảng viên trung tâm và Học viên.
- **Nhân sự chịu trách nhiệm**: 
  - Nguyễn Minh Quang (Business Analyst)
  - Phối hợp cùng nhóm người dùng cuối trải nghiệm.

### Mục tiêu chất lượng cam kết
- Đảm bảo hệ thống đạt mức tối ưu giao diện đáp ứng (Responsive), không vỡ layout trên cả 3 nền tảng: PC, Tablet và Mobile Web.
- Điểm tối ưu hóa SEO On-page và Technical đạt tối thiểu **≥90/100** điểm theo tiêu chuẩn PageSpeed Insights.

### Phạm vi / Kịch bản kiểm thử chính
- **Chấm thi tự luận trực quan**: Giảng viên thực hiện thao tác kiểm duyệt câu hỏi số hóa bởi AI và chấm điểm tự luận trực quan bằng cách click chuột thả dấu ✔/✖ trực tiếp trên ảnh bài làm viết tay của học sinh.
- **Hệ thống chống gian lận (Anti-cheat)**: Thử nghiệm hành vi học sinh cố tình chuyển tab trình duyệt hoặc thoát toàn màn hình quá 3 lần, hoặc thời gian thoát ≥0.5 giây để kiểm tra cơ chế tự động khóa bài thi.

---
> [!NOTE]
> Tài liệu này được sử dụng làm kim chỉ nam để áp dụng kỹ thuật **Test-Driven Development (TDD)** cho các giai đoạn lập trình tiếp theo. Mọi đoạn code mới được thêm vào hệ thống đều phải vượt qua các tiêu chuẩn đã định nghĩa tại đây.

---

## CHI TIẾT TRIỂN KHAI VÀ XÂY DỰNG 4 GIAI ĐOẠN KIỂM THỬ THỰC TẾ

Dưới đây là tài liệu đặc tả chi tiết về **chính xác những gì đã được lập trình và xây dựng** trong mã nguồn để hiện thực hóa 4 giai đoạn kiểm thử trên. Toàn bộ các test cases đều đã được chạy và đạt kết quả Pass 100%.

### 1. Giai đoạn 1: Backend Unit Tests (Lớp Dịch Vụ - Service Layer)
**Mục đích**: Đảm bảo các logic tính toán nghiệp vụ lõi ở Backend hoạt động chuẩn xác mà không phụ thuộc vào Database hay Network.
**Công nghệ sử dụng**: Java, Spring Boot Test, JUnit 5, Mockito.
**Các file mã nguồn đã xây dựng**:

* **`AutoGradeServiceImplTest.java` (3 kịch bản)**
  - `calculateScore_shouldReturnCorrectScore_whenAnswersAreMixed`: Kiểm thử thuật toán chấm điểm hỗn hợp (Đúng 1 phần, sai 1 phần). Mock dữ liệu đầu vào gồm ma trận đáp án chuẩn, và so khớp với câu trả lời của thí sinh.
  - `calculateScore_shouldReturnZero_whenAllAnswersAreWrong`: Đảm bảo không có lỗi chia cho 0 hoặc điểm âm khi học sinh sai toàn bộ.
  - `calculateScore_shouldReturnMaxScore_whenAllAnswersAreCorrect`: Khẳng định thuật toán trả về chính xác 10/10 điểm khi toàn bộ đáp án khớp hoàn toàn.

* **`UserServiceImplTest.java` (3 kịch bản)**
  - `getUserById_shouldReturnUser_whenUserExists`: Mock `UserRepository.findById` trả về thực thể, khẳng định Service parse đúng dữ liệu.
  - `getUserById_shouldThrowException_whenUserNotFound`: Khẳng định Service quăng đúng ngoại lệ `ResourceNotFoundException` khi query ID không tồn tại.
  - `registerUser_shouldHashPasswordAndSave`: Khẳng định mật khẩu người dùng đã được đi qua hàm mã hóa (Bcrypt) trước khi gọi hàm `save()` xuống DB.

* **`CourseServiceImplTest.java` (4 kịch bản)**
  - Khẳng định logic lấy danh sách khóa học của Học viên (trả về danh sách rỗng nếu chưa đăng ký, trả về đúng số lượng khóa học nếu đã đăng ký).
  - Khẳng định logic phân quyền (Giáo viên chỉ được xem danh sách học sinh của lớp mình tạo).

* **`AiExamServiceImplTest.java` & `AiFlashcardServiceImplTest.java` (6 kịch bản)**
  - Giả lập (Mock) phản hồi (Response) từ API của Google Gemini để kiểm thử việc trích xuất chuỗi JSON thành các Object câu hỏi và Flashcard trong Java. Xử lý triệt để các trường hợp file PDF bị lỗi hoặc AI trả về chuỗi JSON rác.

### 2. Giai đoạn 2: Frontend Unit Tests (Lớp Giao Diện - Component Layer)
**Mục đích**: Đảm bảo các Component của React hiển thị đúng, validate form chuẩn và dispatch các action của Redux một cách chính xác.
**Công nghệ sử dụng**: Vite, Vitest, React Testing Library, Redux Mock Store, jsdom.
**Các file mã nguồn đã xây dựng**:

* **`LoginPage.test.jsx` (Form Validation - 4 kịch bản)**
  - Khởi tạo `Provider` chứa `mockReducer` để giả lập state của Redux. 
  - `should show error when email does not contain @`: Bắn sự kiện gõ chữ "student" vào ô Email -> Khẳng định màn hình xuất hiện text cảnh báo "Email không hợp lệ".
  - `should show error when password is less than 6 characters`: Bắn sự kiện gõ "123" vào ô Mật khẩu -> Khẳng định cảnh báo "Mật khẩu tối thiểu 6 ký tự".
  - `should not submit if form is invalid`: Click nút Submit với form trống -> Khẳng định hàm dispatch login của Redux **không** được gọi.
  - `should dispatch login action`: Nhập đúng chuẩn dữ liệu -> Khẳng định form gọi action gửi lên API.

* **`Classes.test.jsx` (Danh sách khóa học - 3 kịch bản)**
  - `should render loading state initially`: Khẳng định giao diện hiển thị các khối `Skeleton` khi State loading = true.
  - `should render empty state`: Khẳng định hiển thị hình ảnh "Bạn chưa tham gia lớp học nào" khi API trả về mảng rỗng `[]`.
  - `should render class cards`: Giả lập dữ liệu mock gồm 2 khóa học -> Khẳng định DOM render ra đủ 2 thẻ (Card) chứa tên khóa học tương ứng.

* **`ExamTaking.test.jsx` (Giao diện làm bài thi - 3 kịch bản)**
  - `should render password gate`: Giả lập API trả về đề thi có thuộc tính `has_password = true` -> Khẳng định giao diện bị chặn lại và hiển thị ô "Nhập mật khẩu phòng thi".
  - `should render questions`: Khẳng định danh sách câu hỏi và các Radio Button đáp án (A, B, C, D) được render đúng text.
  - `should handle answer selection`: Bắn sự kiện click vào một đáp án -> Khẳng định hàm `saveProgress` (Auto-save) của Service được gọi (trigger) để đẩy dữ liệu lưu nháp lên server.

### 3. Giai đoạn 3: Integration Tests (Kiểm thử Tích Hợp)
**Mục đích**: Đảm bảo các thành phần nội bộ (Controller -> Service -> DB) giao tiếp với nhau mà không xảy ra đứt gãy.
**Công nghệ sử dụng**: H2 In-memory Database, Spring Boot Test, MockMvc.
**Các file mã nguồn đã xây dựng**:

* **`UserRepositoryIntegrationTest.java` (DB Integration - 3 kịch bản)**
  - Cấu hình `@DataJpaTest` và `spring.jpa.hibernate.ddl-auto=create-drop` để tự động tạo toàn bộ Table ảo bằng H2 Database trên RAM.
  - Thực thi hàm `userRepository.save()` với dữ liệu thật. Sau đó gọi `userRepository.findByEmail()` -> So sánh dữ liệu móc lên từ DB ảo có khớp với dữ liệu vừa nhét xuống không.
  - Thực thi hàm `deleteById()`, sau đó assert khẳng định `findById` trả về `Optional.empty()`.

* **`TeacherAiControllerIntegrationTest.java` (API Endpoint Integration - 3 kịch bản)**
  - Sử dụng `@SpringBootTest` và `MockMvc` dựng Web Server ảo. Mock bean `AiExamService`.
  - `extractQuestions_shouldReturnDraftQuestions_whenFileIsValid`: Gửi một HTTP POST Request Multipart (chứa file test.pdf giả lập) lên `/api/teacher/ai/extract-questions`. Khẳng định API trả về HTTP Status 200 OK và JSON Path `$[0].content` đúng với dữ liệu mock.
  - `extractQuestions_shouldReturnBadRequest_whenFileIsNotPdf`: Gửi file `test.txt` (text/plain) -> Khẳng định hệ thống báo lỗi HTTP 400 Bad Request và chuỗi "Vui lòng tải lên file PDF hợp lệ".
  - Kiểm tra Authorization: Tạo request với `@WithMockUser(authorities = "STUDENT")` -> Khẳng định HTTP trả về mã 403 Forbidden (Vì API này bắt buộc Role TEACHER).

### 4. Giai đoạn 4: System & Performance Tests (E2E & Tải Cao)
**Mục đích**: Tự động hóa thao tác trình duyệt của người dùng (E2E) và bắn hàng loạt request để đo độ chịu tải của Server.
**Công nghệ sử dụng**: Playwright (E2E Test), Artillery (Performance Test).
**Các file mã nguồn đã xây dựng**:

* **`frontend/tests/main-flow.spec.js` (Kịch bản Playwright E2E - 3 luồng)**
  - Luồng 1 (Login): Code lệnh điều khiển Chrome truy cập `http://localhost:5173/auth/login`, tự động điền `student@test.com` vào ô input, click nút Submit, chờ URL chuyển hướng sang `/student/dashboard` và kiểm tra sự tồn tại của chữ "Trang chủ" trên màn hình.
  - Luồng 2 (Classes View): Tự động click vào tab "Lớp học của tôi", đọc số lượng Element `.class-card` trên DOM để khẳng định trang web render thành công dữ liệu hoặc hiện màn hình trống.
  - Luồng 3 (Exam Protected Room): Bắt trình duyệt truy cập thẳng vào URL phòng thi `/student/exam-taking?id=dummy`, chờ và assert màn hình có xuất hiện lớp Modal "Phòng thi có mật khẩu" không.

* **`performance/artillery.yml` (Kịch bản giả lập nghẽn mạng - Load Test)**
  - File YAML định nghĩa cấu trúc tấn công (Stress Test) vào Server (Localhost hoặc Production).
  - Khai báo 2 Phases:
    - Phase 1 (Ramp up): Tăng dần lượng truy cập lên 50 ảo (virtual users) mỗi giây trong vòng 60 giây đầu tiên.
    - Phase 2 (Sustained): Duy trì liên tục 50 ảo/giây trong 120 giây tiếp theo.
  - Khai báo 2 Scenarios mô phỏng luồng hành vi:
    - Kịch bản 1 (Trọng số 20% tải): Hành vi Giảng viên gửi API POST yêu cầu Server bóc tách PDF bằng AI.
    - Kịch bản 2 (Trọng số 80% tải): Hành vi Học sinh liên tục gọi API Submit gửi đáp án bài thi lên hệ thống. Đánh giá xem Database có chịu được tần suất Inserts dữ liệu liên tục như vậy không.
