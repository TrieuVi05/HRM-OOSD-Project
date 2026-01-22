package com.hrm.HRM.service;

import java.util.List;
import com.hrm.HRM.dto.WorkScheduleRequest;
import com.hrm.HRM.dto.WorkScheduleResponse;

public interface WorkScheduleService {
    List<WorkScheduleResponse> getAll();
    WorkScheduleResponse getById(Long id);
    WorkScheduleResponse create(WorkScheduleRequest request);
    WorkScheduleResponse update(Long id, WorkScheduleRequest request);
    void delete(Long id);
}
