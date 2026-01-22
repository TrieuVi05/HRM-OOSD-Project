package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PositionResponse {
    private Long id;
    private Long departmentId;
    private String name;
    private String description;
    private BigDecimal baseSalary;
}
