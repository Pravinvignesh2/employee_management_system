package com.hrm.system.dto;

import com.hrm.system.entity.Leave;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDto {
    
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String employeeName;
    private String employeeId;
    
    @NotNull(message = "Leave type is required")
    private Leave.LeaveType leaveType;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private Integer totalDays;
    
    @NotNull(message = "Reason is required")
    private String reason;
    
    private Leave.LeaveStatus status = Leave.LeaveStatus.PENDING;
    private Long approvedBy;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public LeaveDto() {}
    
    public LeaveDto(Leave leave) {
        this.id = leave.getId();
        this.userId = leave.getUser().getId();
        this.employeeName = leave.getUser().getFullName();
        this.employeeId = leave.getUser().getEmployeeId();
        this.leaveType = leave.getLeaveType();
        this.startDate = leave.getStartDate();
        this.endDate = leave.getEndDate();
        this.totalDays = leave.getNumberOfDays();
        this.reason = leave.getReason();
        this.status = leave.getStatus();
        this.approvedBy = leave.getApprovedBy() != null ? leave.getApprovedBy().getId() : null;
        this.approvedByName = leave.getApprovedBy() != null ? leave.getApprovedBy().getFullName() : null;
        this.approvedAt = leave.getApprovedAt();
        
        // Set rejection reason only for rejected leaves, approval comments for approved leaves
        if (leave.getStatus() == Leave.LeaveStatus.REJECTED) {
            this.rejectionReason = leave.getApprovalComments();
        } else if (leave.getStatus() == Leave.LeaveStatus.APPROVED && leave.getApprovalComments() != null) {
            this.rejectionReason = leave.getApprovalComments(); // This will be displayed as "Approval Comments" in frontend
        } else {
            this.rejectionReason = null;
        }
        
        this.createdAt = leave.getCreatedAt();
        this.updatedAt = leave.getUpdatedAt();
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
    
    public Leave.LeaveType getLeaveType() {
        return leaveType;
    }
    
    public void setLeaveType(Leave.LeaveType leaveType) {
        this.leaveType = leaveType;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Integer getTotalDays() {
        return totalDays;
    }
    
    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public Leave.LeaveStatus getStatus() {
        return status;
    }
    
    public void setStatus(Leave.LeaveStatus status) {
        this.status = status;
    }
    
    public Long getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public String getApprovedByName() {
        return approvedByName;
    }
    
    public void setApprovedByName(String approvedByName) {
        this.approvedByName = approvedByName;
    }
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
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
    
    // Helper methods
    public boolean isPending() {
        return status == Leave.LeaveStatus.PENDING;
    }
    
    public boolean isApproved() {
        return status == Leave.LeaveStatus.APPROVED;
    }
    
    public boolean isRejected() {
        return status == Leave.LeaveStatus.REJECTED;
    }
    
    public boolean isCancelled() {
        return status == Leave.LeaveStatus.CANCELLED;
    }
    
    public boolean canBeApproved() {
        return status == Leave.LeaveStatus.PENDING;
    }
    
    public boolean canBeCancelled() {
        return status == Leave.LeaveStatus.PENDING || status == Leave.LeaveStatus.APPROVED;
    }
} 