package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.PerformanceReviewRequest;
import com.hrm.HRM.dto.PerformanceReviewResponse;

public interface PerformanceReviewService {
    List<PerformanceReviewResponse> getAll();
    PerformanceReviewResponse getById(Long id);
    PerformanceReviewResponse create(PerformanceReviewRequest request);
    PerformanceReviewResponse update(Long id, PerformanceReviewRequest request);
    void delete(Long id);
}
