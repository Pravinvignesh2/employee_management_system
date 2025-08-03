package com.hrm.system.repository;

import com.hrm.system.entity.Feedback;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find feedback received by a user
    List<Feedback> findByRecipientOrderByCreatedAtDesc(User recipient);
    
    // Find feedback given by a user
    List<Feedback> findByReviewerOrderByCreatedAtDesc(User reviewer);
    
    // Find feedback by type
    List<Feedback> findByType(Feedback.FeedbackType type);
    
    // Find feedback by recipient and type
    List<Feedback> findByRecipientAndType(User recipient, Feedback.FeedbackType type);
    
    // Find feedback by reviewer and type
    List<Feedback> findByReviewerAndType(User reviewer, Feedback.FeedbackType type);
    
    // Find feedback by status
    List<Feedback> findByStatus(Feedback.FeedbackStatus status);
    
    // Find feedback by recipient and status
    List<Feedback> findByRecipientAndStatus(User recipient, Feedback.FeedbackStatus status);
    
    // Find feedback by review period
    List<Feedback> findByReviewPeriod(String reviewPeriod);
    
    // Find feedback by recipient and review period
    List<Feedback> findByRecipientAndReviewPeriod(User recipient, String reviewPeriod);
    
    // Find feedback with pagination
    Page<Feedback> findByRecipient(User recipient, Pageable pageable);
    
    Page<Feedback> findByReviewer(User reviewer, Pageable pageable);
    
    // Find feedback by department (for managers)
    @Query("SELECT f FROM Feedback f WHERE f.recipient.department = :department")
    List<Feedback> findByDepartment(@Param("department") User.Department department);
    
    // Find feedback by department and type
    @Query("SELECT f FROM Feedback f WHERE f.recipient.department = :department AND f.type = :type")
    List<Feedback> findByDepartmentAndType(@Param("department") User.Department department, @Param("type") Feedback.FeedbackType type);
    
    // Find feedback by department and review period
    @Query("SELECT f FROM Feedback f WHERE f.recipient.department = :department AND f.reviewPeriod = :reviewPeriod")
    List<Feedback> findByDepartmentAndReviewPeriod(@Param("department") User.Department department, @Param("reviewPeriod") String reviewPeriod);
    
    // Count feedback by type for a user
    long countByRecipientAndType(User recipient, Feedback.FeedbackType type);
    
    // Count feedback by status for a user
    long countByRecipientAndStatus(User recipient, Feedback.FeedbackStatus status);
    
    // Count feedback by type for a department
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.recipient.department = :department AND f.type = :type")
    long countByDepartmentAndType(@Param("department") User.Department department, @Param("type") Feedback.FeedbackType type);
    
    // Count feedback by type (for admin)
    long countByType(Feedback.FeedbackType type);
    
    // Find pending feedback requests
    @Query("SELECT f FROM Feedback f WHERE f.status = 'PENDING'")
    List<Feedback> findPendingFeedback();
    
    // Find pending feedback for a specific reviewer
    @Query("SELECT f FROM Feedback f WHERE f.reviewer = :reviewer AND f.status = 'PENDING'")
    List<Feedback> findPendingFeedbackForReviewer(@Param("reviewer") User reviewer);
    
    // Find feedback with high ratings (4-5 stars)
    @Query("SELECT f FROM Feedback f WHERE f.rating >= 4")
    List<Feedback> findHighRatedFeedback();
    
    // Find feedback with low ratings (1-2 stars)
    @Query("SELECT f FROM Feedback f WHERE f.rating <= 2")
    List<Feedback> findLowRatedFeedback();
    
    // Find feedback by rating range
    @Query("SELECT f FROM Feedback f WHERE f.rating BETWEEN :minRating AND :maxRating")
    List<Feedback> findByRatingRange(@Param("minRating") Integer minRating, @Param("maxRating") Integer maxRating);
    
    // Find anonymous feedback
    List<Feedback> findByIsAnonymousTrue();
    
    // Find non-anonymous feedback
    List<Feedback> findByIsAnonymousFalse();
} 