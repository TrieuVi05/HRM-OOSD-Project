package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.InterviewRequest;
import com.hrm.HRM.dto.InterviewResponse;
import com.hrm.HRM.service.InterviewService;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService service;

    public InterviewController(InterviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<InterviewResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public InterviewResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public InterviewResponse create(@RequestBody InterviewRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public InterviewResponse update(@PathVariable Long id, @RequestBody InterviewRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
