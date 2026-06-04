package com.ttcn.backend.controller;

import com.ttcn.backend.service.AiFlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentAiController {

    private final AiFlashcardService aiFlashcardService;

    public StudentAiController(AiFlashcardService aiFlashcardService) {
        this.aiFlashcardService = aiFlashcardService;
    }

    @PostMapping("/ai/extract-flashcards")
    public ResponseEntity<?> extractFlashcards(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng tải lên file PDF hợp lệ"));
            }
            List<Map<String, String>> flashcards = aiFlashcardService.extractFlashcards(file);
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý AI: " + e.getMessage()));
        }
    }
}
