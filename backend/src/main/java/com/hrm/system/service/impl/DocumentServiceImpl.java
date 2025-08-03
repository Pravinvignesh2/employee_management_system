package com.hrm.system.service.impl;

import com.hrm.system.dto.DocumentDto;
import com.hrm.system.entity.Document;
import com.hrm.system.entity.User;
import com.hrm.system.repository.DocumentRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public DocumentDto createDocument(DocumentDto documentDto) {
        User user = userRepository.findById(documentDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + documentDto.getUserId()));
        
        Document document = new Document();
        document.setName(documentDto.getName());
        document.setType(documentDto.getType());
        document.setDescription(documentDto.getDescription());
        document.setExpiryDate(documentDto.getExpiryDate());
        document.setFilePath(documentDto.getFilePath());
        document.setFileSize(documentDto.getFileSize());
        document.setUser(user);
        
        Document savedDocument = documentRepository.save(document);
        return new DocumentDto(savedDocument);
    }
    
    @Override
    public Optional<DocumentDto> getDocumentById(Long id) {
        return documentRepository.findById(id).map(DocumentDto::new);
    }
    
    @Override
    public DocumentDto updateDocument(Long id, DocumentDto documentDto) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
        
        document.setName(documentDto.getName());
        document.setType(documentDto.getType());
        document.setDescription(documentDto.getDescription());
        document.setExpiryDate(documentDto.getExpiryDate());
        document.setFilePath(documentDto.getFilePath());
        document.setFileSize(documentDto.getFileSize());
        
        Document updatedDocument = documentRepository.save(document);
        return new DocumentDto(updatedDocument);
    }
    
    @Override
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document not found with ID: " + id);
        }
        documentRepository.deleteById(id);
    }
    
    @Override
    public List<DocumentDto> getDocumentsByUser(Long userId) {
        return documentRepository.findByUserIdOrderByUploadDateDesc(userId)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DocumentDto> getDocumentsByType(String type) {
        return documentRepository.findByTypeOrderByUploadDateDesc(type)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DocumentDto> getDocumentsByUserAndType(Long userId, String type) {
        return documentRepository.findByUserIdAndTypeOrderByUploadDateDesc(userId, type)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DocumentDto> searchDocumentsByName(String searchTerm) {
        return documentRepository.findByNameContainingIgnoreCaseOrderByUploadDateDesc(searchTerm)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DocumentDto> searchDocumentsByUserAndName(Long userId, String searchTerm) {
        return documentRepository.findByUserIdAndNameContainingIgnoreCaseOrderByUploadDateDesc(userId, searchTerm)
                .stream()
                .map(DocumentDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean isOwner(Long documentId, Long userId) {
        return documentRepository.findById(documentId)
                .map(document -> document.getUser().getId().equals(userId))
                .orElse(false);
    }
} 