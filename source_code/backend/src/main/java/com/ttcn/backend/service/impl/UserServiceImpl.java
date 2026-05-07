package com.ttcn.backend.service.impl;

import com.ttcn.backend.entity.Role;
import com.ttcn.backend.dto.UserDTO;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.UserRepository;
import com.ttcn.backend.service.EmailService;
import com.ttcn.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public UserDTO createUser(UserDTO userDto) {
        User user = mapToEntity(userDto);
        User savedUser = userRepository.save(user);
        // Async — safe even if mail server is not configured (caught in EmailServiceImpl)
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());
        return mapToDto(savedUser);
    }

    @Override
    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(UUID id, UserDTO userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        if (userDto.getRole() != null && !userDto.getRole().isBlank()) {
            user.setRole(Role.valueOf(userDto.getRole()));
        }
        user.setStudentId(userDto.getStudentId());
        user.setAvatarUrl(userDto.getAvatarUrl());
        user.setPhoneNumber(userDto.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDTO mapToDto(User user) {
        return UserDTO.builder()
                .id(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .studentId(user.getStudentId())
                .avatarUrl(user.getAvatarUrl())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private User mapToEntity(UserDTO dto) {
        Role role = null;
        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            role = Role.valueOf(dto.getRole());
        }
        return User.builder()
                .userId(dto.getId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .role(role)
                .studentId(dto.getStudentId())
                .avatarUrl(dto.getAvatarUrl())
                .phoneNumber(dto.getPhoneNumber())
                .build();
    }
}
