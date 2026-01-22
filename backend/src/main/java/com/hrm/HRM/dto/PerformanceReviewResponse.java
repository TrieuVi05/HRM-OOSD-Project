package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class PerformanceReviewResponse {
    private Long id;
    private Long employeeId;
    private Long reviewerId;
    private String reviewPeriod;
    private BigDecimal score;
    private String comments;
    private Instant createdAt;
}
