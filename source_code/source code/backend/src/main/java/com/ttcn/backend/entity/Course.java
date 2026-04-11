package com.ttcn.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    // TEXT instead of jsonb — avoids dialect-specific DDL errors with ddl-auto=update
    @Column(columnDefinition = "TEXT")
    private String syllabus;

    private String semester;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
