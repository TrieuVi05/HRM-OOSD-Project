package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.InterviewRequest;
import com.hrm.HRM.dto.InterviewResponse;

public interface InterviewService {
    List<InterviewResponse> getAll();
    InterviewResponse getById(Long id);
    InterviewResponse create(InterviewRequest request);
    InterviewResponse update(Long id, InterviewRequest request);
    void delete(Long id);
}
