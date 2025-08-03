package com.hrm.system.controller;

import com.hrm.system.dto.DocumentDto;
import com.hrm.system.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Document management
 */
@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document Management", description = "APIs for managing employee documents")
@CrossOrigin(origins = "*")
public class DocumentController {
    
    @Autowired
    private DocumentService documentService;
    
    /**
     * Create a new document
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Create a new document", description = "Create a new document for an employee")
    public ResponseEntity<DocumentDto> createDocument(@Valid @RequestBody DocumentDto documentDto) {
        DocumentDto createdDocument = documentService.createDocument(documentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
    }
    
    /**
     * Get document by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @documentService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Get document by ID", description = "Get document details by document ID")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update document
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Update document", description = "Update document information")
    public ResponseEntity<DocumentDto> updateDocument(@PathVariable Long id, @Valid @RequestBody DocumentDto documentDto) {
        try {
            DocumentDto updatedDocument = documentService.updateDocument(id, documentDto);
            return ResponseEntity.ok(updatedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete document
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#id, authentication.principal.id)")
    @Operation(summary = "Delete document", description = "Delete a document")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get documents by user ID
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get documents by user", description = "Get all documents for a specific user")
    public ResponseEntity<List<DocumentDto>> getDocumentsByUser(@PathVariable Long userId) {
        List<DocumentDto> documents = documentService.getDocumentsByUser(userId);
        return ResponseEntity.ok(documents);
    }
    
    /**
     * Get documents by type
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get documents by type", description = "Get all documents of a specific type")
    public ResponseEntity<List<DocumentDto>> getDocumentsByType(@PathVariable String type) {
        List<DocumentDto> documents = documentService.getDocumentsByType(type);
        return ResponseEntity.ok(documents);
    }
    
    /**
     * Get documents by user and type
     */
    @GetMapping("/user/{userId}/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Get documents by user and type", description = "Get documents for a specific user and type")
    public ResponseEntity<List<DocumentDto>> getDocumentsByUserAndType(@PathVariable Long userId, @PathVariable String type) {
        List<DocumentDto> documents = documentService.getDocumentsByUserAndType(userId, type);
        return ResponseEntity.ok(documents);
    }
    
    /**
     * Search documents by name
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Search documents by name", description = "Search documents by name containing search term")
    public ResponseEntity<List<DocumentDto>> searchDocumentsByName(@RequestParam String query) {
        List<DocumentDto> documents = documentService.searchDocumentsByName(query);
        return ResponseEntity.ok(documents);
    }
    
    /**
     * Search documents by user and name
     */
    @GetMapping("/user/{userId}/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @Operation(summary = "Search documents by user and name", description = "Search documents for a specific user by name")
    public ResponseEntity<List<DocumentDto>> searchDocumentsByUserAndName(@PathVariable Long userId, @RequestParam String query) {
        List<DocumentDto> documents = documentService.searchDocumentsByUserAndName(userId, query);
        return ResponseEntity.ok(documents);
    }
} 