package com.hrm.backend.service;

import com.hrm.backend.dto.LeaveRequestRequest;
import com.hrm.backend.dto.LeaveRequestResponse;

import java.util.List;

public interface LeaveRequestService {
    List<LeaveRequestResponse> getAll();
    LeaveRequestResponse getById(Long id);
    LeaveRequestResponse create(LeaveRequestRequest request);
    LeaveRequestResponse update(Long id, LeaveRequestRequest request);
    void delete(Long id);
}
