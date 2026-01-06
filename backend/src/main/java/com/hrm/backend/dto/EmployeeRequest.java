package com.hrm.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class EmployeeRequest {

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;
    private LocalDate dateOfBirth;
    private String department;
    private String position;
    private String phone;

    @Positive
    private Double salary;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getDepartment() {
        return department;
    }

    public String getPosition() {
        return position;
    }

    public String getPhone() {
        return phone;
    }

    public Double getSalary() {
        return salary;
    }
}
