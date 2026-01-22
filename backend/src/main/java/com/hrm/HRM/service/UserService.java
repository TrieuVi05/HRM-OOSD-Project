package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.UserRequest;
import com.hrm.HRM.dto.UserResponse;

public interface UserService {
    List<UserResponse> getAll();
    UserResponse getById(Long id);
    UserResponse create(UserRequest request);
    UserResponse update(Long id, UserRequest request);
    void delete(Long id);
}
