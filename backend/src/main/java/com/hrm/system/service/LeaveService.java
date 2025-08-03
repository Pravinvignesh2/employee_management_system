package com.hrm.system.service;

import com.hrm.system.dto.LeaveDto;
import com.hrm.system.entity.Leave;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Leave management
 */
public interface LeaveService {
    
    /**
     * Create a new leave request
     */
    LeaveDto createLeave(LeaveDto leaveDto);
    
    /**
     * Get all leaves with pagination
     */
    Page<LeaveDto> getAllLeaves(Pageable pageable);
    
    /**
     * Get leave by ID
     */
    Optional<LeaveDto> getLeaveById(Long id);
    
    /**
     * Update leave request
     */
    LeaveDto updateLeave(Long id, LeaveDto leaveDto);
    
    /**
     * Delete leave request
     */
    void deleteLeave(Long id);
    
    /**
     * Get leaves by user ID
     */
    List<LeaveDto> getLeavesByUser(Long userId);
    
    /**
     * Get leaves by status
     */
    List<LeaveDto> getLeavesByStatus(Leave.LeaveStatus status);
    
    /**
     * Get leaves by leave type
     */
    List<LeaveDto> getLeavesByType(Leave.LeaveType leaveType);
    
    /**
     * Approve leave request
     */
    LeaveDto approveLeave(Long id);
    
    /**
     * Reject leave request
     */
    LeaveDto rejectLeave(Long id, String reason);
    
    /**
     * Cancel leave request
     */
    LeaveDto cancelLeave(Long id);
    
    /**
     * Get leave statistics for dashboard
     */
    LeaveStatistics getLeaveStatistics();
    
    /**
     * Get user leave statistics
     */
    UserLeaveStatistics getUserLeaveStatistics(Long userId);
    
    /**
     * Get pending leaves count
     */
    long getPendingLeavesCount();
    
    /**
     * Get approved leaves count
     */
    long getApprovedLeavesCount();
    
    /**
     * Get rejected leaves count
     */
    long getRejectedLeavesCount();
    
    /**
     * Check if user is the owner of the leave request
     */
    boolean isOwner(Long leaveId, Long userId);
    
    /**
     * Leave statistics for dashboard
     */
    record LeaveStatistics(
        long totalLeaves,
        long pendingLeaves,
        long approvedLeaves,
        long rejectedLeaves,
        long cancelledLeaves,
        double approvalRate
    ) {}
    
    /**
     * User leave statistics
     */
    record UserLeaveStatistics(
        long totalLeaves,
        long pendingLeaves,
        long approvedLeaves,
        long rejectedLeaves,
        long cancelledLeaves,
        long remainingLeaves,
        double approvalRate
    ) {}
} 