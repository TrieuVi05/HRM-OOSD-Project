package com.hrm.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "timesheets")
@Getter
@Setter
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "period_start")
    private LocalDate periodStart;

    @Column(name = "period_end")
    private LocalDate periodEnd;

    @Column(name = "total_hours")
    private BigDecimal totalHours;

    @Column(name = "overtime_hours")
    private BigDecimal overtimeHours;

    private String status;

    @Column(name = "created_at")
    private Instant createdAt;
}
