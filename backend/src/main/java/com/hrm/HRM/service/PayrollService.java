package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.PayrollGenerateRequest;
import com.hrm.HRM.dto.PayrollRequest;
import com.hrm.HRM.dto.PayrollResponse;

public interface PayrollService {
    List<PayrollResponse> getAll();
    PayrollResponse getById(Long id);
    PayrollResponse create(PayrollRequest request);
    PayrollResponse update(Long id, PayrollRequest request);
    void delete(Long id);
    PayrollResponse generate(PayrollGenerateRequest request);
}
