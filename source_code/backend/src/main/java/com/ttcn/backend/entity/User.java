/**
 * FILE: User.java
 * MÔ TẢ: Thực thể đại diện cho Người dùng (Admin, Giáo viên, Sinh viên).
 * CHỨC NĂNG: Lưu trữ thông tin cá nhân, email, mật khẩu, quyền hạn (Role) và trạng thái tài khoản.
 */
package com.ttcn.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

/**
 * Maps to the 'users' table in Supabase.
 * Role enum values match Supabase's user_role ENUM: STUDENT, TEACHER, ADMIN, FACULTY_ADMIN.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "student_id")
    private String studentId;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;

    // TỐI ƯU HÓA/SỬ A LỖI: Bổ sung các cột trạng thái hoạt động tài khoản
    // is_active quy định xem người dùng có được cấp quyền truy cập hệ thống nữa hay không.
    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    // status lưu dạng chuỗi ('ACTIVE' hoặc 'INACTIVE') đồng bộ trạng thái.
    @Builder.Default
    @Column(name = "status")
    private String status = "ACTIVE";

    // One instructor can teach many courses
    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Course> taughtCourses;

    // One student can enroll in many courses (via Enrollment)
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Enrollment> enrollments;
}
