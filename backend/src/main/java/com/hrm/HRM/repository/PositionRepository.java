package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
}
