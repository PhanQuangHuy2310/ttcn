package com.ttcn.backend.controller;

import com.ttcn.backend.dto.MaterialDTO;
import com.ttcn.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    public ResponseEntity<MaterialDTO> createMaterial(@RequestBody MaterialDTO materialDto) {
        MaterialDTO savedMaterial = materialService.createMaterial(materialDto);
        return new ResponseEntity<>(savedMaterial, HttpStatus.CREATED);
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByLesson(@PathVariable("lessonId") UUID lessonId) {
        List<MaterialDTO> materials = materialService.getMaterialsByLesson(lessonId);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getMaterialById(@PathVariable("id") UUID id) {
        MaterialDTO materialDto = materialService.getMaterialById(id);
        return ResponseEntity.ok(materialDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable("id") UUID id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
