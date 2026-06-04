package com.ttcn.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.spec.SecretKeySpec;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Cấu hình bảo mật ứng dụng (Spring Security Configuration).
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - File này chịu trách nhiệm thiết lập các lớp bảo vệ bên ngoài hệ thống.
 * - Quy định những đường dẫn (URL) nào ai cũng có thể truy cập (public), những đường dẫn nào yêu cầu quyền Giáo viên (TEACHER).
 * - Sử dụng cơ chế xác thực dựa trên JWT (JSON Web Token) được cung cấp bởi Supabase để nhận diện danh tính người dùng.
 */
@Configuration // Đánh dấu lớp này là một lớp cấu hình của Spring Boot
@EnableWebSecurity // Kích hoạt tính năng Bảo mật Web (Web Security)
@EnableMethodSecurity // Cho phép phân quyền chi tiết trên từng hàm xử lý thông qua các Annotations như @PreAuthorize
public class SecurityConfig {

    // Lấy chuỗi khóa bí mật (Secret Key) từ biến môi trường của hệ thống
    @Value("${JWT_SECRET}")
    private String jwtSecret;

    // Đường dẫn URI để lấy cấu hình khóa công khai (JWK Set) của Supabase nhằm xác thực chữ ký token
    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    /**
     * Định nghĩa bộ quy tắc lọc bảo mật (Security Filter Chain) cho tất cả các HTTP requests.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Vô hiệu hóa CSRF (Cross-Site Request Forgery). 
            // TỐI ƯU HÓA/GIẢI THÍCH: Vì API của chúng ta là Stateless (không lưu session trên server, dùng JWT lưu ở client và truyền qua header),
            // nên không bị tấn công CSRF thông qua cookie. Vô hiệu hóa giúp giảm tải xử lý và đơn giản hóa API.
            .csrf(csrf -> csrf.disable())
            
            // 2. Kích hoạt cấu hình CORS mặc định (Cross-Origin Resource Sharing). 
            // Cho phép các máy khách ở domain khác (như React chạy ở localhost:5173) gửi request đến Backend.
            .cors(Customizer.withDefaults())

            // TỐI ƯU HÓA: Cấu hình quản lý Session là STATELESS.
            // Đảm bảo Spring Security không bao giờ tạo HTTP Session lưu trữ thông tin đăng nhập trên Server,
            // mọi request đều phải mang theo JWT Token để xác thực lại độc lập. Tiết kiệm RAM cho máy chủ.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Cấu hình phân quyền truy cập cho các nhóm API
            .authorizeHttpRequests(auth -> auth
                // Cho phép bất kỳ ai (không cần đăng nhập) cũng có thể gọi các API công khai bắt đầu bằng /api/public/
                .requestMatchers("/api/public/**").permitAll()
                // Chỉ những tài khoản có vai trò 'TEACHER' mới được truy cập các API bắt đầu bằng /api/teacher/
                .requestMatchers("/api/teacher/**").hasAuthority("TEACHER")
                // Tất cả các yêu cầu còn lại đều bắt buộc phải đăng nhập thành công mới được truy cập
                .anyRequest().authenticated()
            )
            
            // 4. Cấu hình xác thực dựa trên tài nguyên OAuth2 (Resource Server) hỗ trợ giải mã JWT Token
            .oauth2ResourceServer(oauth2 -> oauth2
                // Sử dụng Converter tự định nghĩa bên dưới để chuyển thông tin từ Token thành Quyền hạn (Authorities) tương ứng
                .jwt(jwt -> jwt.jwtAuthenticationConverter(getJwtAuthenticationConverter()))
            );
        
        return http.build();
    }

    /**
     * Cấu hình bộ giải mã JWT Token (JwtDecoder).
     * Supabase sử dụng thuật toán ký ES256 (Elliptic Curve DSA với SHA-256).
     * Hàm này chỉ định Spring Security kết nối đến Endpoint jwkSetUri của Supabase để tải khóa xác thực token tự động.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
                .jwsAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.ES256)
                .build();
    }

    /**
     * Bộ chuyển đổi (Converter) giúp ánh xạ dữ liệu từ JWT Claim của Supabase sang đối tượng xác thực của Spring Security.
     * 
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
     * - Khi Supabase tạo token JWT, thông tin cá nhân của người dùng sẽ được lưu trong một trường gọi là "user_metadata".
     * - Ta cần đọc trường này, kiểm tra xem biến "is_teacher" là true hay false.
     * - Dựa vào đó, gán quyền tương ứng (TEACHER hoặc STUDENT) vào ngữ cảnh bảo mật của Spring (SecurityContext)
     *   để các hàm kiểm tra quyền truy cập ở trên (`hasAuthority("TEACHER")`) có thể hoạt động chính xác.
     */
    private Converter<Jwt, AbstractAuthenticationToken> getJwtAuthenticationConverter() {
        return jwt -> {
            List<GrantedAuthority> authorities = new ArrayList<>();
            
            // Lấy claim "user_metadata" dạng Bản đồ (Map) từ payload của JWT
            Map<String, Object> userMetadata = jwt.getClaim("user_metadata");
            if (userMetadata != null) {
                // Đọc thuộc tính "is_teacher"
                Boolean isTeacher = (Boolean) userMetadata.get("is_teacher");
                if (Boolean.TRUE.equals(isTeacher)) {
                    // Nếu là giáo viên, cấp quyền TEACHER và ROLE_TEACHER
                    authorities.add(new SimpleGrantedAuthority("TEACHER"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_TEACHER"));
                } else {
                    // Ngược lại, cấp quyền STUDENT và ROLE_STUDENT
                    authorities.add(new SimpleGrantedAuthority("STUDENT"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
                }
            } else {
                // Đề phòng trường hợp metadata rỗng, mặc định gán quyền học sinh
                authorities.add(new SimpleGrantedAuthority("STUDENT"));
                authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
            }
            
            // Trả về đối tượng JwtAuthenticationToken chứa thông tin Token đã xác thực và danh sách quyền hạn đã phân tích
            return new JwtAuthenticationToken(jwt, authorities);
        };
    }
}
