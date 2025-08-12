package com.hrm.system.service;

import com.hrm.system.dto.ReviewDto;
import java.util.List;

public interface ReviewService {
    
    // Create a new review
    ReviewDto createReview(ReviewDto reviewDto);
    
    // Get review by ID
    ReviewDto getReviewById(Long id);
    
    // Get all reviews for a specific employee
    List<ReviewDto> getReviewsByEmployee(Long employeeId);
    
    // Get all reviews by a specific reviewer
    List<ReviewDto> getReviewsByReviewer(Long reviewerId);
    
    // Update an existing review
    ReviewDto updateReview(Long id, ReviewDto reviewDto);
    
    // Delete a review
    void deleteReview(Long id);
    
    // Get reviews by employee department
    List<ReviewDto> getReviewsByEmployeeDepartment(String department);
    
    // Get recent reviews
    List<ReviewDto> getRecentReviews();
}
