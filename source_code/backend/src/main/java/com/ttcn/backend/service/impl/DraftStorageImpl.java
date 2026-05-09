package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.response.AiFlashcardDraftResponse;
import com.ttcn.backend.service.DraftStorage;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * FILE: DraftStorageImpl.java
 * MÔ TẢ: Lớp triển khai của DraftStorage sử dụng bộ nhớ RAM (In-memory).
 * CHỨC NĂNG: Sử dụng ConcurrentHashMap để lưu trữ tạm thời các bản nháp AI trước khi người dùng xác nhận lưu chính thức vào Database.
 */
@Service
public class DraftStorageImpl implements DraftStorage {
    
    private final Map<String, AiFlashcardDraftResponse> storage = new ConcurrentHashMap<>();

    @Override
    public void saveDraft(String draftId, AiFlashcardDraftResponse draft) {
        storage.put(draftId, draft);
    }

    @Override
    public AiFlashcardDraftResponse getDraft(String draftId) {
        return storage.get(draftId);
    }

    @Override
    public void clearDraft(String draftId) {
        storage.remove(draftId);
    }
}
