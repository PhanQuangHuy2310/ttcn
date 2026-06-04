package com.ttcn.backend.repository;

import com.ttcn.backend.entity.ClassEntity;
import com.ttcn.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {
    List<ClassEntity> findByCourseId(UUID courseId);

    @Query(value = "SELECT u.* FROM users u " +
                   "JOIN student_classes sc ON u.id = sc.student_id " +
                   "JOIN classes c ON sc.class_id = c.id " +
                   "WHERE c.course_id = :courseId", nativeQuery = true)
    List<User> findStudentsByCourseId(@Param("courseId") UUID courseId);
}
