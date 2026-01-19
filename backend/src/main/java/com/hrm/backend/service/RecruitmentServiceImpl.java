package com.hrm.backend.service;

import com.hrm.backend.dto.RecruitmentRequest;
import com.hrm.backend.dto.RecruitmentResponse;
import com.hrm.backend.entity.Recruitment;
import com.hrm.backend.exception.ResourceNotFoundException;
import com.hrm.backend.repository.RecruitmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruitmentServiceImpl implements RecruitmentService {
    private final RecruitmentRepository repository;

    public RecruitmentServiceImpl(RecruitmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<RecruitmentResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public RecruitmentResponse getById(Long id) {
        Recruitment recruitment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruitment not found"));
        return mapToResponse(recruitment);
    }

    @Override
    public RecruitmentResponse create(RecruitmentRequest request) {
        Recruitment recruitment = mapToEntity(request);
        return mapToResponse(repository.save(recruitment));
    }

    @Override
    public RecruitmentResponse update(Long id, RecruitmentRequest request) {
        Recruitment recruitment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruitment not found"));
        recruitment.setTitle(request.getTitle());
        recruitment.setDepartmentId(request.getDepartmentId());
        recruitment.setPositionId(request.getPositionId());
        recruitment.setOpenings(request.getOpenings());
        recruitment.setStatus(request.getStatus());
        recruitment.setPostedAt(request.getPostedAt());
        recruitment.setClosedAt(request.getClosedAt());
        recruitment.setDescription(request.getDescription());
        return mapToResponse(repository.save(recruitment));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Recruitment mapToEntity(RecruitmentRequest request) {
        Recruitment recruitment = new Recruitment();
        recruitment.setTitle(request.getTitle());
        recruitment.setDepartmentId(request.getDepartmentId());
        recruitment.setPositionId(request.getPositionId());
        recruitment.setOpenings(request.getOpenings());
        recruitment.setStatus(request.getStatus());
        recruitment.setPostedAt(request.getPostedAt());
        recruitment.setClosedAt(request.getClosedAt());
        recruitment.setDescription(request.getDescription());
        return recruitment;
    }

    private RecruitmentResponse mapToResponse(Recruitment recruitment) {
        RecruitmentResponse response = new RecruitmentResponse();
        response.setId(recruitment.getId());
        response.setTitle(recruitment.getTitle());
        response.setDepartmentId(recruitment.getDepartmentId());
        response.setPositionId(recruitment.getPositionId());
        response.setOpenings(recruitment.getOpenings());
        response.setStatus(recruitment.getStatus());
        response.setPostedAt(recruitment.getPostedAt());
        response.setClosedAt(recruitment.getClosedAt());
        response.setDescription(recruitment.getDescription());
        return response;
    }
}
