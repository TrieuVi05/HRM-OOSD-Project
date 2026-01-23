package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.CandidateRequest;
import com.hrm.HRM.dto.CandidateResponse;

public interface CandidateService {
    List<CandidateResponse> getAll();
    CandidateResponse getById(Long id);
    CandidateResponse create(CandidateRequest request);
    CandidateResponse update(Long id, CandidateRequest request);
    void delete(Long id);
}
