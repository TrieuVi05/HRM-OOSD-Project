package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.PositionRequest;
import com.hrm.HRM.dto.PositionResponse;
import com.hrm.HRM.service.PositionService;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionController {
    private final PositionService service;

    public PositionController(PositionService service) {
        this.service = service;
    }

    @GetMapping
    public List<PositionResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PositionResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public PositionResponse create(@RequestBody PositionRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PositionResponse update(@PathVariable Long id, @RequestBody PositionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
