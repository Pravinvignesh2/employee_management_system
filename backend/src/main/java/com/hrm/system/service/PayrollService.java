package com.hrm.system.service;

import com.hrm.system.dto.PayrollDto;
import com.hrm.system.entity.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Payroll management
 */
public interface PayrollService {
    
    /**
     * Create a new payroll record
     */
    PayrollDto createPayroll(PayrollDto payrollDto);
    
    /**
     * Get all payroll records with pagination
     */
    Page<PayrollDto> getAllPayroll(Pageable pageable);
    
    /**
     * Get payroll by ID
     */
    Optional<PayrollDto> getPayrollById(Long id);
    
    /**
     * Update payroll record
     */
    PayrollDto updatePayroll(Long id, PayrollDto payrollDto);
    
    /**
     * Delete payroll record
     */
    void deletePayroll(Long id);
    
    /**
     * Get payroll by user ID
     */
    List<PayrollDto> getPayrollByUser(Long userId);
    
    /**
     * Get payroll by status
     */
    List<PayrollDto> getPayrollByStatus(Payroll.PaymentStatus status);
    
    /**
     * Process payroll
     */
    PayrollDto processPayroll(Long id);
    
    /**
     * Mark payroll as paid
     */
    PayrollDto markAsPaid(Long id);
    
    /**
     * Generate payroll for all employees
     */
    List<PayrollDto> generatePayroll(int month, int year);
    
    /**
     * Get payroll statistics for dashboard
     */
    PayrollStatistics getPayrollStatistics();
    
    /**
     * Get user payroll statistics
     */
    UserPayrollStatistics getUserPayrollStatistics(Long userId);
    
    /**
     * Download payslip
     */
    byte[] downloadPayslip(Long id);
    
    /**
     * Get pending payroll count
     */
    long getPendingPayrollCount();
    
    /**
     * Get processed payroll count
     */
    long getProcessedPayrollCount();
    
    /**
     * Get paid payroll count
     */
    long getPaidPayrollCount();
    
    /**
     * Check if user is the owner of the payroll record
     */
    boolean isOwner(Long payrollId, Long userId);
    
    /**
     * Payroll statistics for dashboard
     */
    record PayrollStatistics(
        long totalPayroll,
        long pendingPayroll,
        long processedPayroll,
        long paidPayroll,
        double totalAmount,
        double averageSalary
    ) {}
    
    /**
     * User payroll statistics
     */
    record UserPayrollStatistics(
        long totalPayroll,
        long pendingPayroll,
        long processedPayroll,
        long paidPayroll,
        double totalEarnings,
        double averageSalary,
        double totalDeductions
    ) {}
} 