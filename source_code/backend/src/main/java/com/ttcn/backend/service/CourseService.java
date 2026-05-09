/**
 * FILE: CourseService.java
 * MÔ TẢ: Interface quản lý các nghiệp vụ liên quan đến Khóa học.
 * CHỨC NĂNG: Định nghĩa các thao tác CRUD cho khóa học và nghiệp vụ đăng ký khóa học cho sinh viên.
 */
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
    Page<CourseDTO> searchCourses(String keyword, Pageable pageable);
    void enrollCourse(UUID studentId, UUID courseId);
}
