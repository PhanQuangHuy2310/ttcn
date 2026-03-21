package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.UserDto;
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
    public UserDto createUser(UserDto userDto) {
        User user = mapToEntity(userDto);
        User savedUser = userRepository.save(user);

        // Gửi email bất đồng bộ
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());

        return mapToDto(savedUser);
    }

    @Override
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(UUID id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setStudentId(userDto.getStudentId());
        user.setLecturerCode(userDto.getLecturerCode());
        
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

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .studentId(user.getStudentId())
                .lecturerCode(user.getLecturerCode())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private User mapToEntity(UserDto dto) {
        return User.builder()
                .id(dto.getId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .role(dto.getRole())
                .studentId(dto.getStudentId())
                .lecturerCode(dto.getLecturerCode())
                .build();
    }
}
