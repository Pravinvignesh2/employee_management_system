package com.hrm.system.controller;

import com.hrm.system.dto.AttendanceDto;
import com.hrm.system.entity.Attendance;
import com.hrm.system.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Attendance management
 */
@RestController
@RequestMapping("/api/attendance")
@Tag(name = "Attendance Management", description = "APIs for managing employee attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    /**
     * Punch in for a user
     */
    @PostMapping("/punch-in/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE') and #userId == authentication.principal.id")
    @Operation(summary = "Punch in", description = "Punch in for a user")
    public ResponseEntity<AttendanceDto> punchIn(
            @PathVariable Long userId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {

        try {
            AttendanceDto attendance = attendanceService.punchIn(userId, location, latitude, longitude);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Punch out for a user
     */
    @PostMapping("/punch-out/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE') and #userId == authentication.principal.id")
    @Operation(summary = "Punch out", description = "Punch out for a user")
    public ResponseEntity<AttendanceDto> punchOut(
            @PathVariable Long userId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {

        try {
            AttendanceDto attendance = attendanceService.punchOut(userId, location, latitude, longitude);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Create attendance record
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create attendance", description = "Create a new attendance record")
    public ResponseEntity<AttendanceDto> createAttendance(@Valid @RequestBody AttendanceDto attendanceDto) {
        try {
            AttendanceDto createdAttendance = attendanceService.createAttendance(attendanceDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all attendance records with pagination and filters
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all attendance", description = "Get paginated list of all attendance records with filters")
    public ResponseEntity<Page<AttendanceDto>> getAllAttendance(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "date") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "DESC") String sortDir,
            @Parameter(description = "Filter by date (YYYY-MM-DD)") @RequestParam(required = false) String date,
            @Parameter(description = "Filter by status") @RequestParam(required = false) Attendance.AttendanceStatus status,
            @Parameter(description = "Filter by user ID") @RequestParam(required = false) Long userId) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Apply filters
        if (date != null || status != null || userId != null) {
            Page<AttendanceDto> attendance = attendanceService.getAllAttendanceWithFilters(pageable, date, status,
                    userId);
            return ResponseEntity.ok(attendance);
        } else {
            Page<AttendanceDto> attendance = attendanceService.getAllAttendance(pageable);
            return ResponseEntity.ok(attendance);
        }
    }

    /**
     * Get attendance by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get attendance by ID", description = "Get attendance details by ID")
    public ResponseEntity<AttendanceDto> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get attendance by user and date
     */
    @GetMapping("/user/{userId}/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get attendance by user and date", description = "Get attendance for a specific user on a specific date")
    public ResponseEntity<AttendanceDto> getAttendanceByUserAndDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return attendanceService.getAttendanceByUserAndDate(userId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get attendance by user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get attendance by user", description = "Get all attendance records for a user")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByUser(@PathVariable Long userId) {
        List<AttendanceDto> attendance = attendanceService.getAttendanceByUser(userId);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Get attendance by date
     */
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get attendance by date", description = "Get all attendance records for a specific date")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AttendanceDto> attendance = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Get attendance by user and date range
     */
    @GetMapping("/user/{userId}/range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get attendance by user and date range", description = "Get attendance records for a user within a date range")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<AttendanceDto> attendance = attendanceService.getAttendanceByUserAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Get attendance by department and date
     */
    @GetMapping("/department/{department}/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get attendance by department and date", description = "Get attendance records for a department on a specific date")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByDepartmentAndDate(
            @PathVariable String department,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AttendanceDto> attendance = attendanceService.getAttendanceByDepartmentAndDate(department, date);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Get attendance by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get attendance by status", description = "Get attendance records by status")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByStatus(@PathVariable Attendance.AttendanceStatus status) {
        List<AttendanceDto> attendance = attendanceService.getAttendanceByStatus(status);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Update attendance record
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update attendance", description = "Update an attendance record")
    public ResponseEntity<AttendanceDto> updateAttendance(@PathVariable Long id,
            @Valid @RequestBody AttendanceDto attendanceDto) {
        try {
            AttendanceDto updatedAttendance = attendanceService.updateAttendance(id, attendanceDto);
            return ResponseEntity.ok(updatedAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete attendance record
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete attendance", description = "Delete an attendance record")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Mark attendance as absent
     */
    @PostMapping("/mark-absent/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Mark absent", description = "Mark a user as absent for a specific date")
    public ResponseEntity<AttendanceDto> markAbsent(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String reason) {

        try {
            AttendanceDto attendance = attendanceService.markAbsent(userId, date, reason);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Mark attendance as half day
     */
    @PostMapping("/mark-half-day/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Mark half day", description = "Mark a user as half day for a specific date")
    public ResponseEntity<AttendanceDto> markHalfDay(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String reason) {

        try {
            AttendanceDto attendance = attendanceService.markHalfDay(userId, date, reason);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get attendance statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get attendance statistics", description = "Get attendance statistics for dashboard")
    public ResponseEntity<AttendanceService.AttendanceStatistics> getAttendanceStatistics() {
        AttendanceService.AttendanceStatistics statistics = attendanceService.getAttendanceStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get user attendance statistics
     */
    @GetMapping("/statistics/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get user attendance statistics", description = "Get attendance statistics for a specific user")
    public ResponseEntity<AttendanceService.UserAttendanceStatistics> getUserAttendanceStatistics(
            @PathVariable Long userId) {
        AttendanceService.UserAttendanceStatistics statistics = attendanceService.getUserAttendanceStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get department attendance statistics
     */
    @GetMapping("/statistics/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get department attendance statistics", description = "Get attendance statistics for a specific department")
    public ResponseEntity<AttendanceService.DepartmentAttendanceStatistics> getDepartmentAttendanceStatistics(
            @PathVariable String department) {
        AttendanceService.DepartmentAttendanceStatistics statistics = attendanceService
                .getDepartmentAttendanceStatistics(department);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Check if user has punched in for the day
     */
    @GetMapping("/has-punched-in/{userId}/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE') and #userId == authentication.principal.id")
    @Operation(summary = "Check punch in status", description = "Check if user has punched in for a specific date")
    public ResponseEntity<Boolean> hasPunchedIn(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean hasPunchedIn = attendanceService.hasPunchedIn(userId, date);
        return ResponseEntity.ok(hasPunchedIn);
    }

    /**
     * Check if user has punched out for the day
     */
    @GetMapping("/has-punched-out/{userId}/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE') and #userId == authentication.principal.id")
    @Operation(summary = "Check punch out status", description = "Check if user has punched out for a specific date")
    public ResponseEntity<Boolean> hasPunchedOut(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean hasPunchedOut = attendanceService.hasPunchedOut(userId, date);
        return ResponseEntity.ok(hasPunchedOut);
    }

    /**
     * Get working hours for a user on a specific date
     */
    @GetMapping("/working-hours/{userId}/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get working hours", description = "Get working hours for a user on a specific date")
    public ResponseEntity<Long> getWorkingHours(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        long workingHours = attendanceService.getWorkingHours(userId, date);
        return ResponseEntity.ok(workingHours);
    }

    /**
     * Get total working hours for a user in a date range
     */
    @GetMapping("/total-working-hours/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get total working hours", description = "Get total working hours for a user in a date range")
    public ResponseEntity<Long> getTotalWorkingHours(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            long totalHours = attendanceService.getTotalWorkingHours(userId, startDate, endDate);
            return ResponseEntity.ok(totalHours);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update attendance status for a specific date based on working hours
     */
    @PostMapping("/update-status-for-date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update attendance status for date", description = "Update all attendance records for a specific date based on working hours")
    public ResponseEntity<String> updateAttendanceStatusForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            attendanceService.updateAllAttendanceStatusForDate(date);
            return ResponseEntity.ok("Attendance status updated successfully for " + date);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to update attendance status: " + e.getMessage());
        }
    }
}