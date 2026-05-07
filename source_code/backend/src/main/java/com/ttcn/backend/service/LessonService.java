package com.ttcn.backend.service;

import com.ttcn.backend.dto.LessonDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LessonService {
    Page<LessonDTO> getAllLessons(Pageable pageable, UUID courseId);
    LessonDTO getLessonById(UUID id);
    LessonDTO createLesson(LessonDTO lessonDTO);
    LessonDTO updateLesson(UUID id, LessonDTO lessonDTO);
    void deleteLesson(UUID id);
}
