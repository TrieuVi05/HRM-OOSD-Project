package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.WorkScheduleRequest;
import com.hrm.HRM.dto.WorkScheduleResponse;
import com.hrm.HRM.service.WorkScheduleService;

import java.util.List;

@RestController
@RequestMapping("/api/work-schedules")
public class WorkScheduleController {
    private final WorkScheduleService service;

    public WorkScheduleController(WorkScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public List<WorkScheduleResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public WorkScheduleResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public WorkScheduleResponse create(@RequestBody WorkScheduleRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public WorkScheduleResponse update(@PathVariable Long id, @RequestBody WorkScheduleRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
