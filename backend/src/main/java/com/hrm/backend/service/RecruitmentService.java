package com.hrm.backend.service;

import com.hrm.backend.dto.RecruitmentRequest;
import com.hrm.backend.dto.RecruitmentResponse;

import java.util.List;

public interface RecruitmentService {
    List<RecruitmentResponse> getAll();
    RecruitmentResponse getById(Long id);
    RecruitmentResponse create(RecruitmentRequest request);
    RecruitmentResponse update(Long id, RecruitmentRequest request);
    void delete(Long id);
}
