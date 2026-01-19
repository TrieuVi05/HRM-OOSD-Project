package com.hrm.backend.service;

import com.hrm.backend.dto.UserRequest;
import com.hrm.backend.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAll();
    UserResponse getById(Long id);
    UserResponse create(UserRequest request);
    UserResponse update(Long id, UserRequest request);
    void delete(Long id);
}
