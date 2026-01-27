package com.hrm.HRM.dto;
import jakarta.validation.constraints.*;
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
    private LocalDate hireDate;
    private String status;

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
    public LocalDate getHireDate() {
        return hireDate;
    }
    public String getStatus() {
        return status;
    }
    public Double getSalary() {
        return salary;
    }
}
