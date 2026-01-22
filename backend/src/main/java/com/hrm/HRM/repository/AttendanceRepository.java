package com.hrm.HRM.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	Optional<Attendance> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
}