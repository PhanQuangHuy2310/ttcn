package com.ttcn.backend.service;

import com.ttcn.backend.dto.UserDto;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UserDto createUser(UserDto userDto);
    UserDto getUserById(UUID id);
    List<UserDto> getAllUsers();
    UserDto updateUser(UUID id, UserDto userDto);
    void deleteUser(UUID id);
}
