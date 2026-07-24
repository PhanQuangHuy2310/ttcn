package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.CourseDTO;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Enrollment;
import com.ttcn.backend.entity.Role;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.EnrollmentRepository;
import com.ttcn.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private User teacher;
    private User student;
    private Course course;
    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        teacher = User.builder()
                .userId(UUID.randomUUID())
                .role(Role.TEACHER)
                .build();

        student = User.builder()
                .userId(UUID.randomUUID())
                .role(Role.STUDENT)
                .build();

        course = Course.builder()
                .id(UUID.randomUUID())
                .name("Toan 1")
                .teacher(teacher)
                .build();

        courseDTO = CourseDTO.builder()
                .name("Toan 1")
                .build();
    }

    @Test
    void createCourse_shouldCreateCourse_whenUserIsTeacher() {
        // Arrange
        when(userRepository.findById(teacher.getUserId())).thenReturn(Optional.of(teacher));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // Act
        CourseDTO result = courseService.createCourse(courseDTO, teacher.getUserId());

        // Assert
        assertNotNull(result);
        assertEquals("Toan 1", result.getName());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void createCourse_shouldThrowException_whenUserIsNotTeacher() {
        // Arrange
        when(userRepository.findById(student.getUserId())).thenReturn(Optional.of(student));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            courseService.createCourse(courseDTO, student.getUserId());
        });

        assertEquals("Only instructors can create courses", exception.getMessage());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    void enrollCourse_shouldEnroll_whenStudentNotEnrolledYet() {
        // Arrange
        when(userRepository.findById(student.getUserId())).thenReturn(Optional.of(student));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByStudentAndCourse(student, course)).thenReturn(false);

        // Act
        courseService.enrollCourse(student.getUserId(), course.getId());

        // Assert
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
    }

    @Test
    void enrollCourse_shouldThrowException_whenStudentAlreadyEnrolled() {
        // Arrange
        when(userRepository.findById(student.getUserId())).thenReturn(Optional.of(student));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByStudentAndCourse(student, course)).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            courseService.enrollCourse(student.getUserId(), course.getId());
        });

        assertEquals("Student is already enrolled in this course", exception.getMessage());
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }
}
