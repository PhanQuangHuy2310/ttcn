package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.CourseDTO;
import com.ttcn.backend.dto.UserDTO;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Enrollment;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.entity.Role;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.EnrollmentRepository;
import com.ttcn.backend.repository.UserRepository;
import com.ttcn.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "courses")
    public Page<CourseDTO> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "course", key = "#id")
    public CourseDTO getCourseById(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapToDTO(course);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"courses", "course"}, allEntries = true)
    public CourseDTO createCourse(CourseDTO courseDTO, UUID instructorId) {
        User instructor = null;
        if (instructorId != null) {
            instructor = userRepository.findById(instructorId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));
            
            if (instructor.getRole() != Role.TEACHER) {
                throw new RuntimeException("Only instructors can create courses");
            }
        }
        
        Course course = Course.builder()
                .code(courseDTO.getCode())
                .name(courseDTO.getName())
                .syllabus(courseDTO.getSyllabus())
                .semester(courseDTO.getSemester())
                .thumbnailUrl(courseDTO.getThumbnailUrl())
                .teacher(instructor)
                .build();
                
        Course savedCourse = courseRepository.save(course);
        return mapToDTO(savedCourse);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"courses", "course"}, allEntries = true)
    public CourseDTO updateCourse(UUID id, CourseDTO courseDTO, UUID currentUserId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
                
        // Check ownership
        if (course.getTeacher() == null || !course.getTeacher().getUserId().equals(currentUserId)) {
            throw new RuntimeException("Forbidden: You are not the owner of this course");
        }
        
        course.setCode(courseDTO.getCode());
        course.setName(courseDTO.getName());
        course.setSyllabus(courseDTO.getSyllabus());
        course.setSemester(courseDTO.getSemester());
        course.setThumbnailUrl(courseDTO.getThumbnailUrl());
        
        Course updatedCourse = courseRepository.save(course);
        return mapToDTO(updatedCourse);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"courses", "course"}, allEntries = true)
    public void deleteCourse(UUID id, UUID currentUserId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
                
        // Check ownership
        if (course.getTeacher() == null || !course.getTeacher().getUserId().equals(currentUserId)) {
            throw new RuntimeException("Forbidden: You are not the owner of this course");
        }
        courseRepository.delete(course);
    }

    @Override
    @Transactional
    public void enrollCourse(UUID studentId, UUID courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));
        
        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can enroll in courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
                
        boolean alreadyEnrolled = enrollmentRepository.existsByStudentAndCourse(student, course);
        if (alreadyEnrolled) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .build();
                
        enrollmentRepository.save(enrollment);
    }

    private CourseDTO mapToDTO(Course course) {
        UserDTO teacherDTO = null;
        if (course.getTeacher() != null) {
            User l = course.getTeacher();
            teacherDTO = UserDTO.builder()
                    .id(l.getUserId())
                    .fullName(l.getFullName())
                    .email(l.getEmail())
                    .role(l.getRole() != null ? l.getRole().name() : null)
                    .studentId(l.getStudentId())
                    .avatarUrl(l.getAvatarUrl())
                    .phoneNumber(l.getPhoneNumber())
                    .build();
        }

        return CourseDTO.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .syllabus(course.getSyllabus())
                .semester(course.getSemester())
                .thumbnailUrl(course.getThumbnailUrl())
                .createdAt(course.getCreatedAt())
                .teacher(teacherDTO)
                .build();
    }
}
