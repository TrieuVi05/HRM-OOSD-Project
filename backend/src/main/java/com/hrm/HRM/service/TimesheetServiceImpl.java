package com.hrm.HRM.service;

import org.springframework.stereotype.Service;
import com.hrm.HRM.dto.TimesheetRequest;
import com.hrm.HRM.dto.TimesheetResponse;
import com.hrm.HRM.entity.Timesheet;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.TimesheetRepository;
import java.util.List;

@Service
public class TimesheetServiceImpl implements TimesheetService {
    private final TimesheetRepository repository;

    public TimesheetServiceImpl(TimesheetRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<TimesheetResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public TimesheetResponse getById(Long id) {
        Timesheet timesheet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet not found"));
        return mapToResponse(timesheet);
    }

    @Override
    public TimesheetResponse create(TimesheetRequest request) {
        Timesheet timesheet = mapToEntity(request);
        return mapToResponse(repository.save(timesheet));
    }

    @Override
    public TimesheetResponse update(Long id, TimesheetRequest request) {
        Timesheet timesheet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet not found"));
        timesheet.setEmployeeId(request.getEmployeeId());
        timesheet.setPeriodStart(request.getPeriodStart());
        timesheet.setPeriodEnd(request.getPeriodEnd());
        timesheet.setTotalHours(request.getTotalHours());
        timesheet.setOvertimeHours(request.getOvertimeHours());
        timesheet.setStatus(request.getStatus());
        return mapToResponse(repository.save(timesheet));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Timesheet mapToEntity(TimesheetRequest request) {
        Timesheet timesheet = new Timesheet();
        timesheet.setEmployeeId(request.getEmployeeId());
        timesheet.setPeriodStart(request.getPeriodStart());
        timesheet.setPeriodEnd(request.getPeriodEnd());
        timesheet.setTotalHours(request.getTotalHours());
        timesheet.setOvertimeHours(request.getOvertimeHours());
        timesheet.setStatus(request.getStatus());
        return timesheet;
    }

    private TimesheetResponse mapToResponse(Timesheet timesheet) {
        TimesheetResponse response = new TimesheetResponse();
        response.setId(timesheet.getId());
        response.setEmployeeId(timesheet.getEmployeeId());
        response.setPeriodStart(timesheet.getPeriodStart());
        response.setPeriodEnd(timesheet.getPeriodEnd());
        response.setTotalHours(timesheet.getTotalHours());
        response.setOvertimeHours(timesheet.getOvertimeHours());
        response.setStatus(timesheet.getStatus());
        response.setCreatedAt(timesheet.getCreatedAt());
        return response;
    }
}
