package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.UserRequest;
import com.hrm.HRM.dto.UserResponse;
import com.hrm.HRM.entity.User;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public UserResponse getById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public UserResponse create(UserRequest request) {
        User user = mapToEntity(request);
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("{noop}") && !user.getPasswordHash().startsWith("{bcrypt}")) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(Instant.now());
        }
        return mapToResponse(repository.save(user));
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setUsername(request.getUsername());
        if (request.getPasswordHash() != null) {
            String raw = request.getPasswordHash();
            user.setPasswordHash(raw.startsWith("{noop}") || raw.startsWith("{bcrypt}") ? raw : passwordEncoder.encode(raw));
        }
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setStatus(request.getStatus());
        return mapToResponse(repository.save(user));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private User mapToEntity(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPasswordHash());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setStatus(request.getStatus());
        return user;
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
