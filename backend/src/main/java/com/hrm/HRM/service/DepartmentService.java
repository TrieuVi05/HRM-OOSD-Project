package com.hrm.HRM.service;
import java.util.List;
import com.hrm.HRM.dto.DepartmentRequest;
import com.hrm.HRM.dto.DepartmentResponse;

public interface DepartmentService {
    List<DepartmentResponse> getAll();
    DepartmentResponse getById(Long id);
    DepartmentResponse create(DepartmentRequest request);
    DepartmentResponse update(Long id, DepartmentRequest request);
    void delete(Long id);
}
