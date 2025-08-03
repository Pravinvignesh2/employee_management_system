package com.hrm.system.service;

import com.hrm.system.dto.DashboardActivityDto;
import java.util.List;
import java.util.Map;

public interface DashboardService {
    
    /**
     * Get recent activities for the dashboard
     * @param limit Maximum number of activities to return
     * @return List of recent activities
     */
    List<DashboardActivityDto> getRecentActivities(int limit);
    
    /**
     * Get activities for a specific user
     * @param userId User ID
     * @param limit Maximum number of activities to return
     * @return List of user activities
     */
    List<DashboardActivityDto> getUserActivities(Long userId, int limit);
    
    /**
     * Get activities for a specific department
     * @param department Department name
     * @param limit Maximum number of activities to return
     * @return List of department activities
     */
    List<DashboardActivityDto> getDepartmentActivities(String department, int limit);
    
    /**
     * Get dashboard statistics
     * @return Map containing dashboard statistics
     */
    Map<String, Object> getDashboardStatistics();
} 