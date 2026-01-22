package com.hrm.HRM.service;

import java.util.List;

import com.hrm.HRM.dto.PositionRequest;
import com.hrm.HRM.dto.PositionResponse;

public interface PositionService {
    List<PositionResponse> getAll();
    PositionResponse getById(Long id);
    PositionResponse create(PositionRequest request);
    PositionResponse update(Long id, PositionRequest request);
    void delete(Long id);
}
