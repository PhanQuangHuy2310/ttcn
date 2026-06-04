# Lịch sử thay đổi (Changes Log)

Tài liệu này ghi lại tất cả các thay đổi, tính năng đã thực hiện trong dự án.
**Quy tắc:** Trước khi bắt đầu triển khai bất kỳ yêu cầu mới nào từ người dùng, yêu cầu đó phải được ghi nhận (note) vào mục **"Yêu cầu đang thực hiện"** trong file này trước.

---

## 📋 Yêu cầu đang thực hiện (Current Request)

- **Yêu cầu:**
  1. ~~Khắc phục lỗi phân hệ học sinh không hiển thị tên giáo viên quản lý lớp học~~ ✅ Đã tạo RLS policy.
  2. ~~Sửa logic ở phân hệ giáo viên: Khi ấn "Mở thi", trạng thái bài thi phải chuyển sang "Đang thi"~~ ✅ Đã sửa.
  3. ~~Đảm bảo sau khi giáo viên mở thi, bên giao diện học sinh phải hiển thị bài thi và thời gian làm bài chính xác.~~ ✅ Đã sửa.
  4. ~~Sửa lỗi tạo bài học: `Could not find the 'order_index' column of 'lessons'`~~ ✅ Đã sửa — cột đúng là `order`.
  5. ~~Khi giáo viên nhận xét bài tự luận thì học sinh phải xem được nhận xét đó~~ ✅ Đã sửa — thêm RLS policy UPDATE cho giáo viên + hiển thị nhận xét.
  6. ~~Kiểm tra phân hệ tạo đề thi bằng tài khoản Giáo viên, khắc phục lỗi API Gemini (model `gemini-1.5-flash` đã bị xóa → đổi sang `gemini-2.5-flash`) và đổi cổng Backend từ `8081` sang `8085` để tránh xung đột.~~ ✅ Đã sửa.

---

## 🛠️ Các thay đổi đã thực hiện (Completed Changes)

### 1. Phân hệ Lớp học của Học sinh (Student Class Module)

- **Tính năng:**
  - Cho phép học sinh click vào từng lớp học đã tham gia từ trang danh sách lớp học (`/student/classes`) để chuyển hướng vào trang chi tiết lớp học (`/student/classes/:classId`).
  - Hiển thị thông tin Giảng viên phụ trách lớp học ở góc trên bên trái (Họ tên, Email, Avatar).
  - Giao diện chi tiết lớp học được chia làm 3 tab rõ ràng:
    1. **Bài kiểm tra**: Hiển thị danh sách các bài kiểm tra được giảng viên mở (`ACTIVE` hoặc `ENDED`). Học sinh có thể click "Vào thi" hoặc "Tiếp tục" nếu chưa hoàn thành, hoặc "Xem bài làm" đối với các bài đã nộp. Trạng thái và điểm số được cập nhật trực tiếp từ cơ sở dữ liệu.
    2. **Tài liệu học tập**: Hiển thị danh sách tài liệu giảng dạy của lớp (chỉ các tài liệu có mục đích `THEORY`). Học sinh có thể tải về trực tiếp.
    3. **Danh sách lớp**: Hiển thị danh sách toàn bộ học sinh cùng lớp, đánh dấu rõ tài khoản của học sinh hiện tại ("Bạn").
- **Các file thay đổi/tạo mới:**
  - **[NEW]** [ClassDetail.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Student/ClassDetail.jsx): Trang chi tiết lớp học của học sinh.
  - **[MODIFY]** [Classes.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Student/Classes.jsx): Gắn link chuyển hướng cho thẻ lớp học (`ClassCard`).
  - **[MODIFY]** [App.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/App.jsx): Khai báo route mới cho trang chi tiết lớp học `/student/classes/:classId`.

---

### 2. Tích hợp AI Gemini sinh Flashcard tự động từ PDF cho Học sinh

- **Tính năng:**
  - Tích hợp API Gemini (mô hình `gemini-1.5-flash`) cho phép học sinh tải lên tài liệu học tập định dạng PDF để AI tự động phân tích và trích xuất các khái niệm, nội dung chính thành danh sách Flashcard.
  - Giao diện hiển thị modal cho phép học sinh tải file PDF, xem tiến trình trích xuất, và chỉnh sửa nội dung Flashcard do AI tạo ra trước khi lưu vào bộ Flashcard của mình.
- **Các file thay đổi/tạo mới:**
  - **[NEW]** [StudentAiController.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/controller/StudentAiController.java): Endpoint `/api/student/ai/extract-flashcards` nhận file PDF tải lên từ học sinh.
  - **[MODIFY]** [AiFlashcardService.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/service/AiFlashcardService.java) & [AiFlashcardServiceImpl.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/service/impl/AiFlashcardServiceImpl.java): Bổ sung phương thức `extractFlashcards` xử lý file PDF và giao tiếp với API Gemini.
  - **[MODIFY]** [SecurityConfig.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/config/SecurityConfig.java): Mở quyền truy cập cho API AI của học sinh.
  - **[MODIFY]** [Flashcards.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Student/Flashcards.jsx): Thêm giao diện tải file PDF và modal tương tác sinh Flashcard từ AI.

---

### 3. Tối ưu hóa, Bổ sung chú thích sư phạm & Quản lý tài khoản vô hiệu hóa (Disabled User Accounts & Refactoring)

- **Tính năng:**
  - **Chú thích mã nguồn bằng tiếng Việt**: Bổ sung chú thích cực kỳ chi tiết cho cả Backend (Spring Boot) và Frontend (React, Vite, Redux, Supabase Client) nhằm phục vụ mục đích sư phạm, giúp người mới bắt đầu dễ dàng hiểu rõ luồng xử lý.
  - **Quản lý trạng thái tài khoản (Bật/Tắt/Xóa)**: Admin có thể bật, tắt, hoặc xóa tài khoản của người dùng từ giao diện quản trị (`/admin/users`).
  - **Chặn tài khoản bị vô hiệu hóa**: Bổ sung logic kiểm tra trạng thái kích hoạt (`isActive`, `status`) trong Redux slice `authenticationSlice.ts` và Spring Boot. Khi tài khoản bị vô hiệu hóa, hệ thống lập tức đăng xuất và hiển thị thông báo lỗi: *"Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ admin để biết thêm chi tiết"*.
  - **Sửa lỗi biên dịch JDK 21 & Lombok**: Nâng cấp phiên bản `maven-compiler-plugin` lên `3.12.1` trong file `pom.xml` để khắc phục lỗi biên dịch `TypeTag :: UNKNOWN` trên môi trường Java 21 + Lombok.
  - **Sửa lỗi đồng bộ form/payload**: Sửa đổi form binding trong `FlashcardReviewForm.jsx` (từ `front`/`back` sang `frontText`/`backText`) và bổ sung tham số `draftId` bị thiếu khi lưu Flashcard trong `AiQuestionGenerator.jsx`.
- **Các file thay đổi/tạo mới:**
  - **[MODIFY]** [pom.xml](file:///d:/ttcn/ttcn/source_code/backend/pom.xml): Nâng cấp `maven-compiler-plugin` lên `3.12.1`.
  - **[MODIFY]** [RateLimitFilter.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/filter/RateLimitFilter.java): Thêm chú thích và tối ưu hóa lấy IP khách qua header `X-Forwarded-For`.
  - **[MODIFY]** [SecurityConfig.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/config/SecurityConfig.java): Bổ sung chú thích giải mã JWT và đặt cơ chế session thành stateless.
  - **[MODIFY]** [User.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/entity/User.java) & [UserDTO.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/dto/UserDTO.java): Khai báo ánh xạ các trường `isActive` và `status`.
  - **[MODIFY]** [UserServiceImpl.java](file:///d:/ttcn/ttcn/source_code/backend/src/main/java/com/ttcn/backend/service/impl/UserServiceImpl.java): Đồng bộ các trường `isActive` và `status` khi cập nhật hồ sơ người dùng.
  - **[MODIFY]** [authenticationSlice.ts](file:///d:/ttcn/ttcn/source_code/frontend/src/features/authentication/authenticationSlice.ts): Logic từ chối đăng nhập và khôi phục phiên đối với tài khoản vô hiệu hóa.
  - **[MODIFY]** [UserManagement.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Admin/UserManagement.jsx): Thêm cột trạng thái, các nút Khóa/Mở khóa an toàn và chống tự khóa tài khoản của Admin.
  - **[MODIFY]** [ClassDetail.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Student/ClassDetail.jsx): Bổ sung cờ `isMounted` để loại bỏ nguy cơ rò rỉ bộ nhớ.
  - **[MODIFY]** [FlashcardReviewForm.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/components/Teacher/FlashcardReviewForm.jsx): Khắc phục lỗi binding của form field.
  - **[MODIFY]** [AiQuestionGenerator.jsx](file:///d:/ttcn/ttcn/source_code/frontend/src/pages/Teacher/AiQuestionGenerator.jsx): Cập nhật payload `draftId` và sửa lỗi điều phối SSE event.

---
