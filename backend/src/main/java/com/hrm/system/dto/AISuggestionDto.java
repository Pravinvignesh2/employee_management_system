package com.hrm.system.dto;

import com.hrm.system.entity.AISuggestion;
import java.time.LocalDateTime;

public class AISuggestionDto {
    private Long id;
    private Long userId;
    private String userName;
    private String title;
    private String description;
    private AISuggestion.SuggestionCategory category;
    private AISuggestion.SuggestionPriority priority;
    private AISuggestion.SuggestionType type;
    private AISuggestion.SuggestionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime implementedAt;
    private LocalDateTime dismissedAt;
    private Double aiScore;
    private String implementationNotes;
    
    // Constructors
    public AISuggestionDto() {}
    
    public AISuggestionDto(AISuggestion suggestion) {
        this.id = suggestion.getId();
        this.userId = suggestion.getUser().getId();
        this.userName = suggestion.getUser().getFirstName() + " " + suggestion.getUser().getLastName();
        this.title = suggestion.getTitle();
        this.description = suggestion.getDescription();
        this.category = suggestion.getCategory();
        this.priority = suggestion.getPriority();
        this.type = suggestion.getType();
        this.status = suggestion.getStatus();
        this.createdAt = suggestion.getCreatedAt();
        this.implementedAt = suggestion.getImplementedAt();
        this.dismissedAt = suggestion.getDismissedAt();
        this.aiScore = suggestion.getAiScore();
        this.implementationNotes = suggestion.getImplementationNotes();
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
    
    public AISuggestion.SuggestionCategory getCategory() {
        return category;
    }
    
    public void setCategory(AISuggestion.SuggestionCategory category) {
        this.category = category;
    }
    
    public AISuggestion.SuggestionPriority getPriority() {
        return priority;
    }
    
    public void setPriority(AISuggestion.SuggestionPriority priority) {
        this.priority = priority;
    }
    
    public AISuggestion.SuggestionType getType() {
        return type;
    }
    
    public void setType(AISuggestion.SuggestionType type) {
        this.type = type;
    }
    
    public AISuggestion.SuggestionStatus getStatus() {
        return status;
    }
    
    public void setStatus(AISuggestion.SuggestionStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getImplementedAt() {
        return implementedAt;
    }
    
    public void setImplementedAt(LocalDateTime implementedAt) {
        this.implementedAt = implementedAt;
    }
    
    public LocalDateTime getDismissedAt() {
        return dismissedAt;
    }
    
    public void setDismissedAt(LocalDateTime dismissedAt) {
        this.dismissedAt = dismissedAt;
    }
    
    public Double getAiScore() {
        return aiScore;
    }
    
    public void setAiScore(Double aiScore) {
        this.aiScore = aiScore;
    }
    
    public String getImplementationNotes() {
        return implementationNotes;
    }
    
    public void setImplementationNotes(String implementationNotes) {
        this.implementationNotes = implementationNotes;
    }
} 