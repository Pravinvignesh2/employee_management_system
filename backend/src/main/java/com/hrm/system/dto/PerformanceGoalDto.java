package com.hrm.system.dto;

import com.hrm.system.entity.PerformanceGoal;
import java.time.LocalDateTime;

public class PerformanceGoalDto {
    private Long id;
    private Long userId;
    private String userName;
    private String title;
    private String description;
    private PerformanceGoal.GoalStatus status;
    private Integer progress;
    private String target;
    private String current;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long assignedById;
    private String assignedByName;
    private PerformanceGoal.GoalType type;
    
    // Constructors
    public PerformanceGoalDto() {}
    
    public PerformanceGoalDto(PerformanceGoal goal) {
        this.id = goal.getId();
        this.userId = goal.getUser().getId();
        this.userName = goal.getUser().getFirstName() + " " + goal.getUser().getLastName();
        this.title = goal.getTitle();
        this.description = goal.getDescription();
        this.status = goal.getStatus();
        this.progress = goal.getProgress();
        this.target = goal.getTarget();
        this.current = goal.getCurrent();
        this.dueDate = goal.getDueDate();
        this.createdAt = goal.getCreatedAt();
        this.updatedAt = goal.getUpdatedAt();
        this.type = goal.getType();
        
        if (goal.getAssignedBy() != null) {
            this.assignedById = goal.getAssignedBy().getId();
            this.assignedByName = goal.getAssignedBy().getFirstName() + " " + goal.getAssignedBy().getLastName();
        }
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public PerformanceGoal.GoalStatus getStatus() {
        return status;
    }
    
    public void setStatus(PerformanceGoal.GoalStatus status) {
        this.status = status;
    }
    
    public Integer getProgress() {
        return progress;
    }
    
    public void setProgress(Integer progress) {
        this.progress = progress;
    }
    
    public String getTarget() {
        return target;
    }
    
    public void setTarget(String target) {
        this.target = target;
    }
    
    public String getCurrent() {
        return current;
    }
    
    public void setCurrent(String current) {
        this.current = current;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
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
    
    public Long getAssignedById() {
        return assignedById;
    }
    
    public void setAssignedById(Long assignedById) {
        this.assignedById = assignedById;
    }
    
    public String getAssignedByName() {
        return assignedByName;
    }
    
    public void setAssignedByName(String assignedByName) {
        this.assignedByName = assignedByName;
    }
    
    public PerformanceGoal.GoalType getType() {
        return type;
    }
    
    public void setType(PerformanceGoal.GoalType type) {
        this.type = type;
    }
} 