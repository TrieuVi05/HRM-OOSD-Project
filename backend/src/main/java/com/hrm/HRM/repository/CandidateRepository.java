package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
