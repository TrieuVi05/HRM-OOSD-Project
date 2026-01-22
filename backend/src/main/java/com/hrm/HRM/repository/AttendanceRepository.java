package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Attendance;

import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	Optional<Attendance> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
}
