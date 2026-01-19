package com.hrm.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CandidateResponse {
    private Long id;
    private Long recruitmentId;
    private String fullName;
    private String email;
    private String phone;
    private String resumeUrl;
    private String status;
    private Instant appliedAt;
}
