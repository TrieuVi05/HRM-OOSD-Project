package com.hrm.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "payroll")
@Getter
@Setter
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "period_start")
    private LocalDate periodStart;

    @Column(name = "period_end")
    private LocalDate periodEnd;

    @Column(name = "basic_salary")
    private BigDecimal basicSalary;

    private BigDecimal allowance;
    private BigDecimal bonus;
    private BigDecimal deduction;

    @Column(name = "generated_at")
    private Instant generatedAt;

    private String status;
}
