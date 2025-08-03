package com.hrm.system.controller;

import com.hrm.system.dto.ProjectDto;
import com.hrm.system.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * Get all projects
     */
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        try {
            ProjectDto project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get projects by employee ID
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByEmployee(@PathVariable Long employeeId) {
        List<ProjectDto> projects = projectService.getProjectsByEmployee(employeeId);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Create a new project
     */
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        try {
            ProjectDto createdProject = projectService.createProject(projectDto);
            return ResponseEntity.ok(createdProject);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update an existing project
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody ProjectDto projectDto) {
        try {
            ProjectDto updatedProject = projectService.updateProject(id, projectDto);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete a project
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get projects by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProjectDto>> getProjectsByStatus(@PathVariable String status) {
        List<ProjectDto> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Get active projects
     */
    @GetMapping("/active")
    public ResponseEntity<List<ProjectDto>> getActiveProjects() {
        List<ProjectDto> projects = projectService.getActiveProjects();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Get projects by employee and status
     */
    @GetMapping("/employee/{employeeId}/status/{status}")
    public ResponseEntity<List<ProjectDto>> getProjectsByEmployeeAndStatus(
            @PathVariable Long employeeId, 
            @PathVariable String status) {
        List<ProjectDto> projects = projectService.getProjectsByEmployeeAndStatus(employeeId, status);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Count projects by employee
     */
    @GetMapping("/employee/{employeeId}/count")
    public ResponseEntity<Long> countProjectsByEmployee(@PathVariable Long employeeId) {
        long count = projectService.countProjectsByEmployee(employeeId);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Count active projects by employee
     */
    @GetMapping("/employee/{employeeId}/active/count")
    public ResponseEntity<Long> countActiveProjectsByEmployee(@PathVariable Long employeeId) {
        long count = projectService.countActiveProjectsByEmployee(employeeId);
        return ResponseEntity.ok(count);
    }
} 