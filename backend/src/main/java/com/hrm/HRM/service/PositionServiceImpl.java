package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.PositionRequest;
import com.hrm.HRM.dto.PositionResponse;
import com.hrm.HRM.entity.Position;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.PositionRepository;

import java.util.List;

@Service
public class PositionServiceImpl implements PositionService {
    private final PositionRepository repository;

    public PositionServiceImpl(PositionRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PositionResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public PositionResponse getById(Long id) {
        Position position = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found"));
        return mapToResponse(position);
    }

    @Override
    public PositionResponse create(PositionRequest request) {
        Position position = mapToEntity(request);
        return mapToResponse(repository.save(position));
    }

    @Override
    public PositionResponse update(Long id, PositionRequest request) {
        Position position = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found"));
        position.setDepartmentId(request.getDepartmentId());
        position.setName(request.getName());
        position.setDescription(request.getDescription());
        position.setBaseSalary(request.getBaseSalary());
        return mapToResponse(repository.save(position));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Position mapToEntity(PositionRequest request) {
        Position position = new Position();
        position.setDepartmentId(request.getDepartmentId());
        position.setName(request.getName());
        position.setDescription(request.getDescription());
        position.setBaseSalary(request.getBaseSalary());
        return position;
    }

    private PositionResponse mapToResponse(Position position) {
        PositionResponse response = new PositionResponse();
        response.setId(position.getId());
        response.setDepartmentId(position.getDepartmentId());
        response.setName(position.getName());
        response.setDescription(position.getDescription());
        response.setBaseSalary(position.getBaseSalary());
        return response;
    }
}
