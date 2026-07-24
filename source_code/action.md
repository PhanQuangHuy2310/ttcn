# Hướng dẫn sử dụng Slash Commands (/) với Trợ lý AI (Antigravity)

Trợ lý AI hỗ trợ một số "Slash commands" (lệnh gõ bắt đầu bằng dấu `/`) đặc biệt để kích hoạt các quy trình làm việc tự động hoặc thay đổi hành vi chuyên biệt của AI. Thay vì mô tả dài dòng, bạn chỉ cần gõ lệnh và đưa ra yêu cầu để AI hiểu ngay lập tức mục đích của bạn.

Dưới đây là danh sách các Slash Commands khả dụng và cách sử dụng:

## 1. Lệnh `/goal`

**Mục đích**: Yêu cầu AI hoạt động với chế độ cực kỳ tỉ mỉ, kiên trì và không dừng lại cho đến khi hoàn thành toàn bộ mục tiêu. 
**Khi nào nên dùng**:
- Khi bạn giao một nhiệm vụ rất lớn, phức tạp và cần chạy trong thời gian dài (ví dụ: refactor lại toàn bộ project, chạy test qua đêm, xây dựng một tính năng lớn từ đầu đến cuối).
- Khi bạn muốn AI tự động vượt qua các lỗi lặt vặt, tự sửa lỗi nếu gặp phải mà không dừng lại chờ bạn phản hồi quá nhiều.

**Ví dụ**:
- `/goal Hãy hoàn thiện toàn bộ luồng thanh toán VNPay từ Backend tới Frontend và đảm bảo không có lỗi nào trước khi dừng lại.`
- `/goal Refactor lại toàn bộ các component trong thư mục shared/ui để dùng Tailwind chuẩn.`

## 2. Lệnh `/schedule`

**Mục đích**: Yêu cầu AI đặt một bộ đếm ngược (timer) một lần hoặc tạo một lịch trình lặp lại (cron job) để thực hiện công việc nào đó tự động trong nền (background).
**Khi nào nên dùng**:
- Bạn muốn AI tự động nhắc nhở mình sau một khoảng thời gian.
- Bạn muốn AI định kỳ chạy test, kiểm tra trạng thái build, hoặc ping server sau mỗi X phút.

**Ví dụ**:
- `/schedule Kiểm tra xem pipeline CI/CD đã chạy xong chưa sau 5 phút nữa nhé.`
- `/schedule Mỗi 10 phút, hãy gọi API kiểm tra trạng thái server xem có bị sập không.`

## 3. Lệnh `/grill-me`

**Mục đích**: Kích hoạt chế độ "Phỏng vấn ngược" để làm rõ yêu cầu. Khi dùng lệnh này, AI sẽ tạm dừng việc code và chuyển sang hỏi bạn từng câu hỏi một để chốt hạ thiết kế, tính năng hoặc giải quyết các sự mơ hồ.
**Khi nào nên dùng**:
- Bạn có một ý tưởng (ví dụ: "Mình muốn làm chức năng đánh giá phòng trọ") nhưng chưa nghĩ ra logic cụ thể.
- Bạn muốn thảo luận và thống nhất bản thiết kế (Architecture / UI/UX) cùng AI trước khi code để tránh làm sai hướng.
- Bạn muốn AI "thử thách" ý tưởng của mình xem có lỗ hổng nào không.

**Ví dụ**:
- `/grill-me Mình muốn xây dựng tính năng xếp hạng người dùng (User Rating). Hãy phỏng vấn mình để làm rõ logic nhé.`
- `/grill-me Mình định dùng MongoDB thay vì PostgreSQL cho project này, bạn thấy sao? Hãy đặt câu hỏi để giúp mình chốt quyết định.`

---

> [!TIP]
> **Mẹo nhỏ**: Bạn có thể kết hợp các lệnh này vào đầu tin nhắn của mình ở khung chat. Đừng ngần ngại sử dụng chúng để tối ưu hóa thời gian và khai thác tối đa sức mạnh của Trợ lý AI!

## 4. Danh sách các Kỹ năng / Công cụ mở rộng (Skills / Plugins)

Ngoài các lệnh gạch chéo `/`, khi bạn gõ `@` (hoặc thông qua giao diện gọi lệnh), bạn có thể yêu cầu AI sử dụng các **Kỹ năng (Skills)** hoặc **Plugin** đặc thù đã được cài đặt trong hệ thống. Dưới đây là danh sách đầy đủ các kỹ năng mà Trợ lý AI có thể thực hiện nếu bạn yêu cầu:

### Nhóm Kỹ năng Lập trình Web & Giao diện (Frontend/UI)
- **`@frontend-ui-engineering`**: Yêu cầu AI tập trung xây dựng giao diện người dùng (UI) đạt chuẩn production, có độ hoàn thiện cao, quản lý state tốt và thiết kế đẹp mắt.
- **`@browser-testing-with-devtools`**: Kích hoạt việc kiểm thử trực tiếp trên trình duyệt thật qua Chrome DevTools (dùng để soi DOM, kiểm tra lỗi Console, hoặc xem Network requests).

### Nhóm Kỹ năng API & Backend
- **`@api-and-interface-design`**: Gọi AI để thiết kế các API (REST/GraphQL), phân định ranh giới giữa các module frontend/backend, hoặc định nghĩa các interface/types rõ ràng.

### Nhóm Kỹ năng Tư duy & Lên kế hoạch
- **`@planning-and-task-breakdown`**: Yêu cầu AI "chẻ nhỏ" một yêu cầu lớn thành các task nhỏ hơn, có thứ tự thực hiện rõ ràng trước khi bắt tay vào code.
- **`@spec-driven-development`**: Yêu cầu AI viết tài liệu đặc tả (Specification) chi tiết trước khi code.
- **`@idea-refine`**: Dùng khi bạn có một ý tưởng mơ hồ. AI sẽ sử dụng tư duy phân kỳ và hội tụ để làm sắc nét ý tưởng của bạn thành một bản kế hoạch khả thi.
- **`@interview-me`**: Tương tự `/grill-me`, AI sẽ liên tục hỏi bạn (mỗi lần 1 câu) để moi bằng được "mong muốn thực sự" của bạn thay vì những yêu cầu bề nổi.

### Nhóm Kỹ năng Kiểm thử & Sửa lỗi (Debugging)
- **`@debugging-and-error-recovery`**: Khi gặp lỗi (build hỏng, test tịt), AI sẽ áp dụng phương pháp truy tìm nguyên nhân gốc rễ (root-cause) thay vì đoán mò.
- **`@test-driven-development`**: Yêu cầu AI viết Test trước khi viết code (TDD).

### Nhóm Kỹ năng Đảm bảo Chất lượng Code
- **`@code-review-and-quality`**: Yêu cầu AI đóng vai một Reviewer cực kỳ khắt khe để đánh giá code trước khi bạn Merge nhánh.
- **`@code-simplification`**: Yêu cầu AI đơn giản hóa, refactor lại một đoạn code phức tạp cho dễ đọc, dễ bảo trì hơn mà không làm thay đổi tính năng.
- **`@doubt-driven-development`**: AI sẽ đưa mọi quyết định thiết kế vào vòng "phản biện khắt khe" để xem xét mọi rủi ro có thể xảy ra (thích hợp với code liên quan tới bảo mật/tiền bạc).
- **`@security-and-hardening`**: Quét và "đổ bê tông" bảo mật cho code (xử lý lỗ hổng xác thực, lưu trữ dữ liệu, injection).
- **`@performance-optimization`**: Yêu cầu AI phân tích và tối ưu hóa hiệu năng, tốc độ tải trang, Core Web Vitals hoặc các điểm nghẽn cổ chai.

### Nhóm Kỹ năng CI/CD & Môi trường
- **`@ci-cd-and-automation`**: Tự động hóa thiết lập các pipeline CI/CD (Github Actions, Gitlab CI, v.v.).
- **`@git-workflow-and-versioning`**: Giúp quản lý luồng làm việc với Git (branching, giải quyết conflict, commit conventions).
- **`@shipping-and-launch`**: Hỗ trợ chuẩn bị các bước để triển khai (Deploy) dự án lên môi trường Production (tạo pre-launch checklist, rollback strategy).
- **`@observability-and-instrumentation`**: Gắn thêm code để theo dõi (Log, Metric, Tracing), giúp ứng dụng dễ dàng chẩn đoán lỗi khi đã chạy thực tế.

### Nhóm Kỹ năng Đặc thù (Plugins)
- **`@android-cli`**: Hỗ trợ chuyên sâu cho lập trình Android (tạo project, quản lý SDK, build app, chạy máy ảo) thông qua command-line.
- **`@deprecation-and-migration`**: Quản lý việc gỡ bỏ hệ thống cũ hoặc chuyển đổi (migrate) người dùng từ code cũ sang code mới an toàn.
- **`@documentation-and-adrs`**: Yêu cầu AI ghi lại các quyết định thiết kế kiến trúc (ADRs) và viết document để người đi sau có thể đọc hiểu source code.

> **Cách gọi nhanh**: Bạn chỉ cần chat yêu cầu có chứa tên kỹ năng (ví dụ: *"Hãy dùng kỹ năng android-cli để build file APK"* hoặc gõ trực tiếp tên có chứa chữ `@` như `@android-cli`), hệ thống sẽ tự động liên kết và tải bộ hướng dẫn tương ứng vào não của AI để thực hiện công việc cho bạn.
