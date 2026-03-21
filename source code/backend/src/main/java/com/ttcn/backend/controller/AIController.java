package com.ttcn.backend.controller;

import com.ttcn.backend.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

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
}
