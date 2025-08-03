package com.hrm.system.controller;

import com.hrm.system.dto.DashboardActivityDto;
import com.hrm.system.dto.RecentActivitiesResponse;
import com.hrm.system.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/activities")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RecentActivitiesResponse> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<DashboardActivityDto> activities = dashboardService.getRecentActivities(limit);
            RecentActivitiesResponse response = new RecentActivitiesResponse();
            response.setActivities(activities);
            response.setTotalCount(activities.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/activities/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RecentActivitiesResponse> getUserActivities(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<DashboardActivityDto> activities = dashboardService.getUserActivities(userId, limit);
            RecentActivitiesResponse response = new RecentActivitiesResponse();
            response.setActivities(activities);
            response.setTotalCount(activities.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/activities/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RecentActivitiesResponse> getDepartmentActivities(
            @PathVariable String department,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<DashboardActivityDto> activities = dashboardService.getDepartmentActivities(department, limit);
            RecentActivitiesResponse response = new RecentActivitiesResponse();
            response.setActivities(activities);
            response.setTotalCount(activities.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> getDashboardStatistics() {
        try {
            return ResponseEntity.ok(dashboardService.getDashboardStatistics());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 