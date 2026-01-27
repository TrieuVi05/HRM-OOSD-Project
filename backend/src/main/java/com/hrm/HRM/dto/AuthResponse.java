package com.hrm.HRM.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String role;
}
