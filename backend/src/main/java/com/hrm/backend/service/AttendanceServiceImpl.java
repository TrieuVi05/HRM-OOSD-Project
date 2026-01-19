package com.hrm.backend.service;

import com.hrm.backend.dto.AttendanceRequest;
import com.hrm.backend.dto.AttendanceResponse;
import com.hrm.backend.entity.Attendance;
import com.hrm.backend.exception.ResourceNotFoundException;
import com.hrm.backend.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository repository;

    public AttendanceServiceImpl(AttendanceRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<AttendanceResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public AttendanceResponse getById(Long id) {
        Attendance attendance = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        return mapToResponse(attendance);
    }

    @Override
    public AttendanceResponse create(AttendanceRequest request) {
        Attendance attendance = mapToEntity(request);
        return mapToResponse(repository.save(attendance));
    }

    @Override
    public AttendanceResponse update(Long id, AttendanceRequest request) {
        Attendance attendance = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setWorkDate(request.getWorkDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setScheduleId(request.getScheduleId());
        attendance.setNotes(request.getNotes());
        return mapToResponse(repository.save(attendance));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Attendance mapToEntity(AttendanceRequest request) {
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setWorkDate(request.getWorkDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setScheduleId(request.getScheduleId());
        attendance.setNotes(request.getNotes());
        return attendance;
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setEmployeeId(attendance.getEmployeeId());
        response.setWorkDate(attendance.getWorkDate());
        response.setCheckIn(attendance.getCheckIn());
        response.setCheckOut(attendance.getCheckOut());
        response.setStatus(attendance.getStatus());
        response.setScheduleId(attendance.getScheduleId());
        response.setNotes(attendance.getNotes());
        response.setCreatedAt(attendance.getCreatedAt());
        return response;
    }
}
