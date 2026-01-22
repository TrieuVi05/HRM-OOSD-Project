package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.CandidateRequest;
import com.hrm.HRM.dto.CandidateResponse;
import com.hrm.HRM.service.CandidateService;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {
    private final CandidateService service;

    public CandidateController(CandidateService service) {
        this.service = service;
    }

    @GetMapping
    public List<CandidateResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CandidateResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public CandidateResponse create(@RequestBody CandidateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public CandidateResponse update(@PathVariable Long id, @RequestBody CandidateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
