package com.ttcn.backend.dto.request;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class SaveFlashcardDraftRequest {
    private String draftId;
    private String title;
    private String description;
    private UUID courseId; // ID của khóa học để gửi thông báo cho sinh viên trong các lớp thuộc khóa học này
    private List<FlashcardDraft> flashcards;

    @Data
    public static class FlashcardDraft {
        private String frontText;
        private String backText;
        private String hint;
    }
}
