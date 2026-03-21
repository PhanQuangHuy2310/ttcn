package com.ttcn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String role;
    private String studentId;
    private String avatarUrl;
    private String phoneNumber;
}
