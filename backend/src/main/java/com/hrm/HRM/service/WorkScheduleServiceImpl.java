package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.WorkScheduleRequest;
import com.hrm.HRM.dto.WorkScheduleResponse;
import com.hrm.HRM.entity.WorkSchedule;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.WorkScheduleRepository;

import java.util.List;

@Service
public class WorkScheduleServiceImpl implements WorkScheduleService {
    private final WorkScheduleRepository repository;

    public WorkScheduleServiceImpl(WorkScheduleRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<WorkScheduleResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public WorkScheduleResponse getById(Long id) {
        WorkSchedule schedule = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work schedule not found"));
        return mapToResponse(schedule);
    }

    @Override
    public WorkScheduleResponse create(WorkScheduleRequest request) {
        WorkSchedule schedule = mapToEntity(request);
        return mapToResponse(repository.save(schedule));
    }

    @Override
    public WorkScheduleResponse update(Long id, WorkScheduleRequest request) {
        WorkSchedule schedule = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work schedule not found"));
        schedule.setName(request.getName());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDaysOfWeek(request.getDaysOfWeek());
        schedule.setDescription(request.getDescription());
        return mapToResponse(repository.save(schedule));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private WorkSchedule mapToEntity(WorkScheduleRequest request) {
        WorkSchedule schedule = new WorkSchedule();
        schedule.setName(request.getName());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDaysOfWeek(request.getDaysOfWeek());
        schedule.setDescription(request.getDescription());
        return schedule;
    }

    private WorkScheduleResponse mapToResponse(WorkSchedule schedule) {
        WorkScheduleResponse response = new WorkScheduleResponse();
        response.setId(schedule.getId());
        response.setName(schedule.getName());
        response.setStartTime(schedule.getStartTime());
        response.setEndTime(schedule.getEndTime());
        response.setDaysOfWeek(schedule.getDaysOfWeek());
        response.setDescription(schedule.getDescription());
        return response;
    }
}
