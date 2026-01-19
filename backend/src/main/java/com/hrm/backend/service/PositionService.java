package com.hrm.backend.service;

import com.hrm.backend.dto.PositionRequest;
import com.hrm.backend.dto.PositionResponse;

import java.util.List;

public interface PositionService {
    List<PositionResponse> getAll();
    PositionResponse getById(Long id);
    PositionResponse create(PositionRequest request);
    PositionResponse update(Long id, PositionRequest request);
    void delete(Long id);
}
