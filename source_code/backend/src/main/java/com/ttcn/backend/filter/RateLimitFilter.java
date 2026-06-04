package com.ttcn.backend.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Filter Rate Limit - Bộ lọc giới hạn tần suất yêu cầu (Rate Limiting).
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - Khi có nhiều yêu cầu (requests) gửi liên tục từ một máy khách (Client IP), hệ thống có nguy cơ bị quá tải
 *   hoặc bị tấn công từ chối dịch vụ (DoS). Bộ lọc này giúp giới hạn tối đa số yêu cầu được xử lý trong một đơn vị thời gian.
 * - Bộ lọc này hoạt động ở tầng Servlet (Filter), chặn các yêu cầu trước khi chúng đi vào Controller của Spring Boot.
 */
@Component
public class RateLimitFilter implements Filter {

    /**
     * Cache lưu trữ Bucket giới hạn lưu lượng của từng địa chỉ IP máy khách.
     * - Sử dụng ConcurrentHashMap để đảm bảo an toàn đa luồng (Thread-safe). Vì trong ứng dụng web,
     *   nhiều yêu cầu từ nhiều người dùng có thể đến cùng một lúc, HashMap thông thường sẽ bị lỗi tranh chấp dữ liệu.
     * - Key: Địa chỉ IP của Client (String).
     * - Value: Đối tượng Bucket chứa lượng token cho phép của IP đó (Bucket).
     */
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Hàm tạo một chiếc "Xô chứa Token" (Bucket) mới cho địa chỉ IP mới kết nối.
     * - Sử dụng thuật toán Token Bucket (Thùng thẻ bài): 
     *   + Mỗi máy khách sẽ được cấp một chiếc "xô" chứa tối đa N token (thẻ bài).
     *   + Mỗi khi máy khách gửi 1 request, hệ thống sẽ lấy đi 1 token từ xô.
     *   + Nếu xô hết token, request sẽ bị từ chối.
     *   + Token sẽ tự động được hồi lại (refill) vào xô theo thời gian định trước.
     */
    private Bucket createNewBucket() {
        // Cấu hình giới hạn lưu lượng (Bandwidth): tối đa 100 requests (Capacity) và nạp lại 100 requests sau mỗi 1 phút
        Bandwidth limit = Bandwidth.builder()
                .capacity(100)
                .refillGreedy(100, Duration.ofMinutes(1)) // Nạp lại dần dần (greedy) tổng cộng 100 token trong vòng 1 phút
                .build();
        
        // Tạo và trả về đối tượng Bucket từ cấu hình giới hạn trên
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Phương thức doFilter thực thi lọc mỗi khi có request đi qua.
     * 
     * @param servletRequest  Yêu cầu gửi đến (chứa thông tin IP, Header, Params,...)
     * @param servletResponse Phản hồi gửi đi (chứa thông tin Status, Body, Header,...)
     * @param filterChain     Chuỗi các bộ lọc tiếp theo (hoặc Controller đích nếu đây là bộ lọc cuối)
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        // Ép kiểu (cast) về Http Servlet để lấy được các thông tin giao thức HTTP đầy đủ
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // TỐI ƯU HÓA: Lấy IP thật của khách hàng kể cả khi hệ thống chạy sau Proxy ngược (Nginx, Cloudflare)
        // Nếu không check header này, tất cả người dùng đi qua Nginx sẽ có cùng IP là 127.0.0.1 và bị giới hạn nhầm lẫn nhau.
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr(); // Nếu không qua proxy, lấy IP trực tiếp kết nối
        }

        // Tìm kiếm chiếc xô tương ứng với IP trong Cache. 
        // Nếu IP này chưa từng gửi yêu cầu, hàm computeIfAbsent sẽ gọi hàm createNewBucket() để tạo mới một chiếc xô và lưu vào Cache.
        Bucket bucket = cache.computeIfAbsent(clientIp, k -> createNewBucket());

        // Thử tiêu thụ 1 token trong xô (tương ứng với 1 request hiện tại)
        if (bucket.tryConsume(1)) {
            // Nếu còn token, cho phép request tiếp tục đi sâu vào hệ thống (đến các bộ lọc tiếp theo hoặc Controller xử lý)
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            // Nếu đã hết token, chặn request lại và trả về phản hồi lỗi ngay lập tức
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // Mã trạng thái HTTP 429: Too Many Requests
            response.setContentType("application/json");             // Định dạng dữ liệu phản hồi là JSON
            response.setCharacterEncoding("UTF-8");                  // Bảng mã tiếng Việt UTF-8
            
            // Viết nội dung thông báo lỗi dưới dạng JSON gửi về cho Client
            response.getWriter().write(
                "{\"error\": \"Bạn đã thao tác quá nhanh, vui lòng thử lại sau\"}");
        }
    }
}
