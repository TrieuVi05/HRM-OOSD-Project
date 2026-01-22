package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PerformanceReviewRequest {
    private Long employeeId;
    private Long reviewerId;
    private String reviewPeriod;
    private BigDecimal score;
    private String comments;
}
