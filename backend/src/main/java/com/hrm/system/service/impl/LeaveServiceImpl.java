package com.hrm.system.service.impl;

import com.hrm.system.dto.LeaveDto;
import com.hrm.system.entity.Leave;
import com.hrm.system.entity.User;
import com.hrm.system.repository.LeaveRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {
    
    @Autowired
    private LeaveRepository leaveRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public LeaveDto createLeave(LeaveDto leaveDto) {
        // Validate user exists
        Optional<User> user = userRepository.findById(leaveDto.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + leaveDto.getUserId());
        }
        
        Leave leave = new Leave();
        leave.setUser(user.get());
        leave.setLeaveType(leaveDto.getLeaveType());
        leave.setStartDate(leaveDto.getStartDate());
        leave.setEndDate(leaveDto.getEndDate());
        leave.setReason(leaveDto.getReason());
        leave.setStatus(Leave.LeaveStatus.PENDING);
        
        // Number of days will be calculated automatically by getNumberOfDays() method
        
        Leave savedLeave = leaveRepository.save(leave);
        return new LeaveDto(savedLeave);
    }
    
    @Override
    public Page<LeaveDto> getAllLeaves(Pageable pageable) {
        return leaveRepository.findAll(pageable).map(LeaveDto::new);
    }
    
    @Override
    public Optional<LeaveDto> getLeaveById(Long id) {
        return leaveRepository.findById(id).map(LeaveDto::new);
    }
    
    @Override
    public LeaveDto updateLeave(Long id, LeaveDto leaveDto) {
        Optional<Leave> existingLeave = leaveRepository.findById(id);
        if (existingLeave.isEmpty()) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        
        Leave leave = existingLeave.get();
        leave.setLeaveType(leaveDto.getLeaveType());
        leave.setStartDate(leaveDto.getStartDate());
        leave.setEndDate(leaveDto.getEndDate());
        leave.setReason(leaveDto.getReason());
        
        // Number of days will be calculated automatically by getNumberOfDays() method
        
        Leave updatedLeave = leaveRepository.save(leave);
        return new LeaveDto(updatedLeave);
    }
    
    @Override
    public void deleteLeave(Long id) {
        if (!leaveRepository.existsById(id)) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        leaveRepository.deleteById(id);
    }
    
    @Override
    public List<LeaveDto> getLeavesByUser(Long userId) {
        return leaveRepository.findByUserId(userId)
                .stream()
                .map(LeaveDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<LeaveDto> getLeavesByStatus(Leave.LeaveStatus status) {
        return leaveRepository.findByStatus(status)
                .stream()
                .map(LeaveDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<LeaveDto> getLeavesByType(Leave.LeaveType leaveType) {
        return leaveRepository.findByLeaveType(leaveType)
                .stream()
                .map(LeaveDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public LeaveDto approveLeave(Long id) {
        Optional<Leave> leave = leaveRepository.findById(id);
        if (leave.isEmpty()) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        
        Leave existingLeave = leave.get();
        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new RuntimeException("Only pending leaves can be approved");
        }
        
        existingLeave.setStatus(Leave.LeaveStatus.APPROVED);
        existingLeave.setApprovalComments("Approved");
        existingLeave.setApprovedAt(LocalDateTime.now());
        
        Leave approvedLeave = leaveRepository.save(existingLeave);
        return new LeaveDto(approvedLeave);
    }
    
    @Override
    public LeaveDto rejectLeave(Long id, String reason) {
        Optional<Leave> leave = leaveRepository.findById(id);
        if (leave.isEmpty()) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        
        Leave existingLeave = leave.get();
        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new RuntimeException("Only pending leaves can be rejected");
        }
        
        existingLeave.setStatus(Leave.LeaveStatus.REJECTED);
        existingLeave.setApprovalComments(reason);
        existingLeave.setApprovedAt(LocalDateTime.now());
        
        Leave rejectedLeave = leaveRepository.save(existingLeave);
        return new LeaveDto(rejectedLeave);
    }
    
    @Override
    public LeaveDto cancelLeave(Long id) {
        Optional<Leave> leave = leaveRepository.findById(id);
        if (leave.isEmpty()) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        
        Leave existingLeave = leave.get();
        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING && 
            existingLeave.getStatus() != Leave.LeaveStatus.APPROVED) {
            throw new RuntimeException("Only pending or approved leaves can be cancelled");
        }
        
        existingLeave.setStatus(Leave.LeaveStatus.CANCELLED);
        
        Leave cancelledLeave = leaveRepository.save(existingLeave);
        return new LeaveDto(cancelledLeave);
    }
    
    @Override
    public LeaveStatistics getLeaveStatistics() {
        long totalLeaves = leaveRepository.count();
        long pendingLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.PENDING);
        long approvedLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.APPROVED);
        long rejectedLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.REJECTED);
        long cancelledLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.CANCELLED);
        
        double approvalRate = totalLeaves > 0 ? (double) approvedLeaves / totalLeaves * 100 : 0;
        
        return new LeaveStatistics(
            totalLeaves,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
            cancelledLeaves,
            approvalRate
        );
    }
    
    @Override
    public UserLeaveStatistics getUserLeaveStatistics(Long userId) {
        long totalLeaves = leaveRepository.countByUserId(userId);
        long pendingLeaves = leaveRepository.countByUserIdAndStatus(userId, Leave.LeaveStatus.PENDING);
        long approvedLeaves = leaveRepository.countByUserIdAndStatus(userId, Leave.LeaveStatus.APPROVED);
        long rejectedLeaves = leaveRepository.countByUserIdAndStatus(userId, Leave.LeaveStatus.REJECTED);
        long cancelledLeaves = leaveRepository.countByUserIdAndStatus(userId, Leave.LeaveStatus.CANCELLED);
        
        // Calculate remaining leaves (assuming 20 days per year)
        long usedLeaves = approvedLeaves;
        long remainingLeaves = Math.max(0, 20 - usedLeaves);
        
        double approvalRate = totalLeaves > 0 ? (double) approvedLeaves / totalLeaves * 100 : 0;
        
        return new UserLeaveStatistics(
            totalLeaves,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
            cancelledLeaves,
            remainingLeaves,
            approvalRate
        );
    }
    
    @Override
    public long getPendingLeavesCount() {
        return leaveRepository.countByStatus(Leave.LeaveStatus.PENDING);
    }
    
    @Override
    public long getApprovedLeavesCount() {
        return leaveRepository.countByStatus(Leave.LeaveStatus.APPROVED);
    }
    
    @Override
    public long getRejectedLeavesCount() {
        return leaveRepository.countByStatus(Leave.LeaveStatus.REJECTED);
    }
    
    @Override
    public boolean isOwner(Long leaveId, Long userId) {
        return leaveRepository.existsByIdAndUserId(leaveId, userId);
    }
} 