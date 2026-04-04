package com.ttcn.backend.service;

import java.util.Map;
import java.util.UUID;

public interface AIService {
    Map<String, Object> generateQuestions(UUID materialId);
    Map<String, Object> summarizeLesson(UUID lessonId);
    Map<String, Object> createSyllabus(String courseName, String description);
}
