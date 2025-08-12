package com.hrm.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_requests")
public class FeedbackRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type", nullable = false)
    private Feedback.FeedbackType feedbackType;
    
    @Column(name = "review_period")
    private String reviewPeriod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FeedbackRequestStatus status;
    
    @Column(name = "message")
    private String message;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum FeedbackRequestStatus {
        PENDING,    // Request sent, waiting for response
        ACCEPTED,   // Recipient accepted the request
        DECLINED,   // Recipient declined the request
        COMPLETED,  // Feedback was provided
        EXPIRED     // Request expired
    }
    
    // Default constructor
    public FeedbackRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = FeedbackRequestStatus.PENDING;
    }
    
    // Constructor with required fields
    public FeedbackRequest(User requester, User recipient, Feedback.FeedbackType feedbackType, String reviewPeriod) {
        this();
        this.requester = requester;
        this.recipient = recipient;
        this.feedbackType = feedbackType;
        this.reviewPeriod = reviewPeriod;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getRequester() {
        return requester;
    }
    
    public void setRequester(User requester) {
        this.requester = requester;
    }
    
    public User getRecipient() {
        return recipient;
    }
    
    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }
    
    public Feedback.FeedbackType getFeedbackType() {
        return feedbackType;
    }
    
    public void setFeedbackType(Feedback.FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }
    
    public String getReviewPeriod() {
        return reviewPeriod;
    }
    
    public void setReviewPeriod(String reviewPeriod) {
        this.reviewPeriod = reviewPeriod;
    }
    
    public FeedbackRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(FeedbackRequestStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
