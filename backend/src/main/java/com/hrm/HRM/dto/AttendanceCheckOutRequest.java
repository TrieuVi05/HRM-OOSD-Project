package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AttendanceCheckOutRequest {
    private Long employeeId;
    private LocalDate workDate;
}
