package com.hrm.system.service.impl;

import com.hrm.system.dto.ReviewDto;
import com.hrm.system.entity.Review;
import com.hrm.system.entity.User;
import com.hrm.system.repository.ReviewRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public ReviewDto createReview(ReviewDto reviewDto) {
        // Get current user (reviewer)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("User not authenticated");
        }
        User currentUser = (User) auth.getPrincipal();
        
        // Validate that current user can create reviews (must be manager or admin)
        if (currentUser.getRole() != User.UserRole.MANAGER && currentUser.getRole() != User.UserRole.ADMIN) {
            throw new AccessDeniedException("Only managers and admins can create reviews");
        }
        
        // Get employee
        User employee = userRepository.findById(reviewDto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // For managers, ensure they can only review employees in their department
        if (currentUser.getRole() == User.UserRole.MANAGER && 
            !currentUser.getDepartment().equals(employee.getDepartment())) {
            throw new AccessDeniedException("Managers can only review employees in their department");
        }
        
        // Create review
        Review review = new Review();
        review.setEmployee(employee);
        review.setReviewer(currentUser);
        review.setTitle(reviewDto.getTitle());
        review.setRating(reviewDto.getRating());
        review.setSummary(reviewDto.getSummary());
        review.setStrengths(reviewDto.getStrengths());
        review.setImprovements(reviewDto.getImprovements());
        review.setGoals(reviewDto.getGoals());
        review.setReviewDate(LocalDateTime.now());
        
        Review savedReview = reviewRepository.save(review);
        return new ReviewDto(savedReview);
    }
    
    @Override
    public ReviewDto getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return new ReviewDto(review);
    }
    
    @Override
    public List<ReviewDto> getReviewsByEmployee(Long employeeId) {
        List<Review> reviews = reviewRepository.findByEmployeeIdOrderByReviewDateDesc(employeeId);
        return reviews.stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDto> getReviewsByReviewer(Long reviewerId) {
        List<Review> reviews = reviewRepository.findByReviewerIdOrderByReviewDateDesc(reviewerId);
        return reviews.stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public ReviewDto updateReview(Long id, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Get current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("User not authenticated");
        }
        User currentUser = (User) auth.getPrincipal();
        
        // Only the original reviewer or an admin can update a review
        if (!review.getReviewer().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != User.UserRole.ADMIN) {
            throw new AccessDeniedException("Only the original reviewer or an admin can update this review");
        }
        
        // Update fields
        review.setTitle(reviewDto.getTitle());
        review.setRating(reviewDto.getRating());
        review.setSummary(reviewDto.getSummary());
        review.setStrengths(reviewDto.getStrengths());
        review.setImprovements(reviewDto.getImprovements());
        review.setGoals(reviewDto.getGoals());
        
        Review updatedReview = reviewRepository.save(review);
        return new ReviewDto(updatedReview);
    }
    
    @Override
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Get current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new AccessDeniedException("User not authenticated");
        }
        User currentUser = (User) auth.getPrincipal();
        
        // Only the original reviewer or an admin can delete a review
        if (!review.getReviewer().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != User.UserRole.ADMIN) {
            throw new AccessDeniedException("Only the original reviewer or an admin can delete this review");
        }
        
        reviewRepository.deleteById(id);
    }
    
    @Override
    public List<ReviewDto> getReviewsByEmployeeDepartment(String department) {
        List<Review> reviews = reviewRepository.findByEmployeeDepartment(department);
        return reviews.stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ReviewDto> getRecentReviews() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        List<Review> reviews = reviewRepository.findRecentReviews(startDate);
        return reviews.stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
}
