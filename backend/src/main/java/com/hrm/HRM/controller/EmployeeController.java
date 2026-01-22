package com.hrm.HRM.controller;
import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.EmployeeRequest;
import com.hrm.HRM.dto.EmployeeResponse;
import com.hrm.HRM.service.EmployeeService;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponse> getAll() {
        return employeeService.getAll();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable Long id) {
        return employeeService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('HR_ADMIN')")
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public EmployeeResponse update(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return employeeService.update(id, request);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR_ADMIN')")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }
}
