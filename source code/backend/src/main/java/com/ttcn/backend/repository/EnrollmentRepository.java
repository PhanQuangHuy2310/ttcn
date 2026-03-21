package com.ttcn.backend.repository;

import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Enrollment;
import com.ttcn.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    boolean existsByStudentAndCourse(User student, Course course);
}
