package com.hrm.HRM.service;

import org.springframework.stereotype.Service;
import com.hrm.HRM.dto.DepartmentRequest;
import com.hrm.HRM.dto.DepartmentResponse;
import com.hrm.HRM.entity.Department;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.DepartmentRepository;
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
            .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DepartmentResponse getById(Long id) {
        Department department = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        return mapToResponse(department);
    }

    @Override
    public DepartmentResponse create(DepartmentRequest request) {
        Department department = mapToEntity(request);
        Department saved = repository.save(department);
        return mapToResponse(saved);
    }

    @Override
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        Department updated = repository.save(department);
        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Department mapToEntity(DepartmentRequest request) {
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return department;
    }

    private DepartmentResponse mapToResponse(Department department) {
        return new DepartmentResponse(department.getId(), department.getName(), department.getDescription());
    }
}


