package com.hrm.backend.service;

import com.hrm.backend.dto.RoleRequest;
import com.hrm.backend.dto.RoleResponse;
import com.hrm.backend.entity.Role;
import com.hrm.backend.exception.ResourceNotFoundException;
import com.hrm.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    private final RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<RoleResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public RoleResponse getById(Long id) {
        Role role = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return mapToResponse(role);
    }

    @Override
    public RoleResponse create(RoleRequest request) {
        Role role = mapToEntity(request);
        return mapToResponse(repository.save(role));
    }

    @Override
    public RoleResponse update(Long id, RoleRequest request) {
        Role role = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        return mapToResponse(repository.save(role));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Role mapToEntity(RoleRequest request) {
        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        return role;
    }

    private RoleResponse mapToResponse(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setName(role.getName());
        response.setDescription(role.getDescription());
        return response;
    }
}
