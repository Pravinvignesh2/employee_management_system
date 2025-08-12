import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User, UserResponse } from '../../models/user.model';
import { ReviewService, Review } from '../../services/review.service';
import { ProjectService, Project } from '../../services/project.service';
import { DocumentService, Document } from '../../services/document.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <h1>My Profile</h1>
          <div class="header-actions">
            <button *ngIf="!isEditMode && activeTab === 'personal'" class="btn-secondary" (click)="toggleEditMode()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 18.9609 21.7893 19.3358 21.4142C19.7107 21.0391 19.9214 20.5304 19.9214 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Edit Profile
            </button>
            <button *ngIf="isEditMode" class="btn-secondary" (click)="saveProfile()" [disabled]="!profileForm.dirty || isSaving">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button *ngIf="isEditMode" class="btn-secondary" (click)="cancelEdit()" [disabled]="isSaving">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-content" *ngIf="currentUser">
        <!-- Profile Info Card -->
        <div class="profile-info-card">
          <div class="profile-picture">
            <div class="avatar">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="status-indicator" [class]="getStatusClass()"></div>
          </div>
          <div class="profile-details">
            <h2>{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
            <p class="role">{{ currentUser.role }}</p>
            <p class="department">{{ currentUser.department }}</p>
            <p class="email">{{ currentUser.email }}</p>
            <p class="employee-id">ID: {{ currentUser.employeeId }}</p>
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
                         <!-- Personal Info Tab -->
             <div *ngIf="activeTab === 'personal'" class="tab-panel">
               <div class="form-section">
                 <h3>Personal Information</h3>
                 
                 <!-- Read-only view -->
                 <div *ngIf="!isEditMode" class="info-display">
                   <div class="info-grid">
                     <div class="info-item">
                       <label>First Name</label>
                                               <span>{{ currentUser.firstName }}</span>
                     </div>
                     <div class="info-item">
                       <label>Last Name</label>
                                               <span>{{ currentUser.lastName }}</span>
                     </div>
                     <div class="info-item">
                       <label>Phone Number</label>
                                               <span>{{ currentUser.phoneNumber }}</span>
                     </div>
                     <div class="info-item">
                       <label>Email</label>
                                               <span>{{ currentUser.email }}</span>
                     </div>
                     <div class="info-item">
                       <label>Role</label>
                                               <span>{{ currentUser.role }}</span>
                     </div>
                     <div class="info-item">
                       <label>Department</label>
                                               <span>{{ currentUser.department }}</span>
                     </div>
                     <div class="info-item full-width">
                       <label>Date of Birth</label>
                       <span>{{ profileForm.get('dateOfBirth')?.value || 'Not provided' }}</span>
                     </div>
                     <div class="info-item full-width">
                       <label>Address</label>
                       <span>{{ profileForm.get('address')?.value || 'Not provided' }}</span>
                     </div>
                     <div class="info-item">
                       <label>Emergency Contact</label>
                       <span>{{ profileForm.get('emergencyContact')?.value || 'Not provided' }}</span>
                     </div>
                   </div>
                 </div>

                 <!-- Edit form -->
                 <form *ngIf="isEditMode" [formGroup]="profileForm" class="profile-form">
                   <div class="form-grid">
                     <div class="form-group">
                       <label for="firstName">First Name *</label>
                       <input 
                         type="text" 
                         id="firstName"
                         formControlName="firstName"
                         class="form-input"
                         [disabled]="true">
                       <div class="error-message" *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                         First name is required
                       </div>
                     </div>

                     <div class="form-group">
                       <label for="lastName">Last Name *</label>
                       <input 
                         type="text" 
                         id="lastName"
                         formControlName="lastName"
                         class="form-input"
                         [disabled]="true">
                       <div class="error-message" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                         Last name is required
                       </div>
                     </div>

                     <div class="form-group">
                       <label for="phoneNumber">Phone Number *</label>
                       <input 
                         type="tel" 
                         id="phoneNumber"
                         formControlName="phoneNumber"
                         class="form-input">
                       <div class="error-message" *ngIf="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched">
                         Phone number is required
                       </div>
                     </div>

                     <div class="form-group">
                       <label for="dateOfBirth">Date of Birth</label>
                       <input 
                         type="date" 
                         id="dateOfBirth"
                         formControlName="dateOfBirth"
                         class="form-input">
                     </div>

                     <div class="form-group full-width">
                       <label for="address">Address</label>
                       <textarea 
                         id="address"
                         formControlName="address"
                         rows="3"
                         class="form-textarea"></textarea>
                     </div>

                     <div class="form-group">
                       <label for="emergencyContact">Emergency Contact</label>
                       <input 
                         type="text" 
                         id="emergencyContact"
                         formControlName="emergencyContact"
                         class="form-input">
                     </div>
                   </div>
                 </form>
               </div>
             </div>

            <!-- Documents Tab -->
            <div *ngIf="activeTab === 'documents'" class="tab-panel">
              <div class="documents-header">
                <h3>My Documents</h3>
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

            <!-- Projects Tab -->
            <div *ngIf="activeTab === 'projects'" class="tab-panel">
              <div class="projects-header">
                <h3>My Projects</h3>
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
                <h3>My Performance Reviews</h3>
              </div>
              <div class="reviews-grid">
                <div class="review-card" *ngFor="let review of reviews">
                  <div class="review-header">
                    <h4>{{ review.title }}</h4>
                    <span class="review-date">{{ review.reviewDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="review-rating">
                    <span class="rating-label">Overall Rating:</span>
                    <div class="stars">
                      <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= review.rating">★</span>
                    </div>
                  </div>
                  <p class="review-summary">{{ review.summary }}</p>
                  <div class="reviewer">
                    <span>Reviewed by: {{ review.reviewerName }}</span>
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
        <p>Loading profile...</p>
      </div>

      <!-- Document Upload Modal -->
      <app-document-upload-modal
        [isOpen]="showDocumentModal"
        [employeeId]="currentUser?.id || null"
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

    .header-content h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
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

    .profile-info-card {
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

    .profile-details h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .profile-details p {
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

    .profile-form {
      max-width: 800px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

         .form-grid {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
       gap: 20px;
     }

     .info-display {
       max-width: 800px;
     }

     .info-grid {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
       gap: 20px;
     }

     .info-item {
       margin-bottom: 20px;
     }

     .info-item.full-width {
       grid-column: 1 / -1;
     }

     .info-item label {
       display: block;
       margin-bottom: 6px;
       font-weight: 500;
       color: var(--text-secondary);
       font-size: 14px;
     }

     .info-item span {
       display: block;
       padding: 12px 16px;
       background: var(--background-color);
       border: 1px solid var(--border-color);
       border-radius: 8px;
       font-size: 14px;
       color: var(--text-primary);
       min-height: 20px;
     }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
    }

    .documents-header, .projects-header, .reviews-header {
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

    .loading-container {
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

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-dark);
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:disabled {
      background: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .profile-content {
        padding: 16px;
      }

      .profile-info-card {
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

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: UserResponse | null = null;
  loading = true;
  isSaving = false;
  isEditMode = false;
  activeTab = 'personal';
  showDocumentModal = false;
  
  // Mock data for demonstration
  documents: Document[] = [];

  projects: Project[] = [];

  reviews: Review[] = [];

  tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'documents', label: 'Documents' },
    { id: 'projects', label: 'Projects' },
    { id: 'reviews', label: 'Reviews' }
  ];

  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private projectService: ProjectService,
    private documentService: DocumentService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: ['', Validators.required],
      dateOfBirth: [''],
      address: [''],
      emergencyContact: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadReviews();
    
    // Check for query parameters to automatically enter edit mode
    this.route.queryParams.subscribe(params => {
      if (params['edit'] === 'true') {
        // Wait for user to load, then enter edit mode
        setTimeout(() => {
          if (this.currentUser) {
            this.isEditMode = true;
            // Clear the query parameter after entering edit mode
            this.router.navigate(['/profile'], { replaceUrl: true });
          }
        }, 100);
      }
    });
  }

  loadCurrentUser(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.initializeForm();
      this.loadProjects(); // Load projects after user is loaded
      this.loadDocuments(); // Load documents after user is loaded
      this.loading = false;
    } else {
      // If no user in storage, try to get from API
      this.authService.getCurrentUserInfo().subscribe({
        next: (userInfo) => {
          this.currentUser = userInfo;
          this.initializeForm();
          this.loadProjects(); // Load projects after user is loaded
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading current user:', error);
          this.loading = false;
        }
      });
    }
  }

  initializeForm(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        phoneNumber: this.currentUser.phoneNumber,
        dateOfBirth: this.currentUser.dateOfBirth ? new Date(this.currentUser.dateOfBirth).toISOString().split('T')[0] : '',
        address: this.currentUser.address || '',
        emergencyContact: this.currentUser.emergencyContact || ''
      });
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    // Refresh projects when switching to projects tab
    if (tabId === 'projects') {
      this.loadProjects();
    }
  }

  getStatusClass(): string {
    if (!this.currentUser) return 'inactive';
    return this.currentUser.status === 'ACTIVE' ? 'active' : 'inactive';
  }

  isAdminOrManager(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'ADMIN' || this.currentUser.role === 'MANAGER';
  }

  getProjectStatusClass(status: string): string {
    return status === 'active' ? 'active' : 'completed';
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isSaving = true;
      const updatedData = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phoneNumber: this.profileForm.value.phoneNumber,
        dateOfBirth: this.profileForm.value.dateOfBirth ? this.profileForm.value.dateOfBirth : undefined,
        address: this.profileForm.value.address,
        emergencyContact: this.profileForm.value.emergencyContact,
        role: this.currentUser.role,
        department: this.currentUser.department
      };

      this.userService.updateUser(this.currentUser.id, updatedData).subscribe({
        next: (updatedUser) => {
          // Refresh user data from backend to ensure we have the latest data
          this.authService.getCurrentUserInfo().subscribe({
            next: (refreshedUser) => {
              this.currentUser = refreshedUser;
              this.profileForm.markAsPristine();
              this.isSaving = false;
              this.isEditMode = false; // Exit edit mode after successful save
              console.log('Profile updated successfully and refreshed from backend');
            },
            error: (error) => {
              console.error('Error refreshing user data:', error);
              // Fallback to using the updated user data
              if (this.currentUser) {
                this.currentUser = {
                  ...this.currentUser,
                  phoneNumber: updatedUser.phoneNumber,
                  dateOfBirth: updatedUser.dateOfBirth,
                  address: updatedUser.address,
                  emergencyContact: updatedUser.emergencyContact
                } as UserResponse;
              }
              this.profileForm.markAsPristine();
              this.isSaving = false;
              this.isEditMode = false;
              console.log('Profile updated successfully');
            }
          });
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isSaving = false;
        }
      });
    }
  }

  uploadDocument(): void {
    this.showDocumentModal = true;
  }

  closeDocumentModal(): void {
    this.showDocumentModal = false;
  }

  onDocumentUploaded(documentData: any): void {
    if (!this.currentUser?.id) return;
    
    const documentRequest = {
      name: documentData.documentName + '.pdf',
      type: documentData.documentType,
      description: documentData.description,
      userId: this.currentUser.id,
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
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('Downloaded document:', doc.name);
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

  loadProjects(): void {
    if (this.currentUser?.id) {
      this.projectService.getProjectsByEmployee(this.currentUser.id).subscribe(projects => {
        this.projects = projects;
      });
    }
  }

  loadDocuments(): void {
    this.documentService.getCurrentUserDocuments().subscribe(documents => {
      this.documents = documents;
    });
  }

  loadReviews(): void {
    if (!this.currentUser?.id) return;
    this.reviewService.getReviewsByEmployee(this.currentUser.id).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  toggleEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.profileForm.reset();
    this.initializeForm();
  }

  private generateRealisticResume(doc: any): string {
    const employeeName = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Employee Name';
    const employeeId = this.currentUser ? this.currentUser.employeeId : 'EMP000';
    const department = this.currentUser ? this.currentUser.department : 'Department';
    
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
    const employeeName = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Employee Name';
    const employeeId = this.currentUser ? this.currentUser.employeeId : 'EMP000';
    
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
    const employeeName = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Employee Name';
    const employeeId = this.currentUser ? this.currentUser.employeeId : 'EMP000';
    
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
    const employeeName = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Employee Name';
    const employeeId = this.currentUser ? this.currentUser.employeeId : 'EMP000';
    
    return `DOCUMENT

${doc.name.toUpperCase()}

Employee Information:
Name: ${employeeName}
Employee ID: ${employeeId}
Department: ${this.currentUser ? this.currentUser.department : 'Department'}

Document Details:
Type: ${doc.type}
Upload Date: ${new Date().toLocaleDateString()}
Document ID: DOC-${Date.now()}

This document has been uploaded to the Employee Management System
and is maintained as part of the employee's official records.

Document: ${doc.name}`;
  }
}