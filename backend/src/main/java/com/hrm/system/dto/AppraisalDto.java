package com.hrm.system.dto;

import com.hrm.system.entity.Appraisal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

public class AppraisalDto {
    private Long id;
    @NotNull(message = "Employee ID is required")
    private Long employeeId;
    private String employeeName;
    @NotNull(message = "Manager ID is required")
    private Long managerId;
    private String managerName;
    @NotBlank(message = "Period is required")
    private String period;
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Double rating;
    private String achievements;
    private String improvements;
    private String goals;
    private Appraisal.AppraisalStatus status;
    private LocalDateTime appraisalDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String employeeComments;
    private String managerComments;
    
    // Constructors
    public AppraisalDto() {}
    
    public AppraisalDto(Appraisal appraisal) {
        this.id = appraisal.getId();
        this.employeeId = appraisal.getEmployee().getId();
        this.employeeName = appraisal.getEmployee().getFirstName() + " " + appraisal.getEmployee().getLastName();
        this.managerId = appraisal.getManager().getId();
        this.managerName = appraisal.getManager().getFirstName() + " " + appraisal.getManager().getLastName();
        this.period = appraisal.getPeriod();
        this.rating = appraisal.getRating();
        this.achievements = appraisal.getAchievements();
        this.improvements = appraisal.getImprovements();
        this.goals = appraisal.getGoals();
        this.status = appraisal.getStatus();
        this.appraisalDate = appraisal.getAppraisalDate();
        this.createdAt = appraisal.getCreatedAt();
        this.updatedAt = appraisal.getUpdatedAt();
        this.employeeComments = appraisal.getEmployeeComments();
        this.managerComments = appraisal.getManagerComments();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public Long getManagerId() {
        return managerId;
    }
    
    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
    
    public String getManagerName() {
        return managerName;
    }
    
    public void setManagerName(String managerName) {
        this.managerName = managerName;
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
    
    public Appraisal.AppraisalStatus getStatus() {
        return status;
    }
    
    public void setStatus(Appraisal.AppraisalStatus status) {
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
} 