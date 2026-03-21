package com.ttcn.backend.controller;

import com.ttcn.backend.dto.LessonDTO;
import com.ttcn.backend.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ResponseEntity<LessonDTO> createLesson(@Valid @RequestBody LessonDTO lessonDTO) {
        LessonDTO created = lessonService.createLesson(lessonDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    @GetMapping
    public ResponseEntity<Page<LessonDTO>> getAllLessons(
            Pageable pageable, 
            @RequestParam(required = false) UUID courseId) {
        return ResponseEntity.ok(lessonService.getAllLessons(pageable, courseId));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    @GetMapping("/{id}")
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable UUID id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<LessonDTO> updateLesson(
            @PathVariable UUID id, 
            @Valid @RequestBody LessonDTO lessonDTO) {
        return ResponseEntity.ok(lessonService.updateLesson(id, lessonDTO));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
