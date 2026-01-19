package com.hrm.backend.controller;

import com.hrm.backend.dto.ContractRequest;
import com.hrm.backend.dto.ContractResponse;
import com.hrm.backend.service.ContractService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private final ContractService service;

    public ContractController(ContractService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContractResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ContractResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ContractResponse create(@RequestBody ContractRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ContractResponse update(@PathVariable Long id, @RequestBody ContractRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
