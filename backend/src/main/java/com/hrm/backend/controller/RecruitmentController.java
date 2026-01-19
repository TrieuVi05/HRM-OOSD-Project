package com.hrm.backend.controller;

import com.hrm.backend.dto.RecruitmentRequest;
import com.hrm.backend.dto.RecruitmentResponse;
import com.hrm.backend.service.RecruitmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitments")
public class RecruitmentController {
    private final RecruitmentService service;

    public RecruitmentController(RecruitmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<RecruitmentResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RecruitmentResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public RecruitmentResponse create(@RequestBody RecruitmentRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public RecruitmentResponse update(@PathVariable Long id, @RequestBody RecruitmentRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
