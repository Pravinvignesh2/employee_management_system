import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PerformanceGoal {
  id?: number;
  userId: number;
  userName?: string;
  title: string;
  description: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'COMPLETED' | 'OVERDUE';
  progress: number;
  target: string;
  current: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedById?: number;
  assignedByName?: string;
  type: 'QUARTERLY' | 'ANNUAL' | 'PROJECT_BASED' | 'SKILL_DEVELOPMENT';
}

export interface Feedback {
  id?: number;
  recipientId: number;
  recipientName?: string;
  reviewerId?: number;
  reviewerName?: string;
  type: 'SELF' | 'PEER' | 'MANAGER' | 'SUBORDINATE';
  rating: number;
  comment: string;
  status?: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  reviewPeriod?: string;
  createdAt?: string;
  updatedAt?: string;
  isAnonymous?: boolean;
}

export interface Appraisal {
  id?: number;
  employeeId: number;
  employeeName?: string;
  managerId: number;
  managerName?: string;
  period: string;
  rating: number;
  achievements: string;
  improvements: string;
  goals: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  appraisalDate?: string;
  createdAt?: string;
  updatedAt?: string;
  employeeComments?: string;
  managerComments?: string;
}

export interface AISuggestion {
  id?: number;
  userId: number;
  userName?: string;
  title: string;
  description: string;
  category: 'PRODUCTIVITY' | 'CAREER_GROWTH' | 'SKILLS' | 'LEADERSHIP' | 'TEAMWORK' | 'COMMUNICATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'IMPROVEMENT' | 'OPPORTUNITY' | 'URGENT' | 'RECOMMENDATION';
  status?: 'ACTIVE' | 'IMPLEMENTED' | 'DISMISSED' | 'EXPIRED';
  createdAt?: string;
  implementedAt?: string;
  dismissedAt?: string;
  aiScore?: number;
  implementationNotes?: string;
}

export interface PerformanceStatistics {
  totalGoals?: number;
  completedGoals?: number;
  onTrackGoals?: number;
  atRiskGoals?: number;
  overdueGoals?: number;
  totalFeedback?: number;
  peerFeedback?: number;
  managerFeedback?: number;
  selfFeedback?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceManagementService {
  private apiUrl = `${environment.apiUrl}/performance`;

  constructor(private http: HttpClient) {}

  // ==================== PERFORMANCE GOALS ====================

  createGoal(goal: PerformanceGoal): Observable<PerformanceGoal> {
    return this.http.post<PerformanceGoal>(`${this.apiUrl}/goals`, goal);
  }

  updateGoal(goalId: number, goal: PerformanceGoal): Observable<PerformanceGoal> {
    return this.http.put<PerformanceGoal>(`${this.apiUrl}/goals/${goalId}`, goal);
  }

  getGoalById(goalId: number): Observable<PerformanceGoal> {
    return this.http.get<PerformanceGoal>(`${this.apiUrl}/goals/${goalId}`);
  }

  getGoalsByUser(userId: number): Observable<PerformanceGoal[]> {
    return this.http.get<PerformanceGoal[]>(`${this.apiUrl}/goals/user/${userId}`);
  }

  getGoalsByDepartment(department: string): Observable<PerformanceGoal[]> {
    return this.http.get<PerformanceGoal[]>(`${this.apiUrl}/goals/department/${department}`);
  }

  getAllGoals(): Observable<PerformanceGoal[]> {
    return this.http.get<PerformanceGoal[]>(`${this.apiUrl}/goals`);
  }

  deleteGoal(goalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/goals/${goalId}`);
  }

  getGoalStatistics(): Observable<PerformanceStatistics> {
    return this.http.get<PerformanceStatistics>(`${this.apiUrl}/goals/statistics`);
  }

  // ==================== FEEDBACK ====================

  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/feedback`, feedback);
  }

  updateFeedback(feedbackId: number, feedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/feedback/${feedbackId}`, feedback);
  }

  getFeedbackById(feedbackId: number): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.apiUrl}/feedback/${feedbackId}`);
  }

  getFeedbackByRecipient(recipientId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedback/recipient/${recipientId}`);
  }

  getFeedbackByReviewer(reviewerId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedback/reviewer/${reviewerId}`);
  }

  getFeedbackByDepartment(department: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedback/department/${department}`);
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/feedback`);
  }

  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/feedback/${feedbackId}`);
  }

  getFeedbackStatistics(): Observable<PerformanceStatistics> {
    return this.http.get<PerformanceStatistics>(`${this.apiUrl}/feedback/statistics`);
  }

  // ==================== APPRAISALS ====================

  createAppraisal(appraisal: Appraisal): Observable<Appraisal> {
    return this.http.post<Appraisal>(`${this.apiUrl}/appraisals`, appraisal);
  }

  updateAppraisal(appraisalId: number, appraisal: Appraisal): Observable<Appraisal> {
    return this.http.put<Appraisal>(`${this.apiUrl}/appraisals/${appraisalId}`, appraisal);
  }

  getAppraisalById(appraisalId: number): Observable<Appraisal> {
    return this.http.get<Appraisal>(`${this.apiUrl}/appraisals/${appraisalId}`);
  }

  getAppraisalsByEmployee(employeeId: number): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.apiUrl}/appraisals/employee/${employeeId}`);
  }

  getAppraisalsByManager(managerId: number): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.apiUrl}/appraisals/manager/${managerId}`);
  }

  getAppraisalsByDepartment(department: string): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.apiUrl}/appraisals/department/${department}`);
  }

  getAllAppraisals(): Observable<Appraisal[]> {
    return this.http.get<Appraisal[]>(`${this.apiUrl}/appraisals`);
  }

  deleteAppraisal(appraisalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appraisals/${appraisalId}`);
  }

  getAppraisalStatistics(): Observable<PerformanceStatistics> {
    return this.http.get<PerformanceStatistics>(`${this.apiUrl}/appraisals/statistics`);
  }

  // ==================== AI SUGGESTIONS ====================

  createSuggestion(suggestion: AISuggestion): Observable<AISuggestion> {
    return this.http.post<AISuggestion>(`${this.apiUrl}/suggestions`, suggestion);
  }

  updateSuggestion(suggestionId: number, suggestion: AISuggestion): Observable<AISuggestion> {
    return this.http.put<AISuggestion>(`${this.apiUrl}/suggestions/${suggestionId}`, suggestion);
  }

  getSuggestionById(suggestionId: number): Observable<AISuggestion> {
    return this.http.get<AISuggestion>(`${this.apiUrl}/suggestions/${suggestionId}`);
  }

  getSuggestionsByUser(userId: number): Observable<AISuggestion[]> {
    return this.http.get<AISuggestion[]>(`${this.apiUrl}/suggestions/user/${userId}`);
  }

  getSuggestionsByDepartment(department: string): Observable<AISuggestion[]> {
    return this.http.get<AISuggestion[]>(`${this.apiUrl}/suggestions/department/${department}`);
  }

  getAllSuggestions(): Observable<AISuggestion[]> {
    return this.http.get<AISuggestion[]>(`${this.apiUrl}/suggestions`);
  }

  deleteSuggestion(suggestionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/suggestions/${suggestionId}`);
  }

  implementSuggestion(suggestionId: number, notes: string): Observable<AISuggestion> {
    return this.http.post<AISuggestion>(`${this.apiUrl}/suggestions/${suggestionId}/implement`, { notes });
  }

  dismissSuggestion(suggestionId: number): Observable<AISuggestion> {
    return this.http.post<AISuggestion>(`${this.apiUrl}/suggestions/${suggestionId}/dismiss`, {});
  }

  getSuggestionStatistics(): Observable<PerformanceStatistics> {
    return this.http.get<PerformanceStatistics>(`${this.apiUrl}/suggestions/statistics`);
  }

  // ==================== REPORTS ====================

  getPerformanceReport(department: string, period?: string): Observable<any> {
    let url = `${this.apiUrl}/reports/department/${department}`;
    if (period) {
      url += `?period=${period}`;
    }
    return this.http.get<any>(url);
  }

  getTeamPerformanceReport(managerId: number, period?: string): Observable<any> {
    let url = `${this.apiUrl}/reports/team/${managerId}`;
    if (period) {
      url += `?period=${period}`;
    }
    return this.http.get<any>(url);
  }

  getCompanyWidePerformanceReport(period?: string): Observable<any> {
    let url = `${this.apiUrl}/reports/company`;
    if (period) {
      url += `?period=${period}`;
    }
    return this.http.get<any>(url);
  }

  // ==================== UTILITY ====================

  getAccessibleDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/departments`);
  }

  // ==================== MOCK DATA FOR DEVELOPMENT ====================

  getMockGoals(): PerformanceGoal[] {
    return [
      {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        title: 'Increase Sales Performance',
        description: 'Achieve 20% increase in quarterly sales targets',
        status: 'ON_TRACK',
        progress: 75,
        target: '₹500K',
        current: '₹375K',
        dueDate: '2024-12-31T00:00:00',
        type: 'QUARTERLY'
      },
      {
        id: 2,
        userId: 1,
        userName: 'John Doe',
        title: 'Complete Advanced Training',
        description: 'Finish the leadership development program',
        status: 'AT_RISK',
        progress: 45,
        target: '100%',
        current: '45%',
        dueDate: '2024-11-30T00:00:00',
        type: 'SKILL_DEVELOPMENT'
      },
      {
        id: 3,
        userId: 1,
        userName: 'John Doe',
        title: 'Improve Team Collaboration',
        description: 'Implement new collaboration tools and processes',
        status: 'COMPLETED',
        progress: 100,
        target: '100%',
        current: '100%',
        dueDate: '2024-10-31T00:00:00',
        type: 'PROJECT_BASED'
      }
    ];
  }

  getMockFeedback(): Feedback[] {
    return [
      {
        id: 1,
        recipientId: 1,
        recipientName: 'John Doe',
        reviewerId: 2,
        reviewerName: 'Jane Smith',
        type: 'PEER',
        rating: 4,
        comment: 'Great team player and always willing to help.',
        reviewPeriod: 'Q4 2024',
        isAnonymous: false
      },
      {
        id: 2,
        recipientId: 1,
        recipientName: 'John Doe',
        reviewerId: 3,
        reviewerName: 'Manager A',
        type: 'MANAGER',
        rating: 4,
        comment: 'Strong performance this quarter. Keep up the good work.',
        reviewPeriod: 'Q4 2024',
        isAnonymous: false
      },
      {
        id: 3,
        recipientId: 1,
        recipientName: 'John Doe',
        reviewerId: 1,
        reviewerName: 'John Doe',
        type: 'SELF',
        rating: 4,
        comment: 'I feel I have improved in time management.',
        reviewPeriod: 'Q4 2024',
        isAnonymous: false
      }
    ];
  }

  getMockAppraisals(): Appraisal[] {
    return [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Doe',
        managerId: 3,
        managerName: 'Manager A',
        period: 'Q4 2024',
        rating: 4.3,
        achievements: 'Successfully led the new product launch project',
        improvements: 'Could improve time management for complex tasks',
        goals: 'Focus on leadership development and team building',
        status: 'COMPLETED'
      },
      {
        id: 2,
        employeeId: 1,
        employeeName: 'John Doe',
        managerId: 3,
        managerName: 'Manager A',
        period: 'Q3 2024',
        rating: 4.1,
        achievements: 'Met all quarterly targets and mentored junior team members',
        improvements: 'Need to enhance presentation skills',
        goals: 'Improve public speaking and presentation abilities',
        status: 'COMPLETED'
      }
    ];
  }

  getMockSuggestions(): AISuggestion[] {
    return [
      {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        title: 'Enhance Time Management',
        category: 'PRODUCTIVITY',
        priority: 'HIGH',
        type: 'IMPROVEMENT',
        description: 'Based on your recent performance data, consider using the Pomodoro technique to improve focus and productivity.',
        aiScore: 0.85
      },
      {
        id: 2,
        userId: 1,
        userName: 'John Doe',
        title: 'Leadership Development',
        category: 'CAREER_GROWTH',
        priority: 'MEDIUM',
        type: 'OPPORTUNITY',
        description: 'Your team feedback indicates strong leadership potential. Consider enrolling in the advanced leadership program.',
        aiScore: 0.78
      },
      {
        id: 3,
        userId: 1,
        userName: 'John Doe',
        title: 'Technical Skills Update',
        category: 'SKILLS',
        priority: 'LOW',
        type: 'IMPROVEMENT',
        description: 'Stay updated with the latest industry trends by attending the upcoming tech conference.',
        aiScore: 0.65
      }
    ];
  }
} 