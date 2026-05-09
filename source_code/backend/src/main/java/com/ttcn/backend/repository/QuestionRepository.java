package com.ttcn.backend.repository;

import com.ttcn.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    // Tìm kiếm câu hỏi trong ngân hàng câu hỏi (Không phân biệt hoa thường)
    List<Question> findByContentContainingIgnoreCase(String content);
}
