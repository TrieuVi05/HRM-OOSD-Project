package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.InterviewRequest;
import com.hrm.HRM.dto.InterviewResponse;
import com.hrm.HRM.entity.Interview;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.InterviewRepository;

import java.util.List;

@Service
public class InterviewServiceImpl implements InterviewService {
    private final InterviewRepository repository;

    public InterviewServiceImpl(InterviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<InterviewResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public InterviewResponse getById(Long id) {
        Interview interview = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        return mapToResponse(interview);
    }

    @Override
    public InterviewResponse create(InterviewRequest request) {
        Interview interview = mapToEntity(request);
        return mapToResponse(repository.save(interview));
    }

    @Override
    public InterviewResponse update(Long id, InterviewRequest request) {
        Interview interview = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        interview.setCandidateId(request.getCandidateId());
        interview.setInterviewerId(request.getInterviewerId());
        interview.setScheduledAt(request.getScheduledAt());
        interview.setResult(request.getResult());
        interview.setNotes(request.getNotes());
        return mapToResponse(repository.save(interview));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Interview mapToEntity(InterviewRequest request) {
        Interview interview = new Interview();
        interview.setCandidateId(request.getCandidateId());
        interview.setInterviewerId(request.getInterviewerId());
        interview.setScheduledAt(request.getScheduledAt());
        interview.setResult(request.getResult());
        interview.setNotes(request.getNotes());
        return interview;
    }

    private InterviewResponse mapToResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setCandidateId(interview.getCandidateId());
        response.setInterviewerId(interview.getInterviewerId());
        response.setScheduledAt(interview.getScheduledAt());
        response.setResult(interview.getResult());
        response.setNotes(interview.getNotes());
        return response;
    }
}
