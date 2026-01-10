package com.hrm.backend.service;

import com.hrm.backend.dto.DepartmentResponse;
import com.hrm.backend.entity.Department;
import com.hrm.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository repository;

    public DepartmentServiceImpl(DepartmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DepartmentResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(d -> new DepartmentResponse(
                        d.getId(),
                        d.getName()
                ))
                .toList();
    }

    @Override
    public DepartmentResponse getById(Long id) {
        Department department = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        return new DepartmentResponse(
                department.getId(),
                department.getName()
        );
    }
}


