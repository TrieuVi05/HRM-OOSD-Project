package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.WorkSchedule;

public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
}
