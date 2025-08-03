package com.hrm.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Attendance entity for tracking employee attendance
 */
@Entity
@Table(name = "attendance")
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    private LocalTime punchInTime;
    
    private LocalTime punchOutTime;
    
    private String punchInLocation;
    
    private String punchOutLocation;
    
    private Double punchInLatitude;
    
    private Double punchInLongitude;
    
    private Double punchOutLatitude;
    
    private Double punchOutLongitude;
    
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status = AttendanceStatus.PRESENT;
    
    private String notes;
    
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
    public boolean isPresent() {
        return punchInTime != null;
    }
    
    public boolean isComplete() {
        return punchInTime != null && punchOutTime != null;
    }
    
    public long getWorkingHours() {
        if (punchInTime != null && punchOutTime != null) {
            return java.time.Duration.between(punchInTime, punchOutTime).toHours();
        }
        return 0;
    }
    
    public long getWorkingMinutes() {
        if (punchInTime != null && punchOutTime != null) {
            return java.time.Duration.between(punchInTime, punchOutTime).toMinutes();
        }
        return 0;
    }
    
    // Enums
    public enum AttendanceStatus {
        PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKEND
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
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public LocalTime getPunchInTime() {
        return punchInTime;
    }
    
    public void setPunchInTime(LocalTime punchInTime) {
        this.punchInTime = punchInTime;
    }
    
    public LocalTime getPunchOutTime() {
        return punchOutTime;
    }
    
    public void setPunchOutTime(LocalTime punchOutTime) {
        this.punchOutTime = punchOutTime;
    }
    
    public String getPunchInLocation() {
        return punchInLocation;
    }
    
    public void setPunchInLocation(String punchInLocation) {
        this.punchInLocation = punchInLocation;
    }
    
    public String getPunchOutLocation() {
        return punchOutLocation;
    }
    
    public void setPunchOutLocation(String punchOutLocation) {
        this.punchOutLocation = punchOutLocation;
    }
    
    public Double getPunchInLatitude() {
        return punchInLatitude;
    }
    
    public void setPunchInLatitude(Double punchInLatitude) {
        this.punchInLatitude = punchInLatitude;
    }
    
    public Double getPunchInLongitude() {
        return punchInLongitude;
    }
    
    public void setPunchInLongitude(Double punchInLongitude) {
        this.punchInLongitude = punchInLongitude;
    }
    
    public Double getPunchOutLatitude() {
        return punchOutLatitude;
    }
    
    public void setPunchOutLatitude(Double punchOutLatitude) {
        this.punchOutLatitude = punchOutLatitude;
    }
    
    public Double getPunchOutLongitude() {
        return punchOutLongitude;
    }
    
    public void setPunchOutLongitude(Double punchOutLongitude) {
        this.punchOutLongitude = punchOutLongitude;
    }
    
    public AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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