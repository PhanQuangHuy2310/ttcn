package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.UserDTO;
import com.ttcn.backend.entity.Role;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.exception.ResourceNotFoundException;
import com.ttcn.backend.repository.UserRepository;
import com.ttcn.backend.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .userId(UUID.randomUUID())
                .fullName("John Doe")
                .email("john@example.com")
                .role(Role.STUDENT)
                .build();

        userDTO = UserDTO.builder()
                .fullName("John Doe")
                .email("john@example.com")
                .role("STUDENT")
                .build();
    }

    @Test
    void createUser_shouldCreateUserAndSendEmail() {
        // Arrange
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        UserDTO result = userService.createUser(userDTO);

        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendWelcomeEmail("john@example.com", "John Doe");
    }

    @Test
    void getUserById_shouldReturnUser_whenFound() {
        // Arrange
        when(userRepository.findById(user.getUserId())).thenReturn(Optional.of(user));

        // Act
        UserDTO result = userService.getUserById(user.getUserId());

        // Assert
        assertNotNull(result);
        assertEquals(user.getUserId(), result.getId());
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    void getUserById_shouldThrowException_whenNotFound() {
        // Arrange
        UUID fakeId = UUID.randomUUID();
        when(userRepository.findById(fakeId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(fakeId);
        });

        assertTrue(ex.getMessage().contains("User not found"));
    }
}
