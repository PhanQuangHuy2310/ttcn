package com.ttcn.backend.service;

import com.ttcn.backend.dto.MaterialDto;
import java.util.List;
import java.util.UUID;

public interface MaterialService {
    MaterialDto createMaterial(MaterialDto materialDto);
    List<MaterialDto> getMaterialsByLesson(UUID lessonId);
    MaterialDto getMaterialById(UUID id);
    void deleteMaterial(UUID id);
}
