package com.ttcn.backend.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AiFlashcardService {
    Map<String, Object> generateAndSaveFlashcards(MultipartFile file, UUID userId) throws Exception;

    List<Map<String, String>> generateFlashcardsFromUrl(String pdfUrl, String title) throws Exception;

    List<Map<String, Object>> extractQuestionsFromUrl(String pdfUrl, String title) throws Exception;
}