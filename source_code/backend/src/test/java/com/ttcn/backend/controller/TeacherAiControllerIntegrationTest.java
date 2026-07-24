package com.ttcn.backend.controller;

import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import com.ttcn.backend.service.AiExamService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TeacherAiControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiExamService aiExamService;

    @Test
    @WithMockUser(authorities = "TEACHER")
    void extractQuestions_shouldReturnDraftQuestions_whenFileIsValid() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Dummy PDF content".getBytes()
        );

        AiQuestionDraftResponse mockQuestion = new AiQuestionDraftResponse();
        mockQuestion.setContent("1+1=?");
        mockQuestion.setOptions(List.of("1", "2", "3", "4"));
        mockQuestion.setCorrectAnswer("2");

        when(aiExamService.extractQuestionsFromPdf(any(), eq("THEORY")))
                .thenReturn(List.of(mockQuestion));

        // Act & Assert
        mockMvc.perform(multipart("/api/teacher/ai/extract-questions")
                        .file(file)
                        .param("docType", "THEORY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("1+1=?"))
                .andExpect(jsonPath("$[0].correctAnswer").value("2"));
    }

    @Test
    @WithMockUser(authorities = "TEACHER")
    void extractQuestions_shouldReturnBadRequest_whenFileIsNotPdf() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Dummy text content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/teacher/ai/extract-questions")
                        .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Vui lòng tải lên file PDF hợp lệ"));
    }

    @Test
    @WithMockUser(authorities = "STUDENT")
    void extractQuestions_shouldReturnForbidden_whenUserIsNotTeacher() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Dummy PDF content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/teacher/ai/extract-questions")
                        .file(file))
                .andExpect(status().isForbidden());
    }
}
