package com.hrm.backend.repository;

import com.hrm.backend.entity.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
}
