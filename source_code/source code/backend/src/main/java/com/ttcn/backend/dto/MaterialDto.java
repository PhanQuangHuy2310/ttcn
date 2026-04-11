package com.ttcn.backend.dto;

import com.ttcn.backend.entity.MaterialType;
import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialDTO {
    private UUID id;
    private UUID lessonId;
    private String title;
    private String fileUrl;
    private MaterialType type;
    private Integer size;
}
