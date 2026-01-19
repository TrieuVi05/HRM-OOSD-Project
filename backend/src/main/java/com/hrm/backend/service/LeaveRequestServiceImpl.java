package com.hrm.backend.service;

import com.hrm.backend.dto.LeaveRequestRequest;
import com.hrm.backend.dto.LeaveRequestResponse;
import com.hrm.backend.entity.LeaveRequest;
import com.hrm.backend.exception.ResourceNotFoundException;
import com.hrm.backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
