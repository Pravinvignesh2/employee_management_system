package com.hrm.system.service;

import com.hrm.system.dto.AttendanceDto;
import com.hrm.system.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceService {
    
    /**
     * Punch in for a user
     */
    AttendanceDto punchIn(Long userId, String location, Double latitude, Double longitude);
    
    /**
     * Punch out for a user
     */
    AttendanceDto punchOut(Long userId, String location, Double latitude, Double longitude);
    
    /**
     * Create attendance record
     */
    AttendanceDto createAttendance(AttendanceDto attendanceDto);
    
    /**
     * Update attendance record
     */
    AttendanceDto updateAttendance(Long id, AttendanceDto attendanceDto);
    
    /**
     * Get attendance by ID
     */
    Optional<AttendanceDto> getAttendanceById(Long id);
    
    /**
     * Get attendance by user and date
     */
    Optional<AttendanceDto> getAttendanceByUserAndDate(Long userId, LocalDate date);
    
    /**
     * Get all attendance records with pagination
     */
    Page<AttendanceDto> getAllAttendance(Pageable pageable);
    
    /**
     * Get all attendance records with pagination and filters
     */
    Page<AttendanceDto> getAllAttendanceWithFilters(Pageable pageable, String date, Attendance.AttendanceStatus status, Long userId);
    
    /**
     * Get attendance by user
     */
    List<AttendanceDto> getAttendanceByUser(Long userId);
    
    /**
     * Get attendance by date
     */
    List<AttendanceDto> getAttendanceByDate(LocalDate date);
    
    /**
     * Get attendance by user and date range
     */
    List<AttendanceDto> getAttendanceByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get attendance by department and date
     */
    List<AttendanceDto> getAttendanceByDepartmentAndDate(String department, LocalDate date);
    
    /**
     * Get attendance by status
     */
    List<AttendanceDto> getAttendanceByStatus(Attendance.AttendanceStatus status);
    
    /**
     * Get attendance statistics for dashboard
     */
    AttendanceStatistics getAttendanceStatistics();
    
    /**
     * Get attendance statistics for a user
     */
    UserAttendanceStatistics getUserAttendanceStatistics(Long userId);
    
    /**
     * Get attendance statistics for a department
     */
    DepartmentAttendanceStatistics getDepartmentAttendanceStatistics(String department);
    
    /**
     * Mark attendance as absent
     */
    AttendanceDto markAbsent(Long userId, LocalDate date, String reason);
    
    /**
     * Mark attendance as half day
     */
    AttendanceDto markHalfDay(Long userId, LocalDate date, String reason);
    
    /**
     * Delete attendance record
     */
    void deleteAttendance(Long id);
    
    /**
     * Check if user has already punched in for the day
     */
    boolean hasPunchedIn(Long userId, LocalDate date);
    
    /**
     * Check if user has already punched out for the day
     */
    boolean hasPunchedOut(Long userId, LocalDate date);
    
    /**
     * Get working hours for a user on a specific date
     */
    long getWorkingHours(Long userId, LocalDate date);
    
    /**
     * Get total working hours for a user in a date range
     */
    long getTotalWorkingHours(Long userId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Attendance statistics for dashboard
     */
    class AttendanceStatistics {
        private long totalPresent;
        private long totalAbsent;
        private long totalHalfDay;
        private long totalLeave;
        private double attendanceRate;
        
        public AttendanceStatistics(long totalPresent, long totalAbsent, long totalHalfDay, long totalLeave, double attendanceRate) {
            this.totalPresent = totalPresent;
            this.totalAbsent = totalAbsent;
            this.totalHalfDay = totalHalfDay;
            this.totalLeave = totalLeave;
            this.attendanceRate = attendanceRate;
        }
        
        // Getters
        public long getTotalPresent() { return totalPresent; }
        public long getTotalAbsent() { return totalAbsent; }
        public long getTotalHalfDay() { return totalHalfDay; }
        public long getTotalLeave() { return totalLeave; }
        public double getAttendanceRate() { return attendanceRate; }
    }
    
    /**
     * User attendance statistics
     */
    class UserAttendanceStatistics {
        private long totalDays;
        private long presentDays;
        private long absentDays;
        private long halfDays;
        private long leaveDays;
        private double attendanceRate;
        private long totalWorkingHours;
        
        public UserAttendanceStatistics(long totalDays, long presentDays, long absentDays, long halfDays, long leaveDays, double attendanceRate, long totalWorkingHours) {
            this.totalDays = totalDays;
            this.presentDays = presentDays;
            this.absentDays = absentDays;
            this.halfDays = halfDays;
            this.leaveDays = leaveDays;
            this.attendanceRate = attendanceRate;
            this.totalWorkingHours = totalWorkingHours;
        }
        
        // Getters
        public long getTotalDays() { return totalDays; }
        public long getPresentDays() { return presentDays; }
        public long getAbsentDays() { return absentDays; }
        public long getHalfDays() { return halfDays; }
        public long getLeaveDays() { return leaveDays; }
        public double getAttendanceRate() { return attendanceRate; }
        public long getTotalWorkingHours() { return totalWorkingHours; }
    }
    
    /**
     * Department attendance statistics
     */
    class DepartmentAttendanceStatistics {
        private String department;
        private long totalEmployees;
        private long presentEmployees;
        private long absentEmployees;
        private double attendanceRate;
        
        public DepartmentAttendanceStatistics(String department, long totalEmployees, long presentEmployees, long absentEmployees, double attendanceRate) {
            this.department = department;
            this.totalEmployees = totalEmployees;
            this.presentEmployees = presentEmployees;
            this.absentEmployees = absentEmployees;
            this.attendanceRate = attendanceRate;
        }
        
        // Getters
        public String getDepartment() { return department; }
        public long getTotalEmployees() { return totalEmployees; }
        public long getPresentEmployees() { return presentEmployees; }
        public long getAbsentEmployees() { return absentEmployees; }
        public double getAttendanceRate() { return attendanceRate; }
    }
} 