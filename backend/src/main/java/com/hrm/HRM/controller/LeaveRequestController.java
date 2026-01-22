package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.LeaveApprovalRequest;
import com.hrm.HRM.dto.LeaveRequestRequest;
import com.hrm.HRM.dto.LeaveRequestResponse;
import com.hrm.HRM.service.LeaveRequestService;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {
    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<LeaveRequestResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LeaveRequestResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public LeaveRequestResponse create(@RequestBody LeaveRequestRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public LeaveRequestResponse update(@PathVariable Long id, @RequestBody LeaveRequestRequest request) {
        return service.update(id, request);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('HR_ADMIN','MANAGER')")
    public LeaveRequestResponse approve(@PathVariable Long id, @RequestBody LeaveApprovalRequest request) {
        return service.approve(id, request);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('HR_ADMIN','MANAGER')")
    public LeaveRequestResponse reject(@PathVariable Long id, @RequestBody LeaveApprovalRequest request) {
        return service.reject(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
