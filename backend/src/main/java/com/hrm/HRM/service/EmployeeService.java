package com.hrm.HRM.service;
import java.util.List;

import com.hrm.HRM.dto.EmployeeRequest;
import com.hrm.HRM.dto.EmployeeResponse;

public interface EmployeeService {
    List<EmployeeResponse> getAll();
    EmployeeResponse getById(Long id);
    EmployeeResponse create(EmployeeRequest request);
    EmployeeResponse update(Long id, EmployeeRequest request);
    void delete(Long id);
}


