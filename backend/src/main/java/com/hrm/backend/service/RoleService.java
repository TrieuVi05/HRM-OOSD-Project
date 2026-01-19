package com.hrm.backend.service;

import com.hrm.backend.dto.RoleRequest;
import com.hrm.backend.dto.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAll();
    RoleResponse getById(Long id);
    RoleResponse create(RoleRequest request);
    RoleResponse update(Long id, RoleRequest request);
    void delete(Long id);
}
