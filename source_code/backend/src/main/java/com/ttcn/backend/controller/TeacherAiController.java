/**
 * FILE: TeacherAiController.java
 * MÔ TẢ: Controller điều hướng các yêu cầu liên quan đến AI cho Giáo viên.
 * CHỨC NĂNG: Cung cấp API bóc tách câu hỏi, thẻ ghi nhớ từ PDF và lưu trữ kết quả xử lý của AI.
 */
package com.ttcn.backend.controller;

import com.ttcn.backend.dto.request.SaveExamDraftRequest;
import com.ttcn.backend.dto.request.SaveFlashcardDraftRequest;
import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import com.ttcn.backend.service.AiExamService;
import com.ttcn.backend.service.AiFlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller xử lý các yêu cầu liên quan đến AI dành cho Giáo viên.
 * Chỉ những tài khoản có quyền 'TEACHER' mới có thể truy cập các API này.
 */
@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasAuthority('TEACHER')")
public class TeacherAiController {

    private final AiExamService aiExamService;
    private final AiFlashcardService aiFlashcardService;

    // Sử dụng Constructor Injection để đảm bảo tính sẵn sàng của Service
    public TeacherAiController(AiExamService aiExamService, AiFlashcardService aiFlashcardService) {
        this.aiExamService = aiExamService;
        this.aiFlashcardService = aiFlashcardService;
    }

    /**
     * API bóc tách câu hỏi đề thi từ file PDF.
     * Trả về danh sách câu hỏi nháp để giáo viên xem lại.
     */
    @PostMapping("/ai/extract-questions")
    public ResponseEntity<?> extractQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "docType", required = false, defaultValue = "THEORY") String docType) {
        try {
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng tải lên file PDF hợp lệ"));
            }
            List<AiQuestionDraftResponse> draftQuestions = aiExamService.extractQuestionsFromPdf(file, docType);
            return ResponseEntity.ok(draftQuestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý AI: " + e.getMessage()));
        }
    }

    /**
     * API lưu bộ câu hỏi đề thi sau khi giáo viên đã chỉnh sửa xong.
     */
    @PostMapping("/exams/save-draft")
    public ResponseEntity<?> saveExamDraft(@RequestBody SaveExamDraftRequest request) {
        try {
            aiExamService.saveExamDraft(request);
            return ResponseEntity.ok(Map.of("message", "Đã lưu bộ câu hỏi thành công!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi lưu bộ câu hỏi: " + e.getMessage()));
        }
    }

    /**
     * API bóc tách Flashcards từ PDF sử dụng Server-Sent Events (SSE).
     * Cung cấp phản hồi thời gian thực về tiến độ xử lý của AI.
     */
    @PostMapping("/ai/extract-flashcards/stream")
    public SseEmitter extractFlashcardsStream(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
            SseEmitter emitter = new SseEmitter();
            emitter.completeWithError(new IllegalArgumentException("Vui lòng tải lên file PDF hợp lệ"));
            return emitter;
        }
        return aiFlashcardService.extractFlashcardsStream(file);
    }

    /**
     * API lưu bộ Flashcard sau khi chỉnh sửa và gửi thông báo cho học sinh.
     */
    @PostMapping("/flashcards/save-draft")
    public ResponseEntity<?> saveFlashcardDraft(@RequestBody SaveFlashcardDraftRequest request, Authentication authentication) {
        try {
            // Lấy ID của giáo viên hiện tại từ JWT token của Supabase
            Jwt jwt = (Jwt) authentication.getPrincipal();
            UUID teacherId = UUID.fromString(jwt.getSubject());
            
            aiFlashcardService.saveFlashcardDraft(request, teacherId);
            return ResponseEntity.ok(Map.of("message", "Đã lưu bộ Flashcard thành công và gửi thông báo tới học sinh!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi lưu bộ Flashcard: " + e.getMessage()));
        }
    }
    /**
     * API bóc tách câu hỏi từ URL file PDF (đã upload lên Supabase).
     */
    @PostMapping("/ai/extract-questions/url")
    public ResponseEntity<?> extractQuestionsFromUrl(@RequestBody Map<String, String> request) {
        try {
            String pdfUrl = request.get("pdfUrl");
            String title = request.get("title");
            if (pdfUrl == null || pdfUrl.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Thiếu pdfUrl"));
            }
            List<Map<String, Object>> draftQuestions = aiExamService.extractQuestionsFromUrl(pdfUrl, title);
            return ResponseEntity.ok(draftQuestions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý AI: " + e.getMessage()));
        }
    }

    /**
     * API bóc tách Flashcards từ URL file PDF (đã upload lên Supabase).
     */
    @PostMapping("/ai/extract-flashcards/url")
    public ResponseEntity<?> extractFlashcardsFromUrl(@RequestBody Map<String, String> request) {
        try {
            String pdfUrl = request.get("pdfUrl");
            String title = request.get("title");
            if (pdfUrl == null || pdfUrl.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Thiếu pdfUrl"));
            }
            List<Map<String, String>> draftFlashcards = aiFlashcardService.generateFlashcardsFromUrl(pdfUrl, title);
            return ResponseEntity.ok(draftFlashcards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý AI: " + e.getMessage()));
        }
    }
}
