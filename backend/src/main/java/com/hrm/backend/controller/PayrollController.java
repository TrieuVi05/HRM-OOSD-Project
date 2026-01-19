package com.hrm.backend.controller;

import com.hrm.backend.dto.PayrollRequest;
import com.hrm.backend.dto.PayrollResponse;
import com.hrm.backend.service.PayrollService;
import org.springframework.web.bind.annotation.*;

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
    public PayrollResponse create(@RequestBody PayrollRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PayrollResponse update(@PathVariable Long id, @RequestBody PayrollRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
