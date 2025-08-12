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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service("leaveService")
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
    public Page<LeaveDto> getAllLeavesWithFilters(Pageable pageable, Long userId, Leave.LeaveType leaveType, Leave.LeaveStatus status, String startDate, String endDate, String query) {
        // Get current user for role-based filtering
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User current = null;
        if (auth != null && auth.getPrincipal() instanceof User) {
            current = (User) auth.getPrincipal();
        }

        // Debug logging
        System.out.println("=== DEBUG: getAllLeavesWithFilters ===");
        System.out.println("Current user: " + (current != null ? current.getFullName() : "null"));
        System.out.println("Current user role: " + (current != null ? current.getRole() : "null"));
        System.out.println("Current user department: " + (current != null ? current.getDepartment() : "null"));
        System.out.println("Filters - userId: " + userId + ", leaveType: " + leaveType + ", status: " + status + ", query: " + query);

        // Manager department scoping - apply to all manager queries
        if (current != null && current.getRole() == User.UserRole.MANAGER) {
            User.Department managerDept = current.getDepartment();
            System.out.println("Manager department filtering applied: " + managerDept);
            
            // If manager has specific filters, apply them with department scope
            if (userId != null && leaveType != null && status != null && startDate != null && endDate != null && query != null) {
                // All filters provided with department scope
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                return leaveRepository.findByUser_DepartmentAndUserIdAndLeaveTypeAndStatusAndStartDateBetweenAndReasonContainingIgnoreCase(
                    managerDept, userId, leaveType, status, start, end, query, pageable).map(LeaveDto::new);
            } else if (userId != null && leaveType != null && status != null) {
                // User, type, and status filters with department scope
                return leaveRepository.findByUser_DepartmentAndUserIdAndLeaveTypeAndStatus(managerDept, userId, leaveType, status, pageable)
                        .map(LeaveDto::new);
            } else if (userId != null && leaveType != null) {
                // User and type filters with department scope
                return leaveRepository.findByUser_DepartmentAndUserIdAndLeaveType(managerDept, userId, leaveType, pageable)
                        .map(LeaveDto::new);
            } else if (userId != null && status != null) {
                // User and status filters with department scope
                return leaveRepository.findByUser_DepartmentAndUserIdAndStatus(managerDept, userId, status, pageable)
                        .map(LeaveDto::new);
            } else if (leaveType != null && status != null) {
                // Type and status filters with department scope
                return leaveRepository.findByUser_DepartmentAndLeaveTypeAndStatus(managerDept, leaveType, status, pageable)
                        .map(LeaveDto::new);
            } else if (userId != null) {
                // User filter only with department scope
                return leaveRepository.findByUser_DepartmentAndUserId(managerDept, userId, pageable)
                        .map(LeaveDto::new);
            } else if (leaveType != null) {
                // Type filter only with department scope
                return leaveRepository.findByUser_DepartmentAndLeaveType(managerDept, leaveType, pageable)
                        .map(LeaveDto::new);
            } else if (status != null) {
                // Status filter only with department scope
                return leaveRepository.findByUser_DepartmentAndStatus(managerDept, status, pageable)
                        .map(LeaveDto::new);
            } else if (query != null) {
                // Search query only with department scope
                return leaveRepository.findByUser_DepartmentAndReasonContainingIgnoreCase(managerDept, query, pageable)
                        .map(LeaveDto::new);
            } else {
                // No filters, return all leaves from manager's department
                System.out.println("No filters provided, returning all leaves for department: " + managerDept);
                return leaveRepository.findByUser_Department(managerDept, pageable).map(LeaveDto::new);
            }
        }

        System.out.println("Admin or no role - applying filters without department restriction");
        // Admin or no role - apply filters without department restriction
        if (userId != null && leaveType != null && status != null && startDate != null && endDate != null && query != null) {
            // All filters provided
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            return leaveRepository.findByUserIdAndLeaveTypeAndStatusAndStartDateBetweenAndReasonContainingIgnoreCase(userId, leaveType, status, start, end, query, pageable)
                    .map(LeaveDto::new);
        } else if (userId != null && leaveType != null && status != null) {
            // User, type, and status filters
            return leaveRepository.findByUserIdAndLeaveTypeAndStatus(userId, leaveType, status, pageable)
                    .map(LeaveDto::new);
        } else if (userId != null && leaveType != null) {
            // User and type filters
            return leaveRepository.findByUserIdAndLeaveType(userId, leaveType, pageable)
                    .map(LeaveDto::new);
        } else if (userId != null && status != null) {
            // User and status filters
            return leaveRepository.findByUserIdAndStatus(userId, status, pageable)
                    .map(LeaveDto::new);
        } else if (leaveType != null && status != null) {
            // Type and status filters
            return leaveRepository.findByLeaveTypeAndStatus(leaveType, status, pageable)
                    .map(LeaveDto::new);
        } else if (userId != null) {
            // User filter only
            return leaveRepository.findByUserId(userId, pageable)
                    .map(LeaveDto::new);
        } else if (leaveType != null) {
            // Type filter only
            return leaveRepository.findByLeaveType(leaveType, pageable)
                    .map(LeaveDto::new);
        } else if (status != null) {
            // Status filter only
            return leaveRepository.findByStatus(status, pageable)
                    .map(LeaveDto::new);
        } else if (query != null) {
            // Search query only
            return leaveRepository.findByReasonContainingIgnoreCase(query, pageable)
                    .map(LeaveDto::new);
        } else {
            // No filters, return all (admin)
            return leaveRepository.findAll(pageable).map(LeaveDto::new);
        }
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
    public List<LeaveDto> getLeavesByDepartment(String department) {
        try {
            User.Department dept = User.Department.valueOf(department.toUpperCase());
            return leaveRepository.findByUser_Department(dept, org.springframework.data.domain.Pageable.unpaged())
                    .stream()
                    .map(LeaveDto::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid department: " + department);
        }
    }
    
    @Override
    public List<LeaveDto> getLeavesByDateRange(LocalDate startDate, LocalDate endDate) {
        return leaveRepository.findByDateRange(startDate.atStartOfDay(), endDate.atTime(23, 59, 59))
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

        // Authorization:
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new RuntimeException("Unauthorized: User not authenticated.");
        }
        User currentUser = (User) auth.getPrincipal();
        User leaveRequester = existingLeave.getUser();

        // Debugging
        System.out.println("DEBUG: Approving Leave - Current User: " + currentUser.getFullName() + " (" + currentUser.getRole() + ", Dept: " + currentUser.getDepartment() + ")");
        System.out.println("DEBUG: Approving Leave - Leave Requester: " + leaveRequester.getFullName() + " (" + leaveRequester.getRole() + ", Dept: " + leaveRequester.getDepartment() + ")");

        boolean authorized = false;
        if (leaveRequester.getRole() == User.UserRole.MANAGER) {
            // If leave is from a Manager, only an Admin can approve
            if (currentUser.getRole() == User.UserRole.ADMIN) {
                authorized = true;
            }
        } else if (leaveRequester.getRole() == User.UserRole.ADMIN) {
            // If leave is from an Admin, only another Admin can approve (not self)
            if (currentUser.getRole() == User.UserRole.ADMIN && !currentUser.getId().equals(leaveRequester.getId())) {
                authorized = true;
            }
        } else { // Employee role
            // If leave is from an Employee, only Manager of same department can approve
            if (currentUser.getRole() == User.UserRole.MANAGER && currentUser.getDepartment() == leaveRequester.getDepartment()) {
                authorized = true;
            }
        }

        if (!authorized) {
            throw new SecurityException("You are not authorized to approve this leave request.");
        }

        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not in PENDING status and cannot be approved.");
        }

        existingLeave.setStatus(Leave.LeaveStatus.APPROVED);
        existingLeave.setApprovedBy(currentUser);
        existingLeave.setApprovedAt(LocalDateTime.now());
        existingLeave.setApprovalComments("Approved");
        Leave updatedLeave = leaveRepository.save(existingLeave);
        return new LeaveDto(updatedLeave);
    }

    @Override
    public LeaveDto rejectLeave(Long id, String reason) {
        Optional<Leave> leave = leaveRepository.findById(id);
        if (leave.isEmpty()) {
            throw new RuntimeException("Leave not found with ID: " + id);
        }
        Leave existingLeave = leave.get();

        // Authorization:
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new RuntimeException("Unauthorized: User not authenticated.");
        }
        User currentUser = (User) auth.getPrincipal();
        User leaveRequester = existingLeave.getUser();

        // Debugging
        System.out.println("DEBUG: Rejecting Leave - Current User: " + currentUser.getFullName() + " (" + currentUser.getRole() + ", Dept: " + currentUser.getDepartment() + ")");
        System.out.println("DEBUG: Rejecting Leave - Leave Requester: " + leaveRequester.getFullName() + " (" + leaveRequester.getRole() + ", Dept: " + leaveRequester.getDepartment() + ")");

        boolean authorized = false;
        if (leaveRequester.getRole() == User.UserRole.MANAGER) {
            // If leave is from a Manager, only an Admin can reject
            if (currentUser.getRole() == User.UserRole.ADMIN) {
                authorized = true;
            }
        } else if (leaveRequester.getRole() == User.UserRole.ADMIN) {
            // If leave is from an Admin, only another Admin can reject (not self)
            if (currentUser.getRole() == User.UserRole.ADMIN && !currentUser.getId().equals(leaveRequester.getId())) {
                authorized = true;
            }
        } else { // Employee role
            // If leave is from an Employee, only Manager of same department can reject
            if (currentUser.getRole() == User.UserRole.MANAGER && currentUser.getDepartment() == leaveRequester.getDepartment()) {
                authorized = true;
            }
        }

        if (!authorized) {
            throw new SecurityException("You are not authorized to reject this leave request.");
        }

        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not in PENDING status and cannot be rejected.");
        }

        existingLeave.setStatus(Leave.LeaveStatus.REJECTED);
        existingLeave.setApprovedBy(currentUser);
        existingLeave.setApprovedAt(LocalDateTime.now());
        existingLeave.setApprovalComments(reason);
        Leave updatedLeave = leaveRepository.save(existingLeave);
        return new LeaveDto(updatedLeave);
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