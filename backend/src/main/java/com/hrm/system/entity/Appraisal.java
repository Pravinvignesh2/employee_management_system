package com.hrm.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appraisals")
public class Appraisal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;
    
    @Column(nullable = false)
    private String period; // e.g., "Q4 2024"
    
    @Column(nullable = false)
    private Double rating; // 1.0 - 5.0
    
    @Column(columnDefinition = "TEXT")
    private String achievements;
    
    @Column(columnDefinition = "TEXT")
    private String improvements;
    
    @Column(columnDefinition = "TEXT")
    private String goals;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppraisalStatus status;
    
    @Column(name = "appraisal_date", nullable = false)
    private LocalDateTime appraisalDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "employee_comments", columnDefinition = "TEXT")
    private String employeeComments;
    
    @Column(name = "manager_comments", columnDefinition = "TEXT")
    private String managerComments;
    
    public enum AppraisalStatus {
        DRAFT, SUBMITTED, APPROVED, REJECTED, COMPLETED
    }
    
    // Constructors
    public Appraisal() {
        this.createdAt = LocalDateTime.now();
        this.appraisalDate = LocalDateTime.now();
        this.status = AppraisalStatus.DRAFT;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getEmployee() {
        return employee;
    }
    
    public void setEmployee(User employee) {
        this.employee = employee;
    }
    
    public User getManager() {
        return manager;
    }
    
    public void setManager(User manager) {
        this.manager = manager;
    }
    
    public String getPeriod() {
        return period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public String getAchievements() {
        return achievements;
    }
    
    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }
    
    public String getImprovements() {
        return improvements;
    }
    
    public void setImprovements(String improvements) {
        this.improvements = improvements;
    }
    
    public String getGoals() {
        return goals;
    }
    
    public void setGoals(String goals) {
        this.goals = goals;
    }
    
    public AppraisalStatus getStatus() {
        return status;
    }
    
    public void setStatus(AppraisalStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getAppraisalDate() {
        return appraisalDate;
    }
    
    public void setAppraisalDate(LocalDateTime appraisalDate) {
        this.appraisalDate = appraisalDate;
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
    
    public String getEmployeeComments() {
        return employeeComments;
    }
    
    public void setEmployeeComments(String employeeComments) {
        this.employeeComments = employeeComments;
    }
    
    public String getManagerComments() {
        return managerComments;
    }
    
    public void setManagerComments(String managerComments) {
        this.managerComments = managerComments;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 