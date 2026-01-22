package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.TimesheetRequest;
import com.hrm.HRM.dto.TimesheetResponse;

public interface TimesheetService {
    List<TimesheetResponse> getAll();
    TimesheetResponse getById(Long id);
    TimesheetResponse create(TimesheetRequest request);
    TimesheetResponse update(Long id, TimesheetRequest request);
    void delete(Long id);
}
