package com.hrm.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Performance entity for managing employee performance reviews
 */
@Entity
@Table(name = "performance")
public class Performance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @NotNull(message = "Review period is required")
    private LocalDate reviewPeriod;
    
    @NotNull(message = "Review type is required")
    @Enumerated(EnumType.STRING)
    private ReviewType reviewType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer overallRating;
    
    private String strengths;
    
    private String areasOfImprovement;
    
    private String goals;
    
    private String achievements;
    
    private String challenges;
    
    private String recommendations;
    
    @Enumerated(EnumType.STRING)
    private PerformanceStatus status = PerformanceStatus.DRAFT;
    
    private LocalDateTime reviewDate;
    
    private LocalDateTime nextReviewDate;
    
    private String comments;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public String getRatingDescription() {
        if (overallRating == null) return "Not Rated";
        switch (overallRating) {
            case 1: return "Poor";
            case 2: return "Below Average";
            case 3: return "Average";
            case 4: return "Good";
            case 5: return "Excellent";
            default: return "Not Rated";
        }
    }
    
    public boolean isCompleted() {
        return status == PerformanceStatus.COMPLETED;
    }
    
    public boolean isDraft() {
        return status == PerformanceStatus.DRAFT;
    }
    
    public boolean isInProgress() {
        return status == PerformanceStatus.IN_PROGRESS;
    }
    
    // Enums
    public enum ReviewType {
        ANNUAL, QUARTERLY, MONTHLY, PROJECT_BASED, PROBATION
    }
    
    public enum PerformanceStatus {
        DRAFT, IN_PROGRESS, COMPLETED, APPROVED, REJECTED
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public LocalDate getReviewPeriod() {
        return reviewPeriod;
    }
    
    public void setReviewPeriod(LocalDate reviewPeriod) {
        this.reviewPeriod = reviewPeriod;
    }
    
    public ReviewType getReviewType() {
        return reviewType;
    }
    
    public void setReviewType(ReviewType reviewType) {
        this.reviewType = reviewType;
    }
    
    public User getReviewer() {
        return reviewer;
    }
    
    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }
    
    public Integer getOverallRating() {
        return overallRating;
    }
    
    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }
    
    public String getStrengths() {
        return strengths;
    }
    
    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }
    
    public String getAreasOfImprovement() {
        return areasOfImprovement;
    }
    
    public void setAreasOfImprovement(String areasOfImprovement) {
        this.areasOfImprovement = areasOfImprovement;
    }
    
    public String getGoals() {
        return goals;
    }
    
    public void setGoals(String goals) {
        this.goals = goals;
    }
    
    public String getAchievements() {
        return achievements;
    }
    
    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }
    
    public String getChallenges() {
        return challenges;
    }
    
    public void setChallenges(String challenges) {
        this.challenges = challenges;
    }
    
    public String getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
    
    public PerformanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(PerformanceStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getReviewDate() {
        return reviewDate;
    }
    
    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }
    
    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }
    
    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
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