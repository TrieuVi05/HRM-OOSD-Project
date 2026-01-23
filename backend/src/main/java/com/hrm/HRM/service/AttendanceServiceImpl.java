package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.AttendanceCheckInRequest;
import com.hrm.HRM.dto.AttendanceCheckOutRequest;
import com.hrm.HRM.dto.AttendanceRequest;
import com.hrm.HRM.dto.AttendanceResponse;
import com.hrm.HRM.entity.Attendance;
import com.hrm.HRM.exception.BadRequestException;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.AttendanceRepository;

import java.util.List;
import java.time.Instant;
import java.time.LocalDate;

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

    @Override
    public AttendanceResponse checkIn(AttendanceCheckInRequest request) {
        LocalDate workDate = request.getWorkDate() != null ? request.getWorkDate() : LocalDate.now();
        Attendance existing = repository.findByEmployeeIdAndWorkDate(request.getEmployeeId(), workDate).orElse(null);
        if (existing != null) {
            throw new BadRequestException("Already checked in for this date");
        }
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setWorkDate(workDate);
        attendance.setCheckIn(Instant.now());
        attendance.setStatus("PRESENT");
        attendance.setScheduleId(request.getScheduleId());
        attendance.setNotes(request.getNotes());
        return mapToResponse(repository.save(attendance));
    }

    @Override
    public AttendanceResponse checkOut(AttendanceCheckOutRequest request) {
        LocalDate workDate = request.getWorkDate() != null ? request.getWorkDate() : LocalDate.now();
        Attendance attendance = repository.findByEmployeeIdAndWorkDate(request.getEmployeeId(), workDate)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found for date"));
        if (attendance.getCheckOut() != null) {
            throw new BadRequestException("Already checked out for this date");
        }
        attendance.setCheckOut(Instant.now());
        attendance.setStatus("PRESENT");
        return mapToResponse(repository.save(attendance));
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
