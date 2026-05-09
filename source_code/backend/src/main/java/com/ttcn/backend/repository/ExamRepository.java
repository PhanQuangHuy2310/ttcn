package com.ttcn.backend.repository;

import com.ttcn.backend.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {
    // Tìm kiếm đề thi theo tiêu đề (Không phân biệt hoa thường)
    List<Exam> findByTitleContainingIgnoreCase(String title);
}
