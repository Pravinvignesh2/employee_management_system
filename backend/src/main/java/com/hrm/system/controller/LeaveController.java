package com.hrm.system.controller;

import com.hrm.system.dto.LeaveDto;
import com.hrm.system.entity.Leave;
import com.hrm.system.service.LeaveService;
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
import com.hrm.system.entity.User;
import com.hrm.system.repository.LeaveRepository;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * REST Controller for Leave management
 */
@RestController
@RequestMapping("/api/leaves")
@Tag(name = "Leave Management", description = "APIs for managing employee leaves")
@CrossOrigin(origins = "*")
public class LeaveController {
    
    @Autowired
    private LeaveService leaveService;
    
    @Autowired
    private LeaveRepository leaveRepository;
    
    // Helper method to get current user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    
    /**
     * Create a new leave request
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Create a new leave request", description = "Create a new leave request for an employee")
    public ResponseEntity<LeaveDto> createLeave(@Valid @RequestBody LeaveDto leaveDto) {
        LeaveDto createdLeave = leaveService.createLeave(leaveDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLeave);
    }
    
    /**
     * Get all leaves with pagination and filters
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all leaves", description = "Get paginated list of all leave requests with filters")
    public ResponseEntity<Page<LeaveDto>> getAllLeaves(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String sortDir,
            @Parameter(description = "Filter by user ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "Filter by leave type") @RequestParam(required = false) Leave.LeaveType leaveType,
            @Parameter(description = "Filter by status") @RequestParam(required = false) Leave.LeaveStatus status,
            @Parameter(description = "Filter by start date") @RequestParam(required = false) String startDate,
            @Parameter(description = "Filter by end date") @RequestParam(required = false) String endDate,
            @Parameter(description = "Search query") @RequestParam(required = false) String query) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Apply filters if provided
        if (userId != null || leaveType != null || status != null || startDate != null || endDate != null || query != null) {
            Page<LeaveDto> leaves = leaveService.getAllLeavesWithFilters(pageable, userId, leaveType, status, startDate, endDate, query);
            return ResponseEntity.ok(leaves);
        } else {
            Page<LeaveDto> leaves = leaveService.getAllLeaves(pageable);
            return ResponseEntity.ok(leaves);
        }
    }
    
    /**
     * Get leave by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @leaveService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Get leave by ID", description = "Get leave details by leave ID")
    public ResponseEntity<LeaveDto> getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update leave request
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @leaveService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Update leave request", description = "Update leave request information")
    public ResponseEntity<LeaveDto> updateLeave(@PathVariable Long id, @Valid @RequestBody LeaveDto leaveDto) {
        try {
            LeaveDto updatedLeave = leaveService.updateLeave(id, leaveDto);
            return ResponseEntity.ok(updatedLeave);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete leave request
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Delete leave request", description = "Delete a leave request")
    public ResponseEntity<Void> deleteLeave(@PathVariable Long id) {
        try {
            // Check if user is owner or admin/manager
            User currentUser = getCurrentUser();
            Optional<Leave> leave = leaveRepository.findById(id);
            
            if (leave.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Leave existingLeave = leave.get();
            
            // Only allow deletion if user is admin, manager, or the owner of the leave
            if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
                !currentUser.getRole().equals(User.UserRole.MANAGER) && 
                !existingLeave.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            leaveService.deleteLeave(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get leaves by user ID
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get leaves by user", description = "Get all leave requests for a specific user")
    public ResponseEntity<List<LeaveDto>> getLeavesByUser(@PathVariable Long userId) {
        List<LeaveDto> leaves = leaveService.getLeavesByUser(userId);
        return ResponseEntity.ok(leaves);
    }
    
    /**
     * Get leaves by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get leaves by status", description = "Get all leave requests with a specific status")
    public ResponseEntity<List<LeaveDto>> getLeavesByStatus(@PathVariable Leave.LeaveStatus status) {
        List<LeaveDto> leaves = leaveService.getLeavesByStatus(status);
        return ResponseEntity.ok(leaves);
    }
    
    /**
     * Get leaves by leave type
     */
    @GetMapping("/type/{leaveType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get leaves by type", description = "Get all leave requests of a specific type")
    public ResponseEntity<List<LeaveDto>> getLeavesByType(@PathVariable Leave.LeaveType leaveType) {
        List<LeaveDto> leaves = leaveService.getLeavesByType(leaveType);
        return ResponseEntity.ok(leaves);
    }
    
    /**
     * Approve leave request
     */
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Approve leave request", description = "Approve a leave request")
    public ResponseEntity<LeaveDto> approveLeave(@PathVariable Long id) {
        try {
            LeaveDto approvedLeave = leaveService.approveLeave(id);
            return ResponseEntity.ok(approvedLeave);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Reject leave request
     */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Reject leave request", description = "Reject a leave request with reason")
    public ResponseEntity<LeaveDto> rejectLeave(
            @PathVariable Long id,
            @RequestParam String reason) {
        try {
            LeaveDto rejectedLeave = leaveService.rejectLeave(id, reason);
            return ResponseEntity.ok(rejectedLeave);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Cancel leave request
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Cancel leave request", description = "Cancel a leave request")
    public ResponseEntity<LeaveDto> cancelLeave(@PathVariable Long id) {
        try {
            // Check if user is owner or admin
            User currentUser = getCurrentUser();
            Optional<Leave> leave = leaveRepository.findById(id);
            
            if (leave.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Leave existingLeave = leave.get();
            
            // Only allow cancellation if user is admin, manager, or the owner of the leave
            if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
                !currentUser.getRole().equals(User.UserRole.MANAGER) && 
                !existingLeave.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            LeaveDto cancelledLeave = leaveService.cancelLeave(id);
            return ResponseEntity.ok(cancelledLeave);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get leave statistics for dashboard
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get leave statistics", description = "Get leave statistics for dashboard")
    public ResponseEntity<LeaveService.LeaveStatistics> getLeaveStatistics() {
        LeaveService.LeaveStatistics statistics = leaveService.getLeaveStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get user leave statistics
     */
    @GetMapping("/statistics/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get user leave statistics", description = "Get leave statistics for a specific user")
    public ResponseEntity<LeaveService.UserLeaveStatistics> getUserLeaveStatistics(@PathVariable Long userId) {
        LeaveService.UserLeaveStatistics statistics = leaveService.getUserLeaveStatistics(userId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get current user leave statistics
     */
    @GetMapping("/statistics/current-user")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Get current user leave statistics", description = "Get leave statistics for the currently authenticated user")
    public ResponseEntity<LeaveService.UserLeaveStatistics> getCurrentUserLeaveStatistics() {
        User currentUser = getCurrentUser();
        LeaveService.UserLeaveStatistics statistics = leaveService.getUserLeaveStatistics(currentUser.getId());
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get current user's leaves
     */
    @GetMapping("/current-user")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Get current user's leaves", description = "Get all leave requests for the currently authenticated user")
    public ResponseEntity<List<LeaveDto>> getCurrentUserLeaves() {
        User currentUser = getCurrentUser();
        List<LeaveDto> leaves = leaveService.getLeavesByUser(currentUser.getId());
        return ResponseEntity.ok(leaves);
    }
    
    /**
     * Get pending leaves count
     */
    @GetMapping("/count/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get pending leaves count", description = "Get the count of pending leave requests")
    public ResponseEntity<Long> getPendingLeavesCount() {
        long count = leaveService.getPendingLeavesCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get approved leaves count
     */
    @GetMapping("/count/approved")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get approved leaves count", description = "Get the count of approved leave requests")
    public ResponseEntity<Long> getApprovedLeavesCount() {
        long count = leaveService.getApprovedLeavesCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get rejected leaves count
     */
    @GetMapping("/count/rejected")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get rejected leaves count", description = "Get the count of rejected leave requests")
    public ResponseEntity<Long> getRejectedLeavesCount() {
        long count = leaveService.getRejectedLeavesCount();
        return ResponseEntity.ok(count);
    }
} 