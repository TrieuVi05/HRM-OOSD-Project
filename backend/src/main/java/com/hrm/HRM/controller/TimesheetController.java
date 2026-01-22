package com.hrm.HRM.controller;

import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.TimesheetRequest;
import com.hrm.HRM.dto.TimesheetResponse;
import com.hrm.HRM.service.TimesheetService;

import java.util.List;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {
    private final TimesheetService service;

    public TimesheetController(TimesheetService service) {
        this.service = service;
    }

    @GetMapping
    public List<TimesheetResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TimesheetResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public TimesheetResponse create(@RequestBody TimesheetRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public TimesheetResponse update(@PathVariable Long id, @RequestBody TimesheetRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
