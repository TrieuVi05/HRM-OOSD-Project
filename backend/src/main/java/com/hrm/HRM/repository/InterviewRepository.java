package com.hrm.HRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.HRM.entity.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
