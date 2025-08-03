package com.hrm.system.dto;

import java.util.List;

public class RecentActivitiesResponse {
    private List<DashboardActivityDto> activities;
    private int totalCount;

    // Constructors
    public RecentActivitiesResponse() {}

    public RecentActivitiesResponse(List<DashboardActivityDto> activities, int totalCount) {
        this.activities = activities;
        this.totalCount = totalCount;
    }

    // Getters and Setters
    public List<DashboardActivityDto> getActivities() {
        return activities;
    }

    public void setActivities(List<DashboardActivityDto> activities) {
        this.activities = activities;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
} 