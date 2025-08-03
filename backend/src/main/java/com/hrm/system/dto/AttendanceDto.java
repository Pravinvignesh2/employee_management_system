package com.hrm.system.dto;

import com.hrm.system.entity.Attendance;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AttendanceDto {
    
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String employeeName;
    private String employeeId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    private LocalTime punchInTime;
    private LocalTime punchOutTime;
    private String punchInLocation;
    private String punchOutLocation;
    private Attendance.AttendanceStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public AttendanceDto() {}
    
    public AttendanceDto(Attendance attendance) {
        this.id = attendance.getId();
        this.userId = attendance.getUser().getId();
        this.employeeName = attendance.getUser().getFullName();
        this.employeeId = attendance.getUser().getEmployeeId();
        this.date = attendance.getDate();
        this.punchInTime = attendance.getPunchInTime();
        this.punchOutTime = attendance.getPunchOutTime();
        this.punchInLocation = attendance.getPunchInLocation();
        this.punchOutLocation = attendance.getPunchOutLocation();
        this.status = attendance.getStatus();
        this.notes = attendance.getNotes();
        this.createdAt = attendance.getCreatedAt();
        this.updatedAt = attendance.getUpdatedAt();
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
    
    public Attendance.AttendanceStatus getStatus() {
        return status;
    }
    
    public void setStatus(Attendance.AttendanceStatus status) {
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
    
    // Helper methods
    public boolean isPresent() {
        return punchInTime != null;
    }
    
    public boolean isAbsent() {
        return status == Attendance.AttendanceStatus.ABSENT;
    }
    
    public boolean isLate() {
        return status == Attendance.AttendanceStatus.HALF_DAY;
    }
    
    public boolean isOnTime() {
        return status == Attendance.AttendanceStatus.PRESENT;
    }
} 