package com.hrm.backend.service;

import com.hrm.backend.dto.PerformanceReviewRequest;
import com.hrm.backend.dto.PerformanceReviewResponse;

import java.util.List;

public interface PerformanceReviewService {
    List<PerformanceReviewResponse> getAll();
    PerformanceReviewResponse getById(Long id);
    PerformanceReviewResponse create(PerformanceReviewRequest request);
    PerformanceReviewResponse update(Long id, PerformanceReviewRequest request);
    void delete(Long id);
}
