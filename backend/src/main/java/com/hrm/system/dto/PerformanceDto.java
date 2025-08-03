package com.hrm.system.dto;

import com.hrm.system.entity.Performance;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Performance entity
 */
public class PerformanceDto {
    
    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeId;
    private Performance.ReviewType reviewType;
    private LocalDate reviewPeriod;
    private String goals;
    private String achievements;
    private Integer rating;
    private String comments;
    private Performance.PerformanceStatus status;
    private Long reviewedBy;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for detailed performance
    private String strengths;
    private String areasOfImprovement;
    private String challenges;
    private String recommendations;
    private LocalDateTime nextReviewDate;
    
    public PerformanceDto() {}
    
    public PerformanceDto(Performance performance) {
        this.id = performance.getId();
        this.userId = performance.getUser().getId();
        this.employeeName = performance.getUser().getFullName();
        this.employeeId = performance.getUser().getEmployeeId();
        this.reviewType = performance.getReviewType();
        this.reviewPeriod = performance.getReviewPeriod();
        this.goals = performance.getGoals();
        this.achievements = performance.getAchievements();
        this.rating = performance.getOverallRating();
        this.comments = performance.getComments();
        this.status = performance.getStatus();
        this.reviewedBy = performance.getReviewer() != null ? performance.getReviewer().getId() : null;
        this.reviewedByName = performance.getReviewer() != null ? performance.getReviewer().getFullName() : null;
        this.reviewedAt = performance.getReviewDate();
        this.createdAt = performance.getCreatedAt();
        this.updatedAt = performance.getUpdatedAt();
        
        // Additional fields
        this.strengths = performance.getStrengths();
        this.areasOfImprovement = performance.getAreasOfImprovement();
        this.challenges = performance.getChallenges();
        this.recommendations = performance.getRecommendations();
        this.nextReviewDate = performance.getNextReviewDate();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public String getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    
    public Performance.ReviewType getReviewType() {
        return reviewType;
    }
    
    public void setReviewType(Performance.ReviewType reviewType) {
        this.reviewType = reviewType;
    }
    
    public LocalDate getReviewPeriod() {
        return reviewPeriod;
    }
    
    public void setReviewPeriod(LocalDate reviewPeriod) {
        this.reviewPeriod = reviewPeriod;
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
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public Performance.PerformanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(Performance.PerformanceStatus status) {
        this.status = status;
    }
    
    public Long getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(Long reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
    
    public String getReviewedByName() {
        return reviewedByName;
    }
    
    public void setReviewedByName(String reviewedByName) {
        this.reviewedByName = reviewedByName;
    }
    
    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
    
    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
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
    
    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }
    
    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }
} 