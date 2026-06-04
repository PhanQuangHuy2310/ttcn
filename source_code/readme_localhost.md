# Hướng dẫn Khởi chạy Dự án DHDedu (Local Environment)

Tài liệu này hướng dẫn chi tiết cách cài đặt và khởi chạy toàn bộ hệ thống (Frontend, Backend, Database, Seeder) trên máy tính cá nhân (`localhost`) mà không dùng Docker.

---

## 📋 1. Yêu cầu hệ thống (Prerequisites)

Đảm bảo máy tính của bạn đã cài đặt sẵn các môi trường/công cụ sau:

- **Java JDK 17** (LTS) trở lên.
- **Node.js** (Phiên bản `>= 18.x`, khuyên dùng bản LTS mới nhất).
- **Apache Maven** (Phiên bản `>= 3.8` để build Backend).
- **Redis Server** (Chạy cục bộ trên cổng mặc định `6379` để làm Cache).
- Một tài khoản và project **Supabase** (Đã cấu hình sẵn các file `.env` cho môi trường dev).

---

## 🔑 2. Cấu hình biến môi trường (Environment Variables)

Dự án sử dụng các file cấu hình `.env` cho từng phân hệ (đã được cấu hình sẵn trong mã nguồn cho môi trường phát triển):

- **Backend (`/source_code/backend/.env`):**
  - `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`: Chuỗi kết nối trực tiếp đến PostgreSQL của Supabase.
  - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`: Thông tin kết nối với dịch vụ Supabase.
  - `SUPABASE_AUTH_ISSUER`, `SUPABASE_AUTH_JWK_SET_URI`: Cấu hình phục vụ xác thực JWT token từ Client gửi lên Backend.
  - `GEMINI_API_KEY`: API Key của Google Gemini dùng cho tính năng sinh câu hỏi/flashcards tự động.
  - `REDIS_HOST` & `REDIS_PORT`: Địa chỉ kết nối đến Redis Cache (mặc định: `localhost:6379`).

- **Frontend (`/source_code/frontend/.env`):**
  - `VITE_SUPABASE_URL`: Đường dẫn URL dự án Supabase.
  - `VITE_SUPABASE_ANON_KEY`: Khóa anon dùng cho xác thực phía client.
  - `VITE_API_URL`: Địa chỉ API Backend (mặc định: `http://localhost:8085/api`).

- **Seeder (`/source_code/seeder/.env`):**
  - `SUPABASE_URL`: Đường dẫn URL dự án Supabase.
  - `SUPABASE_SERVICE_ROLE_KEY`: Khóa Service Role của Supabase (quyền Admin tối cao dùng để bypass RLS và tạo người dùng).

---

## 🛠️ 3. Các bước khởi chạy chi tiết

### Bước 1: Khởi tạo Database (Supabase)

Nếu bạn muốn triển khai trên một Database mới hoàn toàn:

1. Tạo một project mới trên [Supabase](https://supabase.com).
2. Truy cập vào **SQL Editor** trên giao diện điều khiển của Supabase Dashboard.
3. Mở file [database.sql](file:///d:/ttcn/ttcn/migrations/database.sql), sao chép toàn bộ nội dung của script và chạy (**Run**) trong SQL Editor để khởi tạo cấu trúc bảng, enums, triggers, và cấu hình các RLS policies.
4. Cập nhật các thông số kết nối (URL, Keys, Password) mới nhận được vào các file `.env` tương ứng của Backend, Frontend, và Seeder.

### Bước 2: Chạy Redis Server

Khởi chạy dịch vụ **Redis Server** trên máy tính của bạn:

- **Chạy bằng Docker (Khuyên dùng - chạy ngầm):**
  ```bash
  docker run -d --name redis-local -p 6379:6379 redis:alpine
  ```
- **Hoặc chạy trực tiếp trên máy (Host):**
  - _Windows:_ Chạy Redis qua Windows Services hoặc mở file `redis-server.exe`.
  - _Linux/macOS:_ Chạy lệnh `redis-server`.
- _Địa chỉ mặc định:_ `127.0.0.1:6379` không mật khẩu.

### Bước 3: Gieo dữ liệu mẫu (Seed Database)

Để tạo các tài khoản và cấu trúc lớp học mẫu:

1. Mở Terminal mới, di chuyển vào thư mục `seeder`:
   ```bash
   cd source_code/seeder
   ```
2. Cài đặt các dependency cần thiết:
   ```bash
   npm install
   ```
3. Chạy lệnh gieo dữ liệu mẫu:
   ```bash
   npm run seed
   ```
   _Quá trình này sẽ khởi tạo tự động 5 tài khoản Giáo viên (`TEACHER`), 30 tài khoản Học sinh (`STUDENT`), các khóa học, lớp học và các lượt làm bài thi mẫu. Mật khẩu đăng nhập mặc định cho tất cả tài khoản mẫu là `123456`._

### Bước 4: Khởi chạy Backend (Spring Boot API)

1. Mở Terminal mới, di chuyển vào thư mục `backend`:
   ```bash
   cd source_code/backend
   ```
2. Chạy ứng dụng bằng lệnh Maven:
   ```bash
   mvn spring-boot:run
   ```
   _(Hoặc bạn có thể import thư mục `backend` vào các IDE như IntelliJ IDEA / Eclipse để chạy trực tiếp class `BackendApplication.java`)._
3. Ứng dụng Backend sẽ khởi động thành công và lắng nghe tại cổng **`8085`** (`http://localhost:8085`).

### Bước 5: Khởi chạy Frontend (React + Vite)

1. Mở Terminal mới, di chuyển vào thư mục `frontend`:
   ```bash
   cd source_code/frontend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng ở chế độ phát triển:
   ```bash
   npm run dev
   ```
4. Sau khi khởi chạy thành công, mở trình duyệt và truy cập vào: **`http://localhost:5173`**.

---

## 🔑 4. Tài khoản thử nghiệm mặc định

Sau khi chạy thành công script `seeder`, các tài khoản mẫu sẽ được tạo trong hệ thống. Do quá trình tạo tên và email của seeder là ngẫu nhiên, bạn có thể kiểm tra danh sách email đã tạo trong bảng `users` bằng giao diện Supabase Table Editor hoặc đăng nhập bằng cách đăng ký tài khoản mới trực tiếp từ giao diện Frontend.

- Mật khẩu đăng nhập mặc định cho toàn bộ các tài khoản mẫu do seeder sinh ra là: **`123456`**.
