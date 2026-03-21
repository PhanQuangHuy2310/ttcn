package com.ttcn.backend.service;

import com.ttcn.backend.dto.CourseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CourseService {
    Page<CourseDTO> getAllCourses(Pageable pageable);
    CourseDTO getCourseById(UUID id);
    CourseDTO createCourse(CourseDTO courseDTO, UUID instructorId);
    CourseDTO updateCourse(UUID id, CourseDTO courseDTO, UUID currentUserId);
    void deleteCourse(UUID id, UUID currentUserId);
    void enrollCourse(UUID studentId, UUID courseId);
}
