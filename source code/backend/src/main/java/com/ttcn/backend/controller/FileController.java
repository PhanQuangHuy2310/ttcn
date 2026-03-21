package com.ttcn.backend.controller;

import com.ttcn.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String publicUrl = fileStorageService.uploadFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", publicUrl);
        return ResponseEntity.ok(response);
    }
}
