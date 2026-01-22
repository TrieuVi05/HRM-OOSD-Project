package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.ContractRequest;
import com.hrm.HRM.dto.ContractResponse;

public interface ContractService {
    List<ContractResponse> getAll();
    ContractResponse getById(Long id);
    ContractResponse create(ContractRequest request);
    ContractResponse update(Long id, ContractRequest request);
    void delete(Long id);
}
