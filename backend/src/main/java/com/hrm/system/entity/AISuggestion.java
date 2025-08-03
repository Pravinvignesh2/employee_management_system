package com.hrm.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_suggestions")
public class AISuggestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SuggestionCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SuggestionPriority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SuggestionType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SuggestionStatus status;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "implemented_at")
    private LocalDateTime implementedAt;
    
    @Column(name = "dismissed_at")
    private LocalDateTime dismissedAt;
    
    @Column(name = "ai_score")
    private Double aiScore; // 0.0 - 1.0 confidence score
    
    @Column(name = "implementation_notes", columnDefinition = "TEXT")
    private String implementationNotes;
    
    public enum SuggestionCategory {
        PRODUCTIVITY, CAREER_GROWTH, SKILLS, LEADERSHIP, TEAMWORK, COMMUNICATION
    }
    
    public enum SuggestionPriority {
        HIGH, MEDIUM, LOW
    }
    
    public enum SuggestionType {
        IMPROVEMENT, OPPORTUNITY, URGENT, RECOMMENDATION
    }
    
    public enum SuggestionStatus {
        ACTIVE, IMPLEMENTED, DISMISSED, EXPIRED
    }
    
    // Constructors
    public AISuggestion() {
        this.createdAt = LocalDateTime.now();
        this.status = SuggestionStatus.ACTIVE;
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
    
    public SuggestionCategory getCategory() {
        return category;
    }
    
    public void setCategory(SuggestionCategory category) {
        this.category = category;
    }
    
    public SuggestionPriority getPriority() {
        return priority;
    }
    
    public void setPriority(SuggestionPriority priority) {
        this.priority = priority;
    }
    
    public SuggestionType getType() {
        return type;
    }
    
    public void setType(SuggestionType type) {
        this.type = type;
    }
    
    public SuggestionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SuggestionStatus status) {
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