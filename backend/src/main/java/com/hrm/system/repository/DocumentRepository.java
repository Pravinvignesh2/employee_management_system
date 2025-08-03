package com.hrm.system.repository;

import com.hrm.system.entity.Document;
import com.hrm.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    /**
     * Find documents by user
     */
    List<Document> findByUserOrderByUploadDateDesc(User user);
    
    /**
     * Find documents by user ID
     */
    @Query("SELECT d FROM Document d WHERE d.user.id = :userId ORDER BY d.uploadDate DESC")
    List<Document> findByUserIdOrderByUploadDateDesc(@Param("userId") Long userId);
    
    /**
     * Find documents by type
     */
    List<Document> findByTypeOrderByUploadDateDesc(String type);
    
    /**
     * Find documents by user and type
     */
    @Query("SELECT d FROM Document d WHERE d.user.id = :userId AND d.type = :type ORDER BY d.uploadDate DESC")
    List<Document> findByUserIdAndTypeOrderByUploadDateDesc(@Param("userId") Long userId, @Param("type") String type);
    
    /**
     * Count documents by user
     */
    long countByUser(User user);
    
    /**
     * Count documents by user ID
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    /**
     * Find documents by name containing search term
     */
    @Query("SELECT d FROM Document d WHERE d.name LIKE %:searchTerm% ORDER BY d.uploadDate DESC")
    List<Document> findByNameContainingIgnoreCaseOrderByUploadDateDesc(@Param("searchTerm") String searchTerm);
    
    /**
     * Find documents by user and name containing search term
     */
    @Query("SELECT d FROM Document d WHERE d.user.id = :userId AND d.name LIKE %:searchTerm% ORDER BY d.uploadDate DESC")
    List<Document> findByUserIdAndNameContainingIgnoreCaseOrderByUploadDateDesc(@Param("userId") Long userId, @Param("searchTerm") String searchTerm);
} 