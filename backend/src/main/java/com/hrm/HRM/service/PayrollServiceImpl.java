package com.hrm.HRM.service;

import org.springframework.stereotype.Service;

import com.hrm.HRM.dto.PayrollGenerateRequest;
import com.hrm.HRM.dto.PayrollRequest;
import com.hrm.HRM.dto.PayrollResponse;
import com.hrm.HRM.entity.Payroll;
import com.hrm.HRM.exception.ResourceNotFoundException;
import com.hrm.HRM.repository.PayrollRepository;

import java.util.List;
import java.time.Instant;

@Service
public class PayrollServiceImpl implements PayrollService {
    private final PayrollRepository repository;

    public PayrollServiceImpl(PayrollRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PayrollResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    public PayrollResponse getById(Long id) {
        Payroll payroll = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));
        return mapToResponse(payroll);
    }

    @Override
    public PayrollResponse create(PayrollRequest request) {
        Payroll payroll = mapToEntity(request);
        return mapToResponse(repository.save(payroll));
    }

    @Override
    public PayrollResponse update(Long id, PayrollRequest request) {
        Payroll payroll = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));
        payroll.setEmployeeId(request.getEmployeeId());
        payroll.setPeriodStart(request.getPeriodStart());
        payroll.setPeriodEnd(request.getPeriodEnd());
        payroll.setBasicSalary(request.getBasicSalary());
        payroll.setAllowance(request.getAllowance());
        payroll.setBonus(request.getBonus());
        payroll.setDeduction(request.getDeduction());
        payroll.setStatus(request.getStatus());
        return mapToResponse(repository.save(payroll));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public PayrollResponse generate(PayrollGenerateRequest request) {
        Payroll payroll = new Payroll();
        payroll.setEmployeeId(request.getEmployeeId());
        payroll.setPeriodStart(request.getPeriodStart());
        payroll.setPeriodEnd(request.getPeriodEnd());
        payroll.setBasicSalary(request.getBasicSalary());
        payroll.setAllowance(request.getAllowance());
        payroll.setBonus(request.getBonus());
        payroll.setDeduction(request.getDeduction());
        payroll.setStatus("GENERATED");
        payroll.setGeneratedAt(Instant.now());
        return mapToResponse(repository.save(payroll));
    }

    private Payroll mapToEntity(PayrollRequest request) {
        Payroll payroll = new Payroll();
        payroll.setEmployeeId(request.getEmployeeId());
        payroll.setPeriodStart(request.getPeriodStart());
        payroll.setPeriodEnd(request.getPeriodEnd());
        payroll.setBasicSalary(request.getBasicSalary());
        payroll.setAllowance(request.getAllowance());
        payroll.setBonus(request.getBonus());
        payroll.setDeduction(request.getDeduction());
        payroll.setStatus(request.getStatus());
        return payroll;
    }

    private PayrollResponse mapToResponse(Payroll payroll) {
        PayrollResponse response = new PayrollResponse();
        response.setId(payroll.getId());
        response.setEmployeeId(payroll.getEmployeeId());
        response.setPeriodStart(payroll.getPeriodStart());
        response.setPeriodEnd(payroll.getPeriodEnd());
        response.setBasicSalary(payroll.getBasicSalary());
        response.setAllowance(payroll.getAllowance());
        response.setBonus(payroll.getBonus());
        response.setDeduction(payroll.getDeduction());
        response.setStatus(payroll.getStatus());
        response.setGeneratedAt(payroll.getGeneratedAt());
        return response;
    }
}
