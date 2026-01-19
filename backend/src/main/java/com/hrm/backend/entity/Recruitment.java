package com.hrm.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "recruitments")
@Getter
@Setter
public class Recruitment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "position_id")
    private Long positionId;

    private Integer openings;
    private String status;

    @Column(name = "posted_at")
    private Instant postedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    private String description;
}
