package com.hrm.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class LeaveRequestRequest {
    private Long employeeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String leaveType;
    private String reason;
    private String status;
    private Long approvedBy;
    private Instant approvedAt;
}
