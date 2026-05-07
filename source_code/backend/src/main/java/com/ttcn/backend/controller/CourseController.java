package com.ttcn.backend.controller;

import com.ttcn.backend.dto.CourseDTO;
import com.ttcn.backend.service.CourseService;
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
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(
            @Valid @RequestBody CourseDTO courseDTO,
            @RequestParam UUID instructorId) {
        CourseDTO created = courseService.createCourse(courseDTO, instructorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    @GetMapping
    public ResponseEntity<Page<CourseDTO>> getAllCourses(Pageable pageable) {
        return ResponseEntity.ok(courseService.getAllCourses(pageable));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody CourseDTO courseDTO,
            @RequestParam UUID currentUserId) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDTO, currentUserId));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable UUID id,
            @RequestParam UUID currentUserId) {
        courseService.deleteCourse(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<String> enrollCourse(
            @PathVariable UUID courseId,
            @RequestParam UUID studentId) {
        courseService.enrollCourse(studentId, courseId);
        return ResponseEntity.ok("Enrolled successfully in course " + courseId);
    }
}
