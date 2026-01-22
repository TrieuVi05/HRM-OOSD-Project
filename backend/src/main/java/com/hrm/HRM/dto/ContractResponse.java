package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class ContractResponse {
    private Long id;
    private Long employeeId;
    private String contractType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal salary;
    private String status;
    private Instant signedAt;
}
