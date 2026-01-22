package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
}
