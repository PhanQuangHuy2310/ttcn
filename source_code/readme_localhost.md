# Hướng dẫn chạy dự án trên Localhost (Không dùng Docker)

Tài liệu này hướng dẫn bạn khởi chạy toàn bộ dự án trên máy cá nhân (`localhost`) mà không cần đóng gói Docker. Luồng chạy bao gồm: **Redis** -> **Backend (Spring Boot)** -> **Frontend (React + Vite)**.

---

### 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt sẵn các công cụ sau:
- **Java Development Kit (JDK) 17** (để chạy Backend).
- **Apache Maven** (để build/chạy ứng dụng Java).
- **Node.js (v20+) & npm** (để chạy Frontend).
- **Redis Server** (vì ứng dụng Spring Boot dùng Redis làm bộ nhớ cache).

---

### 2. Bước 1: Khởi động dịch vụ Redis (Bắt buộc)
Backend Spring Boot yêu cầu kết nối tới Redis ở cổng `6379`. Bạn có hai cách để khởi động Redis:

#### Cách 1: Sử dụng Docker để chạy nhanh Redis (Khuyên dùng)
Nếu máy bạn có cài Docker, hãy mở terminal lên và chạy lệnh sau để chạy riêng Redis:
```bash
docker run -d --name redis-local -p 6379:6379 redis:7-alpine
```

#### Cách 2: Chạy trực tiếp Redis trên máy thật
Khởi động service Redis cục bộ của bạn bằng lệnh phù hợp với hệ điều hành (ví dụ trên Windows sử dụng dịch vụ WSL hoặc tệp chạy `redis-server.exe`).

---

### 3. Bước 2: Cấu hình và Khởi động Backend (Spring Boot)

#### 3.1. Kiểm tra File môi trường
Đảm bảo bạn có file cấu hình môi trường [backend/.env](file:///d:/ttcn/ttcn/source_code/backend/.env) (mặc định đã được thiết lập đầy đủ kết nối tới cơ sở dữ liệu Supabase, Gemini AI và Redis cục bộ `localhost:6379`).

#### 3.2. Khởi chạy Backend qua Command Line
Mở Terminal/CMD mới, di chuyển đến thư mục backend và chạy lệnh sau:
```bash
cd d:\ttcn\ttcn\source_code\backend
mvn spring-boot:run
```

*Lưu ý: Bạn cũng có thể mở thư mục `source_code/backend` bằng các IDE lớn như IntelliJ IDEA hoặc VS Code và nhấn nút **Run** trực tiếp trên lớp chính `com.ttcn.backend.BackendApplication`.*

Khi màn hình log hiển thị `Started BackendApplication in X seconds`, Backend đã chạy thành công trên cổng **`8081`**.

---

### 4. Bước 3: Cấu hình và Khởi động Frontend (React + Vite)

#### 4.1. Điều chỉnh cấu hình gọi API
Khi chạy localhost độc lập (không đi qua Nginx của Docker), bạn cần cho phép Frontend biết cổng của Backend. Hãy mở file [frontend/.env](file:///d:/ttcn/ttcn/source_code/frontend/.env):

Sửa dòng:
```env
VITE_API_URL=/api
```
Thành:
```env
VITE_API_URL=http://localhost:8081/api
```
*(Thao tác này giúp ứng dụng React gọi trực tiếp đến cổng `8081` của Spring Boot thay vì gọi nội bộ).*

#### 4.2. Khởi chạy Frontend
Mở một Terminal/CMD mới khác, di chuyển đến thư mục frontend và khởi chạy:
```bash
cd d:\ttcn\ttcn\source_code\frontend

# Cài đặt các thư viện phụ thuộc (nếu là lần đầu)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Ứng dụng sẽ khởi động thành công và tự động mở trình duyệt tại địa chỉ: **`http://localhost:3000`**.

---

### 5. Khởi tạo dữ liệu mẫu (Seeding Database) - *Tùy chọn*
Nếu bạn muốn nạp dữ liệu mẫu mới lên cơ sở dữ liệu để chạy thử hệ thống:
1. Mở Terminal mới, truy cập thư mục seeder:
   ```bash
   cd d:\ttcn\ttcn\source_code\seeder
   ```
2. Chạy lệnh:
   ```bash
   node seeder.js
   ```

---

### 6. Khắc phục lỗi thường gặp (Troubleshooting)

- **Lỗi kết nối Redis**: Nếu Backend báo lỗi không tìm thấy Redis hoặc crash ngay khi bắt đầu chạy, hãy kiểm tra xem cổng `6379` đã được mở và dịch vụ Redis đã chạy hay chưa bằng cách kiểm tra trạng thái Docker hoặc chạy thử lệnh ping redis.
- **Lỗi CORS**: Backend đã cấu hình cho phép các nguồn gửi yêu cầu từ `http://localhost:3000` và `http://localhost:5173`. Do đó nếu chạy frontend ở cổng mặc định `3000`, lỗi CORS sẽ không xảy ra.
