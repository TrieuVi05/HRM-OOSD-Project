package com.hrm.HRM.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "interviews")
@Getter
@Setter
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id")
    private Long candidateId;

    @Column(name = "interviewer_id")
    private Long interviewerId;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    private String result;
    private String notes;
}

