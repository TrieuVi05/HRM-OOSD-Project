package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class PayrollResponse {
    private Long id;
    private Long employeeId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal basicSalary;
    private BigDecimal allowance;
    private BigDecimal bonus;
    private BigDecimal deduction;
    private String status;
    private Instant generatedAt;
}
