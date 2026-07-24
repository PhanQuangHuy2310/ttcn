package com.ttcn.backend.service.impl;

import com.ttcn.backend.entity.Exam;
import com.ttcn.backend.entity.Question;
import com.ttcn.backend.entity.Submission;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.repository.QuestionRepository;
import com.ttcn.backend.repository.SubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AutoGradeServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private AutoGradeService autoGradeService;

    private Exam exam;
    private User student;
    private Submission submission;

    @BeforeEach
    void setUp() {
        exam = Exam.builder()
                .id(UUID.randomUUID())
                .duration(60)
                .build();

        student = User.builder()
                .userId(UUID.randomUUID())
                .build();

        submission = Submission.builder()
                .id(UUID.randomUUID())
                .exam(exam)
                .student(student)
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now().minusMinutes(65)) // Past duration + 1 min buffer
                .build();
    }

    @Test
    void autoGradeExpiredExams_shouldGradeAndCalculateScore_whenExamIsExpired() {
        // Arrange
        when(submissionRepository.findByStatus("IN_PROGRESS"))
                .thenReturn(Collections.singletonList(submission));

        Question q1 = Question.builder()
                .id(UUID.randomUUID())
                .type(Question.QuestionType.MCQ)
                .correctAnswer("A")
                .build();

        Question q2 = Question.builder()
                .id(UUID.randomUUID())
                .type(Question.QuestionType.MCQ)
                .correctAnswer("B")
                .build();

        when(questionRepository.findByExamId(exam.getId()))
                .thenReturn(Arrays.asList(q1, q2));

        submission.setAnswers(Map.of(
                q1.getId().toString(), "A",
                q2.getId().toString(), "C"
        ));

        // Act
        autoGradeService.autoGradeExpiredExams();

        // Assert
        verify(submissionRepository, times(1)).save(submission);
        assertEquals("GRADED", submission.getStatus());
        assertEquals(5.0, submission.getScore()); // 1 correct out of 2 => 5.0 points
        assertNotNull(submission.getSubmittedAt());
    }

    @Test
    void autoGradeExpiredExams_shouldNotGrade_whenExamIsNotExpired() {
        // Arrange
        // Set started time to just 10 mins ago (not expired yet, duration is 60)
        submission.setStartedAt(LocalDateTime.now().minusMinutes(10));
        when(submissionRepository.findByStatus("IN_PROGRESS"))
                .thenReturn(Collections.singletonList(submission));

        // Act
        autoGradeService.autoGradeExpiredExams();

        // Assert
        verify(questionRepository, never()).findByExamId(any());
        verify(submissionRepository, never()).save(any());
        assertEquals("IN_PROGRESS", submission.getStatus());
    }

    @Test
    void autoGradeExpiredExams_shouldSetStatusToPendingEssay_whenContainsEssay() {
        // Arrange
        when(submissionRepository.findByStatus("IN_PROGRESS"))
                .thenReturn(Collections.singletonList(submission));

        Question q1 = Question.builder()
                .id(UUID.randomUUID())
                .type(Question.QuestionType.MCQ)
                .correctAnswer("A")
                .build();

        Question q2 = Question.builder()
                .id(UUID.randomUUID())
                .type(Question.QuestionType.ESSAY)
                .build();

        when(questionRepository.findByExamId(exam.getId()))
                .thenReturn(Arrays.asList(q1, q2));

        submission.setAnswers(Map.of(
                q1.getId().toString(), "A"
        ));

        // Act
        autoGradeService.autoGradeExpiredExams();

        // Assert
        verify(submissionRepository, times(1)).save(submission);
        assertEquals("PENDING_ESSAY_GRADING", submission.getStatus());
        assertEquals(10.0, submission.getScore()); // 1 correct MCQ out of 1 => 10.0 points
    }
}
