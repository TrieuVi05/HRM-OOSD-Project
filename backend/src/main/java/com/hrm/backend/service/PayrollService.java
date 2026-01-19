package com.hrm.backend.service;

import com.hrm.backend.dto.PayrollRequest;
import com.hrm.backend.dto.PayrollResponse;

import java.util.List;

public interface PayrollService {
    List<PayrollResponse> getAll();
    PayrollResponse getById(Long id);
    PayrollResponse create(PayrollRequest request);
    PayrollResponse update(Long id, PayrollRequest request);
    void delete(Long id);
}
