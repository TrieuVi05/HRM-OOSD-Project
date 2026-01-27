package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String username;
    private String passwordHash;
    private String email;
    private String fullName;
    private String phone;
    private String status;
    private String roleName;
}
