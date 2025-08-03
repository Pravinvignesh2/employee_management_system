package com.hrm.system.dto;

import com.hrm.system.entity.Payroll;
import com.hrm.system.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

/**
 * DTO for Payroll entity
 */
public class PayrollDto {
    
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private YearMonth payPeriod;
    private BigDecimal basicSalary;
    private BigDecimal netSalary;
    private Payroll.PaymentStatus paymentStatus;
    private LocalDate paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for detailed payroll
    private BigDecimal houseRentAllowance;
    private BigDecimal dearnessAllowance;
    private BigDecimal conveyanceAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal specialAllowance;
    private BigDecimal providentFund;
    private BigDecimal incomeTax;
    private BigDecimal professionalTax;
    private BigDecimal overtime;
    private BigDecimal bonus;
    private BigDecimal incentives;
    private BigDecimal otherDeductions;
    private String paymentMethod;
    private String bankAccountNumber;
    private String transactionId;
    private String remarks;
    
    public PayrollDto() {}
    
    public PayrollDto(Payroll payroll) {
        this.id = payroll.getId();
        this.userId = payroll.getUser().getId();
        this.employeeName = payroll.getUser().getFullName();
        this.employeeId = payroll.getUser().getEmployeeId();
        this.payPeriod = payroll.getPayPeriod();
        this.basicSalary = payroll.getBasicSalary();
        this.netSalary = payroll.getNetSalary();
        this.paymentStatus = payroll.getPaymentStatus();
        this.paymentDate = payroll.getPaymentDate();
        this.createdAt = payroll.getCreatedAt();
        this.updatedAt = payroll.getUpdatedAt();
        
        // Additional fields
        this.houseRentAllowance = payroll.getHouseRentAllowance();
        this.dearnessAllowance = payroll.getDearnessAllowance();
        this.conveyanceAllowance = payroll.getConveyanceAllowance();
        this.medicalAllowance = payroll.getMedicalAllowance();
        this.specialAllowance = payroll.getSpecialAllowance();
        this.providentFund = payroll.getProvidentFund();
        this.incomeTax = payroll.getIncomeTax();
        this.professionalTax = payroll.getProfessionalTax();
        this.overtime = payroll.getOvertime();
        this.bonus = payroll.getBonus();
        this.incentives = payroll.getIncentives();
        this.otherDeductions = payroll.getOtherDeductions();
        this.paymentMethod = payroll.getPaymentMethod();
        this.bankAccountNumber = payroll.getBankAccountNumber();
        this.transactionId = payroll.getTransactionId();
        this.remarks = payroll.getRemarks();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public String getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    
    public YearMonth getPayPeriod() {
        return payPeriod;
    }
    
    public void setPayPeriod(YearMonth payPeriod) {
        this.payPeriod = payPeriod;
    }
    
    public BigDecimal getBasicSalary() {
        return basicSalary;
    }
    
    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }
    

    
    public BigDecimal getNetSalary() {
        return netSalary;
    }
    
    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }
    
    public Payroll.PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(Payroll.PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public LocalDate getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public BigDecimal getHouseRentAllowance() {
        return houseRentAllowance;
    }
    
    public void setHouseRentAllowance(BigDecimal houseRentAllowance) {
        this.houseRentAllowance = houseRentAllowance;
    }
    
    public BigDecimal getDearnessAllowance() {
        return dearnessAllowance;
    }
    
    public void setDearnessAllowance(BigDecimal dearnessAllowance) {
        this.dearnessAllowance = dearnessAllowance;
    }
    
    public BigDecimal getConveyanceAllowance() {
        return conveyanceAllowance;
    }
    
    public void setConveyanceAllowance(BigDecimal conveyanceAllowance) {
        this.conveyanceAllowance = conveyanceAllowance;
    }
    
    public BigDecimal getMedicalAllowance() {
        return medicalAllowance;
    }
    
    public void setMedicalAllowance(BigDecimal medicalAllowance) {
        this.medicalAllowance = medicalAllowance;
    }
    
    public BigDecimal getSpecialAllowance() {
        return specialAllowance;
    }
    
    public void setSpecialAllowance(BigDecimal specialAllowance) {
        this.specialAllowance = specialAllowance;
    }
    
    public BigDecimal getProvidentFund() {
        return providentFund;
    }
    
    public void setProvidentFund(BigDecimal providentFund) {
        this.providentFund = providentFund;
    }
    
    public BigDecimal getIncomeTax() {
        return incomeTax;
    }
    
    public void setIncomeTax(BigDecimal incomeTax) {
        this.incomeTax = incomeTax;
    }
    
    public BigDecimal getProfessionalTax() {
        return professionalTax;
    }
    
    public void setProfessionalTax(BigDecimal professionalTax) {
        this.professionalTax = professionalTax;
    }
    
    public BigDecimal getOvertime() {
        return overtime;
    }
    
    public void setOvertime(BigDecimal overtime) {
        this.overtime = overtime;
    }
    
    public BigDecimal getBonus() {
        return bonus;
    }
    
    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }
    
    public BigDecimal getIncentives() {
        return incentives;
    }
    
    public void setIncentives(BigDecimal incentives) {
        this.incentives = incentives;
    }
    
    public BigDecimal getOtherDeductions() {
        return otherDeductions;
    }
    
    public void setOtherDeductions(BigDecimal otherDeductions) {
        this.otherDeductions = otherDeductions;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
} 