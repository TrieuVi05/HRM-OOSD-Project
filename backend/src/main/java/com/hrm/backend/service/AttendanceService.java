package com.hrm.backend.service;

import com.hrm.backend.dto.AttendanceRequest;
import com.hrm.backend.dto.AttendanceResponse;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> getAll();
    AttendanceResponse getById(Long id);
    AttendanceResponse create(AttendanceRequest request);
    AttendanceResponse update(Long id, AttendanceRequest request);
    void delete(Long id);
}
