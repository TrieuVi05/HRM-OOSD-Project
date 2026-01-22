package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class RecruitmentRequest {
    private String title;
    private Long departmentId;
    private Long positionId;
    private Integer openings;
    private String status;
    private Instant postedAt;
    private Instant closedAt;
    private String description;
}
