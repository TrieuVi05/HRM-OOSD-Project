package com.hrm.backend.service;

import com.hrm.backend.dto.WorkScheduleRequest;
import com.hrm.backend.dto.WorkScheduleResponse;

import java.util.List;

public interface WorkScheduleService {
    List<WorkScheduleResponse> getAll();
    WorkScheduleResponse getById(Long id);
    WorkScheduleResponse create(WorkScheduleRequest request);
    WorkScheduleResponse update(Long id, WorkScheduleRequest request);
    void delete(Long id);
}
