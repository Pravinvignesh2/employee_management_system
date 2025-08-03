package com.hrm.system.dto;

import com.hrm.system.entity.Document;
import java.time.LocalDateTime;

public class DocumentDto {
    
    private Long id;
    private String name;
    private String type;
    private String description;
    private LocalDateTime uploadDate;
    private LocalDateTime expiryDate;
    private String filePath;
    private Long fileSize;
    private Long userId;
    private String userName;
    
    // Constructors
    public DocumentDto() {}
    
    public DocumentDto(Document document) {
        this.id = document.getId();
        this.name = document.getName();
        this.type = document.getType();
        this.description = document.getDescription();
        this.uploadDate = document.getUploadDate();
        this.expiryDate = document.getExpiryDate();
        this.filePath = document.getFilePath();
        this.fileSize = document.getFileSize();
        this.userId = document.getUser().getId();
        this.userName = document.getUser().getFullName();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
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
} 