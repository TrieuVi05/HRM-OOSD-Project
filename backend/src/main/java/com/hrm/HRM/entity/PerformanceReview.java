package com.hrm.HRM.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "performance_reviews")
@Getter
@Setter
public class PerformanceReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "reviewer_id")
    private Long reviewerId;

    @Column(name = "review_period")
    private String reviewPeriod;

    private BigDecimal score;
    private String comments;

    @Column(name = "created_at")
    private Instant createdAt;
}

