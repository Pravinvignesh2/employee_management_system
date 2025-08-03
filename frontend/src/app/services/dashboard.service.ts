import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { LeaveService } from './leave.service';
import { PerformanceService } from './performance.service';

export interface DashboardActivity {
  id: string;
  type: 'USER_CREATED' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'PERFORMANCE_REVIEW' | 'ATTENDANCE_MARKED';
  title: string;
  description: string;
  timestamp: Date;
  userId?: number;
  userName?: string;
  relatedId?: number;
  icon?: string;
}

export interface RecentActivitiesResponse {
  activities: DashboardActivity[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private leaveService: LeaveService,
    private performanceService: PerformanceService
  ) { }

  // Get recent activities from backend
  getRecentActivities(limit: number = 10): Observable<DashboardActivity[]> {
    return this.http.get<RecentActivitiesResponse>(`${this.apiUrl}/activities?limit=${limit}`)
      .pipe(
        map(response => response.activities)
      );
  }

  // Fallback method to aggregate activities from different services
  getRecentActivitiesFallback(limit: number = 10): Observable<DashboardActivity[]> {
    return forkJoin({
      recentUsers: this.userService.getUsers(0, 5), // Get recent users
      recentLeaves: this.leaveService.getAllLeaves(0, 5), // Get recent leaves
      recentPerformance: this.performanceService.getPerformance(0, 5) // Get recent performance reviews
    }).pipe(
      map(({ recentUsers, recentLeaves, recentPerformance }) => {
        const activities: DashboardActivity[] = [];

        // Add recent user activities
        recentUsers.content.forEach(user => {
          activities.push({
            id: `user-${user.id}`,
            type: 'USER_CREATED',
            title: 'New Employee Added',
            description: `${user.firstName} ${user.lastName} joined the company`,
            timestamp: new Date(user.createdAt || new Date()),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            icon: 'person_add'
          });
        });

        // Add recent leave activities
        recentLeaves.content.forEach(leave => {
          if (leave.status === 'APPROVED') {
            activities.push({
              id: `leave-${leave.id}`,
              type: 'LEAVE_APPROVED',
              title: 'Leave Request Approved',
              description: `Leave request approved for ${leave.employeeName || 'Employee'}`,
              timestamp: new Date(leave.updatedAt || new Date()),
              userId: leave.userId,
              userName: leave.employeeName,
              relatedId: leave.id,
              icon: 'check_circle'
            });
          } else if (leave.status === 'REJECTED') {
            activities.push({
              id: `leave-${leave.id}`,
              type: 'LEAVE_REJECTED',
              title: 'Leave Request Rejected',
              description: `Leave request rejected for ${leave.employeeName || 'Employee'}`,
              timestamp: new Date(leave.updatedAt || new Date()),
              userId: leave.userId,
              userName: leave.employeeName,
              relatedId: leave.id,
              icon: 'cancel'
            });
          }
        });

        // Add recent performance review activities
        recentPerformance.content.forEach(performance => {
          if (performance.status === 'COMPLETED' || performance.status === 'APPROVED') {
            activities.push({
              id: `performance-${performance.id}`,
              type: 'PERFORMANCE_REVIEW',
              title: 'Performance Review Completed',
              description: `Performance review completed for ${performance.employeeName}`,
              timestamp: new Date(performance.reviewedAt || performance.updatedAt || new Date()),
              userId: performance.userId,
              userName: performance.employeeName,
              relatedId: performance.id,
              icon: 'assessment'
            });
          }
        });

        // Sort by timestamp (most recent first) and limit
        return activities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      })
    );
  }

  // Get dashboard statistics
  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  // Get user-specific activities
  getUserActivities(userId: number, limit: number = 10): Observable<DashboardActivity[]> {
    return this.http.get<RecentActivitiesResponse>(`${this.apiUrl}/activities/user/${userId}?limit=${limit}`)
      .pipe(
        map(response => response.activities)
      );
  }

  // Get department-specific activities
  getDepartmentActivities(department: string, limit: number = 10): Observable<DashboardActivity[]> {
    return this.http.get<RecentActivitiesResponse>(`${this.apiUrl}/activities/department/${department}?limit=${limit}`)
      .pipe(
        map(response => response.activities)
      );
  }
} 