package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.LeaveApprovalRequest;
import com.hrm.HRM.dto.LeaveRequestRequest;
import com.hrm.HRM.dto.LeaveRequestResponse;

public interface LeaveRequestService {
    List<LeaveRequestResponse> getAll();
    LeaveRequestResponse getById(Long id);
    LeaveRequestResponse create(LeaveRequestRequest request);
    LeaveRequestResponse update(Long id, LeaveRequestRequest request);
    void delete(Long id);
    LeaveRequestResponse approve(Long id, LeaveApprovalRequest request);
    LeaveRequestResponse reject(Long id, LeaveApprovalRequest request);
}
