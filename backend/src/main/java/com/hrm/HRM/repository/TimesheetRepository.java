package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Timesheet;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
}
