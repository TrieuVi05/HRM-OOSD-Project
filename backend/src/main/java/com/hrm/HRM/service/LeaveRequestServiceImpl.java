package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.LeaveApprovalRequest;
import com.hrm.HRM.dto.LeaveRequestRequest;
import com.hrm.HRM.dto.LeaveRequestResponse;
import com.hrm.HRM.entity.LeaveRequest;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.LeaveRequestRepository;

import java.util.List;
import java.time.Instant;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {
    private final LeaveRequestRepository repository;

    public LeaveRequestServiceImpl(LeaveRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<LeaveRequestResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public LeaveRequestResponse getById(Long id) {
        LeaveRequest leave = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        return mapToResponse(leave);
    }

    @Override
    public LeaveRequestResponse create(LeaveRequestRequest request) {
        LeaveRequest leave = mapToEntity(request);
        return mapToResponse(repository.save(leave));
    }

    @Override
    public LeaveRequestResponse update(Long id, LeaveRequestRequest request) {
        LeaveRequest leave = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setEmployeeId(request.getEmployeeId());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setLeaveType(request.getLeaveType());
        leave.setReason(request.getReason());
        leave.setStatus(request.getStatus());
        leave.setApprovedBy(request.getApprovedBy());
        leave.setApprovedAt(request.getApprovedAt());
        return mapToResponse(repository.save(leave));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public LeaveRequestResponse approve(Long id, LeaveApprovalRequest request) {
        LeaveRequest leave = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setStatus("APPROVED");
        leave.setApprovedBy(request.getApprovedBy());
        leave.setApprovedAt(Instant.now());
        return mapToResponse(repository.save(leave));
    }

    @Override
    public LeaveRequestResponse reject(Long id, LeaveApprovalRequest request) {
        LeaveRequest leave = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setStatus("REJECTED");
        leave.setApprovedBy(request.getApprovedBy());
        leave.setApprovedAt(Instant.now());
        return mapToResponse(repository.save(leave));
    }

    private LeaveRequest mapToEntity(LeaveRequestRequest request) {
        LeaveRequest leave = new LeaveRequest();
        leave.setEmployeeId(request.getEmployeeId());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setLeaveType(request.getLeaveType());
        leave.setReason(request.getReason());
        leave.setStatus(request.getStatus());
        leave.setApprovedBy(request.getApprovedBy());
        leave.setApprovedAt(request.getApprovedAt());
        return leave;
    }

    private LeaveRequestResponse mapToResponse(LeaveRequest leave) {
        LeaveRequestResponse response = new LeaveRequestResponse();
        response.setId(leave.getId());
        response.setEmployeeId(leave.getEmployeeId());
        response.setStartDate(leave.getStartDate());
        response.setEndDate(leave.getEndDate());
        response.setLeaveType(leave.getLeaveType());
        response.setReason(leave.getReason());
        response.setStatus(leave.getStatus());
        response.setApprovedBy(leave.getApprovedBy());
        response.setApprovedAt(leave.getApprovedAt());
        response.setCreatedAt(leave.getCreatedAt());
        return response;
    }
}
