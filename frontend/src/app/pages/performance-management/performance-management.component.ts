import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PerformanceManagementService, PerformanceGoal, Feedback, Appraisal, AISuggestion, FeedbackRequest, RatingTrendPoint } from '../../services/performance-management.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

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
            <button *ngIf="canCreateGoals" class="btn-primary" (click)="openGoalModal()">
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
            <div class="section-actions">
              <!-- Admin: My Goals / Department Goals -->
              <ng-container *ngIf="isAdmin; else nonAdminSelect">
                <select class="view-select" [(ngModel)]="goalViewMode" (change)="loadGoals()">
                  <option value="MY">My Goals</option>
                  <option value="DEPT">Department Goals</option>
                </select>
                <select *ngIf="goalViewMode==='DEPT'" class="view-select" [(ngModel)]="selectedDepartment" (change)="loadGoals()">
                  <option *ngFor="let d of departments" [ngValue]="d">{{ d }}</option>
                </select>
              </ng-container>
              <!-- Manager/Employee -->
              <ng-template #nonAdminSelect>
                <select *ngIf="canViewTeamGoals" class="view-select" [(ngModel)]="goalViewMode" (change)="loadGoals()">
                  <option value="MY">My Goals</option>
                  <option value="TEAM">Team Goals</option>
                </select>
              </ng-template>
              <button *ngIf="canCreateGoals" class="btn-outline" (click)="openGoalModal()">Add Goal</button>
            </div>
          </div>
          <!-- Department restriction notice for managers -->
          <div *ngIf="currentUser?.role === 'MANAGER'" class="info-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Note: You can only assign goals and give feedback to employees in your department ({{ currentUser.department }})</span>
          </div>
          <!-- Employee goal creation notice -->
          <div *ngIf="currentUser?.role === 'EMPLOYEE'" class="info-notice employee-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Note: You can create personal goals for yourself and request feedback from peers</span>
          </div>
          <div class="goals-grid">
            <div *ngFor="let goal of goals" class="goal-card">
              <div class="goal-header">
                <h3>{{ goal.title }}</h3>
                <span class="goal-status" [ngClass]="getGoalStatusClass(goal)">{{ goal.status }}</span>
              </div>
              <div class="goal-assigned-to" *ngIf="goal.userName && (isAdmin || currentUser?.role === 'MANAGER')">
                <span class="assigned-label">Assigned to:</span>
                <span class="assigned-name">{{ goal.userName }}</span>
              </div>
              <p class="goal-description">{{ goal.description }}</p>
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="goal.progress"></div>
                </div>
                <span class="progress-text">{{ goal.progress }}% Complete</span>
              </div>
              <div class="goal-deadline" *ngIf="goal.dueDate">
                <span class="metric-label">Due: </span>
                <span class="metric-value">{{ goal.dueDate | date:'mediumDate' }}</span>
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
                <button *ngIf="canEditGoal(goal)" class="btn-small" (click)="updateGoal(goal)">Update</button>
                <button class="btn-small secondary" (click)="viewGoalDetails(goal)">Details</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 360° Feedback Section -->
        <div class="section">
          <div class="section-header">
            <h2>360° Feedback</h2>
            <div class="feedback-actions">
              <button *ngIf="canRequestFeedback" class="btn-outline" style="margin-right: 10px" (click)="openFeedbackModal(true)">Request Feedback</button>
              <button *ngIf="canRequestFeedback" class="btn-outline" (click)="openFeedbackModal(false)">Give Feedback</button>
            </div>
          </div>
          <!-- Department restriction notice for managers -->
          <div *ngIf="currentUser?.role === 'MANAGER'" class="info-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Note: You can only give feedback to employees in your department ({{ currentUser.department }})</span>
          </div>
          <!-- Employee feedback notice -->
          <div *ngIf="currentUser?.role === 'EMPLOYEE'" class="info-notice employee-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Note: You can request feedback from peers and give feedback to colleagues</span>
          </div>
          <div class="feedback-grid">
            <!-- Feedback Requests Panel -->
            <!-- Notification bell for requests -->
            <div class="feedback-card">
              <div class="feedback-header">
                <h3>360° Feedback</h3>
                <button class="notif-bell" (click)="openRequestsModal()">
                  <span class="bell">🔔</span>
                  <span class="badge" *ngIf="receivedRequests.length > 0">{{ receivedRequests.length }}</span>
                </button>
              </div>
              <div class="helper-text">Click the bell to view and respond to feedback requests</div>
            </div>
            <div class="feedback-card">
              <div class="feedback-header">
                <h3>Peer Feedback</h3>
                <span class="feedback-count">{{ peerFeedback.length }} reviews</span>
              </div>
              <div class="feedback-list">
                <div *ngFor="let feedback of peerFeedback.slice(0, 3)" class="feedback-item">
                  <div class="feedback-author">{{ feedback.isAnonymous ? 'Anonymous' : feedback.reviewerName }}</div>
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
                  <div class="feedback-author">{{ feedback.isAnonymous ? 'Anonymous' : feedback.reviewerName }}</div>
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
                  <div class="feedback-author">{{ feedback.isAnonymous ? 'Anonymous' : feedback.reviewerName }}</div>
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
        <div class="section" *ngIf="currentUser?.role !== 'IT_SUPPORT'">
          <div class="section-header">
            <h2>Appraisal History & Rating Visualization</h2>
            <div class="section-actions" style="gap: 12px;">
              <ng-container *ngIf="canViewAllAppraisals">
                <select class="view-select" [(ngModel)]="selectedAppraisalEmployeeId" (change)="onChangeAppraisalEmployee()">
                  <option [ngValue]="currentUser?.id">Myself</option>
                  <option *ngFor="let u of availableUsers" [ngValue]="u.id">{{ u.firstName }} {{ u.lastName }}</option>
                </select>
              </ng-container>
              <button *ngIf="canCreateAppraisals" class="btn-outline" (click)="openAppraisalModal()">New Appraisal</button>
              <button *ngIf="isAdmin" class="btn-outline" (click)="exportAppraisalReport()">Export Data</button>
            </div>
          </div>
          <div class="appraisal-content">
            <div class="rating-chart">
              <h3>Performance Rating Trends</h3>
              <div class="chart-container" id="ratingChart">
                <canvas baseChart
                  [data]="{ labels: lineChartLabels, datasets: lineChartData }"
                  [type]="'bar'"
                  [options]="lineChartOptions">
                </canvas>
              </div>
            </div>
            <div class="appraisal-history">
              <h3>Recent Appraisals</h3>
              <div class="appraisal-list">
                <div *ngFor="let appraisal of appraisals" class="appraisal-item">
                  <div class="appraisal-header">
                    <span class="appraisal-period">{{ appraisal.period }}</span>
                    <div class="appraisal-meta">
                      <span class="appraisal-rating">{{ appraisal.rating }}/5</span>
                      <span class="appraisal-status" [ngClass]="getAppraisalStatusClass(appraisal.status || '')">{{ appraisal.status || 'Unknown' }}</span>
                    </div>
                  </div>
                  <div class="appraisal-details">
                    <p><strong>Manager:</strong> {{ appraisal.managerName }}</p>
                    <p><strong>Key Achievements:</strong> {{ appraisal.achievements }}</p>
                    <p><strong>Areas for Improvement:</strong> {{ appraisal.improvements }}</p>
                  </div>
                  <!-- Edit button for managers on draft/submitted appraisals -->
                  <div class="appraisal-actions" *ngIf="canEditAppraisal(appraisal)">
                    <button class="btn-small primary" (click)="editAppraisal(appraisal)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.50023C18.8978 2.10297 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10297 21.5 2.50023C21.8978 2.89749 22.1218 3.43705 22.1218 3.99973C22.1218 4.56241 21.8978 5.10197 21.5 5.49923L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <!-- Status-based access notice -->
              <div class="appraisal-notice" *ngIf="currentUser?.role === 'EMPLOYEE'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Note: You can only view completed appraisals. Draft and submitted appraisals are visible to managers and HR.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI-Based Performance Suggestions -->
        <!-- <div class="section">
          <div class="section-header">
            <h2>AI-Based Performance Suggestions</h2>
            <div class="header-actions">
              <button class="btn-outline" (click)="generateNewSuggestions()">
                <span>🤖</span> Generate New Suggestions
              </button>
            </div>
          </div>
          <div class="ai-suggestions">
            <div *ngFor="let suggestion of aiSuggestions" class="suggestion-card" [class]="getSuggestionStatusClass(suggestion)">
              <div class="suggestion-header">
                <div class="suggestion-icon">
                  <span class="category-icon">{{ getCategoryIcon(suggestion.category) }}</span>
                </div>
                <div class="suggestion-title">
                  <h3>{{ suggestion.title }}</h3>
                  <span class="suggestion-category">{{ suggestion.category.replace('_', ' ') }}</span>
                </div>
                <div class="suggestion-meta">
                  <span class="priority-badge" [class]="getPriorityClass(suggestion)">
                    {{ suggestion.priority }}
                  </span>
                  <span class="ai-score">AI: {{ ((suggestion.aiScore || 0) * 100).toFixed(0) }}%</span>
                </div>
              </div>
              <p class="suggestion-description">{{ suggestion.description }}</p>
              <div class="suggestion-footer">
                <div class="suggestion-type">{{ suggestion.type }}</div>
                <div class="suggestion-actions" *ngIf="suggestion.status === 'ACTIVE'">
                  <button class="btn-small primary" (click)="implementSuggestion(suggestion)">
                    <span>✓</span> Implement
                  </button>
                  <button class="btn-small secondary" (click)="dismissSuggestion(suggestion)">
                    <span>✕</span> Dismiss
                  </button>
                </div>
                <div class="suggestion-status" *ngIf="suggestion.status !== 'ACTIVE'">
                  <span class="status-badge" [class]="(suggestion.status || '').toLowerCase()">
                    {{ suggestion.status }}
                  </span>
                  <div class="status-details" *ngIf="suggestion.implementationNotes">
                    <strong>Notes:</strong> {{ suggestion.implementationNotes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Appraisal Modal -->
        <div class="modal-overlay" *ngIf="showAppraisalModal" (click)="closeAppraisalModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isEditingAppraisal ? 'Edit Appraisal' : 'Create Appraisal' }}</h2>
              <button class="close-btn" (click)="closeAppraisalModal()">×</button>
            </div>
            <div class="modal-body" *ngIf="appraisalForm as form">
              <div class="form-field" *ngIf="isAdmin || currentUser?.role==='MANAGER'">
                <label>Employee</label>
                <select class="view-select" [(ngModel)]="form.employeeId">
                  <option *ngFor="let u of availableUsers" [ngValue]="u.id">{{ u.firstName }} {{ u.lastName }}</option>
                </select>
              </div>
              <div class="form-field">
                <label>Period</label>
                <input class="text-input" [(ngModel)]="form.period" placeholder="e.g., Q4 2024" />
              </div>
              <div class="form-field">
                <label>Rating (1-5)</label>
                <input type="number" class="text-input" min="1" max="5" step="0.1" [(ngModel)]="form.rating" />
              </div>
              <div class="form-field">
                <label>Achievements</label>
                <textarea class="text-area" rows="3" [(ngModel)]="form.achievements"></textarea>
              </div>
              <div class="form-field">
                <label>Areas for Improvement</label>
                <textarea class="text-area" rows="3" [(ngModel)]="form.improvements"></textarea>
              </div>
              <div class="form-field">
                <label>Goals</label>
                <textarea class="text-area" rows="3" [(ngModel)]="form.goals"></textarea>
              </div>
              <div class="form-field">
                <label>Manager Comments</label>
                <textarea class="text-area" rows="3" [(ngModel)]="form.managerComments"></textarea>
              </div>
              <div class="form-field">
                <label>Status</label>
                <select class="view-select" [(ngModel)]="form.status">
                  <option [ngValue]="'DRAFT'">Draft</option>
                  <option [ngValue]="'SUBMITTED'">Submitted</option>
                  <option [ngValue]="'COMPLETED'">Completed (Finalize)</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-secondary" (click)="closeAppraisalModal()">Cancel</button>
              <button class="btn-small" (click)="saveAppraisal()">{{ isEditingAppraisal ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestion Implementation Modal -->
    <div class="modal-overlay" *ngIf="showSuggestionModal" (click)="closeSuggestionModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Implement Suggestion</h2>
          <button class="close-btn" (click)="closeSuggestionModal()">×</button>
        </div>
        <div class="modal-body" *ngIf="selectedSuggestion">
          <div class="suggestion-details">
            <h3>{{ selectedSuggestion.title }}</h3>
            <p class="suggestion-category">
              <span class="category-icon">{{ getCategoryIcon(selectedSuggestion.category) }}</span>
              {{ selectedSuggestion.category.replace('_', ' ') }}
            </p>
            <p class="suggestion-description">{{ selectedSuggestion.description }}</p>
            <div class="suggestion-meta">
              <span class="priority-badge" [class]="getPriorityClass(selectedSuggestion)">
                {{ selectedSuggestion.priority }}
              </span>
              <span class="ai-score">AI Confidence: {{ ((selectedSuggestion.aiScore || 0) * 100).toFixed(0) }}%</span>
            </div>
          </div>
          <div class="form-field">
            <label>Implementation Notes</label>
            <textarea 
              class="text-area" 
              rows="4" 
              [(ngModel)]="implementationNotes"
              placeholder="Describe how you plan to implement this suggestion...">
            </textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-secondary" (click)="closeSuggestionModal()">Cancel</button>
          <button class="btn-small" (click)="saveImplementation()">Implement</button>
        </div>
      </div>
    </div>
    
    <!-- Requests Modal -->
    <div class="requests-overlay" *ngIf="showRequestsPopover" (click)="showRequestsPopover=false">
      <div class="requests-modal" (click)="$event.stopPropagation()">
        <div class="requests-header">
          <h3 style="margin:0">Feedback Requests</h3>
          <button class="close-x" (click)="showRequestsPopover=false">×</button>
        </div>
        <div class="requests-body">
          <div *ngIf="receivedRequests.length === 0" class="empty-text">No pending requests</div>
          <div class="requests-list" *ngIf="receivedRequests.length > 0">
            <div *ngFor="let req of receivedRequests" class="request-item">
              <div class="request-top">
                <strong>{{ req.requesterName }}</strong>
                <span class="request-meta">{{ req.feedbackType }} • {{ req.reviewPeriod }}</span>
              </div>
              <div class="request-actions">
                <button class="btn-small" (click)="respondToRequest(req); showRequestsPopover=false">Give Feedback</button>
                <button class="btn-small secondary" (click)="dismissRequest(req)">Dismiss</button>
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
      [canAssign]="canAssignGoalsToOthers"
      [availableUsers]="availableUsers"
      [defaultUserId]="currentUser?.id || null"
      (save)="onGoalSave($event)"
      (closeModal)="closeGoalModal()"
    ></app-goal-modal>
    
    <!-- Feedback Modal -->
    <app-feedback-modal 
      *ngIf="showFeedbackModal"
      [isRequesting]="isRequestingFeedback"
      [availableUsers]="availableUsers"
      [showAnonymousOption]="anonymousFeedbackEnabled"
      [allowDirectRecipient]="availableUsers.length > 0"
      [presetRecipientId]="requestPreset.recipientId"
      [presetType]="requestPreset.type"
      [presetReviewPeriod]="requestPreset.reviewPeriod"
      [lockRecipientAndType]="lockRecipientAndType"
      (save)="onFeedbackSave($event)"
      (closeModal)="closeFeedbackModal()"
    ></app-feedback-modal>
    <!-- Goal Details Modal -->
    <div class="modal-overlay" *ngIf="showGoalDetails" (click)="closeGoalDetails()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Goal Details</h2>
          <button class="close-btn" (click)="closeGoalDetails()">×</button>
        </div>
        <div class="modal-body" *ngIf="selectedGoal">
          <p><strong>Title:</strong> {{ selectedGoal.title }}</p>
          <p *ngIf="selectedGoal.userName && (isAdmin || currentUser?.role === 'MANAGER')"><strong>Assigned to:</strong> {{ selectedGoal.userName }}</p>
          <p><strong>Description:</strong> {{ selectedGoal.description }}</p>
          <p><strong>Status:</strong> {{ selectedGoal.status }}</p>
          <p><strong>Type:</strong> {{ selectedGoal.type }}</p>
          <p *ngIf="selectedGoal.dueDate"><strong>Due:</strong> {{ selectedGoal.dueDate | date:'mediumDate' }}</p>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="selectedGoal.progress"></div>
            </div>
            <span class="progress-text">{{ selectedGoal.progress }}% Complete</span>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-secondary" (click)="closeGoalDetails()">Close</button>
        </div>
      </div>
    </div>
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

    .info-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #dbeafe;
      border: 1px solid #93c5fd;
      border-radius: 8px;
      margin-bottom: 16px;
      color: #1e40af;
      font-size: 14px;
    }

    .info-notice svg {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .employee-notice {
      background-color: #f0f9ff;
      border-color: #7dd3fc;
      color: #0369a1;
    }

    .employee-notice svg {
      color: #0284c7;
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

    .section-actions { display: flex; gap: 12px; align-items: center; }
    .view-select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #1f2937; }

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

    .goal-assigned-to {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding: 6px 10px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 13px;
    }

    .assigned-label {
      color: #6b7280;
      font-weight: 500;
    }

    .assigned-name {
      color: #1f2937;
      font-weight: 600;
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

    .notif-bell { position: relative; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; padding: 6px 10px; cursor: pointer; }
    .notif-bell .bell { font-size: 18px; }
    .notif-bell .badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: #fff; font-size: 11px; border-radius: 999px; padding: 2px 6px; }
    .requests-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1100; }
    .requests-modal { background: #fff; width: 90%; max-width: 560px; max-height: 80vh; overflow: auto; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .requests-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #e5e7eb; }
    .close-x { background: none; border: none; font-size: 22px; color: #6b7280; cursor: pointer; }
    .requests-body { padding: 14px 18px; }
    .requests-list { max-height: 60vh; overflow: auto; }
    .request-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .request-item:last-child { border-bottom: none; }
    .request-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .request-meta { color: #6b7280; font-size: 12px; }
    .request-actions { margin-top: 8px; display: flex; gap: 8px; }
    .helper-text { margin-top: 8px; font-size: 12px; color: #6b7280; }

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
      height: 260px;
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

    .suggestion-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .suggestion-type {
      font-size: 12px;
      color: #6b7280;
      text-transform: capitalize;
    }

    .suggestion-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .priority-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-high {
      background: #fef2f2;
      color: #dc2626;
    }

    .priority-medium {
      background: #fef3c7;
      color: #d97706;
    }

    .priority-low {
      background: #dcfce7;
      color: #166534;
    }

    .ai-score {
      font-size: 11px;
      color: #6b7280;
      font-weight: 500;
    }

    .category-icon {
      font-size: 18px;
    }

    .suggestion-status {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.implemented {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.dismissed {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-badge.expired {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-details {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.4;
    }

    .suggestion-card.implemented {
      border-left-color: #10b981;
      opacity: 0.8;
    }

    .suggestion-card.dismissed {
      border-left-color: #ef4444;
      opacity: 0.6;
    }

    .suggestion-card.expired {
      border-left-color: #6b7280;
      opacity: 0.5;
    }

    .suggestion-details {
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .suggestion-details h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
    }

    .suggestion-details .suggestion-category {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }

    .suggestion-details .suggestion-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #fff; border-radius: 12px; width: 90%; max-width: 640px; max-height: 90vh; overflow: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
    .modal-body { padding: 20px; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 12px 20px; border-top: 1px solid #e5e7eb; }
    .form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .text-input, .text-area { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }

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
  receivedRequests: FeedbackRequest[] = [];
  sentRequests: FeedbackRequest[] = [];
  performanceRatings: { period: string; value: number }[] = [];
  lineChartLabels: string[] = [];
  lineChartData: any[] = [
    {
      data: [],
      label: 'Rating',
      backgroundColor: 'rgba(102, 126, 234, 0.8)',
      borderColor: 'rgb(102, 126, 234)',
      borderWidth: 1,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }
  ];
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 1, max: 5, ticks: { stepSize: 1 } },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 1
      }
    },
    elements: {
      bar: {
        borderRadius: 4
      }
    }
  };
  ratingTrendPoints: RatingTrendPoint[] = [];
  selectedAppraisalEmployeeId: number | null = null;
  appraisals: Appraisal[] = [];
  aiSuggestions: AISuggestion[] = [];
  canCreateGoals = false;
  canRequestFeedback = false;
  canViewAllAppraisals = false;
  anonymousFeedbackEnabled = environment.features.anonymousFeedback;
  canAssignGoalsToOthers = false;
  canViewTeamGoals = false;
  isAdmin = false;
  canCreateAppraisals = false;
  goalViewMode: 'MY' | 'TEAM' | 'ALL' | 'DEPT' = 'MY';
  selectedDepartment: string | null = null;
  departments: string[] = [];
  showRequestsPopover = false;
  
  // Modal states
  showGoalModal = false;
  showFeedbackModal = false;
  showAppraisalModal = false;
  isEditingAppraisal = false;
  showSuggestionModal = false;
  selectedSuggestion: AISuggestion | null = null;
  implementationNotes = '';
  // Fields for responding to request
  requestPreset: { recipientId?: number; type?: any; reviewPeriod?: string } = {};
  lockRecipientAndType = false;
  currentRespondingRequest: FeedbackRequest | null = null;
  editingGoal: PerformanceGoal | undefined = undefined;
  showGoalDetails = false;
  selectedGoal: PerformanceGoal | null = null;
  isRequestingFeedback = false;
  availableUsers: any[] = [];
  appraisalForm: Partial<Appraisal> | null = null;

  constructor(
    private authService: AuthService,
    private performanceService: PerformanceManagementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPerformanceData();
    // Load user list for Admin/Manager (for goal assignment) and for all users (for feedback requests)
    if (this.canAssignGoalsToOthers || this.canRequestFeedback) {
      this.loadAvailableUsers();
    }
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    const role = this.currentUser?.role;
    this.isAdmin = role === 'ADMIN';
    this.canCreateGoals = role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE';
    this.canRequestFeedback = role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE';
    this.canViewAllAppraisals = role === 'ADMIN' || role === 'MANAGER';
    this.canAssignGoalsToOthers = role === 'ADMIN' || role === 'MANAGER';
    this.canViewTeamGoals = role === 'ADMIN' || role === 'MANAGER';
    this.canCreateAppraisals = role === 'ADMIN' || role === 'MANAGER';
    if (this.isAdmin) {
      // Load departments list for admin dropdown
      this.performanceService.getAccessibleDepartments().subscribe({
        next: (depts) => {
          this.departments = depts;
          if (!this.selectedDepartment && depts.length) {
            this.selectedDepartment = depts[0];
          }
        },
        error: () => { this.departments = []; }
      });
    }
  }

  loadPerformanceData(): void {
    // Load data from service
    this.loadGoals();
    this.loadFeedback();
    this.loadFeedbackRequests();
    this.loadAppraisals();
    this.loadAISuggestions();
  }

  loadGoals(): void {
    if (this.currentUser) {
      if (this.isAdmin && this.goalViewMode === 'DEPT') {
        const dept = this.selectedDepartment || this.currentUser.department;
        this.performanceService.getGoalsByDepartment(dept).subscribe({
          next: (goals) => { this.goals = goals; },
          error: (error) => {
            console.error('Error loading department goals:', error);
            this.goals = [];
          }
        });
      } else if (this.goalViewMode === 'TEAM' && this.canViewTeamGoals) {
        // Team view: fetch by department
        const dept = this.currentUser.department;
        this.performanceService.getGoalsByDepartment(dept).subscribe({
          next: (goals) => { this.goals = goals; },
          error: (error) => {
            console.error('Error loading team goals:', error);
            this.goals = [];
          }
        });
      } else if (this.goalViewMode === 'ALL' && this.isAdmin) {
        this.performanceService.getAllGoals().subscribe({
          next: (goals) => { this.goals = goals; },
          error: (error) => {
            console.error('Error loading all goals:', error);
            this.goals = [];
          }
        });
      } else {
        // My goals
        this.performanceService.getGoalsByUser(this.currentUser.id).subscribe({
          next: (goals) => { this.goals = goals; },
                  error: (error) => {
          console.error('Error loading goals:', error);
          this.goals = [];
        }
        });
      }
    }
  }

  loadFeedback(): void {
    if (this.currentUser) {
      this.performanceService.getFeedbackByRecipient(this.currentUser.id).subscribe({
        next: (feedbacks) => {
          // Always show only feedback where current user is the recipient
          const mine = feedbacks.filter(f => f.recipientId === this.currentUser!.id);
          // Hide feedback authored by the current user (except SELF type)
          const othersToMe = mine.filter(f => f.type === 'SELF' || f.reviewerId !== this.currentUser!.id);
          this.peerFeedback = othersToMe.filter(f => f.type === 'PEER');
          this.managerFeedback = othersToMe.filter(f => f.type === 'MANAGER');
          this.selfFeedback = othersToMe.filter(f => f.type === 'SELF');
        },
        error: (error) => {
          console.error('Error loading feedback:', error);
          this.peerFeedback = [];
          this.managerFeedback = [];
          this.selfFeedback = [];
        }
      });
    }
  }

  loadFeedbackRequests(): void {
    // Requests received by current user (PENDING only)
    this.performanceService.getPendingFeedbackRequests().subscribe({
      next: (reqs) => { this.receivedRequests = reqs; },
      error: () => { this.receivedRequests = []; }
    });
    // Requests sent by current user
    this.performanceService.getFeedbackRequestsFromUser().subscribe({
      next: (reqs) => { this.sentRequests = reqs; },
      error: () => { this.sentRequests = []; }
    });
  }

  loadAppraisals(): void {
    if (this.currentUser) {
      const targetId = this.selectedAppraisalEmployeeId || this.currentUser.id;
      this.performanceService.getAppraisalsByEmployee(targetId).subscribe({
        next: (appraisals) => {
          // Show all appraisals including drafts and submitted
          this.appraisals = appraisals;
          // Load trend points from API for accuracy and ordering
          this.loadRatingTrends();
        },
        error: (error) => {
          console.error('Error loading appraisals:', error);
          this.appraisals = [];
          this.performanceRatings = [];
        }
      });
    }
  }

  loadRatingTrends(): void {
    if (!this.currentUser) return;
    const targetId = this.selectedAppraisalEmployeeId || this.currentUser.id;
    this.performanceService.getRatingTrends(targetId).subscribe({
      next: (points) => {
        this.ratingTrendPoints = points;
        this.performanceRatings = points.map(p => ({ period: p.period, value: p.rating }));
        this.lineChartLabels = this.performanceRatings.map(p => p.period);
        this.lineChartData = [{
          ...this.lineChartData[0],
          data: this.performanceRatings.map(p => p.value)
        }];
      },
      error: () => {
        this.ratingTrendPoints = [];
      }
    });
  }

  onChangeAppraisalEmployee(): void {
    this.loadAppraisals();
  }

  async exportAppraisalReport(): Promise<void> {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

      const chartEl = document.getElementById('ratingChart');
      if (chartEl) {
        const canvas = await html2canvas(chartEl);
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 80;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.text('Appraisal Rating Trends', 40, 40);
        doc.addImage(imgData, 'PNG', 40, 60, imgWidth, imgHeight);
      }

      let y = 80 + 260;
      doc.text('Recent Appraisals (Completed)', 40, y);
      y += 20;
      const rows = this.appraisals.slice(0, 10).map(a => [a.period, a.managerName || '', (a.rating ?? '').toString()]);
      doc.setFontSize(10);
      doc.text(['Period', 'Manager', 'Rating'].join('  |  '), 40, y);
      y += 14;
      rows.forEach(r => { doc.text(r.join('  |  '), 40, y); y += 14; });

      doc.save('appraisal-report.pdf');
    } catch (e) {
      console.error('Export failed', e);
    }
  }

  openAppraisalModal(): void {
    if (!this.selectedAppraisalEmployeeId) {
      // default to first available user in same department or current user
      this.selectedAppraisalEmployeeId = (this.availableUsers[0]?.id) || this.currentUser?.id;
    }
    this.appraisalForm = {
      employeeId: this.selectedAppraisalEmployeeId!,
      managerId: this.currentUser?.id,
      period: 'Q4 2024',
      rating: 4.0,
      achievements: '',
      improvements: '',
      goals: '',
      managerComments: '',
      status: 'DRAFT'
    } as any;
    this.showAppraisalModal = true;
  }

  closeAppraisalModal(): void {
    this.showAppraisalModal = false;
    this.isEditingAppraisal = false;
    this.appraisalForm = null;
  }

  saveAppraisal(): void {
    if (!this.appraisalForm?.employeeId || !this.appraisalForm?.managerId || !this.appraisalForm?.period) {
      console.error('Missing required fields');
      alert('Please fill in all required fields: Employee, Period, and Rating.');
      return;
    }
    const payload: any = {
      employeeId: this.appraisalForm.employeeId as number,
      managerId: this.appraisalForm.managerId as number,
      period: this.appraisalForm.period as string,
      rating: Number(this.appraisalForm.rating ?? 0),
      achievements: this.appraisalForm.achievements || '',
      improvements: this.appraisalForm.improvements || '',
      goals: this.appraisalForm.goals || '',
      managerComments: this.appraisalForm.managerComments || '',
      status: (this.appraisalForm.status as any) || 'DRAFT',
      appraisalDate: new Date().toISOString()
    };

    if (this.isEditingAppraisal && this.appraisalForm.id) {
      // Update existing appraisal
      this.performanceService.updateAppraisal(this.appraisalForm.id, payload).subscribe({
        next: () => {
          this.closeAppraisalModal();
          this.loadAppraisals();
        },
        error: (err) => {
          console.error('Failed to update appraisal', err);
          const errorMsg = err?.error?.message || err?.message || 'Failed to update appraisal. Please check all required fields.';
          alert('Error: ' + errorMsg);
        }
      });
    } else {
      // Create new appraisal
      this.performanceService.createAppraisal(payload).subscribe({
        next: () => {
          this.closeAppraisalModal();
          this.loadAppraisals();
        },
        error: (err) => {
          console.error('Failed to create appraisal', err);
          const errorMsg = err?.error?.message || err?.message || 'Failed to create appraisal. Please check all required fields.';
          alert('Error: ' + errorMsg);
        }
      });
    }
  }

  loadAISuggestions(): void {
    if (this.currentUser) {
      console.log('Loading AI suggestions for user:', this.currentUser.id);
      this.performanceService.getSuggestionsByUser(this.currentUser.id).subscribe({
        next: (suggestions) => {
          console.log('AI suggestions loaded:', suggestions);
          this.aiSuggestions = suggestions;
        },
        error: (error) => {
          console.error('Error loading AI suggestions:', error);
          // Add fallback sample data if API fails
          this.aiSuggestions = this.getFallbackSuggestions();
        }
      });
    }
  }

  getFallbackSuggestions(): any[] {
    return [
      {
        id: 1,
        title: "Improve Time Management",
        description: "Based on your work patterns, consider using time-blocking techniques to improve productivity.",
        category: "PRODUCTIVITY",
        priority: "HIGH",
        type: "IMPROVEMENT",
        status: "ACTIVE",
        aiScore: 0.85,
        userName: this.currentUser?.firstName + ' ' + this.currentUser?.lastName
      },
      {
        id: 2,
        title: "Learn Advanced Skills",
        description: "Consider expanding your technical knowledge to take on more complex projects.",
        category: "SKILLS",
        priority: "MEDIUM",
        type: "OPPORTUNITY",
        status: "ACTIVE",
        aiScore: 0.78,
        userName: this.currentUser?.firstName + ' ' + this.currentUser?.lastName
      }
    ];
  }

  loadAvailableUsers(): void {
    this.userService.getUsers(0, 100).subscribe({
      next: (response: any) => {
        let filteredUsers = response.content;
        
        // For managers and employees, only show users in their department
        if (this.currentUser?.role === 'MANAGER' || this.currentUser?.role === 'EMPLOYEE') {
          filteredUsers = filteredUsers.filter((user: any) => 
            user.department === this.currentUser.department
          );
        }
        // For employees, prevent selecting self
        if (this.currentUser?.role === 'EMPLOYEE') {
          filteredUsers = filteredUsers.filter((user: any) => user.id !== this.currentUser?.id);
        }
        // For admins, show all users (including self)
        
        this.availableUsers = filteredUsers;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.availableUsers = [];
      }
    });
  }

  openGoalModal(goal?: PerformanceGoal): void {
    this.editingGoal = goal || undefined;
    this.showGoalModal = true;
  }

  openFeedbackModal(isRequesting = false): void {
    // Check if we have available users for feedback
    if (isRequesting && this.availableUsers.length === 0) {
      // Try to reload users if none available
      this.loadAvailableUsers();
      // Show a message that we're loading users
      console.log('Loading available users for feedback...');
    }
    
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
      // If admin/manager assigned to someone else in the modal, keep that userId.
      // Otherwise default to current user.
      if (!goalData.userId) {
        goalData.userId = this.currentUser.id;
      }
      this.performanceService.createGoal(goalData).subscribe({
        next: (newGoal) => {
          // Only add to local list if it's for the current user; otherwise, just confirm and refresh if needed.
          if (newGoal.userId === this.currentUser.id) {
            this.goals.push(newGoal);
          } else {
            // If manager/admin assigned to someone else, refresh the current view so it appears immediately
            this.loadGoals();
          }
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
      // Create feedback request
      const requestData = {
        requesterId: this.currentUser.id,
        recipientId: feedbackData.recipientId,
        feedbackType: feedbackData.type,
        reviewPeriod: feedbackData.reviewPeriod,
        message: feedbackData.comment || ''
      };
      this.performanceService.createFeedbackRequest(requestData).subscribe({
        next: (newRequest) => {
          this.closeFeedbackModal();
          // Update badge immediately
          this.loadFeedbackRequests();
        },
        error: (error) => {
          console.error('Error creating feedback request:', error);
        }
      });
    } else {
      // Submit feedback
      feedbackData.reviewerId = this.currentUser.id;
      if (!feedbackData.recipientId) {
        feedbackData.recipientId = this.currentUser.id;
        feedbackData.type = 'SELF' as any;
      }
      if (!this.anonymousFeedbackEnabled) {
        feedbackData.isAnonymous = false;
      }
      this.performanceService.createFeedback(feedbackData).subscribe({
        next: (newFeedback) => {
          this.loadFeedback();
          // If feedback was in response to a request, mark request completed and remove from list immediately
          if (this.currentRespondingRequest?.id) {
            const reqId = this.currentRespondingRequest.id;
            this.performanceService.updateFeedbackRequestStatus(reqId, 'COMPLETED').subscribe({
              next: () => {
                this.receivedRequests = this.receivedRequests.filter(r => r.id !== reqId);
              },
              error: () => {
                // fallback to refresh
                this.loadFeedbackRequests();
              }
            });
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
    this.requestPreset = {};
    this.lockRecipientAndType = false;
    this.currentRespondingRequest = null;
  }

  updateGoal(goal: PerformanceGoal): void {
    this.openGoalModal(goal);
  }

  canEditGoal(goal: PerformanceGoal): boolean {
    const role = this.currentUser?.role;
    if (role === 'ADMIN') return true;
    if (role === 'MANAGER') return true;
    // Employees can update only their own goals' progress via Update
    return role === 'EMPLOYEE' && goal.userId === this.currentUser?.id;
  }

  viewGoalDetails(goal: PerformanceGoal): void {
    this.selectedGoal = goal;
    this.showGoalDetails = true;
  }

  closeGoalDetails(): void {
    this.showGoalDetails = false;
    this.selectedGoal = null;
  }

  implementSuggestion(suggestion: AISuggestion): void {
    this.selectedSuggestion = suggestion;
    this.implementationNotes = '';
    this.showSuggestionModal = true;
  }

  saveImplementation(): void {
    if (this.selectedSuggestion && this.implementationNotes.trim()) {
      this.performanceService.implementSuggestion(this.selectedSuggestion.id!, this.implementationNotes).subscribe({
        next: (updatedSuggestion) => {
          const index = this.aiSuggestions.findIndex(s => s.id === updatedSuggestion.id);
          if (index !== -1) {
            this.aiSuggestions[index] = updatedSuggestion;
          }
          this.closeSuggestionModal();
        },
        error: (error) => {
          console.error('Error implementing suggestion:', error);
          alert('Failed to implement suggestion. Please try again.');
        }
      });
    } else {
      alert('Please enter implementation notes.');
    }
  }

  closeSuggestionModal(): void {
    this.showSuggestionModal = false;
    this.selectedSuggestion = null;
    this.implementationNotes = '';
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

  respondToRequest(req: FeedbackRequest): void {
    // Open give-feedback modal prefilled and locked to requester/type/period
    this.requestPreset = {
      recipientId: req.requesterId,
      type: req.feedbackType as any,
      reviewPeriod: req.reviewPeriod || 'Q4 2024'
    };
    this.lockRecipientAndType = true;
    this.currentRespondingRequest = req;
    this.openFeedbackModal(false);
  }

  updateRequestStatus(req: FeedbackRequest, status: 'ACCEPTED' | 'DECLINED'): void {
    this.performanceService.updateFeedbackRequestStatus(req.id!, status).subscribe({
      next: (updated) => {
        // Refresh both lists
        this.loadFeedbackRequests();
      },
      error: (error) => {
        console.error('Failed to update request status', error);
      }
    });
  }

  dismissRequest(req: FeedbackRequest): void {
    this.updateRequestStatus(req, 'DECLINED');
    // Optimistic update for snappy UI
    this.receivedRequests = this.receivedRequests.filter(r => r.id !== req.id);
  }

  getGoalStatusClass(goal: PerformanceGoal): string {
    const status = (goal.status || '').toString().toLowerCase();
    switch (status) {
      case 'on_track':
      case 'ontrack':
      case 'on-track':
        return 'goal-status on-track';
      case 'at_risk':
      case 'atrisk':
      case 'at-risk':
        return 'goal-status at-risk';
      case 'completed':
        return 'goal-status completed';
      case 'overdue':
        return 'goal-status at-risk';
      default:
        return 'goal-status';
    }
  }

  openRequestsModal(): void {
    this.showRequestsPopover = true;
  }

  getSuggestionStatusClass(suggestion: AISuggestion): string {
    switch (suggestion.status) {
      case 'IMPLEMENTED':
        return 'suggestion-status implemented';
      case 'DISMISSED':
        return 'suggestion-status dismissed';
      case 'EXPIRED':
        return 'suggestion-status expired';
      default:
        return 'suggestion-status active';
    }
  }

  getPriorityClass(suggestion: AISuggestion): string {
    switch (suggestion.priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'PRODUCTIVITY':
        return '⚡';
      case 'SKILLS':
        return '🎯';
      case 'LEADERSHIP':
        return '👥';
      case 'COMMUNICATION':
        return '💬';
      case 'CAREER_GROWTH':
        return '📈';
      case 'TEAMWORK':
        return '🤝';
      default:
        return '💡';
    }
  }

  generateNewSuggestions(): void {
    // This would typically call an AI service to generate new suggestions
    // For now, we'll show a message and reload existing suggestions
    alert('AI suggestion generation feature is being developed. For now, showing existing suggestions.');
    this.loadAISuggestions();
  }

  getAppraisalStatusClass(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'appraisal-status draft';
      case 'SUBMITTED':
        return 'appraisal-status submitted';
      case 'COMPLETED':
        return 'appraisal-status completed';
      default:
        return 'appraisal-status';
    }
  }

  canEditAppraisal(appraisal: Appraisal): boolean {
    // Only managers and admins can edit appraisals
    if (!this.isAdmin && this.currentUser?.role !== 'MANAGER') {
      return false;
    }
    
    // Can only edit draft and submitted appraisals
    return appraisal.status === 'DRAFT' || appraisal.status === 'SUBMITTED';
  }

  editAppraisal(appraisal: Appraisal): void {
    // Set the form data for editing
    this.appraisalForm = {
      id: appraisal.id,
      employeeId: appraisal.employeeId,
      managerId: appraisal.managerId,
      period: appraisal.period,
      rating: appraisal.rating,
      achievements: appraisal.achievements,
      improvements: appraisal.improvements,
      goals: appraisal.goals,
      status: appraisal.status,
      employeeComments: appraisal.employeeComments,
      managerComments: appraisal.managerComments
    };
    
    // Open the modal for editing
    this.showAppraisalModal = true;
    this.isEditingAppraisal = true;
  }
} 