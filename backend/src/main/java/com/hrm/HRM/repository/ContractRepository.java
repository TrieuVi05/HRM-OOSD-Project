package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {
}
