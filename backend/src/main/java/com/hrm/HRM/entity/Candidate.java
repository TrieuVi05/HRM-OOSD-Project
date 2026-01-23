package com.hrm.HRM.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "candidates")
@Getter
@Setter
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recruitment_id")
    private Long recruitmentId;

    @Column(name = "full_name")
    private String fullName;

    private String email;
    private String phone;

    @Column(name = "resume_url")
    private String resumeUrl;

    private String status;

    @Column(name = "applied_at")
    private Instant appliedAt;
}


