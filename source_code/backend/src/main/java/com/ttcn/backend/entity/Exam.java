package com.ttcn.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity; // 'Class' is a reserved keyword in Java

    @Column(nullable = false)
    private String title;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    private Integer duration; // in minutes

    private String password;

    @Column(name = "shuffle_questions")
    private Boolean shuffleQuestions;

    @Column(name = "anti_cheat")
    private Boolean antiCheat;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
