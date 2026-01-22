package com.hrm.HRM.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}

