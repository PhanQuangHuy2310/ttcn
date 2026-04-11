package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.MaterialDTO;
import com.ttcn.backend.entity.Lesson;
import com.ttcn.backend.entity.Material;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.LessonRepository;
import com.ttcn.backend.repository.MaterialRepository;
import com.ttcn.backend.service.MaterialService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final LessonRepository lessonRepository;

    @Override
    public MaterialDTO createMaterial(MaterialDTO materialDto) {
        Lesson lesson = lessonRepository.findById(materialDto.getLessonId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + materialDto.getLessonId()));
        
        Material material = mapToEntity(materialDto, lesson);
        Material savedMaterial = materialRepository.save(material);
        return mapToDto(savedMaterial);
    }

    @Override
    public List<MaterialDTO> getMaterialsByLesson(UUID lessonId) {
        return materialRepository.findByLessonId(lessonId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialDTO getMaterialById(UUID id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        return mapToDto(material);
    }

    @Override
    public void deleteMaterial(UUID id) {
        if (!materialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Material not found with id: " + id);
        }
        materialRepository.deleteById(id);
    }

    private MaterialDTO mapToDto(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .lessonId(material.getLesson() != null ? material.getLesson().getId() : null)
                .title(material.getTitle())
                .fileUrl(material.getFileUrl())
                .type(material.getType())
                .size(material.getSize())
                .build();
    }

    private Material mapToEntity(MaterialDTO dto, Lesson lesson) {
        return Material.builder()
                .id(dto.getId())
                .lesson(lesson)
                .title(dto.getTitle())
                .fileUrl(dto.getFileUrl())
                .type(dto.getType())
                .size(dto.getSize())
                .build();
    }
}
