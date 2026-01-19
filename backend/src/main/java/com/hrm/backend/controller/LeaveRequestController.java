package com.hrm.backend.controller;

import com.hrm.backend.dto.LeaveRequestRequest;
import com.hrm.backend.dto.LeaveRequestResponse;
import com.hrm.backend.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
