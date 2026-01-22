package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class AttendanceRequest {
    private Long employeeId;
    private LocalDate workDate;
    private Instant checkIn;
    private Instant checkOut;
    private String status;
    private Long scheduleId;
    private String notes;
}
