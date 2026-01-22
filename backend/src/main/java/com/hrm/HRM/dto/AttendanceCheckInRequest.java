package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AttendanceCheckInRequest {
    private Long employeeId;
    private LocalDate workDate;
    private Long scheduleId;
    private String notes;
}
