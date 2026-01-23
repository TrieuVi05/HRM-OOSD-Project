package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.PerformanceReviewRequest;
import com.hrm.HRM.dto.PerformanceReviewResponse;
import com.hrm.HRM.service.PerformanceReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/performance-reviews")
public class PerformanceReviewController {
    private final PerformanceReviewService service;

    public PerformanceReviewController(PerformanceReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<PerformanceReviewResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PerformanceReviewResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public PerformanceReviewResponse create(@RequestBody PerformanceReviewRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PerformanceReviewResponse update(@PathVariable Long id, @RequestBody PerformanceReviewRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
