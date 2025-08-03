package com.hrm.system.controller;

import com.hrm.system.dto.PerformanceDto;
import com.hrm.system.entity.Performance;
import com.hrm.system.service.PerformanceService;
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
 * REST Controller for Performance management
 */
@RestController
@RequestMapping("/api/performance")
@Tag(name = "Performance Management", description = "APIs for managing employee performance reviews")
@CrossOrigin(origins = "*")
public class PerformanceController {
    
    @Autowired
    private PerformanceService performanceService;
    
    /**
     * Create a new performance review
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create a new performance review", description = "Create a new performance review for an employee")
    public ResponseEntity<PerformanceDto> createPerformance(@Valid @RequestBody PerformanceDto performanceDto) {
        PerformanceDto createdPerformance = performanceService.createPerformance(performanceDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPerformance);
    }
    
    /**
     * Get all performance reviews with pagination
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all performance reviews", description = "Get paginated list of all performance reviews")
    public ResponseEntity<Page<PerformanceDto>> getAllPerformance(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PerformanceDto> performance = performanceService.getAllPerformance(pageable);
        return ResponseEntity.ok(performance);
    }
    
    /**
     * Get performance review by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @performanceService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Get performance review by ID", description = "Get performance review details by ID")
    public ResponseEntity<PerformanceDto> getPerformanceById(@PathVariable Long id) {
        return performanceService.getPerformanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update performance review
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @performanceService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Update performance review", description = "Update performance review information")
    public ResponseEntity<PerformanceDto> updatePerformance(@PathVariable Long id, @Valid @RequestBody PerformanceDto performanceDto) {
        try {
            PerformanceDto updatedPerformance = performanceService.updatePerformance(id, performanceDto);
            return ResponseEntity.ok(updatedPerformance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete performance review
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete performance review", description = "Delete a performance review")
    public ResponseEntity<Void> deletePerformance(@PathVariable Long id) {
        try {
            performanceService.deletePerformance(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get performance reviews by user ID
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get performance reviews by user", description = "Get all performance reviews for a specific user")
    public ResponseEntity<List<PerformanceDto>> getPerformanceByUser(@PathVariable Long userId) {
        List<PerformanceDto> performance = performanceService.getPerformanceByUser(userId);
        return ResponseEntity.ok(performance);
    }
    
    /**
     * Get performance reviews by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get performance reviews by status", description = "Get all performance reviews with a specific status")
    public ResponseEntity<List<PerformanceDto>> getPerformanceByStatus(@PathVariable Performance.PerformanceStatus status) {
        List<PerformanceDto> performance = performanceService.getPerformanceByStatus(status);
        return ResponseEntity.ok(performance);
    }
    
    /**
     * Get performance reviews by review type
     */
    @GetMapping("/type/{reviewType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get performance reviews by type", description = "Get all performance reviews of a specific type")
    public ResponseEntity<List<PerformanceDto>> getPerformanceByReviewType(@PathVariable Performance.ReviewType reviewType) {
        List<PerformanceDto> performance = performanceService.getPerformanceByReviewType(reviewType);
        return ResponseEntity.ok(performance);
    }
    
    /**
     * Submit performance review
     */
    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Submit performance review", description = "Submit a performance review")
    public ResponseEntity<PerformanceDto> submitPerformance(@PathVariable Long id) {
        try {
            PerformanceDto submittedPerformance = performanceService.submitPerformance(id);
            return ResponseEntity.ok(submittedPerformance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Review performance
     */
    @PatchMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Review performance", description = "Review a performance submission")
    public ResponseEntity<PerformanceDto> reviewPerformance(
            @PathVariable Long id,
            @RequestBody PerformanceService.ReviewRequest reviewRequest) {
        try {
            PerformanceDto reviewedPerformance = performanceService.reviewPerformance(id, reviewRequest);
            return ResponseEntity.ok(reviewedPerformance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Approve performance review
     */
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Approve performance review", description = "Approve a performance review")
    public ResponseEntity<PerformanceDto> approvePerformance(@PathVariable Long id) {
        try {
            PerformanceDto approvedPerformance = performanceService.approvePerformance(id);
            return ResponseEntity.ok(approvedPerformance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Reject performance review
     */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Reject performance review", description = "Reject a performance review with reason")
    public ResponseEntity<PerformanceDto> rejectPerformance(
            @PathVariable Long id,
            @RequestParam String reason) {
        try {
            PerformanceDto rejectedPerformance = performanceService.rejectPerformance(id, reason);
            return ResponseEntity.ok(rejectedPerformance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get performance statistics for dashboard
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get performance statistics", description = "Get performance statistics for dashboard")
    public ResponseEntity<PerformanceService.PerformanceStatistics> getPerformanceStatistics() {
        PerformanceService.PerformanceStatistics statistics = performanceService.getPerformanceStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get user performance statistics
     */
    @GetMapping("/statistics/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get user performance statistics", description = "Get performance statistics for a specific user")
    public ResponseEntity<PerformanceService.UserPerformanceStatistics> getUserPerformanceStatistics(@PathVariable Long userId) {
        PerformanceService.UserPerformanceStatistics statistics = performanceService.getUserPerformanceStatistics(userId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get high performers
     */
    @GetMapping("/high-performers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get high performers", description = "Get list of high performing employees")
    public ResponseEntity<List<PerformanceDto>> getHighPerformers(
            @Parameter(description = "Number of high performers to return") @RequestParam(defaultValue = "10") int limit) {
        List<PerformanceDto> highPerformers = performanceService.getHighPerformers(limit);
        return ResponseEntity.ok(highPerformers);
    }
    
    /**
     * Get performance reviews by department
     */
    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get performance reviews by department", description = "Get all performance reviews for a specific department")
    public ResponseEntity<List<PerformanceDto>> getPerformanceByDepartment(@PathVariable String department) {
        List<PerformanceDto> performance = performanceService.getPerformanceByDepartment(department);
        return ResponseEntity.ok(performance);
    }
    
    /**
     * Get completed reviews count
     */
    @GetMapping("/count/completed")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get completed reviews count", description = "Get the count of completed performance reviews")
    public ResponseEntity<Long> getCompletedReviewsCount() {
        long count = performanceService.getCompletedReviewsCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get pending reviews count
     */
    @GetMapping("/count/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get pending reviews count", description = "Get the count of pending performance reviews")
    public ResponseEntity<Long> getPendingReviewsCount() {
        long count = performanceService.getPendingReviewsCount();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get under review count
     */
    @GetMapping("/count/under-review")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get under review count", description = "Get the count of performance reviews under review")
    public ResponseEntity<Long> getUnderReviewCount() {
        long count = performanceService.getUnderReviewCount();
        return ResponseEntity.ok(count);
    }
    
} 