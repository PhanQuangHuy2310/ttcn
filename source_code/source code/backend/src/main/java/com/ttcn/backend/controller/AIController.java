package com.ttcn.backend.controller;

import com.ttcn.backend.service.AIService;
import com.ttcn.backend.service.AiFlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;
    private final AiFlashcardService aiFlashcardService;

    @PostMapping("/generate-questions")
    public ResponseEntity<Map<String, Object>> generateQuestions(@RequestBody Map<String, String> request) {
        UUID materialId = UUID.fromString(request.get("materialId"));
        return ResponseEntity.ok(aiService.generateQuestions(materialId));
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, Object>> summarizeLesson(@RequestBody Map<String, String> request) {
        UUID lessonId = UUID.fromString(request.get("lessonId"));
        return ResponseEntity.ok(aiService.summarizeLesson(lessonId));
    }

    @PostMapping("/create-syllabus")
    public ResponseEntity<Map<String, Object>> createSyllabus(@RequestBody Map<String, String> request) {
        String courseName = request.get("courseName");
        String description = request.get("description");
        return ResponseEntity.ok(aiService.createSyllabus(courseName, description));
    }

    @PostMapping("/generate-flashcards")
    public ResponseEntity<Map<String, Object>> generateFlashcardsFromPdf(
            @RequestParam("pdf") MultipartFile file,
            @RequestParam("userId") UUID userId) {
        try {
            Map<String, Object> result = aiFlashcardService.generateAndSaveFlashcards(file, userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-flashcards-from-url")
    public ResponseEntity<List<Map<String, String>>> generateFlashcardsFromUrl(
            @RequestBody Map<String, Object> request) {
        try {
            String pdfUrl = String.valueOf(request.get("pdfUrl"));
            String title = String.valueOf(request.get("title"));

            List<Map<String, String>> result = aiFlashcardService.generateFlashcardsFromUrl(pdfUrl, title);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/extract-questions-from-url")
    public ResponseEntity<List<Map<String, Object>>> extractQuestionsFromUrl(@RequestBody Map<String, Object> request) {
        try {
            String pdfUrl = String.valueOf(request.get("pdfUrl"));
            String title = request.containsKey("materialTitle")
                    ? String.valueOf(request.get("materialTitle"))
                    : String.valueOf(request.get("title"));

            List<Map<String, Object>> result = aiFlashcardService.extractQuestionsFromUrl(pdfUrl, title);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}