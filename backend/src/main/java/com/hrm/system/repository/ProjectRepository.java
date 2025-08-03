package com.hrm.system.repository;

import com.hrm.system.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    /**
     * Find all projects assigned to a specific employee
     */
    List<Project> findByEmployeeId(Long employeeId);
    
    /**
     * Find all projects by status
     */
    List<Project> findByStatus(String status);
    
    /**
     * Find all active projects
     */
    @Query("SELECT p FROM Project p WHERE p.status = 'active'")
    List<Project> findActiveProjects();
    
    /**
     * Find projects by employee and status
     */
    List<Project> findByEmployeeIdAndStatus(Long employeeId, String status);
    
    /**
     * Find projects by priority
     */
    List<Project> findByPriority(String priority);
    
    /**
     * Find projects by employee and priority
     */
    List<Project> findByEmployeeIdAndPriority(Long employeeId, String priority);
    
    /**
     * Count projects by employee
     */
    long countByEmployeeId(Long employeeId);
    
    /**
     * Count active projects by employee
     */
    @Query("SELECT COUNT(p) FROM Project p WHERE p.employee.id = :employeeId AND p.status = 'active'")
    long countActiveProjectsByEmployee(@Param("employeeId") Long employeeId);
} 