package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class TimesheetResponse {
    private Long id;
    private Long employeeId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal totalHours;
    private BigDecimal overtimeHours;
    private String status;
    private Instant createdAt;
}
