package com.hrm.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class TimesheetRequest {
    private Long employeeId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal totalHours;
    private BigDecimal overtimeHours;
    private String status;
}
