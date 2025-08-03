package com.hrm.system.dto;

import java.time.LocalDateTime;

public class DashboardActivityDto {
    private String id;
    private String type;
    private String title;
    private String description;
    private LocalDateTime timestamp;
    private Long userId;
    private String userName;
    private Long relatedId;
    private String icon;

    // Constructors
    public DashboardActivityDto() {}

    public DashboardActivityDto(String id, String type, String title, String description, 
                              LocalDateTime timestamp, Long userId, String userName, 
                              Long relatedId, String icon) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.userId = userId;
        this.userName = userName;
        this.relatedId = relatedId;
        this.icon = icon;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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

    public Long getRelatedId() {
        return relatedId;
    }

    public void setRelatedId(Long relatedId) {
        this.relatedId = relatedId;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
} 