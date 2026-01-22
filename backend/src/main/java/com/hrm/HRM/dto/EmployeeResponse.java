package com.hrm.HRM.dto;
import java.time.LocalDate;

public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String email;
    private String department;
    private String position;
    private String phone;
    private Double salary;
    private LocalDate dateOfBirth;

    public EmployeeResponse() {
    }
    public EmployeeResponse(Long id, String fullName, String email, String department,
                            String position, String phone, Double salary, LocalDate dateOfBirth) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.department = department;
        this.position = position;
        this.phone = phone;
        this.salary = salary;
        this.dateOfBirth = dateOfBirth;
    }
    public Long getId() {
        return id;
    }
    public String getFullName() {
        return fullName;
    }
    public String getEmail() {
        return email;
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
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    public void setPosition(String position) {
        this.position = position;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setSalary(Double salary) {
        if (salary != null && salary < 0) {
            throw new IllegalArgumentException("Lương không được nhỏ hơn 0");
        }
        this.salary = salary;
    }
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}

