package com.hrm.system.service;

import com.hrm.system.dto.ProjectDto;

import java.util.List;

public interface ProjectService {
    
    /**
     * Get all projects
     */
    List<ProjectDto> getAllProjects();
    
    /**
     * Get project by ID
     */
    ProjectDto getProjectById(Long id);
    
    /**
     * Get projects by employee ID
     */
    List<ProjectDto> getProjectsByEmployee(Long employeeId);
    
    /**
     * Create a new project
     */
    ProjectDto createProject(ProjectDto projectDto);
    
    /**
     * Update an existing project
     */
    ProjectDto updateProject(Long id, ProjectDto projectDto);
    
    /**
     * Delete a project
     */
    void deleteProject(Long id);
    
    /**
     * Get projects by status
     */
    List<ProjectDto> getProjectsByStatus(String status);
    
    /**
     * Get active projects
     */
    List<ProjectDto> getActiveProjects();
    
    /**
     * Get projects by employee and status
     */
    List<ProjectDto> getProjectsByEmployeeAndStatus(Long employeeId, String status);
    
    /**
     * Count projects by employee
     */
    long countProjectsByEmployee(Long employeeId);
    
    /**
     * Count active projects by employee
     */
    long countActiveProjectsByEmployee(Long employeeId);
} 