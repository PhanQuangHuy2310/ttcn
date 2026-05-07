package com.ttcn.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "flashcards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "set_id", nullable = false)
    private FlashcardSet flashcardSet;

    // Để TEXT vì câu trả lời của AI có thể dài
    @Column(name = "front_text", columnDefinition = "TEXT", nullable = false)
    private String frontText;

    @Column(name = "back_text", columnDefinition = "TEXT", nullable = false)
    private String backText;

    @Column(name = "image_url")
    private String imageUrl;

    // Postgres dùng keyword "order", cần dùng dấu ngoặc kép để tránh lỗi SQL syntax
    @Column(name = "\"order\"")
    private Integer order;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}