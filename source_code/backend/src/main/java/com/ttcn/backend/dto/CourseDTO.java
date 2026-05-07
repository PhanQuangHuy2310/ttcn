package com.ttcn.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private UUID id;

    @NotBlank(message = "Course code is mandatory")
    private String code;

    @NotBlank(message = "Course name is mandatory")
    private String name;

    private String syllabus;

    @NotBlank(message = "Semester is mandatory")
    private String semester;
    private String thumbnailUrl;
    private UserDTO teacher;
    private LocalDateTime createdAt;
}
