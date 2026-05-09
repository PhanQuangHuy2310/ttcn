package com.ttcn.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiQuestionDraftResponse {
    private String content;
    private String type; // MCQ or ESSAY
    private String difficulty; // EASY, MEDIUM, HARD
    private Double points;
    private List<String> options; // Nullable for ESSAY
    private String correctAnswer; // Nullable or sample answer for ESSAY
}
