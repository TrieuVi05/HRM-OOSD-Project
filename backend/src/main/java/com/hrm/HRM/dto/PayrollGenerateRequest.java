package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PayrollGenerateRequest {
    private Long employeeId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal basicSalary;
    private BigDecimal allowance;
    private BigDecimal bonus;
    private BigDecimal deduction;
}
