import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-performance',
  template: `
    <div class="performance-container">
      <!-- Header -->
      <div class="performance-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Performance Management</h1>
            <p>Track and manage employee performance reviews</p>
          </div>
          <div class="header-actions">
            <button class="new-review-btn" (click)="openNewReviewModal()" [disabled]="isCreatingReview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ isCreatingReview ? 'Creating...' : 'New Review' }}
            </button>
            <button class="refresh-btn" (click)="loadPerformanceData()" [disabled]="loading">
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

      <!-- Statistics Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon completed-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Completed Reviews</h3>
              <p class="stat-number">{{ completedReviews }}</p>
              <span class="stat-change positive">+12 this month</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon pending-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Pending Reviews</h3>
              <p class="stat-number">{{ pendingReviews }}</p>
              <span class="stat-change neutral">Requires attention</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon average-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Average Rating</h3>
              <p class="stat-number">{{ averageRating }}/5</p>
              <span class="stat-change positive">+0.3 from last quarter</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon goals-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>Goals Achieved</h3>
              <p class="stat-number">{{ goalsAchieved }}%</p>
              <span class="stat-change positive">+8% from last quarter</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>Loading performance data...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error-container">
        <div class="error-card">
          <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="error-content">
            <h3>Error Loading Data</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" (click)="loadPerformanceData()">Try Again</button>
          </div>
        </div>
      </div>

      <!-- Performance Content -->
      <div *ngIf="!loading && !error" class="performance-content">
        <!-- Filters -->
        <div class="filters-section">
          <div class="filters-content">
            <div class="filter-group">
              <label>Review Status</label>
              <select [(ngModel)]="selectedStatus" (change)="onStatusChange()" class="filter-select">
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Review Type</label>
              <select [(ngModel)]="selectedReviewType" (change)="onReviewTypeChange()" class="filter-select">
                <option value="">All Types</option>
                <option value="ANNUAL">Annual Review</option>
                <option value="QUARTERLY">Quarterly Review</option>
                <option value="MONTHLY">Monthly Review</option>
                <option value="PROJECT">Project Review</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Rating</label>
              <select [(ngModel)]="selectedRating" (change)="onRatingChange()" class="filter-select">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Performance Reviews Table -->
        <div class="performance-table-container">
          <div class="table-header">
            <h2>Performance Reviews</h2>
            <div class="table-actions">
              <button class="export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="performance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Review Type</th>
                  <th>Review Period</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Reviewer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let review of performanceReviews" class="table-row">
                  <td class="employee-cell">
                    <div class="employee-info">
                      <div class="employee-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p class="employee-name">{{ review.employeeName }}</p>
                        <p class="employee-id">{{ review.employeeId }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="review-type-badge" [ngClass]="'type-' + review.reviewType.toLowerCase()">
                      {{ review.reviewType }}
                    </span>
                  </td>
                  <td>{{ review.reviewPeriod | date:'MMM yyyy' }}</td>
                  <td>
                    <div class="rating-display">
                      <div class="stars">
                        <span *ngFor="let star of [1,2,3,4,5]" 
                              class="star" 
                              [ngClass]="{'filled': star <= review.rating, 'empty': star > review.rating}">
                          ★
                        </span>
                      </div>
                      <span class="rating-text">{{ review.rating }}/5</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" [ngClass]="'status-' + review.status.toLowerCase()">
                      {{ review.status }}
                    </span>
                  </td>
                  <td>{{ review.reviewerName }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn view-btn" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button *ngIf="review.status === 'PENDING'" class="action-btn edit-btn" title="Edit Review">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button class="action-btn download-btn" title="Download Report">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="performanceReviews.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>No performance reviews found</h3>
            <p>Try adjusting your filters or create a new review</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->
    <app-success-dialog
      [isOpen]="showSuccessDialog"
      [title]="successDialogData.title"
      [message]="successDialogData.message"
      (close)="closeSuccessDialog()">
    </app-success-dialog>
  `,
  styles: [`
    .performance-container {
      min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .performance-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 40px;
      color: white;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      font-size: 16px;
      opacity: 0.95;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .new-review-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .new-review-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .refresh-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .stats-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .completed-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .pending-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .average-icon {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }

    .goals-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-number {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 800;
      color: #1f2937;
    }

    .stat-change {
      font-size: 12px;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #10b981;
    }

    .stat-change.negative {
      color: #ef4444;
    }

    .stat-change.neutral {
      color: #6b7280;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }

    .error-card {
      background: white;
      border: 1px solid #fecaca;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 500px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
      color: #ef4444;
      flex-shrink: 0;
    }

    .error-content h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .error-content p {
      margin: 0 0 16px 0;
      color: #6b7280;
    }

    .retry-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .retry-btn:hover {
      background: #5a67d8;
    }

    .performance-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px 40px;
    }

    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

    .filters-content {
      display: flex;
      gap: 24px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #1f2937;
      font-size: 14px;
      min-width: 150px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .performance-table-container {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .table-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .export-btn:hover {
      background: #5a67d8;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .performance-table {
      width: 100%;
      border-collapse: collapse;
    }

    .performance-table th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .performance-table td {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      color: #1f2937;
      font-size: 14px;
    }

    .table-row:hover {
      background: #f9fafb;
    }

    .employee-cell {
      min-width: 200px;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .employee-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .employee-name {
      margin: 0 0 2px 0;
      font-weight: 600;
      color: #1f2937;
    }

    .employee-id {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .review-type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .type-annual {
      background: #dbeafe;
      color: #1e40af;
    }

    .type-quarterly {
      background: #dcfce7;
      color: #166534;
    }

    .type-monthly {
      background: #fef3c7;
      color: #92400e;
    }

    .type-project {
      background: #fce7f3;
      color: #be185d;
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 16px;
      line-height: 1;
    }

    .star.filled {
      color: #fbbf24;
    }

    .star.empty {
      color: #d1d5db;
    }

    .rating-text {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-completed {
      background: #dcfce7;
      color: #166534;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-in_progress {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-overdue {
      background: #fee2e2;
      color: #991b1b;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn {
      background: #f3f4f6;
      color: #6b7280;
    }

    .view-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .edit-btn {
      background: #667eea;
      color: white;
    }

    .edit-btn:hover {
      background: #5a67d8;
    }

    .download-btn {
      background: #10b981;
      color: white;
    }

    .download-btn:hover {
      background: #059669;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #6b7280;
    }

    .empty-state h3 {
      margin: 16px 0 8px 0;
      color: #374151;
      font-size: 20px;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .performance-header {
        padding: 24px 20px;
      }

      .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .stats-section {
        padding: 24px 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .performance-content {
        padding: 0 16px 24px;
      }

      .filters-content {
        flex-direction: column;
        gap: 16px;
      }

      .filter-select {
        min-width: auto;
      }

      .table-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .performance-table th,
      .performance-table td {
        padding: 8px;
        font-size: 12px;
      }

      .employee-cell {
        min-width: 150px;
      }
    }
  `]
})
export class PerformanceComponent implements OnInit {
  performanceReviews: any[] = [];
  loading = true;
  error = '';
  selectedStatus = '';
  selectedReviewType = '';
  selectedRating = '';
  completedReviews = 28;
  pendingReviews = 5;
  averageRating = 4.2;
  goalsAchieved = 85;
  isCreatingReview = false;

  // Dialog states
  showSuccessDialog = false;
  successDialogData = { title: '', message: '' };

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.loadPerformanceData();
  }

  loadPerformanceData(): void {
    this.loading = true;
    this.error = '';

    this.performanceService.getPerformance().subscribe({
      next: (response: any) => {
        this.performanceReviews = response.content || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading performance data:', error);
        this.error = 'Failed to load performance data';
        this.loading = false;
      }
    });
  }

  onStatusChange(): void {
    // Handle status filter change
  }

  onReviewTypeChange(): void {
    // Handle review type filter change
  }

  onRatingChange(): void {
    // Handle rating filter change
  }

  openNewReviewModal(): void {
    this.isCreatingReview = true;
    
    // TODO: Implement new review modal
    // In a real implementation, this would open a modal for creating a new review
    setTimeout(() => {
      this.isCreatingReview = false;
      this.showSuccessMessage('New review modal will be implemented. This would allow creating performance reviews for employees.');
    }, 1000);
  }

  showSuccessMessage(message: string): void {
    this.successDialogData = {
      title: 'Information',
      message: message
    };
    this.showSuccessDialog = true;
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }
} 