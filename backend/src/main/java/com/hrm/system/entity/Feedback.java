package com.hrm.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient; // Person receiving feedback
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer; // Person giving feedback
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackType type;
    
    @Column(nullable = false)
    private Integer rating; // 1-5 stars
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackStatus status;
    
    @Column(name = "review_period")
    private String reviewPeriod; // e.g., "Q1 2024"
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    
    public enum FeedbackType {
        SELF, PEER, MANAGER, SUBORDINATE
    }
    
    public enum FeedbackStatus {
        PENDING, SUBMITTED, APPROVED, REJECTED
    }
    
    // Constructors
    public Feedback() {
        this.createdAt = LocalDateTime.now();
        this.status = FeedbackStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getRecipient() {
        return recipient;
    }
    
    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }
    
    public User getReviewer() {
        return reviewer;
    }
    
    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }
    
    public FeedbackType getType() {
        return type;
    }
    
    public void setType(FeedbackType type) {
        this.type = type;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public FeedbackStatus getStatus() {
        return status;
    }
    
    public void setStatus(FeedbackStatus status) {
        this.status = status;
    }
    
    public String getReviewPeriod() {
        return reviewPeriod;
    }
    
    public void setReviewPeriod(String reviewPeriod) {
        this.reviewPeriod = reviewPeriod;
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
    
    public Boolean getIsAnonymous() {
        return isAnonymous;
    }
    
    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 