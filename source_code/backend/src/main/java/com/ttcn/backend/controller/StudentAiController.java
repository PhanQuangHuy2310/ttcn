package com.ttcn.backend.controller;

import com.ttcn.backend.service.AiFlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các tác vụ AI cho Học sinh (Student AI Controller).
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - Lớp này định nghĩa các API Endpoint (Đầu cuối kết nối) nhận yêu cầu gửi lên từ giao diện của Học sinh.
 * - @RestController báo cho Spring Boot biết đây là lớp điều khiển API trả về dữ liệu thô (JSON/XML) thay vì render giao diện HTML (View).
 * - @RequestMapping("/api/student") quy định đường dẫn cơ sở cho mọi API trong lớp này.
 */
@RestController
@RequestMapping("/api/student")
public class StudentAiController {

    // Khai báo Dependency - lớp dịch vụ xử lý nghiệp vụ AI
    private final AiFlashcardService aiFlashcardService;

    /**
     * Constructor injection để nhúng đối tượng dịch vụ (Dependency Injection).
     * GIẢI THÍCH: Đây là thiết kế khuyến nghị trong Spring Boot thay vì dùng `@Autowired` trực tiếp trên trường (Field Injection).
     * Giúp code rõ ràng, dễ viết kiểm thử tự động (Unit Test) và đảm bảo các trường không bị null sau khi khởi tạo.
     */
    public StudentAiController(AiFlashcardService aiFlashcardService) {
        this.aiFlashcardService = aiFlashcardService;
    }

    /**
     * API nhận file PDF tải lên và gửi qua AI phân tích thành danh sách Flashcard.
     * Đường dẫn đầy đủ: POST http://localhost:8085/api/student/ai/extract-flashcards
     * 
     * @param file Đối tượng MultipartFile chứa dữ liệu file PDF tải lên từ client.
     * @return ResponseEntity đại diện cho phản hồi HTTP (kèm dữ liệu JSON hoặc thông báo lỗi).
     */
    @PostMapping("/ai/extract-flashcards")
    public ResponseEntity<?> extractFlashcards(@RequestParam("file") MultipartFile file) {
        try {
            // TỐI ƯU HÓA 1: Null-safe Content-Type check (getContentType() có thể null nếu trình duyệt không gửi lên)
            String contentType = file.getContentType();
            if (file.isEmpty() || contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng tải lên file PDF hợp lệ"));
            }

            // TỐI ƯU HÓA 2: Giới hạn kích thước file tải lên tối đa là 10MB để chống tràn bộ nhớ (Out Of Memory) của server PDFBox
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("message", "Kích thước file vượt quá giới hạn cho phép (Tối đa 10MB)"));
            }

            // Gọi dịch vụ bóc tách flashcards từ file PDF
            List<Map<String, String>> flashcards = aiFlashcardService.extractFlashcards(file);
            
            // Trả về danh sách thẻ Flashcard thành công (Mã HTTP 200 OK)
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            // Ghi lại log lỗi trên hệ thống (nếu có thư viện Logging) và trả về lỗi Server (Mã HTTP 500)
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý AI: " + e.getMessage()));
        }
    }
}
