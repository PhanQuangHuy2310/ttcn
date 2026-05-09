/**
 * FILE: Question.java
 * MÔ TẢ: Thực thể đại diện cho Câu hỏi trong đề thi.
 * CHỨC NĂNG: Lưu trữ nội dung câu hỏi, loại câu hỏi (trắc nghiệm/tự luận), các lựa chọn và đáp án đúng.
 */
package com.ttcn.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    private Double points;

    // TEXT instead of jsonb
    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(name = "correct_answer")
    private String correctAnswer;

    public enum QuestionType {
        MCQ, ESSAY
    }
}
