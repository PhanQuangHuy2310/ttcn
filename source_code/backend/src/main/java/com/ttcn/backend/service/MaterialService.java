package com.ttcn.backend.service;

import com.ttcn.backend.dto.MaterialDTO;
import java.util.List;
import java.util.UUID;

public interface MaterialService {
    MaterialDTO createMaterial(MaterialDTO materialDto);
    List<MaterialDTO> getMaterialsByLesson(UUID lessonId);
    MaterialDTO getMaterialById(UUID id);
    void deleteMaterial(UUID id);
}
