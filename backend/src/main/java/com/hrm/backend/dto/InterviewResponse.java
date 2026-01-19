package com.hrm.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class InterviewResponse {
    private Long id;
    private Long candidateId;
    private Long interviewerId;
    private Instant scheduledAt;
    private String result;
    private String notes;
}
