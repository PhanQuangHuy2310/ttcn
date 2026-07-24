package com.ttcn.backend.service.impl;

import com.ttcn.backend.entity.Exam;
import com.ttcn.backend.entity.Question;
import com.ttcn.backend.entity.Submission;
import com.ttcn.backend.repository.QuestionRepository;
import com.ttcn.backend.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutoGradeService {

    private final SubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;

    /**
     * Cron job runs every minute to find abandoned exams and auto-submit them.
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoGradeExpiredExams() {
        List<Submission> inProgressSubmissions = submissionRepository.findByStatus("IN_PROGRESS");
        if (inProgressSubmissions.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        int gradedCount = 0;

        for (Submission sub : inProgressSubmissions) {
            Exam exam = sub.getExam();
            if (exam == null) continue;

            LocalDateTime startedAt = sub.getStartedAt();
            if (startedAt == null) {
                // Fallback using created_at
                startedAt = sub.getCreatedAt();
                if (startedAt == null) startedAt = now;
            }

            Integer durationMinutes = exam.getDuration() != null ? exam.getDuration() : 60;
            LocalDateTime absoluteLimit = startedAt.plusMinutes(durationMinutes);

            // Tôn trọng end_time cứng của đề thi
            if (exam.getEndTime() != null) {
                if (exam.getEndTime().isBefore(absoluteLimit)) {
                    absoluteLimit = exam.getEndTime();
                }
            }

            // Cho phép độ trễ 1 phút (60s) để frontend kịp gọi API nộp bài bình thường
            if (now.isAfter(absoluteLimit.plusMinutes(1))) {
                gradeSubmission(sub);
                gradedCount++;
            }
        }

        if (gradedCount > 0) {
            log.info("[AutoGradeService] Successfully auto-graded {} expired submissions.", gradedCount);
        }
    }

    private void gradeSubmission(Submission sub) {
        List<Question> questions = questionRepository.findByExamId(sub.getExam().getId());
        if (questions == null || questions.isEmpty()) {
            sub.setStatus("GRADED");
            sub.setScore(0.0);
            sub.setSubmittedAt(LocalDateTime.now());
            submissionRepository.save(sub);
            return;
        }

        long totalMcq = questions.stream().filter(q -> q.getType() == Question.QuestionType.MCQ).count();
        boolean hasEssay = questions.stream().anyMatch(q -> q.getType() == Question.QuestionType.ESSAY);

        Map<String, Object> answers = sub.getAnswers();
        long correctCount = 0;

        if (answers != null && totalMcq > 0) {
            for (Question q : questions) {
                if (q.getType() == Question.QuestionType.MCQ) {
                    Object studentAns = answers.get(q.getId().toString());
                    String correctAns = q.getCorrectAnswer();
                    if (studentAns != null && correctAns != null) {
                        if (studentAns.toString().trim().equalsIgnoreCase(correctAns.trim())) {
                            correctCount++;
                        }
                    }
                }
            }
        }

        double score = 0.0;
        if (totalMcq > 0) {
            score = (10.0 / totalMcq) * correctCount;
            score = Math.round(score * 100.0) / 100.0;
        }

        sub.setScore(score);
        sub.setStatus(hasEssay ? "PENDING_ESSAY_GRADING" : "GRADED");
        sub.setSubmittedAt(LocalDateTime.now());
        
        submissionRepository.save(sub);
        log.info("[AutoGradeService] Auto-submitted exam {} for student {}. Score: {}", 
                sub.getExam().getId(), sub.getStudent().getUserId(), score);
    }
}
