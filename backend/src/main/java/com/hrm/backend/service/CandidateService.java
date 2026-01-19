package com.hrm.backend.service;

import com.hrm.backend.dto.CandidateRequest;
import com.hrm.backend.dto.CandidateResponse;

import java.util.List;

public interface CandidateService {
    List<CandidateResponse> getAll();
    CandidateResponse getById(Long id);
    CandidateResponse create(CandidateRequest request);
    CandidateResponse update(Long id, CandidateRequest request);
    void delete(Long id);
}
