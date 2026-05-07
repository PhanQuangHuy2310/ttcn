package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.LessonDTO;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Lesson;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.LessonRepository;
import com.ttcn.backend.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<LessonDTO> getAllLessons(Pageable pageable, UUID courseId) {
        if (courseId != null) {
            List<LessonDTO> lessons = lessonRepository.findByCourseId(courseId)
                    .stream().map(this::mapToDTO).collect(Collectors.toList());
            // Fake pagination for custom query, or add query to repo
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), lessons.size());
            return new PageImpl<>(lessons.subList(start, end), pageable, lessons.size());
        }
        return lessonRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public LessonDTO getLessonById(UUID id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson/Module", "id", id));
        return mapToDTO(lesson);
    }

    @Override
    @Transactional
    public LessonDTO createLesson(LessonDTO lessonDTO) {
        Course course = courseRepository.findById(lessonDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", lessonDTO.getCourseId()));
                
        Lesson lesson = Lesson.builder()
                .chapter(lessonDTO.getChapter())
                .title(lessonDTO.getTitle())
                .description(lessonDTO.getDescription())
                .order(lessonDTO.getOrder())
                .videoUrl(lessonDTO.getVideoUrl())
                .course(course)
                .build();
                
        Lesson savedLesson = lessonRepository.save(lesson);
        return mapToDTO(savedLesson);
    }

    @Override
    @Transactional
    public LessonDTO updateLesson(UUID id, LessonDTO lessonDTO) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson/Module", "id", id));
                
        Course course = courseRepository.findById(lessonDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", lessonDTO.getCourseId()));
        
        lesson.setChapter(lessonDTO.getChapter());
        lesson.setTitle(lessonDTO.getTitle());
        lesson.setDescription(lessonDTO.getDescription());
        lesson.setOrder(lessonDTO.getOrder());
        lesson.setVideoUrl(lessonDTO.getVideoUrl());
        lesson.setCourse(course);
        
        Lesson updatedLesson = lessonRepository.save(lesson);
        return mapToDTO(updatedLesson);
    }

    @Override
    @Transactional
    public void deleteLesson(UUID id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson/Module", "id", id));
        lessonRepository.delete(lesson);
    }

    private LessonDTO mapToDTO(Lesson lesson) {
        // ... (mapper logic)
        UUID currentCourseId = lesson.getCourse() != null ? lesson.getCourse().getId() : null;
        return LessonDTO.builder()
                .id(lesson.getId())
                .chapter(lesson.getChapter())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .order(lesson.getOrder())
                .videoUrl(lesson.getVideoUrl())
                .courseId(currentCourseId)
                .build();
    }
}
