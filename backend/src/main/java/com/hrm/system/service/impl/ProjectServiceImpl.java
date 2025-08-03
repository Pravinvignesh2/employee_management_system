package com.hrm.system.service.impl;

import com.hrm.system.dto.ProjectDto;
import com.hrm.system.entity.Project;
import com.hrm.system.entity.User;
import com.hrm.system.repository.ProjectRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return new ProjectDto(project);
    }
    
    @Override
    public List<ProjectDto> getProjectsByEmployee(Long employeeId) {
        return projectRepository.findByEmployeeId(employeeId).stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        User employee = userRepository.findById(projectDto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + projectDto.getEmployeeId()));
        
        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setStatus(projectDto.getStatus());
        project.setRole(projectDto.getRole());
        project.setStartDate(projectDto.getStartDate());
        project.setEndDate(projectDto.getEndDate());
        project.setPriority(projectDto.getPriority());
        project.setBudget(projectDto.getBudget());
        project.setEmployee(employee);
        
        Project savedProject = projectRepository.save(project);
        return new ProjectDto(savedProject);
    }
    
    @Override
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        if (projectDto.getName() != null) {
            project.setName(projectDto.getName());
        }
        if (projectDto.getDescription() != null) {
            project.setDescription(projectDto.getDescription());
        }
        if (projectDto.getStatus() != null) {
            project.setStatus(projectDto.getStatus());
        }
        if (projectDto.getRole() != null) {
            project.setRole(projectDto.getRole());
        }
        if (projectDto.getStartDate() != null) {
            project.setStartDate(projectDto.getStartDate());
        }
        if (projectDto.getEndDate() != null) {
            project.setEndDate(projectDto.getEndDate());
        }
        if (projectDto.getPriority() != null) {
            project.setPriority(projectDto.getPriority());
        }
        if (projectDto.getBudget() != null) {
            project.setBudget(projectDto.getBudget());
        }
        
        Project updatedProject = projectRepository.save(project);
        return new ProjectDto(updatedProject);
    }
    
    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    @Override
    public List<ProjectDto> getProjectsByStatus(String status) {
        return projectRepository.findByStatus(status).stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProjectDto> getActiveProjects() {
        return projectRepository.findActiveProjects().stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProjectDto> getProjectsByEmployeeAndStatus(Long employeeId, String status) {
        return projectRepository.findByEmployeeIdAndStatus(employeeId, status).stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countProjectsByEmployee(Long employeeId) {
        return projectRepository.countByEmployeeId(employeeId);
    }
    
    @Override
    public long countActiveProjectsByEmployee(Long employeeId) {
        return projectRepository.countActiveProjectsByEmployee(employeeId);
    }
} 