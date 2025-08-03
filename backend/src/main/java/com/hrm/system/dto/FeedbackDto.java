package com.hrm.system.dto;

import com.hrm.system.entity.Feedback;
import java.time.LocalDateTime;

public class FeedbackDto {
    private Long id;
    private Long recipientId;
    private String recipientName;
    private Long reviewerId;
    private String reviewerName;
    private Feedback.FeedbackType type;
    private Integer rating;
    private String comment;
    private Feedback.FeedbackStatus status;
    private String reviewPeriod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isAnonymous;
    
    // Constructors
    public FeedbackDto() {}
    
    public FeedbackDto(Feedback feedback) {
        this.id = feedback.getId();
        this.recipientId = feedback.getRecipient().getId();
        this.recipientName = feedback.getRecipient().getFirstName() + " " + feedback.getRecipient().getLastName();
        this.reviewerId = feedback.getReviewer().getId();
        this.reviewerName = feedback.getReviewer().getFirstName() + " " + feedback.getReviewer().getLastName();
        this.type = feedback.getType();
        this.rating = feedback.getRating();
        this.comment = feedback.getComment();
        this.status = feedback.getStatus();
        this.reviewPeriod = feedback.getReviewPeriod();
        this.createdAt = feedback.getCreatedAt();
        this.updatedAt = feedback.getUpdatedAt();
        this.isAnonymous = feedback.getIsAnonymous();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getRecipientId() {
        return recipientId;
    }
    
    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }
    
    public String getRecipientName() {
        return recipientName;
    }
    
    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }
    
    public Long getReviewerId() {
        return reviewerId;
    }
    
    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }
    
    public String getReviewerName() {
        return reviewerName;
    }
    
    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }
    
    public Feedback.FeedbackType getType() {
        return type;
    }
    
    public void setType(Feedback.FeedbackType type) {
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
    
    public Feedback.FeedbackStatus getStatus() {
        return status;
    }
    
    public void setStatus(Feedback.FeedbackStatus status) {
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
} 