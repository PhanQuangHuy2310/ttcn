/**
 * FILE: Notification.java
 * MÔ TẢ: Entity (thực thể) đại diện cho thông báo trong hệ thống.
 * CHỨC NĂNG: Ánh xạ cấu trúc bảng 'notifications' từ database vào mã nguồn Java.
 */
package com.ttcn.backend.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String content;

    @Column(name = "is_read")
    private boolean isRead = false;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
