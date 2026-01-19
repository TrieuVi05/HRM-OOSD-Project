package com.hrm.backend.service;

import com.hrm.backend.dto.ContractRequest;
import com.hrm.backend.dto.ContractResponse;

import java.util.List;

public interface ContractService {
    List<ContractResponse> getAll();
    ContractResponse getById(Long id);
    ContractResponse create(ContractRequest request);
    ContractResponse update(Long id, ContractRequest request);
    void delete(Long id);
}
