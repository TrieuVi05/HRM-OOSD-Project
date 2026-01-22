package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.ContractRequest;
import com.hrm.HRM.dto.ContractResponse;
import com.hrm.HRM.entity.Contract;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.ContractRepository;

import java.util.List;

@Service
public class ContractServiceImpl implements ContractService {
    private final ContractRepository repository;

    public ContractServiceImpl(ContractRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ContractResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public ContractResponse getById(Long id) {
        Contract contract = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        return mapToResponse(contract);
    }

    @Override
    public ContractResponse create(ContractRequest request) {
        Contract contract = mapToEntity(request);
        return mapToResponse(repository.save(contract));
    }

    @Override
    public ContractResponse update(Long id, ContractRequest request) {
        Contract contract = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        contract.setEmployeeId(request.getEmployeeId());
        contract.setContractType(request.getContractType());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setSalary(request.getSalary());
        contract.setStatus(request.getStatus());
        contract.setSignedAt(request.getSignedAt());
        return mapToResponse(repository.save(contract));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Contract mapToEntity(ContractRequest request) {
        Contract contract = new Contract();
        contract.setEmployeeId(request.getEmployeeId());
        contract.setContractType(request.getContractType());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setSalary(request.getSalary());
        contract.setStatus(request.getStatus());
        contract.setSignedAt(request.getSignedAt());
        return contract;
    }

    private ContractResponse mapToResponse(Contract contract) {
        ContractResponse response = new ContractResponse();
        response.setId(contract.getId());
        response.setEmployeeId(contract.getEmployeeId());
        response.setContractType(contract.getContractType());
        response.setStartDate(contract.getStartDate());
        response.setEndDate(contract.getEndDate());
        response.setSalary(contract.getSalary());
        response.setStatus(contract.getStatus());
        response.setSignedAt(contract.getSignedAt());
        return response;
    }
}
