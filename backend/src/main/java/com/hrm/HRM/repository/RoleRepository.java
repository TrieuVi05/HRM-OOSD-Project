package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
