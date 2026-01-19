package com.hrm.backend.service;

import com.hrm.backend.dto.CandidateRequest;
import com.hrm.backend.dto.CandidateResponse;
import com.hrm.backend.entity.Candidate;
import com.hrm.backend.exception.ResourceNotFoundException;
import com.hrm.backend.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateServiceImpl implements CandidateService {
    private final CandidateRepository repository;

    public CandidateServiceImpl(CandidateRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CandidateResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public CandidateResponse getById(Long id) {
        Candidate candidate = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        return mapToResponse(candidate);
    }

    @Override
    public CandidateResponse create(CandidateRequest request) {
        Candidate candidate = mapToEntity(request);
        return mapToResponse(repository.save(candidate));
    }

    @Override
    public CandidateResponse update(Long id, CandidateRequest request) {
        Candidate candidate = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        candidate.setRecruitmentId(request.getRecruitmentId());
        candidate.setFullName(request.getFullName());
        candidate.setEmail(request.getEmail());
        candidate.setPhone(request.getPhone());
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setStatus(request.getStatus());
        candidate.setAppliedAt(request.getAppliedAt());
        return mapToResponse(repository.save(candidate));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Candidate mapToEntity(CandidateRequest request) {
        Candidate candidate = new Candidate();
        candidate.setRecruitmentId(request.getRecruitmentId());
        candidate.setFullName(request.getFullName());
        candidate.setEmail(request.getEmail());
        candidate.setPhone(request.getPhone());
        candidate.setResumeUrl(request.getResumeUrl());
        candidate.setStatus(request.getStatus());
        candidate.setAppliedAt(request.getAppliedAt());
        return candidate;
    }

    private CandidateResponse mapToResponse(Candidate candidate) {
        CandidateResponse response = new CandidateResponse();
        response.setId(candidate.getId());
        response.setRecruitmentId(candidate.getRecruitmentId());
        response.setFullName(candidate.getFullName());
        response.setEmail(candidate.getEmail());
        response.setPhone(candidate.getPhone());
        response.setResumeUrl(candidate.getResumeUrl());
        response.setStatus(candidate.getStatus());
        response.setAppliedAt(candidate.getAppliedAt());
        return response;
    }
}
