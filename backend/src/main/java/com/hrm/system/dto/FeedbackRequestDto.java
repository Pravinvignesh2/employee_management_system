package com.hrm.system.dto;

import com.hrm.system.entity.FeedbackRequest;
import com.hrm.system.entity.Feedback;

import java.time.LocalDateTime;

public class FeedbackRequestDto {
    
    private Long id;
    private Long requesterId;
    private String requesterName;
    private Long recipientId;
    private String recipientName;
    private Feedback.FeedbackType feedbackType;
    private String reviewPeriod;
    private FeedbackRequest.FeedbackRequestStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Default constructor
    public FeedbackRequestDto() {}
    
    // Constructor from entity
    public FeedbackRequestDto(FeedbackRequest feedbackRequest) {
        this.id = feedbackRequest.getId();
        this.requesterId = feedbackRequest.getRequester().getId();
        this.requesterName = feedbackRequest.getRequester().getFirstName() + " " + feedbackRequest.getRequester().getLastName();
        this.recipientId = feedbackRequest.getRecipient().getId();
        this.recipientName = feedbackRequest.getRecipient().getFirstName() + " " + feedbackRequest.getRecipient().getLastName();
        this.feedbackType = feedbackRequest.getFeedbackType();
        this.reviewPeriod = feedbackRequest.getReviewPeriod();
        this.status = feedbackRequest.getStatus();
        this.message = feedbackRequest.getMessage();
        this.createdAt = feedbackRequest.getCreatedAt();
        this.updatedAt = feedbackRequest.getUpdatedAt();
    }
    
    // Constructor for creating new requests
    public FeedbackRequestDto(Long requesterId, Long recipientId, Feedback.FeedbackType feedbackType, String reviewPeriod) {
        this.requesterId = requesterId;
        this.recipientId = recipientId;
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
    
    public Long getRequesterId() {
        return requesterId;
    }
    
    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }
    
    public String getRequesterName() {
        return requesterName;
    }
    
    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
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
    
    public FeedbackRequest.FeedbackRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(FeedbackRequest.FeedbackRequestStatus status) {
        this.status = status;
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
