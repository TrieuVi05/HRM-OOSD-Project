package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class WorkScheduleRequest {
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    private String daysOfWeek;
    private String description;
}
