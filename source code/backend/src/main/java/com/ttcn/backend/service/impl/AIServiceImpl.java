package com.ttcn.backend.service.impl;

import com.ttcn.backend.service.AIService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AIServiceImpl implements AIService {

    @Override
    public Map<String, Object> generateQuestions(UUID materialId) {
        // Mocking MCP Server response
        Map<String, Object> response = new HashMap<>();
        response.put("materialId", materialId);
        response.put("status", "success");
        response.put("questions", "AI generated questions would go here.");
        return response;
    }

    @Override
    public Map<String, Object> summarizeLesson(UUID lessonId) {
        // Mocking MCP Server response
        Map<String, Object> response = new HashMap<>();
        response.put("lessonId", lessonId);
        response.put("summary", "AI generated summary of the lesson.");
        return response;
    }

    @Override
    public Map<String, Object> createSyllabus(String courseName, String description) {
        // Mocking MCP Server response
        Map<String, Object> response = new HashMap<>();
        response.put("courseName", courseName);
        response.put("syllabus", "AI generated course syllabus.");
        return response;
    }
}
