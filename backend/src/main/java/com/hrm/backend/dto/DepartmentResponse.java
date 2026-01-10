package com.hrm.backend.dto;

public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;

    public DepartmentResponse(Long id, String name) {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}

