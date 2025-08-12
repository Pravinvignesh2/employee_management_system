package com.hrm.system.controller;

import com.hrm.system.dto.ReviewDto;
import com.hrm.system.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review Management", description = "APIs for managing performance reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create a new review", description = "Create a performance review for an employee")
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewDto reviewDto) {
        try {
            ReviewDto createdReview = reviewService.createReview(reviewDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Get review by ID", description = "Get a specific review by its ID")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable Long id) {
        try {
            ReviewDto review = reviewService.getReviewById(id);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #employeeId == authentication.principal.id")
    @Operation(summary = "Get reviews by employee", description = "Get all reviews for a specific employee")
    public ResponseEntity<List<ReviewDto>> getReviewsByEmployee(@PathVariable Long employeeId) {
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByEmployee(employeeId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/reviewer/{reviewerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #reviewerId == authentication.principal.id")
    @Operation(summary = "Get reviews by reviewer", description = "Get all reviews created by a specific reviewer")
    public ResponseEntity<List<ReviewDto>> getReviewsByReviewer(@PathVariable Long reviewerId) {
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByReviewer(reviewerId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update review", description = "Update an existing review")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long id, @Valid @RequestBody ReviewDto reviewDto) {
        try {
            ReviewDto updatedReview = reviewService.updateReview(id, reviewDto);
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete review", description = "Delete a review")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get reviews by department", description = "Get all reviews for employees in a specific department")
    public ResponseEntity<List<ReviewDto>> getReviewsByDepartment(@PathVariable String department) {
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByEmployeeDepartment(department);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get recent reviews", description = "Get reviews from the last 30 days")
    public ResponseEntity<List<ReviewDto>> getRecentReviews() {
        try {
            List<ReviewDto> reviews = reviewService.getRecentReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
