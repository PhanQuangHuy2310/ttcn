package com.ttcn.backend.dto.request;

import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SaveExamDraftRequest {
    private String examTitle;
    private UUID courseId;
    private List<AiQuestionDraftResponse> questions;
}
