package com.hrm.system.service;

import com.hrm.system.dto.DocumentDto;
import java.util.List;
import java.util.Optional;

public interface DocumentService {
    
    /**
     * Create a new document
     */
    DocumentDto createDocument(DocumentDto documentDto);
    
    /**
     * Get document by ID
     */
    Optional<DocumentDto> getDocumentById(Long id);
    
    /**
     * Update document
     */
    DocumentDto updateDocument(Long id, DocumentDto documentDto);
    
    /**
     * Delete document
     */
    void deleteDocument(Long id);
    
    /**
     * Get documents by user ID
     */
    List<DocumentDto> getDocumentsByUser(Long userId);
    
    /**
     * Get documents by type
     */
    List<DocumentDto> getDocumentsByType(String type);
    
    /**
     * Get documents by user and type
     */
    List<DocumentDto> getDocumentsByUserAndType(Long userId, String type);
    
    /**
     * Search documents by name
     */
    List<DocumentDto> searchDocumentsByName(String searchTerm);
    
    /**
     * Search documents by user and name
     */
    List<DocumentDto> searchDocumentsByUserAndName(Long userId, String searchTerm);
    
    /**
     * Check if user owns the document
     */
    boolean isOwner(Long documentId, Long userId);
} 