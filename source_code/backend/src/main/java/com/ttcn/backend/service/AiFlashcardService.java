package com.ttcn.backend.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.ttcn.backend.dto.request.SaveFlashcardDraftRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AiFlashcardService {
    List<Map<String, String>> generateFlashcardsFromUrl(String pdfUrl, String title) throws Exception;

    // New Advanced Methods
    SseEmitter extractFlashcardsStream(MultipartFile file);
    void saveFlashcardDraft(SaveFlashcardDraftRequest request, UUID teacherId) throws Exception;

    // Student method to extract flashcards directly from uploaded PDF
    List<Map<String, String>> extractFlashcards(MultipartFile file) throws Exception;
}