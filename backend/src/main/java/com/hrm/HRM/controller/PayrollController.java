package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.PayrollGenerateRequest;
import com.hrm.HRM.dto.PayrollRequest;
import com.hrm.HRM.dto.PayrollResponse;
import com.hrm.HRM.service.PayrollService;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {
    private final PayrollService service;

    public PayrollController(PayrollService service) {
        this.service = service;
    }

    @GetMapping
    public List<PayrollResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PayrollResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_ADMIN')")
    public PayrollResponse create(@RequestBody PayrollRequest request) {
        return service.create(request);
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public PayrollResponse generate(@RequestBody PayrollGenerateRequest request) {
        return service.generate(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public PayrollResponse update(@PathVariable Long id, @RequestBody PayrollRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
