package com.hrm.HRM.service;

import java.util.List;
import com.hrm.HRM.dto.RoleRequest;
import com.hrm.HRM.dto.RoleResponse;

public interface RoleService {
    List<RoleResponse> getAll();
    RoleResponse getById(Long id);
    RoleResponse create(RoleRequest request);
    RoleResponse update(Long id, RoleRequest request);
    void delete(Long id);
}
