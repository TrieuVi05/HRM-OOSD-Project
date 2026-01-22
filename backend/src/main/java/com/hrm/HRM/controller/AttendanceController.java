package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.AttendanceCheckInRequest;
import com.hrm.HRM.dto.AttendanceCheckOutRequest;
import com.hrm.HRM.dto.AttendanceRequest;
import com.hrm.HRM.dto.AttendanceResponse;
import com.hrm.HRM.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<AttendanceResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AttendanceResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_ADMIN')")
    public AttendanceResponse create(@RequestBody AttendanceRequest request) {
        return service.create(request);
    }

    @PostMapping("/checkin")
    @PreAuthorize("hasAnyRole('HR_ADMIN','MANAGER','EMPLOYEE')")
    public AttendanceResponse checkIn(@RequestBody AttendanceCheckInRequest request) {
        return service.checkIn(request);
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('HR_ADMIN','MANAGER','EMPLOYEE')")
    public AttendanceResponse checkOut(@RequestBody AttendanceCheckOutRequest request) {
        return service.checkOut(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public AttendanceResponse update(@PathVariable Long id, @RequestBody AttendanceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
