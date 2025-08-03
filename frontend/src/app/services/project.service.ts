import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  role: string;
  startDate: Date;
  endDate: Date;
  priority?: string;
  budget?: number;
  employeeId: number;
  employeeName: string;
  assignedDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  private convertToProject(dto: any): Project {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      role: dto.role,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
      priority: dto.priority,
      budget: dto.budget,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      assignedDate: new Date(dto.assignedDate)
    };
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(projects => {
        const convertedProjects = projects.map(dto => this.convertToProject(dto));
        this.projectsSubject.next(convertedProjects);
      }),
      map(projects => projects.map(dto => this.convertToProject(dto)))
    );
  }

  getProjectsByEmployee(employeeId: number): Observable<Project[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      tap(projects => {
        const convertedProjects = projects.map(dto => this.convertToProject(dto));
        // Update the subject with all projects for this employee
        const currentProjects = this.projectsSubject.value;
        const otherProjects = currentProjects.filter(p => p.employeeId !== employeeId);
        this.projectsSubject.next([...otherProjects, ...convertedProjects]);
      }),
      map(projects => projects.map(dto => this.convertToProject(dto)))
    );
  }

  addProject(project: Omit<Project, 'id' | 'assignedDate'>): Observable<Project> {
    const projectDto = {
      name: project.name,
      description: project.description,
      status: project.status,
      role: project.role,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : null,
      priority: project.priority,
      budget: project.budget,
      employeeId: project.employeeId
    };

    return this.http.post<any>(this.apiUrl, projectDto).pipe(
      tap(newProject => {
        const convertedProject = this.convertToProject(newProject);
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next([...currentProjects, convertedProject]);
      }),
      map(dto => this.convertToProject(dto))
    );
  }

  updateProject(projectId: number, updates: Partial<Project>): Observable<Project> {
    const updateDto = {
      name: updates.name,
      description: updates.description,
      status: updates.status,
      role: updates.role,
      startDate: updates.startDate ? updates.startDate.toISOString().split('T')[0] : null,
      endDate: updates.endDate ? updates.endDate.toISOString().split('T')[0] : null,
      priority: updates.priority,
      budget: updates.budget
    };

    return this.http.put<any>(`${this.apiUrl}/${projectId}`, updateDto).pipe(
      tap(updatedProject => {
        const convertedProject = this.convertToProject(updatedProject);
        const currentProjects = this.projectsSubject.value;
        const updatedProjects = currentProjects.map(project => 
          project.id === projectId ? convertedProject : project
        );
        this.projectsSubject.next(updatedProjects);
      }),
      map(dto => this.convertToProject(dto))
    );
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`).pipe(
      tap(() => {
        const currentProjects = this.projectsSubject.value;
        const filteredProjects = currentProjects.filter(project => project.id !== projectId);
        this.projectsSubject.next(filteredProjects);
      })
    );
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}`).pipe(
      map(dto => this.convertToProject(dto))
    );
  }
} 