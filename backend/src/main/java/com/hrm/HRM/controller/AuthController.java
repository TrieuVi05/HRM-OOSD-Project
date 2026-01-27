package com.hrm.HRM.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.hrm.HRM.dto.AuthRequest;
import com.hrm.HRM.dto.AuthResponse;
import com.hrm.HRM.dto.ChangePasswordRequest;
import com.hrm.HRM.entity.User;
import com.hrm.HRM.exception.BadRequestException;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.UserRepository;
import com.hrm.HRM.repository.UserRoleRepository;
import com.hrm.HRM.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          UserRoleRepository userRoleRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication.getName());

        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String role = userRoleRepository.findByIdUserId(user.getId())
            .stream()
            .map(ur -> ur.getRole() != null ? ur.getRole().getName() : null)
            .filter(name -> name != null && !name.isBlank())
            .findFirst()
            .orElse(null);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUsername(authentication.getName());
        response.setRole(role);
        return response;
    }

    @GetMapping("/me")
    public AuthResponse me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthResponse response = new AuthResponse();
        if (authentication != null && authentication.getName() != null) {
            response.setUsername(authentication.getName());
            User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            String role = userRoleRepository.findByIdUserId(user.getId())
                .stream()
                .map(ur -> ur.getRole() != null ? ur.getRole().getName() : null)
                .filter(name -> name != null && !name.isBlank())
                .findFirst()
                .orElse(null);
            response.setRole(role);
        }
        return response;
    }

    @PutMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new BadRequestException("Unauthenticated");
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed";
    }

    @PostMapping("/logout")
    public String logout() {
        return "Logged out";
    }
}
