import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Performance {
  id: number;
  userId: number;
  employeeName: string;
  employeeId: string;
  reviewType: ReviewType;
  reviewPeriod: string;
  goals: string;
  achievements: string;
  rating: number;
  comments: string;
  status: PerformanceStatus;
  reviewedBy?: number;
  reviewedByName?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReviewType {
  SELF = 'SELF',
  MANAGER = 'MANAGER',
  PEER = 'PEER',
  ANNUAL = 'ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY'
}

export enum PerformanceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface PerformanceStatistics {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  averageRating: number;
  highPerformers: number;
}

export interface CreatePerformanceRequest {
  userId: number;
  reviewType: ReviewType;
  reviewPeriod: string;
  goals: string;
  achievements: string;
  rating: number;
  comments: string;
}

export interface PerformanceFilters {
  userId?: number;
  reviewType?: ReviewType;
  status?: PerformanceStatus;
  reviewPeriod?: string;
  department?: string;
}

export interface PaginatedPerformanceResponse {
  content: Performance[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl = `${environment.apiUrl}/performance`;

  constructor(private http: HttpClient) { }

  // Get all performance records with pagination and filters
  getPerformance(page: number = 0, size: number = 10, filters?: PerformanceFilters): Observable<PaginatedPerformanceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.userId) {
        params = params.set('userId', filters.userId.toString());
      }
      if (filters.reviewType) {
        params = params.set('reviewType', filters.reviewType);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.reviewPeriod) {
        params = params.set('reviewPeriod', filters.reviewPeriod);
      }
      if (filters.department) {
        params = params.set('department', filters.department);
      }
    }

    return this.http.get<PaginatedPerformanceResponse>(this.apiUrl, { params });
  }

  // Get performance by ID
  getPerformanceById(id: number): Observable<Performance> {
    return this.http.get<Performance>(`${this.apiUrl}/${id}`);
  }

  // Get performance by user
  getPerformanceByUser(userId: number): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get performance by review type
  getPerformanceByReviewType(reviewType: ReviewType): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/review-type/${reviewType}`);
  }

  // Get performance by status
  getPerformanceByStatus(status: PerformanceStatus): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/status/${status}`);
  }

  // Create performance record
  createPerformance(performanceData: CreatePerformanceRequest): Observable<Performance> {
    return this.http.post<Performance>(this.apiUrl, performanceData);
  }

  // Update performance record
  updatePerformance(id: number, performanceData: Partial<Performance>): Observable<Performance> {
    return this.http.put<Performance>(`${this.apiUrl}/${id}`, performanceData);
  }

  // Submit performance review
  submitPerformance(id: number): Observable<Performance> {
    return this.http.patch<Performance>(`${this.apiUrl}/${id}/submit`, {});
  }

  // Review performance
  reviewPerformance(id: number, reviewData: any): Observable<Performance> {
    return this.http.patch<Performance>(`${this.apiUrl}/${id}/review`, reviewData);
  }

  // Approve performance
  approvePerformance(id: number): Observable<Performance> {
    return this.http.patch<Performance>(`${this.apiUrl}/${id}/approve`, {});
  }

  // Reject performance
  rejectPerformance(id: number, reason: string): Observable<Performance> {
    return this.http.patch<Performance>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  // Delete performance record
  deletePerformance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get performance statistics
  getPerformanceStatistics(): Observable<PerformanceStatistics> {
    return this.http.get<PerformanceStatistics>(`${this.apiUrl}/statistics`);
  }

  // Get user performance statistics
  getUserPerformanceStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/user/${userId}`);
  }

  // Get high performers
  getHighPerformers(limit: number = 10): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/high-performers`, {
      params: new HttpParams().set('limit', limit.toString())
    });
  }

  // Get performance by department
  getPerformanceByDepartment(department: string): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.apiUrl}/department/${department}`);
  }

  // Helper method to get review type display name
  getReviewTypeDisplayName(reviewType: ReviewType): string {
    switch (reviewType) {
      case ReviewType.SELF:
        return 'Self Review';
      case ReviewType.MANAGER:
        return 'Manager Review';
      case ReviewType.PEER:
        return 'Peer Review';
      case ReviewType.ANNUAL:
        return 'Annual Review';
      case ReviewType.QUARTERLY:
        return 'Quarterly Review';
      case ReviewType.MONTHLY:
        return 'Monthly Review';
      default:
        return reviewType;
    }
  }

  // Helper method to get status display name
  getStatusDisplayName(status: PerformanceStatus): string {
    switch (status) {
      case PerformanceStatus.DRAFT:
        return 'Draft';
      case PerformanceStatus.SUBMITTED:
        return 'Submitted';
      case PerformanceStatus.UNDER_REVIEW:
        return 'Under Review';
      case PerformanceStatus.COMPLETED:
        return 'Completed';
      case PerformanceStatus.APPROVED:
        return 'Approved';
      case PerformanceStatus.REJECTED:
        return 'Rejected';
      default:
        return status;
    }
  }

  // Helper method to get status color
  getStatusColor(status: PerformanceStatus): string {
    switch (status) {
      case PerformanceStatus.DRAFT:
        return 'secondary';
      case PerformanceStatus.SUBMITTED:
        return 'info';
      case PerformanceStatus.UNDER_REVIEW:
        return 'warning';
      case PerformanceStatus.COMPLETED:
        return 'success';
      case PerformanceStatus.APPROVED:
        return 'success';
      case PerformanceStatus.REJECTED:
        return 'danger';
      default:
        return 'light';
    }
  }

  // Helper method to get rating display
  getRatingDisplay(rating: number): string {
    if (rating >= 4.5) return 'Outstanding';
    if (rating >= 4.0) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Satisfactory';
    if (rating >= 2.5) return 'Needs Improvement';
    return 'Poor';
  }

  // Helper method to get rating color
  getRatingColor(rating: number): string {
    if (rating >= 4.5) return 'success';
    if (rating >= 4.0) return 'success';
    if (rating >= 3.5) return 'info';
    if (rating >= 3.0) return 'warning';
    if (rating >= 2.5) return 'warning';
    return 'danger';
  }

  // Helper method to format date
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Helper method to check if performance is draft
  isDraft(performance: Performance): boolean {
    return performance.status === PerformanceStatus.DRAFT;
  }

  // Helper method to check if performance is submitted
  isSubmitted(performance: Performance): boolean {
    return performance.status === PerformanceStatus.SUBMITTED;
  }

  // Helper method to check if performance is under review
  isUnderReview(performance: Performance): boolean {
    return performance.status === PerformanceStatus.UNDER_REVIEW;
  }

  // Helper method to check if performance is completed
  isCompleted(performance: Performance): boolean {
    return performance.status === PerformanceStatus.COMPLETED;
  }

  // Helper method to check if performance is approved
  isApproved(performance: Performance): boolean {
    return performance.status === PerformanceStatus.APPROVED;
  }

  // Helper method to check if performance is rejected
  isRejected(performance: Performance): boolean {
    return performance.status === PerformanceStatus.REJECTED;
  }

  // Helper method to check if performance can be submitted
  canBeSubmitted(performance: Performance): boolean {
    return performance.status === PerformanceStatus.DRAFT;
  }

  // Helper method to check if performance can be reviewed
  canBeReviewed(performance: Performance): boolean {
    return performance.status === PerformanceStatus.SUBMITTED || 
           performance.status === PerformanceStatus.UNDER_REVIEW;
  }
} 