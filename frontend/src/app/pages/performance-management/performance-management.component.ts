import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PerformanceManagementService, PerformanceGoal, Feedback, Appraisal, AISuggestion } from '../../services/performance-management.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-performance-management',
  template: `
    <div class="performance-container">
      <!-- Header -->
      <div class="performance-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Performance Management</h1>
            <p>Goal setting, feedback, and AI-powered insights</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openGoalModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Set New Goal
            </button>
            <button class="btn-secondary" (click)="refreshData()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9C19.2214 5.33805 15.7011 2.5 11.5 2.5C6.80546 2.5 2.5 6.80546 2.5 11.5C2.5 16.1945 6.80546 20.5 11.5 20.5C15.7011 20.5 19.2214 17.662 20.49 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Content -->
      <div class="performance-content">
        <!-- Goal Setting and Tracking Section -->
        <div class="section">
          <div class="section-header">
            <h2>Goal Setting & Tracking (OKRs)</h2>
            <button class="btn-outline" (click)="openGoalModal()">Add Goal</button>
          </div>
          <div class="goals-grid">
            <div *ngFor="let goal of goals" class="goal-card">
              <div class="goal-header">
                <h3>{{ goal.title }}</h3>
                <span class="goal-status" [class]="goal.status">{{ goal.status }}</span>
              </div>
              <p class="goal-description">{{ goal.description }}</p>
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="goal.progress"></div>
                </div>
                <span class="progress-text">{{ goal.progress }}% Complete</span>
              </div>
              <div class="goal-metrics">
                <div class="metric">
                  <span class="metric-label">Target:</span>
                  <span class="metric-value">{{ goal.target }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Current:</span>
                  <span class="metric-value">{{ goal.current }}</span>
                </div>
              </div>
              <div class="goal-actions">
                <button class="btn-small" (click)="updateGoal(goal)">Update</button>
                <button class="btn-small secondary" (click)="viewGoalDetails(goal)">Details</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 360° Feedback Section -->
        <div class="section">
          <div class="section-header">
            <h2>360° Feedback</h2>
            <button class="btn-outline" (click)="openFeedbackModal()">Request Feedback</button>
          </div>
          <div class="feedback-grid">
            <div class="feedback-card">
              <div class="feedback-header">
                <h3>Peer Feedback</h3>
                <span class="feedback-count">{{ peerFeedback.length }} reviews</span>
              </div>
              <div class="feedback-list">
                <div *ngFor="let feedback of peerFeedback.slice(0, 3)" class="feedback-item">
                  <div class="feedback-author">{{ feedback.reviewerName }}</div>
                  <div class="feedback-rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= feedback.rating">★</span>
                  </div>
                  <p class="feedback-comment">{{ feedback.comment }}</p>
                </div>
              </div>
            </div>

            <div class="feedback-card">
              <div class="feedback-header">
                <h3>Manager Feedback</h3>
                <span class="feedback-count">{{ managerFeedback.length }} reviews</span>
              </div>
              <div class="feedback-list">
                <div *ngFor="let feedback of managerFeedback.slice(0, 3)" class="feedback-item">
                  <div class="feedback-author">{{ feedback.reviewerName }}</div>
                  <div class="feedback-rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= feedback.rating">★</span>
                  </div>
                  <p class="feedback-comment">{{ feedback.comment }}</p>
                </div>
              </div>
            </div>

            <div class="feedback-card">
              <div class="feedback-header">
                <h3>Self Assessment</h3>
                <span class="feedback-count">{{ selfFeedback.length }} reviews</span>
              </div>
              <div class="feedback-list">
                <div *ngFor="let feedback of selfFeedback.slice(0, 3)" class="feedback-item">
                  <div class="feedback-author">{{ feedback.reviewerName }}</div>
                  <div class="feedback-rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= feedback.rating">★</span>
                  </div>
                  <p class="feedback-comment">{{ feedback.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Appraisal History Section -->
        <div class="section">
          <div class="section-header">
            <h2>Appraisal History & Rating Visualization</h2>
          </div>
          <div class="appraisal-content">
            <div class="rating-chart">
              <h3>Performance Rating Trends</h3>
              <div class="chart-container">
                <div class="chart-bars">
                  <div *ngFor="let rating of performanceRatings" class="chart-bar">
                    <div class="bar-fill" [style.height.%]="rating.value"></div>
                    <span class="bar-label">{{ rating.period }}</span>
                    <span class="bar-value">{{ rating.value }}/5</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="appraisal-history">
              <h3>Recent Appraisals</h3>
              <div class="appraisal-list">
                <div *ngFor="let appraisal of appraisals" class="appraisal-item">
                  <div class="appraisal-header">
                    <span class="appraisal-period">{{ appraisal.period }}</span>
                    <span class="appraisal-rating">{{ appraisal.rating }}/5</span>
                  </div>
                  <div class="appraisal-details">
                    <p><strong>Manager:</strong> {{ appraisal.managerName }}</p>
                    <p><strong>Key Achievements:</strong> {{ appraisal.achievements }}</p>
                    <p><strong>Areas for Improvement:</strong> {{ appraisal.improvements }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI-Based Performance Suggestions -->
        <div class="section">
          <div class="section-header">
            <h2>AI-Based Performance Suggestions</h2>
          </div>
          <div class="ai-suggestions">
            <div *ngFor="let suggestion of aiSuggestions" class="suggestion-card" [class]="suggestion.type">
              <div class="suggestion-header">
                <div class="suggestion-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L14.55 13.74L16.18 20.02L12 16.77L7.82 20.02L9.45 13.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="suggestion-title">
                  <h3>{{ suggestion.title }}</h3>
                  <span class="suggestion-category">{{ suggestion.category }}</span>
                </div>
                <span class="suggestion-priority" [class]="suggestion.priority">{{ suggestion.priority }}</span>
              </div>
              <p class="suggestion-description">{{ suggestion.description }}</p>
              <div class="suggestion-actions">
                <button class="btn-small" (click)="implementSuggestion(suggestion)">Implement</button>
                <button class="btn-small secondary" (click)="dismissSuggestion(suggestion)">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Goal Modal -->
    <app-goal-modal 
      *ngIf="showGoalModal"
      [goal]="editingGoal"
      (save)="onGoalSave($event)"
      (closeModal)="closeGoalModal()"
    ></app-goal-modal>
    
    <!-- Feedback Modal -->
    <app-feedback-modal 
      *ngIf="showFeedbackModal"
      [isRequesting]="isRequestingFeedback"
      [availableUsers]="availableUsers"
      (save)="onFeedbackSave($event)"
      (closeModal)="closeFeedbackModal()"
    ></app-feedback-modal>
  `,
  styles: [`
    .performance-container {
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .performance-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .header-left h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .header-left p {
      margin: 0;
      color: white;
      opacity: 0.95;
      font-size: 16px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .performance-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .section {
      margin-bottom: 48px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    .btn-outline {
      background: white;
      color: #667eea;
      border: 1px solid #667eea;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .goal-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .goal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .goal-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .goal-status.on-track {
      background: #dcfce7;
      color: #166534;
    }

    .goal-status.at-risk {
      background: #fef3c7;
      color: #92400e;
    }

    .goal-status.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .goal-description {
      color: #6b7280;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .goal-progress {
      margin-bottom: 16px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .goal-metrics {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
    }

    .metric {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .goal-actions {
      display: flex;
      gap: 8px;
    }

    .btn-small {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-small {
      background: #667eea;
      color: white;
    }

    .btn-small:hover {
      background: #5a67d8;
    }

    .btn-small.secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-small.secondary:hover {
      background: #e5e7eb;
    }

    .feedback-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .feedback-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .feedback-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .feedback-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .feedback-count {
      background: #f3f4f6;
      color: #6b7280;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .feedback-item {
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .feedback-item:last-child {
      border-bottom: none;
    }

    .feedback-author {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .feedback-rating {
      margin-bottom: 8px;
    }

    .star {
      color: #d1d5db;
      font-size: 16px;
    }

    .star.filled {
      color: #fbbf24;
    }

    .feedback-comment {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .appraisal-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .rating-chart, .appraisal-history {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .rating-chart h3, .appraisal-history h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .chart-container {
      height: 200px;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 100%;
      padding: 20px 0;
    }

    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 60px;
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
      transition: height 0.3s ease;
    }

    .bar-label {
      margin-top: 8px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }

    .bar-value {
      margin-top: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .appraisal-item {
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .appraisal-item:last-child {
      border-bottom: none;
    }

    .appraisal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .appraisal-period {
      font-weight: 600;
      color: #1f2937;
    }

    .appraisal-rating {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .appraisal-details p {
      margin: 4px 0;
      font-size: 14px;
      color: #6b7280;
    }

    .ai-suggestions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .suggestion-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      border-left: 4px solid #667eea;
    }

    .suggestion-card.improvement {
      border-left-color: #f59e0b;
    }

    .suggestion-card.opportunity {
      border-left-color: #10b981;
    }

    .suggestion-card.urgent {
      border-left-color: #ef4444;
    }

    .suggestion-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .suggestion-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .suggestion-title h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .suggestion-category {
      font-size: 12px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .suggestion-priority {
      margin-left: auto;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .suggestion-priority.high {
      background: #fef2f2;
      color: #dc2626;
    }

    .suggestion-priority.medium {
      background: #fef3c7;
      color: #d97706;
    }

    .suggestion-priority.low {
      background: #dcfce7;
      color: #166534;
    }

    .suggestion-description {
      color: #6b7280;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .suggestion-actions {
      display: flex;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .performance-content {
        padding: 16px;
      }

      .appraisal-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .goals-grid, .feedback-grid, .ai-suggestions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PerformanceManagementComponent implements OnInit {
  currentUser: any;
  goals: PerformanceGoal[] = [];
  peerFeedback: Feedback[] = [];
  managerFeedback: Feedback[] = [];
  selfFeedback: Feedback[] = [];
  performanceRatings: any[] = [];
  appraisals: Appraisal[] = [];
  aiSuggestions: AISuggestion[] = [];
  
  // Modal states
  showGoalModal = false;
  showFeedbackModal = false;
  editingGoal: PerformanceGoal | undefined = undefined;
  isRequestingFeedback = false;
  availableUsers: any[] = [];

  constructor(
    private authService: AuthService,
    private performanceService: PerformanceManagementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPerformanceData();
    this.loadAvailableUsers();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadPerformanceData(): void {
    // Load data from service
    this.loadGoals();
    this.loadFeedback();
    this.loadAppraisals();
    this.loadAISuggestions();
  }

  loadGoals(): void {
    if (this.currentUser) {
      this.performanceService.getGoalsByUser(this.currentUser.id).subscribe({
        next: (goals) => {
          this.goals = goals;
        },
        error: (error) => {
          console.error('Error loading goals:', error);
          // Fallback to mock data
          this.goals = this.performanceService.getMockGoals();
        }
      });
    }
  }

  loadFeedback(): void {
    if (this.currentUser) {
      this.performanceService.getFeedbackByRecipient(this.currentUser.id).subscribe({
        next: (feedbacks) => {
          this.peerFeedback = feedbacks.filter(f => f.type === 'PEER');
          this.managerFeedback = feedbacks.filter(f => f.type === 'MANAGER');
          this.selfFeedback = feedbacks.filter(f => f.type === 'SELF');
        },
        error: (error) => {
          console.error('Error loading feedback:', error);
          // Fallback to mock data
          const mockFeedbacks = this.performanceService.getMockFeedback();
          this.peerFeedback = mockFeedbacks.filter(f => f.type === 'PEER');
          this.managerFeedback = mockFeedbacks.filter(f => f.type === 'MANAGER');
          this.selfFeedback = mockFeedbacks.filter(f => f.type === 'SELF');
        }
      });
    }
  }

  loadAppraisals(): void {
    if (this.currentUser) {
      this.performanceService.getAppraisalsByEmployee(this.currentUser.id).subscribe({
        next: (appraisals) => {
          this.appraisals = appraisals;
          // Generate performance ratings from appraisals
          this.performanceRatings = appraisals.map(appraisal => ({
            period: appraisal.period,
            value: appraisal.rating
          }));
        },
        error: (error) => {
          console.error('Error loading appraisals:', error);
          // Fallback to mock data
          this.appraisals = this.performanceService.getMockAppraisals();
          this.performanceRatings = [
            { period: 'Q1 2024', value: 4.2 },
            { period: 'Q2 2024', value: 4.5 },
            { period: 'Q3 2024', value: 4.1 },
            { period: 'Q4 2024', value: 4.3 }
          ];
        }
      });
    }
  }

  loadAISuggestions(): void {
    if (this.currentUser) {
      this.performanceService.getSuggestionsByUser(this.currentUser.id).subscribe({
        next: (suggestions) => {
          this.aiSuggestions = suggestions;
        },
        error: (error) => {
          console.error('Error loading AI suggestions:', error);
          // Fallback to mock data
          this.aiSuggestions = this.performanceService.getMockSuggestions();
        }
      });
    }
  }

  loadAvailableUsers(): void {
    this.userService.getUsers(0, 100).subscribe({
      next: (response: any) => {
        this.availableUsers = response.content.filter((user: any) => user.id !== this.currentUser?.id);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      }
    });
  }

  openGoalModal(goal?: PerformanceGoal): void {
    this.editingGoal = goal || undefined;
    this.showGoalModal = true;
  }

  openFeedbackModal(isRequesting = false): void {
    this.isRequestingFeedback = isRequesting;
    this.showFeedbackModal = true;
  }

  refreshData(): void {
    this.loadPerformanceData();
  }

  onGoalSave(goalData: PerformanceGoal): void {
    if (this.editingGoal) {
      // Update existing goal
      this.performanceService.updateGoal(this.editingGoal.id!, goalData).subscribe({
        next: (updatedGoal) => {
          const index = this.goals.findIndex(g => g.id === updatedGoal.id);
          if (index !== -1) {
            this.goals[index] = updatedGoal;
          }
          this.closeGoalModal();
        },
        error: (error) => {
          console.error('Error updating goal:', error);
        }
      });
    } else {
      // Create new goal
      goalData.userId = this.currentUser.id;
      this.performanceService.createGoal(goalData).subscribe({
        next: (newGoal) => {
          this.goals.push(newGoal);
          this.closeGoalModal();
        },
        error: (error) => {
          console.error('Error creating goal:', error);
        }
      });
    }
  }

  closeGoalModal(): void {
    this.showGoalModal = false;
    this.editingGoal = undefined;
  }

  onFeedbackSave(feedbackData: Feedback): void {
    if (this.isRequestingFeedback) {
      // Request feedback - this would typically send a notification
      console.log('Requesting feedback:', feedbackData);
      this.closeFeedbackModal();
    } else {
      // Submit feedback
      feedbackData.reviewerId = this.currentUser.id;
      this.performanceService.createFeedback(feedbackData).subscribe({
        next: (newFeedback) => {
          // Add to appropriate feedback list
          if (newFeedback.type === 'PEER') {
            this.peerFeedback.push(newFeedback);
          } else if (newFeedback.type === 'MANAGER') {
            this.managerFeedback.push(newFeedback);
          } else if (newFeedback.type === 'SELF') {
            this.selfFeedback.push(newFeedback);
          }
          this.closeFeedbackModal();
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
        }
      });
    }
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.isRequestingFeedback = false;
  }

  updateGoal(goal: PerformanceGoal): void {
    this.openGoalModal(goal);
  }

  viewGoalDetails(goal: PerformanceGoal): void {
    // Implementation for viewing goal details
    console.log('Viewing goal details:', goal);
  }

  implementSuggestion(suggestion: AISuggestion): void {
    const notes = prompt('Enter implementation notes:');
    if (notes !== null) {
      this.performanceService.implementSuggestion(suggestion.id!, notes).subscribe({
        next: (updatedSuggestion) => {
          const index = this.aiSuggestions.findIndex(s => s.id === updatedSuggestion.id);
          if (index !== -1) {
            this.aiSuggestions[index] = updatedSuggestion;
          }
        },
        error: (error) => {
          console.error('Error implementing suggestion:', error);
        }
      });
    }
  }

  dismissSuggestion(suggestion: AISuggestion): void {
    if (confirm('Are you sure you want to dismiss this suggestion?')) {
      this.performanceService.dismissSuggestion(suggestion.id!).subscribe({
        next: (updatedSuggestion) => {
          const index = this.aiSuggestions.findIndex(s => s.id === updatedSuggestion.id);
          if (index !== -1) {
            this.aiSuggestions[index] = updatedSuggestion;
          }
        },
        error: (error) => {
          console.error('Error dismissing suggestion:', error);
        }
      });
    }
  }
} 