package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.AttendanceCheckInRequest;
import com.hrm.HRM.dto.AttendanceCheckOutRequest;
import com.hrm.HRM.dto.AttendanceRequest;
import com.hrm.HRM.dto.AttendanceResponse;

public interface AttendanceService {
    List<AttendanceResponse> getAll();
    AttendanceResponse getById(Long id);
    AttendanceResponse create(AttendanceRequest request);
    AttendanceResponse update(Long id, AttendanceRequest request);
    void delete(Long id);
    AttendanceResponse checkIn(AttendanceCheckInRequest request);
    AttendanceResponse checkOut(AttendanceCheckOutRequest request);
}
