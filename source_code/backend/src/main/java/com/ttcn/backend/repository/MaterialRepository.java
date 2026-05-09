package com.ttcn.backend.repository;

import com.ttcn.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {
    List<Material> findByLessonId(UUID lessonId);
    
    // Tìm kiếm học liệu theo tiêu đề (Không phân biệt hoa thường)
    List<Material> findByTitleContainingIgnoreCase(String title);
}
