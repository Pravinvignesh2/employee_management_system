import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Leave, 
  LeaveType, 
  LeaveStatus, 
  LeaveStatistics, 
  UserLeaveStatistics,
  LeaveRequest,
  LeaveApproval,
  LeaveRejection,
  LeaveFilters,
  PaginatedLeaveResponse,
  LeaveNotification,
  LeaveBalance
} from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) { }

  // CRUD Operations
  createLeave(leaveRequest: LeaveRequest): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leaveRequest);
  }

  updateLeave(id: number, leaveRequest: Partial<LeaveRequest>): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}`, leaveRequest);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/${id}`);
  }

  // Get Leave Records
  getAllLeaves(page: number = 0, size: number = 10, filters?: LeaveFilters): Observable<PaginatedLeaveResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.userId) {
        params = params.set('userId', filters.userId.toString());
      }
      if (filters.leaveType) {
        params = params.set('leaveType', filters.leaveType);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.searchQuery) {
        params = params.set('query', filters.searchQuery);
      }
    }

    return this.http.get<PaginatedLeaveResponse>(this.apiUrl, { params });
  }

  getLeavesByUser(userId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/user/${userId}`);
  }

  getLeavesByStatus(status: LeaveStatus): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/status/${status}`);
  }

  getLeavesByType(leaveType: LeaveType): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/type/${leaveType}`);
  }

  // Approval Operations
  approveLeave(id: number, approval: LeaveApproval): Observable<Leave> {
    return this.http.patch<Leave>(`${this.apiUrl}/${id}/approve`, approval);
  }

  rejectLeave(id: number, rejection: LeaveRejection): Observable<Leave> {
    const params = new HttpParams().set('reason', rejection.rejectionReason);
    return this.http.patch<Leave>(`${this.apiUrl}/${id}/reject`, {}, { params });
  }

  cancelLeave(id: number): Observable<Leave> {
    return this.http.patch<Leave>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Statistics Operations
  getLeaveStatistics(): Observable<LeaveStatistics> {
    return this.http.get<LeaveStatistics>(`${this.apiUrl}/statistics`);
  }

  getUserLeaveStatistics(userId: number): Observable<UserLeaveStatistics> {
    return this.http.get<UserLeaveStatistics>(`${this.apiUrl}/statistics/user/${userId}`);
  }

  getPendingLeavesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/pending`);
  }

  getApprovedLeavesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/approved`);
  }

  getRejectedLeavesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/rejected`);
  }

  // Helper Methods
  getCurrentUserLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/current-user`);
  }

  getCurrentUserLeaveStatistics(): Observable<UserLeaveStatistics> {
    return this.http.get<UserLeaveStatistics>(`${this.apiUrl}/statistics/current-user`);
  }

  createLeaveForCurrentUser(leaveRequest: Omit<LeaveRequest, 'userId'>): Observable<Leave> {
    const currentUserId = this.getCurrentUserId();
    const fullRequest: LeaveRequest = {
      ...leaveRequest,
      userId: currentUserId
    };
    return this.createLeave(fullRequest);
  }

  approveLeaveForCurrentUser(id: number): Observable<Leave> {
    const currentUserId = this.getCurrentUserId();
    const approval: LeaveApproval = {
      id,
      approvedBy: currentUserId
    };
    return this.approveLeave(id, approval);
  }

  rejectLeaveForCurrentUser(id: number, rejectionReason: string): Observable<Leave> {
    const currentUserId = this.getCurrentUserId();
    const rejection: LeaveRejection = {
      id,
      rejectedBy: currentUserId,
      rejectionReason
    };
    return this.rejectLeave(id, rejection);
  }

  // Private helper method to get current user ID
  private getCurrentUserId(): number {
    const userStr = localStorage.getItem(environment.auth.userKey);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return 0;
  }

  // Utility Methods
  getLeaveTypeDisplay(type: LeaveType): string {
    switch (type) {
      case LeaveType.ANNUAL:
        return 'Annual Leave';
      case LeaveType.SICK:
        return 'Sick Leave';
      case LeaveType.PERSONAL:
        return 'Personal Leave';
      case LeaveType.MATERNITY:
        return 'Maternity Leave';
      case LeaveType.PATERNITY:
        return 'Paternity Leave';
      case LeaveType.BEREAVEMENT:
        return 'Bereavement Leave';
      case LeaveType.UNPAID:
        return 'Unpaid Leave';
      default:
        return type;
    }
  }

  getLeaveTypeColor(type: LeaveType): string {
    switch (type) {
      case LeaveType.ANNUAL:
        return 'primary';
      case LeaveType.SICK:
        return 'danger';
      case LeaveType.PERSONAL:
        return 'info';
      case LeaveType.MATERNITY:
        return 'success';
      case LeaveType.PATERNITY:
        return 'success';
      case LeaveType.BEREAVEMENT:
        return 'secondary';
      case LeaveType.UNPAID:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getLeaveStatusDisplay(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING:
        return 'Pending';
      case LeaveStatus.APPROVED:
        return 'Approved';
      case LeaveStatus.REJECTED:
        return 'Rejected';
      case LeaveStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  }

  getLeaveStatusColor(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING:
        return 'warning';
      case LeaveStatus.APPROVED:
        return 'success';
      case LeaveStatus.REJECTED:
        return 'danger';
      case LeaveStatus.CANCELLED:
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  calculateLeaveDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  }

  // Validation Methods
  isLeaveOverlapping(startDate: string, endDate: string, existingLeaves: Leave[]): boolean {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    
    return existingLeaves.some(leave => {
      if (leave.status === LeaveStatus.REJECTED || leave.status === LeaveStatus.CANCELLED) {
        return false;
      }
      
      const existingStart = new Date(leave.startDate);
      const existingEnd = new Date(leave.endDate);
      
      return (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }

  validateLeaveRequest(leaveRequest: LeaveRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!leaveRequest.startDate) {
      errors.push('Start date is required');
    }
    
    if (!leaveRequest.endDate) {
      errors.push('End date is required');
    }
    
    if (leaveRequest.startDate && leaveRequest.endDate) {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      
      if (start > end) {
        errors.push('Start date cannot be after end date');
      }
      
      if (start < new Date()) {
        errors.push('Start date cannot be in the past');
      }
    }
    
    if (!leaveRequest.reason || leaveRequest.reason.trim().length < 10) {
      errors.push('Reason must be at least 10 characters long');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 