package com.ttcn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDTO {
    private UUID id;

    @NotNull(message = "Chapter number is mandatory")
    private Integer chapter;

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    @NotNull(message = "Order is mandatory")
    private Integer order;

    private String videoUrl;

    @NotNull(message = "Course ID is mandatory")
    private UUID courseId;
}
