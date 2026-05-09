package com.ttcn.backend.service;

import com.ttcn.backend.dto.response.AiFlashcardDraftResponse;

/**
 * FILE: DraftStorage.java
 * MÔ TẢ: Interface quản lý bộ nhớ tạm cho các bản nháp AI.
 * CHỨC NĂNG: Cung cấp phương thức lưu, lấy và xóa bản nháp (Flashcards/Questions) trong quá trình xử lý AI.
 */
public interface DraftStorage {
    void saveDraft(String draftId, AiFlashcardDraftResponse draft);
    AiFlashcardDraftResponse getDraft(String draftId);
    void clearDraft(String draftId);
}
