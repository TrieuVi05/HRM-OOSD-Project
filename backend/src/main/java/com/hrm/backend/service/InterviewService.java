package com.hrm.backend.service;

import com.hrm.backend.dto.InterviewRequest;
import com.hrm.backend.dto.InterviewResponse;

import java.util.List;

public interface InterviewService {
    List<InterviewResponse> getAll();
    InterviewResponse getById(Long id);
    InterviewResponse create(InterviewRequest request);
    InterviewResponse update(Long id, InterviewRequest request);
    void delete(Long id);
}
