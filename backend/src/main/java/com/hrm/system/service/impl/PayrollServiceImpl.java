package com.hrm.system.service.impl;

import com.hrm.system.dto.PayrollDto;
import com.hrm.system.entity.Payroll;
import com.hrm.system.entity.User;
import com.hrm.system.repository.PayrollRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PayrollServiceImpl implements PayrollService {
    
    @Autowired
    private PayrollRepository payrollRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public PayrollDto createPayroll(PayrollDto payrollDto) {
        // Validate user exists
        Optional<User> user = userRepository.findById(payrollDto.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + payrollDto.getUserId());
        }
        
        Payroll payroll = new Payroll();
        payroll.setUser(user.get());
        payroll.setPayPeriod(payrollDto.getPayPeriod());
        payroll.setBasicSalary(payrollDto.getBasicSalary());
        payroll.setHouseRentAllowance(payrollDto.getHouseRentAllowance());
        payroll.setDearnessAllowance(payrollDto.getDearnessAllowance());
        payroll.setConveyanceAllowance(payrollDto.getConveyanceAllowance());
        payroll.setMedicalAllowance(payrollDto.getMedicalAllowance());
        payroll.setSpecialAllowance(payrollDto.getSpecialAllowance());
        payroll.setBonus(payrollDto.getBonus());
        payroll.setOvertime(payrollDto.getOvertime());
        payroll.setIncentives(payrollDto.getIncentives());
        payroll.setProvidentFund(payrollDto.getProvidentFund());
        payroll.setProfessionalTax(payrollDto.getProfessionalTax());
        payroll.setIncomeTax(payrollDto.getIncomeTax());
        payroll.setOtherDeductions(payrollDto.getOtherDeductions());
        payroll.setPaymentStatus(Payroll.PaymentStatus.PENDING);
        payroll.setPaymentMethod(payrollDto.getPaymentMethod());
        payroll.setBankAccountNumber(payrollDto.getBankAccountNumber());
        payroll.setRemarks(payrollDto.getRemarks());
        
        // Calculate gross salary, total deductions, and net salary
        payroll.setGrossSalary(payroll.calculateGrossSalary());
        payroll.setTotalDeductions(payroll.calculateTotalDeductions());
        payroll.setNetSalary(payroll.calculateNetSalary());
        
        Payroll savedPayroll = payrollRepository.save(payroll);
        return new PayrollDto(savedPayroll);
    }
    
    @Override
    public Page<PayrollDto> getAllPayroll(Pageable pageable) {
        return payrollRepository.findAll(pageable).map(PayrollDto::new);
    }
    
    @Override
    public Optional<PayrollDto> getPayrollById(Long id) {
        return payrollRepository.findById(id).map(PayrollDto::new);
    }
    
    @Override
    public PayrollDto updatePayroll(Long id, PayrollDto payrollDto) {
        Optional<Payroll> existingPayroll = payrollRepository.findById(id);
        if (existingPayroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with ID: " + id);
        }
        
        Payroll payroll = existingPayroll.get();
        payroll.setPayPeriod(payrollDto.getPayPeriod());
        payroll.setBasicSalary(payrollDto.getBasicSalary());
        payroll.setHouseRentAllowance(payrollDto.getHouseRentAllowance());
        payroll.setDearnessAllowance(payrollDto.getDearnessAllowance());
        payroll.setConveyanceAllowance(payrollDto.getConveyanceAllowance());
        payroll.setMedicalAllowance(payrollDto.getMedicalAllowance());
        payroll.setSpecialAllowance(payrollDto.getSpecialAllowance());
        payroll.setBonus(payrollDto.getBonus());
        payroll.setOvertime(payrollDto.getOvertime());
        payroll.setIncentives(payrollDto.getIncentives());
        payroll.setProvidentFund(payrollDto.getProvidentFund());
        payroll.setProfessionalTax(payrollDto.getProfessionalTax());
        payroll.setIncomeTax(payrollDto.getIncomeTax());
        payroll.setOtherDeductions(payrollDto.getOtherDeductions());
        payroll.setPaymentMethod(payrollDto.getPaymentMethod());
        payroll.setBankAccountNumber(payrollDto.getBankAccountNumber());
        payroll.setRemarks(payrollDto.getRemarks());
        
        // Recalculate amounts
        payroll.setGrossSalary(payroll.calculateGrossSalary());
        payroll.setTotalDeductions(payroll.calculateTotalDeductions());
        payroll.setNetSalary(payroll.calculateNetSalary());
        
        Payroll updatedPayroll = payrollRepository.save(payroll);
        return new PayrollDto(updatedPayroll);
    }
    
    @Override
    public void deletePayroll(Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new RuntimeException("Payroll not found with ID: " + id);
        }
        payrollRepository.deleteById(id);
    }
    
    @Override
    public List<PayrollDto> getPayrollByUser(Long userId) {
        return payrollRepository.findByUserIdOrderByPayPeriodDesc(userId)
                .stream()
                .map(PayrollDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PayrollDto> getPayrollByStatus(Payroll.PaymentStatus status) {
        return payrollRepository.findByPaymentStatusOrderByPayPeriodDesc(status)
                .stream()
                .map(PayrollDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public PayrollDto processPayroll(Long id) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with ID: " + id);
        }
        
        Payroll existingPayroll = payroll.get();
        existingPayroll.setPaymentStatus(Payroll.PaymentStatus.PROCESSING);
        
        Payroll processedPayroll = payrollRepository.save(existingPayroll);
        return new PayrollDto(processedPayroll);
    }
    
    @Override
    public PayrollDto markAsPaid(Long id) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with ID: " + id);
        }
        
        Payroll existingPayroll = payroll.get();
        existingPayroll.setPaymentStatus(Payroll.PaymentStatus.PAID);
        existingPayroll.setPaymentDate(LocalDate.now());
        
        Payroll paidPayroll = payrollRepository.save(existingPayroll);
        return new PayrollDto(paidPayroll);
    }
    
    @Override
    public List<PayrollDto> generatePayroll(int month, int year) {
        YearMonth payPeriod = YearMonth.of(year, month);
        
        // Get all active employees
        List<User> activeEmployees = userRepository.findByStatus(User.UserStatus.ACTIVE);
        
        return activeEmployees.stream()
                .map(employee -> {
                    PayrollDto payrollDto = new PayrollDto();
                    payrollDto.setUserId(employee.getId());
                    payrollDto.setEmployeeName(employee.getFullName());
                    payrollDto.setEmployeeId(employee.getEmployeeId());
                    payrollDto.setPayPeriod(payPeriod);
                    payrollDto.setBasicSalary(BigDecimal.valueOf(5000)); // Default salary
                    payrollDto.setPaymentStatus(Payroll.PaymentStatus.PENDING);
                    
                    return createPayroll(payrollDto);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public PayrollStatistics getPayrollStatistics() {
        long totalPayroll = payrollRepository.count();
        long pendingPayroll = payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PENDING);
        long processedPayroll = payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PROCESSING);
        long paidPayroll = payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PAID);
        
        // Calculate total amount and average salary
        BigDecimal totalAmount = payrollRepository.findAll().stream()
                .map(Payroll::getNetSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        double averageSalary = totalPayroll > 0 ? 
                totalAmount.divide(BigDecimal.valueOf(totalPayroll), 2, BigDecimal.ROUND_HALF_UP).doubleValue() : 0;
        
        return new PayrollStatistics(
            totalPayroll,
            pendingPayroll,
            processedPayroll,
            paidPayroll,
            totalAmount.doubleValue(),
            averageSalary
        );
    }
    
    @Override
    public UserPayrollStatistics getUserPayrollStatistics(Long userId) {
        long totalPayroll = payrollRepository.countByUserId(userId);
        long pendingPayroll = payrollRepository.countByUserIdAndPaymentStatus(userId, Payroll.PaymentStatus.PENDING);
        long processedPayroll = payrollRepository.countByUserIdAndPaymentStatus(userId, Payroll.PaymentStatus.PROCESSING);
        long paidPayroll = payrollRepository.countByUserIdAndPaymentStatus(userId, Payroll.PaymentStatus.PAID);
        
        // Calculate total earnings and deductions
        List<Payroll> userPayrolls = payrollRepository.findByUserIdOrderByPayPeriodDesc(userId);
        BigDecimal totalEarnings = userPayrolls.stream()
                .map(Payroll::getNetSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalDeductions = userPayrolls.stream()
                .map(Payroll::getTotalDeductions)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        double averageSalary = totalPayroll > 0 ? 
                totalEarnings.divide(BigDecimal.valueOf(totalPayroll), 2, BigDecimal.ROUND_HALF_UP).doubleValue() : 0;
        
        return new UserPayrollStatistics(
            totalPayroll,
            pendingPayroll,
            processedPayroll,
            paidPayroll,
            totalEarnings.doubleValue(),
            averageSalary,
            totalDeductions.doubleValue()
        );
    }
    
    @Override
    public byte[] downloadPayslip(Long id) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with ID: " + id);
        }
        
        // For now, return a simple text representation
        // In a real implementation, this would generate a PDF
        String payslipContent = generatePayslipText(payroll.get());
        return payslipContent.getBytes();
    }
    
    @Override
    public long getPendingPayrollCount() {
        return payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PENDING);
    }
    
    @Override
    public long getProcessedPayrollCount() {
        return payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PROCESSING);
    }
    
    @Override
    public long getPaidPayrollCount() {
        return payrollRepository.countByPaymentStatus(Payroll.PaymentStatus.PAID);
    }
    
    @Override
    public boolean isOwner(Long payrollId, Long userId) {
        return payrollRepository.existsByIdAndUserId(payrollId, userId);
    }
    
    private String generatePayslipText(Payroll payroll) {
        StringBuilder payslip = new StringBuilder();
        payslip.append("PAYSLIP\n");
        payslip.append("========\n");
        payslip.append("Employee: ").append(payroll.getUser().getFullName()).append("\n");
        payslip.append("Employee ID: ").append(payroll.getUser().getEmployeeId()).append("\n");
        payslip.append("Pay Period: ").append(payroll.getPayPeriod()).append("\n");
        payslip.append("Basic Salary: $").append(payroll.getBasicSalary()).append("\n");
        payslip.append("Gross Salary: $").append(payroll.getGrossSalary()).append("\n");
        payslip.append("Total Deductions: $").append(payroll.getTotalDeductions()).append("\n");
        payslip.append("Net Salary: $").append(payroll.getNetSalary()).append("\n");
        payslip.append("Status: ").append(payroll.getPaymentStatus()).append("\n");
        return payslip.toString();
    }
} 