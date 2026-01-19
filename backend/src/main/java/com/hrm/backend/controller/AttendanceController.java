package com.hrm.backend.controller;

import com.hrm.backend.dto.AttendanceRequest;
import com.hrm.backend.dto.AttendanceResponse;
import com.hrm.backend.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

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
    public AttendanceResponse create(@RequestBody AttendanceRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AttendanceResponse update(@PathVariable Long id, @RequestBody AttendanceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
