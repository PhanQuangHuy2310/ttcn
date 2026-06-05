package com.ttcn.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * PublicController xử lý các yêu cầu công khai không cần xác thực.
 * Cung cấp endpoint kiểm tra trạng thái hoạt động của hệ thống (Health check).
 */
@RestController
public class PublicController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "LMS Backend API is running successfully!");
        return ResponseEntity.ok(status);
    }
}
