package com.ttcn.backend.repository;

import com.ttcn.backend.entity.Role;
import com.ttcn.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false",
    "spring.datasource.username=sa",
    "spring.datasource.password="
})
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindUser_shouldWorkCorrectly() {
        // Arrange
        User user = User.builder()
                .userId(UUID.randomUUID())
                .fullName("Integration Test User")
                .email("integration@test.com")
                .role(Role.STUDENT)
                .build();

        // Act
        User savedUser = userRepository.save(user);
        Optional<User> foundUser = userRepository.findById(savedUser.getUserId());

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals("Integration Test User", foundUser.get().getFullName());
        assertEquals("integration@test.com", foundUser.get().getEmail());
    }

    @Test
    void findByEmail_shouldReturnUser_whenEmailExists() {
        // Arrange
        User user = User.builder()
                .userId(UUID.randomUUID())
                .fullName("Email Test User")
                .email("findbyemail@test.com")
                .role(Role.TEACHER)
                .build();
        userRepository.save(user);

        // Act
        Optional<User> foundUser = userRepository.findByEmail("findbyemail@test.com");

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals(user.getUserId(), foundUser.get().getUserId());
    }

    @Test
    void deleteUser_shouldRemoveFromDatabase() {
        // Arrange
        User user = User.builder()
                .userId(UUID.randomUUID())
                .fullName("Delete Test User")
                .email("delete@test.com")
                .role(Role.ADMIN)
                .build();
        User savedUser = userRepository.save(user);

        // Act
        userRepository.deleteById(savedUser.getUserId());
        Optional<User> foundUser = userRepository.findById(savedUser.getUserId());

        // Assert
        assertFalse(foundUser.isPresent());
    }
}
