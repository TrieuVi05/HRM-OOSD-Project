package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.RecruitmentRequest;
import com.hrm.HRM.dto.RecruitmentResponse;

public interface RecruitmentService {
    List<RecruitmentResponse> getAll();
    RecruitmentResponse getById(Long id);
    RecruitmentResponse create(RecruitmentRequest request);
    RecruitmentResponse update(Long id, RecruitmentRequest request);
    void delete(Long id);
}
