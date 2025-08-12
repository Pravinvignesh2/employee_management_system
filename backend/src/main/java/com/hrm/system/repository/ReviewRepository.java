package com.hrm.system.repository;

import com.hrm.system.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all reviews for a specific employee
    List<Review> findByEmployeeIdOrderByReviewDateDesc(Long employeeId);
    
    // Find all reviews by a specific reviewer
    List<Review> findByReviewerIdOrderByReviewDateDesc(Long reviewerId);
    
    // Find reviews by employee and reviewer
    List<Review> findByEmployeeIdAndReviewerIdOrderByReviewDateDesc(Long employeeId, Long reviewerId);
    
    // Find reviews by employee department
    @Query("SELECT r FROM Review r WHERE r.employee.department = :department ORDER BY r.reviewDate DESC")
    List<Review> findByEmployeeDepartment(@Param("department") String department);
    
    // Find recent reviews (last 30 days)
    @Query("SELECT r FROM Review r WHERE r.reviewDate >= :startDate ORDER BY r.reviewDate DESC")
    List<Review> findRecentReviews(@Param("startDate") java.time.LocalDateTime startDate);
    
    // Count reviews by employee
    long countByEmployeeId(Long employeeId);
    
    // Count reviews by reviewer
    long countByReviewerId(Long reviewerId);
}
