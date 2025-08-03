package com.hrm.system.service;

import com.hrm.system.dto.PerformanceDto;
import com.hrm.system.entity.Performance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Performance management
 */
public interface PerformanceService {
    
    /**
     * Create a new performance review
     */
    PerformanceDto createPerformance(PerformanceDto performanceDto);
    
    /**
     * Get all performance reviews with pagination
     */
    Page<PerformanceDto> getAllPerformance(Pageable pageable);
    
    /**
     * Get performance review by ID
     */
    Optional<PerformanceDto> getPerformanceById(Long id);
    
    /**
     * Update performance review
     */
    PerformanceDto updatePerformance(Long id, PerformanceDto performanceDto);
    
    /**
     * Delete performance review
     */
    void deletePerformance(Long id);
    
    /**
     * Get performance reviews by user ID
     */
    List<PerformanceDto> getPerformanceByUser(Long userId);
    
    /**
     * Get performance reviews by status
     */
    List<PerformanceDto> getPerformanceByStatus(Performance.PerformanceStatus status);
    
    /**
     * Get performance reviews by review type
     */
    List<PerformanceDto> getPerformanceByReviewType(Performance.ReviewType reviewType);
    
    /**
     * Submit performance review
     */
    PerformanceDto submitPerformance(Long id);
    
    /**
     * Review performance
     */
    PerformanceDto reviewPerformance(Long id, ReviewRequest reviewRequest);
    
    /**
     * Approve performance review
     */
    PerformanceDto approvePerformance(Long id);
    
    /**
     * Reject performance review
     */
    PerformanceDto rejectPerformance(Long id, String reason);
    
    /**
     * Get performance statistics for dashboard
     */
    PerformanceStatistics getPerformanceStatistics();
    
    /**
     * Get user performance statistics
     */
    UserPerformanceStatistics getUserPerformanceStatistics(Long userId);
    
    /**
     * Get high performers
     */
    List<PerformanceDto> getHighPerformers(int limit);
    
    /**
     * Get performance reviews by department
     */
    List<PerformanceDto> getPerformanceByDepartment(String department);
    
    /**
     * Get completed reviews count
     */
    long getCompletedReviewsCount();
    
    /**
     * Get pending reviews count
     */
    long getPendingReviewsCount();
    
    /**
     * Get under review count
     */
    long getUnderReviewCount();
    
    /**
     * Check if user is the owner of the performance review
     */
    boolean isOwner(Long performanceId, Long userId);
    
    /**
     * Review request DTO
     */
    record ReviewRequest(
        String comments,
        String recommendations,
        Integer rating
    ) {}
    
    /**
     * Performance statistics for dashboard
     */
    record PerformanceStatistics(
        long totalReviews,
        long completedReviews,
        long pendingReviews,
        long underReviewReviews,
        double averageRating,
        long highPerformers
    ) {}
    
    /**
     * User performance statistics
     */
    record UserPerformanceStatistics(
        long totalReviews,
        long completedReviews,
        long pendingReviews,
        long underReviewReviews,
        double averageRating,
        double highestRating,
        double lowestRating
    ) {}
} 