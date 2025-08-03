package com.hrm.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

/**
 * Payroll entity for managing employee salary and compensation
 */
@Entity
@Table(name = "payroll")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @NotNull(message = "Pay period is required")
    private YearMonth payPeriod;
    
    @NotNull(message = "Basic salary is required")
    @Positive(message = "Basic salary must be positive")
    private BigDecimal basicSalary;
    
    private BigDecimal houseRentAllowance;
    
    private BigDecimal dearnessAllowance;
    
    private BigDecimal conveyanceAllowance;
    
    private BigDecimal medicalAllowance;
    
    private BigDecimal specialAllowance;
    
    private BigDecimal bonus;
    
    private BigDecimal overtime;
    
    private BigDecimal incentives;
    
    private BigDecimal grossSalary;
    
    private BigDecimal providentFund;
    
    private BigDecimal professionalTax;
    
    private BigDecimal incomeTax;
    
    private BigDecimal otherDeductions;
    
    private BigDecimal totalDeductions;
    
    @NotNull(message = "Net salary is required")
    @Positive(message = "Net salary must be positive")
    private BigDecimal netSalary;
    
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    private String paymentMethod;
    
    private String bankAccountNumber;
    
    private String transactionId;
    
    private String remarks;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public BigDecimal calculateGrossSalary() {
        BigDecimal gross = basicSalary;
        if (houseRentAllowance != null) gross = gross.add(houseRentAllowance);
        if (dearnessAllowance != null) gross = gross.add(dearnessAllowance);
        if (conveyanceAllowance != null) gross = gross.add(conveyanceAllowance);
        if (medicalAllowance != null) gross = gross.add(medicalAllowance);
        if (specialAllowance != null) gross = gross.add(specialAllowance);
        if (bonus != null) gross = gross.add(bonus);
        if (overtime != null) gross = gross.add(overtime);
        if (incentives != null) gross = gross.add(incentives);
        return gross;
    }
    
    public BigDecimal calculateTotalDeductions() {
        BigDecimal deductions = BigDecimal.ZERO;
        if (providentFund != null) deductions = deductions.add(providentFund);
        if (professionalTax != null) deductions = deductions.add(professionalTax);
        if (incomeTax != null) deductions = deductions.add(incomeTax);
        if (otherDeductions != null) deductions = deductions.add(otherDeductions);
        return deductions;
    }
    
    public BigDecimal calculateNetSalary() {
        return grossSalary.subtract(totalDeductions);
    }
    
    public boolean isPaid() {
        return paymentStatus == PaymentStatus.PAID;
    }
    
    public boolean isPending() {
        return paymentStatus == PaymentStatus.PENDING;
    }
    
    // Enums
    public enum PaymentStatus {
        PENDING, PROCESSING, PAID, FAILED, CANCELLED
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    public BigDecimal getBonus() {
        return bonus;
    }
    
    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }
    
    public BigDecimal getOvertime() {
        return overtime;
    }
    
    public void setOvertime(BigDecimal overtime) {
        this.overtime = overtime;
    }
    
    public BigDecimal getIncentives() {
        return incentives;
    }
    
    public void setIncentives(BigDecimal incentives) {
        this.incentives = incentives;
    }
    
    public BigDecimal getGrossSalary() {
        return grossSalary;
    }
    
    public void setGrossSalary(BigDecimal grossSalary) {
        this.grossSalary = grossSalary;
    }
    
    public BigDecimal getProvidentFund() {
        return providentFund;
    }
    
    public void setProvidentFund(BigDecimal providentFund) {
        this.providentFund = providentFund;
    }
    
    public BigDecimal getProfessionalTax() {
        return professionalTax;
    }
    
    public void setProfessionalTax(BigDecimal professionalTax) {
        this.professionalTax = professionalTax;
    }
    
    public BigDecimal getIncomeTax() {
        return incomeTax;
    }
    
    public void setIncomeTax(BigDecimal incomeTax) {
        this.incomeTax = incomeTax;
    }
    
    public BigDecimal getOtherDeductions() {
        return otherDeductions;
    }
    
    public void setOtherDeductions(BigDecimal otherDeductions) {
        this.otherDeductions = otherDeductions;
    }
    
    public BigDecimal getTotalDeductions() {
        return totalDeductions;
    }
    
    public void setTotalDeductions(BigDecimal totalDeductions) {
        this.totalDeductions = totalDeductions;
    }
    
    public BigDecimal getNetSalary() {
        return netSalary;
    }
    
    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }
    
    public LocalDate getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
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
} 