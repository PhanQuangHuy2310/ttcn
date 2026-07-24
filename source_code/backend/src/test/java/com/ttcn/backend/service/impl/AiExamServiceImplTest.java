package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.request.SaveExamDraftRequest;
import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Exam;
import com.ttcn.backend.entity.Question;
import com.ttcn.backend.repository.ClassRepository;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.ExamRepository;
import com.ttcn.backend.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiExamServiceImplTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ClassRepository classRepository;

    @InjectMocks
    private AiExamServiceImpl aiExamService;

    private SaveExamDraftRequest request;
    private Course course;

    @BeforeEach
    void setUp() {
        course = Course.builder().id(UUID.randomUUID()).build();

        AiQuestionDraftResponse q1 = AiQuestionDraftResponse.builder()
                .content("Q1")
                .type("MCQ")
                .points(10.0)
                .build();

        request = new SaveExamDraftRequest();
        request.setExamTitle("Draft Exam");
        request.setCourseId(course.getId());
        request.setQuestions(Arrays.asList(q1));
    }

    @Test
    void saveExamDraft_shouldSaveExamAndQuestions_whenValidRequest() throws Exception {
        // Arrange
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(examRepository.save(any(Exam.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        aiExamService.saveExamDraft(request);

        // Assert
        verify(examRepository, times(1)).save(any(Exam.class));
        ArgumentCaptor<Question> questionCaptor = ArgumentCaptor.forClass(Question.class);
        verify(questionRepository, times(1)).save(questionCaptor.capture());
        
        Question savedQuestion = questionCaptor.getValue();
        assertEquals("Q1", savedQuestion.getContent());
        assertEquals(Question.QuestionType.MCQ, savedQuestion.getType());
    }

    @Test
    void searchExams_shouldReturnExamList_whenGivenKeyword() {
        // Arrange
        String keyword = "Toan";
        Exam exam1 = new Exam();
        exam1.setTitle("Toan 1");
        
        when(examRepository.findByTitleContainingIgnoreCase(keyword))
                .thenReturn(Arrays.asList(exam1));

        // Act
        List<Exam> results = aiExamService.searchExams(keyword);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Toan 1", results.get(0).getTitle());
    }

    @Test
    void searchQuestions_shouldReturnQuestionList_whenGivenKeyword() {
        // Arrange
        String keyword = "AI";
        Question q1 = new Question();
        q1.setContent("What is AI?");
        
        when(questionRepository.findByContentContainingIgnoreCase(keyword))
                .thenReturn(Arrays.asList(q1));

        // Act
        List<Question> results = aiExamService.searchQuestions(keyword);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("What is AI?", results.get(0).getContent());
    }
}
