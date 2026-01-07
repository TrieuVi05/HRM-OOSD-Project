package com.hrm.backend.service;
import com.hrm.backend.dto.EmployeeRequest;
import com.hrm.backend.dto.EmployeeResponse;
import com.hrm.backend.entity.Employee;
import com.hrm.backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    @Override
    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public EmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return mapToResponse(employee);
    }
    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = mapToEntity(request);
        Employee saved = employeeRepository.save(employee);
        return mapToResponse(saved);
    }
    @Override
    public EmployeeResponse update(Long id, EmployeeRequest request) {

        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        existing.setFullName(request.getFullName());
        existing.setEmail(request.getEmail());
        existing.setDepartment(request.getDepartment());
        existing.setPhone(request.getPhone());
        existing.setPosition(request.getPosition());
        existing.setSalary(request.getSalary());
        existing.setDateOfBirth(request.getDateOfBirth());
        Employee updated = employeeRepository.save(existing);
        return mapToResponse(updated);
    }
    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }
    private Employee mapToEntity(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setSalary(request.getSalary());
        employee.setDateOfBirth(request.getDateOfBirth());
        return employee;
    }
    private EmployeeResponse mapToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setFullName(employee.getFullName());
        response.setEmail(employee.getEmail());
        response.setDepartment(employee.getDepartment());
        response.setPhone(employee.getPhone());
        response.setPosition(employee.getPosition());
        response.setSalary(employee.getSalary());
        response.setDateOfBirth(employee.getDateOfBirth());
        return response;
    }
}

