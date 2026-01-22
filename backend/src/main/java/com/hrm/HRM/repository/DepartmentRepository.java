package com.hrm.HRM.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {
}
