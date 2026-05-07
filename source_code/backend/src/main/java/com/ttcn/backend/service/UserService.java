package com.ttcn.backend.service;

import com.ttcn.backend.dto.UserDTO;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UserDTO createUser(UserDTO userDto);
    UserDTO getUserById(UUID id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(UUID id, UserDTO userDto);
    void deleteUser(UUID id);
}
