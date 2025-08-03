import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AttendanceService } from '../../services/attendance.service';
import { User } from '../../models/user.model';
import { ProjectAssignmentModalComponent } from '../../shared/project-assignment-modal/project-assignment-modal.component';
import { DocumentUploadModalComponent } from '../../shared/document-upload-modal/document-upload-modal.component';
import { ProjectService, Project } from '../../services/project.service';
import { DocumentService, Document } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-profile',
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="back-button" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </div>
          <h1>Employee Profile</h1>
          <div class="header-actions">
            <button class="btn-secondary" (click)="openChat()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Message
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-content" *ngIf="employee">
        <!-- Employee Info Card -->
        <div class="employee-info-card">
          <div class="profile-picture">
            <div class="avatar">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="status-indicator" [class]="getStatusClass()"></div>
          </div>
          <div class="employee-details">
            <h2>{{ employee.firstName }} {{ employee.lastName }}</h2>
            <p class="role">{{ employee.role }}</p>
            <p class="department">{{ employee.department }}</p>
            <p class="email">{{ employee.email }}</p>
            <p class="employee-id">ID: {{ employee.employeeId }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
          <div class="tabs-header">
            <button 
              *ngFor="let tab of tabs" 
              class="tab-button" 
              [class.active]="activeTab === tab.id"
              (click)="setActiveTab(tab.id)">
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Overview Tab -->
            <div *ngIf="activeTab === 'overview'" class="tab-panel">
              <div class="overview-grid">
                <div class="info-card">
                  <h3>Personal Information</h3>
                  <div class="info-item">
                    <span class="label">Full Name:</span>
                    <span class="value">{{ employee.firstName }} {{ employee.lastName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Email:</span>
                    <span class="value">{{ employee.email }}</span>
                  </div>
                                     <div class="info-item">
                     <span class="label">Phone:</span>
                     <span class="value">{{ employee.phoneNumber ? employee.phoneNumber : 'Not provided' }}</span>
                   </div>
                   <div class="info-item">
                     <span class="label">Date of Birth:</span>
                     <span class="value">{{ employee.dateOfBirth ? (employee.dateOfBirth | date:'mediumDate') : 'Not provided' }}</span>
                   </div>
                </div>

                <div class="info-card">
                  <h3>Employment Details</h3>
                  <div class="info-item">
                    <span class="label">Employee ID:</span>
                    <span class="value">{{ employee.employeeId }}</span>
                  </div>
                                     <div class="info-item">
                     <span class="label">Date of Joining:</span>
                     <span class="value">{{ employee.dateOfJoining ? (employee.dateOfJoining | date:'mediumDate') : 'Not provided' }}</span>
                   </div>
                  <div class="info-item">
                    <span class="label">Status:</span>
                    <span class="value status-badge" [class]="getStatusClass()">{{ employee.status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job Info Tab -->
            <div *ngIf="activeTab === 'job-info'" class="tab-panel">
              <div class="job-info-grid">
                <div class="info-card">
                  <h3>Position Details</h3>
                                     <div class="info-item">
                     <span class="label">Job Title:</span>
                     <span class="value">{{ employee.role ? employee.role : 'Not specified' }}</span>
                   </div>
                   <div class="info-item">
                     <span class="label">Department:</span>
                     <span class="value">{{ employee.department }}</span>
                   </div>
                   <div class="info-item">
                     <span class="label">Role:</span>
                     <span class="value">{{ employee.role }}</span>
                   </div>
                   <div class="info-item">
                     <span class="label">Manager:</span>
                     <span class="value">{{ employee.managerId ? 'Manager ID: ' + employee.managerId : 'Not assigned' }}</span>
                   </div>
                </div>

                <div class="info-card">
                  <h3>Compensation</h3>
                                     <div class="info-item">
                     <span class="label">Salary:</span>
                     <span class="value">Not specified</span>
                   </div>
                   <div class="info-item">
                     <span class="label">Currency:</span>
                     <span class="value">USD</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- Documents Tab -->
            <div *ngIf="activeTab === 'documents'" class="tab-panel">
              <div class="documents-header">
                <h3>Documents & Certificates</h3>
                <button class="btn-primary" (click)="uploadDocument()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Upload Document
                </button>
              </div>
              <div class="documents-grid">
                <div class="document-card" *ngFor="let doc of documents">
                  <div class="document-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="document-info">
                    <h4>{{ doc.name }}</h4>
                    <p>{{ doc.type }}</p>
                    <span class="upload-date">{{ doc.uploadDate | date:'short' }}</span>
                  </div>
                  <div class="document-actions" *ngIf="isAdminOrManager()">
                    <button class="btn-icon" (click)="downloadDocument(doc)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="btn-icon" (click)="deleteDocument(doc)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attendance Tab -->
            <div *ngIf="activeTab === 'attendance'" class="tab-panel">
              <div class="attendance-header">
                <h3>Attendance Records</h3>
              </div>
              <div class="attendance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Punch In</th>
                      <th>Punch Out</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let record of attendanceRecords">
                      <td>{{ record.date | date:'shortDate' }}</td>
                      <td>{{ formatTime(record.punchInTime) || '-' }}</td>
                      <td>{{ formatTime(record.punchOutTime) || '-' }}</td>
                      <td>{{ formatWorkingHours(record) }}</td>
                      <td>
                        <span class="status-badge" [class]="getAttendanceStatusClass(record.status)">
                          {{ record.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Projects Tab -->
            <div *ngIf="activeTab === 'projects'" class="tab-panel">
              <div class="projects-header">
                <h3>Projects</h3>
                <button class="btn-primary" (click)="assignProject()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Assign Project
                </button>
              </div>
              <div class="projects-grid">
                <div class="project-card" *ngFor="let project of projects">
                  <div class="project-header">
                    <h4>{{ project.name }}</h4>
                    <span class="project-status" [class]="getProjectStatusClass(project.status)">
                      {{ project.status }}
                    </span>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-details">
                    <span class="project-role">{{ project.role }}</span>
                    <span class="project-duration">{{ project.startDate | date:'shortDate' }} - {{ project.endDate | date:'shortDate' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div *ngIf="activeTab === 'reviews'" class="tab-panel">
              <div class="reviews-header">
                <h3>Performance Reviews</h3>
                <button class="btn-primary" (click)="createReview()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Create Review
                </button>
              </div>
              <div class="reviews-grid">
                <div class="review-card" *ngFor="let review of reviews">
                  <div class="review-header">
                    <h4>{{ review.title }}</h4>
                    <span class="review-date">{{ review.date | date:'mediumDate' }}</span>
                  </div>
                  <div class="review-rating">
                    <span class="rating-label">Overall Rating:</span>
                    <div class="stars">
                      <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= review.rating">★</span>
                    </div>
                  </div>
                  <p class="review-summary">{{ review.summary }}</p>
                  <div class="reviewer">
                    <span>Reviewed by: {{ review.reviewer }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading employee profile...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-container">
        <div class="error-card">
          <h3>Error Loading Profile</h3>
          <p>{{ error }}</p>
          <button class="btn-primary" (click)="loadEmployee()">Try Again</button>
        </div>
      </div>

      <!-- Project Assignment Modal -->
      <app-project-assignment-modal
        [isOpen]="showProjectModal"
        [employeeId]="employee?.id || null"
        [employeeName]="employee ? employee.firstName + ' ' + employee.lastName : ''"
        (close)="closeProjectModal()"
        (assign)="onProjectAssigned($event)">
      </app-project-assignment-modal>

      <!-- Document Upload Modal -->
      <app-document-upload-modal
        [isOpen]="showDocumentModal"
        [employeeId]="employee?.id || null"
        (close)="closeDocumentModal()"
        (upload)="onDocumentUploaded($event)">
      </app-document-upload-modal>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background-color: var(--background-color);
      color: var(--text-primary);
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .back-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .employee-info-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .profile-picture {
      position: relative;
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .status-indicator {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }

    .status-indicator.active {
      background-color: #10b981;
    }

    .status-indicator.inactive {
      background-color: #6b7280;
    }

    .employee-details h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .employee-details p {
      margin: 4px 0;
      color: var(--text-secondary);
    }

    .role {
      color: var(--primary-color) !important;
      font-weight: 600;
    }

    .tabs-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--border-color);
    }

    .tab-button {
      flex: 1;
      padding: 16px 24px;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.2s;
    }

    .tab-button:hover {
      background-color: var(--background-color);
    }

    .tab-button.active {
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-color);
    }

    .tab-content {
      padding: 24px;
    }

    .tab-panel {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .overview-grid, .job-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .info-card {
      background: var(--background-color);
      border-radius: 12px;
      padding: 20px;
    }

    .info-card h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: var(--text-secondary);
    }

    .value {
      font-weight: 600;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-badge.inactive {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .documents-header, .attendance-header, .projects-header, .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .documents-grid, .projects-grid, .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .document-card, .project-card, .review-card {
      background: var(--background-color);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid var(--border-color);
    }

    .document-card {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .document-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .document-info {
      flex: 1;
    }

    .document-info h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .document-info p {
      margin: 0 0 4px 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .upload-date {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .document-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: var(--background-color);
      border-color: var(--primary-color);
    }

    .attendance-table {
      background: var(--background-color);
      border-radius: 12px;
      overflow: hidden;
    }

    .attendance-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .attendance-table th,
    .attendance-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .attendance-table th {
      background: var(--primary-color);
      color: white;
      font-weight: 600;
    }

    .project-header, .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .project-status, .review-date {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .project-status.active {
      background: #dcfce7;
      color: #166534;
    }

    .project-status.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .project-description {
      margin: 0 0 12px 0;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .project-details {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      color: #d1d5db;
      font-size: 16px;
    }

    .star.filled {
      color: #fbbf24;
    }

    .review-summary {
      margin: 0 0 12px 0;
      line-height: 1.5;
    }

    .reviewer {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      text-align: center;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-primary, .btn-secondary {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    @media (max-width: 768px) {
      .profile-content {
        padding: 16px;
      }

      .employee-info-card {
        flex-direction: column;
        text-align: center;
      }

      .tabs-header {
        flex-wrap: wrap;
      }

      .tab-button {
        flex: none;
        min-width: 120px;
      }

      .overview-grid, .job-info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeProfileComponent implements OnInit {
  employee: User | null = null;
  loading = true;
  error = '';
  activeTab = 'overview';
  showProjectModal = false;
  showDocumentModal = false;
  
  documents: Document[] = [];

  attendanceRecords: any[] = [];
  attendanceDate = new Date().toISOString().split('T')[0];

  projects: Project[] = [];

  reviews = [
    { id: 1, title: 'Annual Performance Review 2024', date: new Date('2024-01-15'), rating: 4, summary: 'Excellent performance throughout the year', reviewer: 'John Manager' },
    { id: 2, title: 'Mid-Year Review 2023', date: new Date('2023-07-15'), rating: 5, summary: 'Outstanding contribution to team projects', reviewer: 'Sarah Director' }
  ];

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'job-info', label: 'Job Info' },
    { id: 'documents', label: 'Documents' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'projects', label: 'Projects' },
    { id: 'reviews', label: 'Reviews' }
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private attendanceService: AttendanceService,
    private projectService: ProjectService,
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployee();
    this.loadProjects();
  }

  loadEmployee(): void {
    this.loading = true;
    this.error = '';
    
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) {
      this.error = 'Employee ID not provided';
      this.loading = false;
      return;
    }

    this.userService.getUserById(+employeeId).subscribe({
      next: (user) => {
        this.employee = user;
        this.loadAttendanceRecords();
        this.loadProjects(); // Load projects after employee is loaded
        this.loadDocuments(); // Load documents after employee is loaded
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load employee profile';
        this.loading = false;
        console.error('Error loading employee:', error);
      }
    });
  }

  loadAttendanceRecords(): void {
    if (!this.employee) return;

    this.attendanceService.getAttendanceByUser(this.employee.id!).subscribe({
      next: (records) => {
        this.attendanceRecords = records;
      },
      error: (error) => {
        console.error('Error loading attendance records:', error);
      }
    });
  }

  loadProjects(): void {
    if (this.employee?.id) {
      this.projectService.getProjectsByEmployee(this.employee.id).subscribe(projects => {
        this.projects = projects;
      });
    }
  }

  loadDocuments(): void {
    if (this.employee?.id) {
      this.documentService.getDocumentsByUser(this.employee.id).subscribe(documents => {
        this.documents = documents;
      });
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getStatusClass(): string {
    if (!this.employee) return 'inactive';
    return this.employee.status === 'ACTIVE' ? 'active' : 'inactive';
  }

  isAdminOrManager(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;
    return currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';
  }

  getAttendanceStatusClass(status: string): string {
    switch (status) {
      case 'PRESENT': return 'active';
      case 'ABSENT': return 'inactive';
      case 'HALF_DAY': return 'warning';
      default: return 'inactive';
    }
  }

  getProjectStatusClass(status: string): string {
    return status === 'active' ? 'active' : 'completed';
  }

  formatWorkingHours(record: any): string {
    let totalHours = 0;
    
    // If working hours are provided, use them
    if (record.workingHours !== undefined || record.workingMinutes !== undefined) {
      totalHours = (record.workingHours || 0) + (record.workingMinutes || 0) / 60;
    } 
    // Otherwise, calculate from punch in and punch out times
    else if (record.punchInTime && record.punchOutTime) {
      const punchIn = new Date(`2000-01-01T${record.punchInTime}`);
      const punchOut = new Date(`2000-01-01T${record.punchOutTime}`);
      const diffMs = punchOut.getTime() - punchIn.getTime();
      totalHours = diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
    }
    
    // If no working hours data available
    if (totalHours <= 0) {
      return '-';
    }
    
    if (totalHours < 1) {
      // Show as decimal for less than 1 hour (e.g., 0.1, 0.2, 0.5)
      return totalHours.toFixed(1);
    } else {
      // Show as hours and minutes for 1 hour or more
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    try {
      // If it's already in HH:MM:SS format, just return it
      if (timeString.includes(':') && timeString.split(':').length >= 2) {
        const parts = timeString.split(':');
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2] ? parts[2].split('.')[0].padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
      }
      
      // If it's a full date string, parse it
      const time = new Date(timeString);
      if (isNaN(time.getTime())) {
        return timeString; // Return original if parsing fails
      }
      
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return timeString; // Return original if any error occurs
    }
  }

  goBack(): void {
    window.history.back();
  }

  openChat(): void {
    // Implement chat functionality
    console.log('Opening chat with', this.employee?.firstName);
  }



  downloadDocument(doc: any): void {
    // Generate realistic document content based on document type
    let content = '';
    const documentType = doc.type.toLowerCase();
    
    if (documentType.includes('resume')) {
      content = this.generateRealisticResume(doc);
    } else if (documentType.includes('certificate') || documentType.includes('degree')) {
      content = this.generateRealisticCertificate(doc);
    } else if (documentType.includes('training')) {
      content = this.generateRealisticTraining(doc);
    } else {
      content = this.generateRealisticDocument(doc);
    }
    
    // Create a blob with the content as PDF
    const blob = new Blob([content], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Downloaded document:', doc.name);
  }
  
  private generateRealisticResume(doc: any): string {
    const employeeName = this.employee ? `${this.employee.firstName} ${this.employee.lastName}` : 'Employee Name';
    const employeeId = this.employee ? this.employee.employeeId : 'EMP000';
    const department = this.employee ? this.employee.department : 'Department';
    
    return `RESUME

${employeeName}
${employeeId}
${department}

PROFESSIONAL SUMMARY
Experienced professional with expertise in ${department.toLowerCase()} operations and team collaboration. 
Demonstrated ability to deliver high-quality results in fast-paced environments.

EDUCATION
• Bachelor's Degree in ${department} or related field
• Relevant certifications and training programs

EXPERIENCE
• ${department} Specialist at Vibe Coding Solutions
• Previous experience in similar roles
• Strong analytical and problem-solving skills

SKILLS
• Technical skills relevant to ${department}
• Communication and teamwork
• Project management
• Problem solving and critical thinking

REFERENCES
Available upon request

Generated on: ${new Date().toLocaleDateString()}
Document: ${doc.name}`;
  }
  
  private generateRealisticCertificate(doc: any): string {
    const employeeName = this.employee ? `${this.employee.firstName} ${this.employee.lastName}` : 'Employee Name';
    const employeeId = this.employee ? this.employee.employeeId : 'EMP000';
    
    return `CERTIFICATE OF COMPLETION

This is to certify that

${employeeName}
Employee ID: ${employeeId}

Has successfully completed the required education and training programs
as specified by Vibe Coding Solutions.

Certificate Type: ${doc.type}
Issue Date: ${new Date().toLocaleDateString()}
Certificate ID: CERT-${Date.now()}

This certificate is valid and recognized by Vibe Coding Solutions.

Document: ${doc.name}`;
  }
  
  private generateRealisticTraining(doc: any): string {
    const employeeName = this.employee ? `${this.employee.firstName} ${this.employee.lastName}` : 'Employee Name';
    const employeeId = this.employee ? this.employee.employeeId : 'EMP000';
    
    return `TRAINING CERTIFICATE

${employeeName}
Employee ID: ${employeeId}

Has successfully completed the training program:

${doc.type.toUpperCase()} TRAINING

Training Details:
• Program: ${doc.type} Training
• Completion Date: ${new Date().toLocaleDateString()}
• Training ID: TRAIN-${Date.now()}
• Status: Completed

This training certificate is issued by Vibe Coding Solutions
and is valid for professional development records.

Document: ${doc.name}`;
  }
  
  private generateRealisticDocument(doc: any): string {
    const employeeName = this.employee ? `${this.employee.firstName} ${this.employee.lastName}` : 'Employee Name';
    const employeeId = this.employee ? this.employee.employeeId : 'EMP000';
    
    return `DOCUMENT

${doc.name.toUpperCase()}

Employee Information:
Name: ${employeeName}
Employee ID: ${employeeId}
Department: ${this.employee ? this.employee.department : 'Department'}

Document Details:
Type: ${doc.type}
Upload Date: ${new Date().toLocaleDateString()}
Document ID: DOC-${Date.now()}

This document has been uploaded to the Employee Management System
and is maintained as part of the employee's official records.

Document: ${doc.name}`;
  }

  deleteDocument(doc: any): void {
    this.documentService.deleteDocument(doc.id).subscribe({
      next: () => {
        this.loadDocuments(); // Reload documents to reflect the deletion
        console.log('Deleted document:', doc.name);
      },
      error: (error) => {
        console.error('Error deleting document:', error);
      }
    });
  }

  assignProject(): void {
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
  }

  onProjectAssigned(projectData: any): void {
    // Add the new project using the project service
    const newProject = {
      name: projectData.projectName,
      description: projectData.description,
      status: projectData.status,
      role: projectData.role,
      startDate: new Date(projectData.startDate),
      endDate: projectData.endDate ? new Date(projectData.endDate) : new Date(),
      priority: projectData.priority,
      budget: projectData.budget,
      employeeId: this.employee?.id || 0,
      employeeName: this.employee ? `${this.employee.firstName} ${this.employee.lastName}` : 'Unknown'
    };
    
    this.projectService.addProject(newProject).subscribe({
      next: (project) => {
        this.loadProjects(); // Reload projects to show the new assignment
        this.closeProjectModal();
        console.log('Project assigned:', project);
      },
      error: (error) => {
        console.error('Error assigning project:', error);
        this.closeProjectModal();
      }
    });
  }

  uploadDocument(): void {
    this.showDocumentModal = true;
  }

  closeDocumentModal(): void {
    this.showDocumentModal = false;
  }

  onDocumentUploaded(documentData: any): void {
    if (!this.employee?.id) return;
    
    const documentRequest = {
      name: documentData.documentName + '.pdf',
      type: documentData.documentType,
      description: documentData.description,
      userId: this.employee.id,
      expiryDate: documentData.expiryDate ? new Date(documentData.expiryDate) : undefined
    };
    
    this.documentService.createDocument(documentRequest).subscribe({
      next: (document) => {
        this.loadDocuments(); // Reload documents to show the new upload
        this.closeDocumentModal();
        console.log('Document uploaded:', document);
      },
      error: (error) => {
        console.error('Error uploading document:', error);
        this.closeDocumentModal();
      }
    });
  }

  createReview(): void {
    // Implement review creation
    console.log('Create review');
  }
} 