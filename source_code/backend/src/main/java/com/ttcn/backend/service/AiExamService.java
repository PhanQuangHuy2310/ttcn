/**
 * FILE: AiExamService.java
 * MÔ TẢ: Interface định nghĩa các nghiệp vụ xử lý đề thi bằng AI.
 * CHỨC NĂNG: Khai báo các hàm bóc tách câu hỏi từ PDF (file hoặc URL) và lưu bản nháp đề thi.
 */
package com.ttcn.backend.service;

import com.ttcn.backend.dto.request.SaveExamDraftRequest;
import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import com.ttcn.backend.entity.Exam;
import com.ttcn.backend.entity.Question;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface AiExamService {
    List<AiQuestionDraftResponse> extractQuestionsFromPdf(MultipartFile file) throws Exception;
    void saveExamDraft(SaveExamDraftRequest request) throws Exception;
    List<Exam> searchExams(String keyword);
    List<Question> searchQuestions(String keyword);
    List<Map<String, Object>> extractQuestionsFromUrl(String pdfUrl, String title) throws Exception;
}
