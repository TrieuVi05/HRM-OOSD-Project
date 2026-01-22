package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.PerformanceReviewRequest;
import com.hrm.HRM.dto.PerformanceReviewResponse;
import com.hrm.HRM.entity.PerformanceReview;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.PerformanceReviewRepository;

import java.util.List;

@Service
public class PerformanceReviewServiceImpl implements PerformanceReviewService {
    private final PerformanceReviewRepository repository;

    public PerformanceReviewServiceImpl(PerformanceReviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PerformanceReviewResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public PerformanceReviewResponse getById(Long id) {
        PerformanceReview review = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review not found"));
        return mapToResponse(review);
    }

    @Override
    public PerformanceReviewResponse create(PerformanceReviewRequest request) {
        PerformanceReview review = mapToEntity(request);
        return mapToResponse(repository.save(review));
    }

    @Override
    public PerformanceReviewResponse update(Long id, PerformanceReviewRequest request) {
        PerformanceReview review = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review not found"));
        review.setEmployeeId(request.getEmployeeId());
        review.setReviewerId(request.getReviewerId());
        review.setReviewPeriod(request.getReviewPeriod());
        review.setScore(request.getScore());
        review.setComments(request.getComments());
        return mapToResponse(repository.save(review));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private PerformanceReview mapToEntity(PerformanceReviewRequest request) {
        PerformanceReview review = new PerformanceReview();
        review.setEmployeeId(request.getEmployeeId());
        review.setReviewerId(request.getReviewerId());
        review.setReviewPeriod(request.getReviewPeriod());
        review.setScore(request.getScore());
        review.setComments(request.getComments());
        return review;
    }

    private PerformanceReviewResponse mapToResponse(PerformanceReview review) {
        PerformanceReviewResponse response = new PerformanceReviewResponse();
        response.setId(review.getId());
        response.setEmployeeId(review.getEmployeeId());
        response.setReviewerId(review.getReviewerId());
        response.setReviewPeriod(review.getReviewPeriod());
        response.setScore(review.getScore());
        response.setComments(review.getComments());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
