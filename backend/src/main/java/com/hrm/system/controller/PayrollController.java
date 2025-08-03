package com.hrm.system.controller;

import com.hrm.system.dto.PayrollDto;
import com.hrm.system.entity.Payroll;
import com.hrm.system.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Payroll management
 */
@RestController
@RequestMapping("/api/payroll")
@Tag(name = "Payroll Management", description = "APIs for managing employee payroll")
@CrossOrigin(origins = "*")
public class PayrollController {
    
    @Autowired
    private PayrollService payrollService;
    
    /**
     * Create a new payroll record
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new payroll record", description = "Create a new payroll record for an employee")
    public ResponseEntity<PayrollDto> createPayroll(@Valid @RequestBody PayrollDto payrollDto) {
        PayrollDto createdPayroll = payrollService.createPayroll(payrollDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayroll);
    }
    
    /**
     * Get all payroll records with pagination
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all payroll records", description = "Get paginated list of all payroll records")
    public ResponseEntity<Page<PayrollDto>> getAllPayroll(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PayrollDto> payroll = payrollService.getAllPayroll(pageable);
        return ResponseEntity.ok(payroll);
    }
    
    /**
     * Get payroll by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @payrollService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Get payroll by ID", description = "Get payroll details by payroll ID")
    public ResponseEntity<PayrollDto> getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update payroll record
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update payroll record", description = "Update payroll record information")
    public ResponseEntity<PayrollDto> updatePayroll(@PathVariable Long id, @Valid @RequestBody PayrollDto payrollDto) {
        try {
            PayrollDto updatedPayroll = payrollService.updatePayroll(id, payrollDto);
            return ResponseEntity.ok(updatedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete payroll record
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete payroll record", description = "Delete a payroll record")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        try {
            payrollService.deletePayroll(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get payroll by user ID
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get payroll by user", description = "Get all payroll records for a specific user")
    public ResponseEntity<List<PayrollDto>> getPayrollByUser(@PathVariable Long userId) {
        List<PayrollDto> payroll = payrollService.getPayrollByUser(userId);
        return ResponseEntity.ok(payroll);
    }
    
    /**
     * Get payroll by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get payroll by status", description = "Get all payroll records with a specific status")
    public ResponseEntity<List<PayrollDto>> getPayrollByStatus(@PathVariable Payroll.PaymentStatus status) {
        List<PayrollDto> payroll = payrollService.getPayrollByStatus(status);
        return ResponseEntity.ok(payroll);
    }
    
    /**
     * Process payroll
     */
    @PatchMapping("/{id}/process")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process payroll", description = "Process a payroll record")
    public ResponseEntity<PayrollDto> processPayroll(@PathVariable Long id) {
        try {
            PayrollDto processedPayroll = payrollService.processPayroll(id);
            return ResponseEntity.ok(processedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Mark payroll as paid
     */
    @PatchMapping("/{id}/paid")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark payroll as paid", description = "Mark a payroll record as paid")
    public ResponseEntity<PayrollDto> markAsPaid(@PathVariable Long id) {
        try {
            PayrollDto paidPayroll = payrollService.markAsPaid(id);
            return ResponseEntity.ok(paidPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Generate payroll for all employees
     */
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate payroll", description = "Generate payroll for all employees for a specific month")
    public ResponseEntity<List<PayrollDto>> generatePayroll(
            @RequestParam int month,
            @RequestParam int year) {
        List<PayrollDto> generatedPayroll = payrollService.generatePayroll(month, year);
        return ResponseEntity.status(HttpStatus.CREATED).body(generatedPayroll);
    }
    
    /**
     * Get payroll statistics for dashboard
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get payroll statistics", description = "Get payroll statistics for dashboard")
    public ResponseEntity<PayrollService.PayrollStatistics> getPayrollStatistics() {
        PayrollService.PayrollStatistics statistics = payrollService.getPayrollStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get user payroll statistics
     */
    @GetMapping("/statistics/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get user payroll statistics", description = "Get payroll statistics for a specific user")
    public ResponseEntity<PayrollService.UserPayrollStatistics> getUserPayrollStatistics(@PathVariable Long userId) {
        PayrollService.UserPayrollStatistics statistics = payrollService.getUserPayrollStatistics(userId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Download payslip
     */
    @GetMapping("/{id}/payslip")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @payrollService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Download payslip", description = "Download payslip as PDF")
    public ResponseEntity<byte[]> downloadPayslip(@PathVariable Long id) {
        try {
            byte[] payslip = payrollService.downloadPayslip(id);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=payslip-" + id + ".pdf")
                    .body(payslip);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get pending payroll count
     */
    @GetMapping("/count/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get pending payroll count", description = "Get the count of pending payroll records")
    public ResponseEntity<Long> getPendingPayrollCount() {
        long count = payrollService.getPendingPayrollCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get processed payroll count
     */
    @GetMapping("/count/processed")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get processed payroll count", description = "Get the count of processed payroll records")
    public ResponseEntity<Long> getProcessedPayrollCount() {
        long count = payrollService.getProcessedPayrollCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get paid payroll count
     */
    @GetMapping("/count/paid")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get paid payroll count", description = "Get the count of paid payroll records")
    public ResponseEntity<Long> getPaidPayrollCount() {
        long count = payrollService.getPaidPayrollCount();
        return ResponseEntity.ok(count);
    }
} 