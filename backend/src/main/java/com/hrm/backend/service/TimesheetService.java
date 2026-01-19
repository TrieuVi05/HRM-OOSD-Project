package com.hrm.backend.service;

import com.hrm.backend.dto.TimesheetRequest;
import com.hrm.backend.dto.TimesheetResponse;

import java.util.List;

public interface TimesheetService {
    List<TimesheetResponse> getAll();
    TimesheetResponse getById(Long id);
    TimesheetResponse create(TimesheetRequest request);
    TimesheetResponse update(Long id, TimesheetRequest request);
    void delete(Long id);
}
