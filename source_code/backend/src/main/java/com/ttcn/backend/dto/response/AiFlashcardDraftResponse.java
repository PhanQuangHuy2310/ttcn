package com.ttcn.backend.dto.response;

import com.ttcn.backend.entity.Flashcard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * FILE: AiFlashcardDraftResponse.java
 * MÔ TẢ: DTO phản hồi chứa bản nháp bộ thẻ ghi nhớ (Flashcards) do AI tạo ra.
 * CHỨC NĂNG: Chuyển dữ liệu từ AI Service về Controller để hiển thị cho người dùng kiểm tra trước khi lưu.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiFlashcardDraftResponse {
    private String draftId;
    private List<Flashcard> flashcards;
}
