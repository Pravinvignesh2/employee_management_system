import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardActivity } from '../../services/dashboard.service';
import { User, UserStatistics } from '../../models/user.model';
import { AttendanceStatistics } from '../../models/attendance.model';
import { LeaveStatistics } from '../../models/leave.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <button class="refresh-btn" (click)="refreshData()" [disabled]="loading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.49 9C19.2214 5.33805 15.7011 2.5 11.5 2.5C6.80546 2.5 2.5 6.80546 2.5 11.5C2.5 16.1945 6.80546 20.5 11.5 20.5C15.7011 20.5 19.2214 17.662 20.49 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="error-container">
        <div class="error-card">
          <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="error-content">
            <h3>Error Loading Data</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" (click)="refreshData()">Try Again</button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading && !error" class="dashboard-content">
        
        <!-- Employee Dashboard (For Regular Employees) -->
        <div class="employee-dashboard" *ngIf="!isAdminOrManager">
          
          <!-- Welcome Section -->
          <div class="welcome-section">
            <h2>Welcome, {{ currentUser?.firstName || 'Employee' }}!</h2>
            <p>Here's your personalized dashboard</p>
          </div>

          <!-- Employee Quick Stats -->
          <div class="employee-stats-grid">
            
            <!-- My Attendance -->
            <div class="stat-card employee-card">
              <div class="stat-header">
                <div class="stat-icon attendance-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>My Attendance</h3>
                  <p>Today's status</p>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-item">
                  <span class="stat-label">Today's Status</span>
                  <span class="stat-value" [class]="getTodayAttendanceStatus()">
                    {{ getTodayAttendanceStatus() }}
                  </span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">This Month</span>
                  <span class="stat-value">{{ getMonthlyAttendanceRate() }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Working Hours</span>
                  <span class="stat-value">{{ getTodayWorkingHours() }}</span>
                </div>
              </div>
            </div>

            <!-- Leaves Left -->
            <div class="stat-card employee-card">
              <div class="stat-header">
                <div class="stat-icon leave-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>Leaves Left</h3>
                  <p>Your leave balance</p>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-item">
                  <span class="stat-label">Annual Leave</span>
                  <span class="stat-value">{{ getLeaveBalance('ANNUAL') }} days</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Sick Leave</span>
                  <span class="stat-value">{{ getLeaveBalance('SICK') }} days</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Personal Leave</span>
                  <span class="stat-value">{{ getLeaveBalance('PERSONAL') }} days</span>
                </div>
              </div>
            </div>

            <!-- Upcoming Holidays -->
            <div class="stat-card employee-card">
              <div class="stat-header">
                <div class="stat-icon holiday-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>Upcoming Holidays</h3>
                  <p>Next few holidays</p>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-item" *ngFor="let holiday of getUpcomingHolidays()">
                  <span class="stat-label">{{ holiday.name }}</span>
                  <span class="stat-value">{{ holiday.date | date:'shortDate' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Self-Service Options -->
          <div class="self-service-section">
            <h3>Self-Service Options</h3>
            <div class="service-grid">
              <div class="service-card clickable" (click)="navigateToAttendance()">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h4>Mark Attendance</h4>
                <p>Punch in/out and view records</p>
              </div>
              
              <div class="service-card clickable" (click)="navigateToLeave()">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h4>Request Leave</h4>
                <p>Apply for leave and check status</p>
              </div>
              
              <div class="service-card clickable" (click)="navigateToProfile()">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h4>Update Profile</h4>
                <p>Edit personal information</p>
              </div>
              
              <div class="service-card clickable" (click)="navigateToPayroll()">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h4>View Payroll</h4>
                <p>Check salary and payslips</p>
              </div>
            </div>
          </div>

          <!-- Birthday/Work Anniversary Messages -->
          <div class="messages-section" *ngIf="getSpecialMessages().length > 0">
            <h3>Special Messages</h3>
            <div class="message-cards">
              <div class="message-card" *ngFor="let message of getSpecialMessages()">
                <div class="message-icon" [class]="message.type">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="message-content">
                  <h4>{{ message.title }}</h4>
                  <p>{{ message.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Statistics Cards (Admin/Manager Only) -->
        <div class="stats-grid" *ngIf="isAdminOrManager">
          
          <!-- User Statistics -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon user-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>Employee Statistics</h3>
                <p>Total workforce overview</p>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-item">
                <span class="stat-label">Total Employees</span>
                <span class="stat-value">{{ userStatistics?.totalUsers || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Active Employees</span>
                <span class="stat-value">{{ userStatistics?.activeUsers || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">New Hires (This Month)</span>
                <span class="stat-value">{{ userStatistics?.newHiresThisMonth || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pending Approvals</span>
                <span class="stat-value">{{ userStatistics?.pendingApprovals || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Attendance Statistics -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon attendance-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>Attendance Statistics</h3>
                <p>Today's attendance overview</p>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-item">
                <span class="stat-label">Present Today</span>
                <span class="stat-value">{{ attendanceStatistics?.totalPresent || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Absent Today</span>
                <span class="stat-value">{{ attendanceStatistics?.totalAbsent || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Half Day</span>
                <span class="stat-value">{{ attendanceStatistics?.totalHalfDay || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Attendance Rate</span>
                <span class="stat-value" [ngClass]="'rate-' + getAttendanceRateColor()">
                  {{ getAttendanceRate() | number:'1.1-1' }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Leave Statistics -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon leave-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>Leave Statistics</h3>
                <p>Leave management overview</p>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-item">
                <span class="stat-label">Total Leaves</span>
                <span class="stat-value">{{ leaveStatistics?.totalLeaves || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pending Leaves</span>
                <span class="stat-value">{{ leaveStatistics?.pendingLeaves || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Approved Leaves</span>
                <span class="stat-value">{{ leaveStatistics?.approvedLeaves || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Approval Rate</span>
                <span class="stat-value" [ngClass]="'rate-' + getLeaveApprovalRateColor()">
                  {{ getLeaveApprovalRate() | number:'1.1-1' }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>Quick Actions</h3>
                <p>Common tasks</p>
              </div>
            </div>
            <div class="stat-content">
              <div class="quick-actions">
                <button *ngIf="isAdmin" class="action-btn primary" (click)="navigateToEmployees()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="11" x2="22" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Add Employee
                </button>
                <button class="action-btn accent" (click)="navigateToLeaveManagement()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Approve Leaves
                </button>
                <button class="action-btn warning" (click)="navigateToAttendance()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Mark Attendance
                </button>
                <!-- <button class="action-btn neutral" (click)="navigateToReports()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  View Reports
                </button> -->
              </div>
            </div>
          </div>

        </div>

        <!-- Recent Activities (Admin/Manager Only) -->
        <div class="recent-activities" *ngIf="isAdminOrManager">
          <div class="section-header">
            <h2>Recent Activities</h2>
            <p>Latest updates and notifications</p>
          </div>
          <div class="activities-list">
            <div *ngFor="let activity of recentActivities" class="activity-item">
              <div class="activity-icon" [ngClass]="'icon-' + activity.type.toLowerCase()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.description }}</p>
                <span class="activity-time">{{ activity.timestamp | date:'short' }}</span>
              </div>
            </div>
            <!-- Empty state when no activities -->
            <div *ngIf="recentActivities.length === 0" class="activity-item empty-state">
              <div class="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-text">No recent activities</p>
                <span class="activity-time">Check back later for updates</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 40px;
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-left h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .header-left p {
      margin: 8px 0 0 0;
      color: white;
      opacity: 0.95;
      font-size: 16px;
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

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
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

    .user-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .attendance-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .leave-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .action-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-info h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #6b7280;
      font-size: 14px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-value {
      color: #1f2937;
      font-size: 16px;
      font-weight: 700;
    }

    .rate-success {
      color: #10b981;
    }

    .rate-warning {
      color: #f59e0b;
    }

    .rate-danger {
      color: #ef4444;
    }

    .quick-actions {
      display: flex;
      flex-direction: row;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: white;
      flex: 1;
      min-width: 140px;
      justify-content: center;
    }

    .action-btn.primary {
      background: #667eea;
    }

    .action-btn.accent {
      background: #10b981;
    }

    .action-btn.warning {
      background: #f59e0b;
    }

    .action-btn.neutral {
      background: #6b7280;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }

    .recent-activities {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .section-header p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .icon-user_created {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .icon-leave_approved {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .icon-leave_rejected {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .icon-performance_review {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .icon-attendance_marked {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 4px 0;
      color: #1f2937;
      font-weight: 500;
    }

    .activity-time {
      color: #6b7280;
      font-size: 12px;
    }

    /* Employee Dashboard Styles */
    .employee-dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      text-align: center;
    }

    .welcome-section h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .welcome-section p {
      margin: 0;
      color: white;
      opacity: 0.95;
      font-size: 16px;
    }

    .employee-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .employee-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .self-service-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
    }

    .self-service-section h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }

    .service-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .service-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .service-card.clickable {
      cursor: pointer;
    }

    .service-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      border-color: #667eea;
    }

    .service-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      background: #667eea;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .service-card h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .service-card p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    .messages-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
    }

    .messages-section h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }

    .message-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .message-icon.birthday {
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      color: white;
    }

    .message-icon.anniversary {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
      color: white;
    }

    .message-content h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .message-content p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 24px 20px;
      }

      .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .header-left h1 {
        font-size: 28px;
      }

      .dashboard-content {
        padding: 24px 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .quick-actions {
        flex-direction: column;
        gap: 8px;
      }

      .action-btn {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  
  userStatistics: UserStatistics | null = null;
  attendanceStatistics: AttendanceStatistics | null = null;
  leaveStatistics: LeaveStatistics | null = null;
  currentUser: any = null;
  isAdminOrManager = false;
  isAdmin = false; // Add isAdmin property
  loading = true;
  error = '';
  recentActivities: DashboardActivity[] = [];
  todayAttendance: any = null; // Added for today's attendance
  userAttendanceStats: any = null; // Added for user's attendance statistics
  userLeaves: any[] = []; // Added for user's leave records
  leaveBalance: { [key: string]: number } = {}; // Added for calculated leave balance
  
  constructor(
    private userService: UserService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardData();
    this.loadAttendanceData(); // Add this line to load attendance data
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdminOrManager = this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
    this.isAdmin = this.authService.hasRole('ADMIN'); // Set isAdmin based on role
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load dashboard statistics for admin/manager
    if (this.isAdminOrManager) {
      this.dashboardService.getDashboardStatistics().subscribe({
        next: (stats) => {
          // Map the dashboard statistics to our component properties
          this.userStatistics = {
            totalUsers: stats.totalUsers || 0,
            activeUsers: stats.activeUsers || 0,
            newHiresThisMonth: stats.newHiresThisMonth || 0,
            pendingApprovals: stats.pendingApprovals || 0
          };
          
          this.attendanceStatistics = {
            totalPresent: stats.presentToday || 0,
            totalAbsent: stats.absentToday || 0,
            totalHalfDay: stats.halfDayToday || 0,
            totalLeave: 0, // Not provided by dashboard service
            attendanceRate: stats.attendanceRate || 0
          };
          
          this.leaveStatistics = {
            totalLeaves: stats.totalLeaves || 0,
            pendingLeaves: stats.pendingLeaves || 0,
            approvedLeaves: stats.approvedLeaves || 0,
            rejectedLeaves: 0, // Not provided by dashboard service
            cancelledLeaves: 0, // Not provided by dashboard service
            approvalRate: 0 // Will be calculated
          };
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard statistics:', error);
          this.loading = false;
        }
      });

      // Load recent activities for admins/managers
      this.loadRecentActivities();
    } else {
      // For regular employees, just set loading to false
      this.loading = false;
    }
  }

  // Add new method to load attendance data
  loadAttendanceData(): void {
    if (this.currentUser) {
      // Load today's attendance for the current user
      this.attendanceService.getTodayAttendance().subscribe({
        next: (attendance) => {
          this.todayAttendance = attendance;
        },
        error: (error) => {
          console.error('Error loading today\'s attendance:', error);
        }
      });

      // Load user's attendance statistics
      this.attendanceService.getUserAttendanceStatistics(this.currentUser.id).subscribe({
        next: (stats: any) => {
          this.userAttendanceStats = stats;
        },
        error: (error: any) => {
          console.error('Error loading user attendance statistics:', error);
        }
      });

      // Load user's leave records to calculate balance
      this.leaveService.getCurrentUserLeaves().subscribe({
        next: (leaves: any[]) => {
          this.userLeaves = leaves;
          this.calculateLeaveBalance();
        },
        error: (error: any) => {
          console.error('Error loading user leaves:', error);
        }
      });
    }
  }

  // Add method to calculate leave balance from actual leave records
  calculateLeaveBalance(): void {
    if (!this.userLeaves) return;

    const currentYear = new Date().getFullYear();
    const approvedLeaves = this.userLeaves.filter(leave => 
      leave.status === 'APPROVED' && 
      new Date(leave.startDate).getFullYear() === currentYear
    );

    // Calculate used days by leave type
    const usedByType: { [key: string]: number } = {};
    approvedLeaves.forEach(leave => {
      const type = leave.leaveType;
      const days = leave.totalDays || 1;
      usedByType[type] = (usedByType[type] || 0) + days;
    });

    // Default leave allowances (can be made configurable)
    const defaultAllowances = {
      'ANNUAL': 20,
      'SICK': 10,
      'PERSONAL': 5,
      'MATERNITY': 90,
      'PATERNITY': 14,
      'BEREAVEMENT': 5,
      'UNPAID': 0
    };

    // Calculate remaining leaves
    this.leaveBalance = {};
    Object.keys(defaultAllowances).forEach(type => {
      const used = usedByType[type] || 0;
      const allowance = defaultAllowances[type as keyof typeof defaultAllowances];
      this.leaveBalance[type] = Math.max(0, allowance - used);
    });
  }

  getLeaveBalance(leaveType: string): number {
    if (!this.leaveBalance) {
      // Return default values if data not loaded yet
      switch (leaveType) {
        case 'ANNUAL': return 20;
        case 'SICK': return 10;
        case 'PERSONAL': return 5;
        default: return 0;
      }
    }

    // Use calculated balance from actual leave records
    return this.leaveBalance[leaveType] || 0;
  }

  loadRecentActivities(): void {
    // Only load recent activities for admin/manager
    if (!this.isAdminOrManager) {
      this.recentActivities = [];
      return;
    }

    // Try to get activities from backend first, fallback to aggregated data
    this.dashboardService.getRecentActivities(5).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent activities from backend, using fallback:', error);
        // Fallback to aggregated data from different services
        this.dashboardService.getRecentActivitiesFallback(5).subscribe({
          next: (activities) => {
            this.recentActivities = activities;
            this.loading = false;
          },
          error: (fallbackError) => {
            console.error('Error loading fallback activities:', fallbackError);
            this.recentActivities = [];
            this.loading = false;
          }
        });
      }
    });
  }
  
  refreshData(): void {
    this.loadDashboardData();
  }
  
  getAttendanceRate(): number {
    if (!this.attendanceStatistics) return 0;
    return this.attendanceStatistics.attendanceRate;
  }
  
  getAttendanceRateColor(): string {
    const rate = this.getAttendanceRate();
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'warning';
    return 'danger';
  }
  
  getLeaveApprovalRate(): number {
    if (!this.leaveStatistics) return 0;
    const total = this.leaveStatistics.totalLeaves;
    const approved = this.leaveStatistics.approvedLeaves;
    return total > 0 ? (approved / total) * 100 : 0;
  }
  
  getLeaveApprovalRateColor(): string {
    const rate = this.getLeaveApprovalRate();
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }

  // Employee Dashboard Methods - Updated to use real data
  getTodayAttendanceStatus(): string {
    if (!this.currentUser) return 'Unknown';
    
    if (this.todayAttendance) {
      if (this.todayAttendance.status === 'PRESENT') {
        return 'Present';
      } else if (this.todayAttendance.status === 'ABSENT') {
        return 'Absent';
      } else if (this.todayAttendance.status === 'HALF_DAY') {
        return 'Half Day';
      } else if (this.todayAttendance.status === 'LATE') {
        return 'Late';
      }
    }
    
    // Check if user has punched in today
    if (this.todayAttendance?.punchInTime && !this.todayAttendance?.punchOutTime) {
      return 'Present';
    }
    
    return 'Not Started';
  }

  getMonthlyAttendanceRate(): number {
    if (!this.currentUser || !this.userAttendanceStats) return 0;
    
    return this.userAttendanceStats.monthlyAttendanceRate || 0;
  }

  getTodayWorkingHours(): string {
    if (!this.currentUser || !this.todayAttendance) return '0h 0m';
    
    if (this.todayAttendance.workingHours !== undefined || this.todayAttendance.workingMinutes !== undefined) {
      const hours = this.todayAttendance.workingHours || 0;
      const minutes = this.todayAttendance.workingMinutes || 0;
      return `${hours}h ${minutes}m`;
    }
    
    // Calculate from punch in/out times if available
    if (this.todayAttendance.punchInTime && this.todayAttendance.punchOutTime) {
      const punchIn = new Date(`2000-01-01T${this.todayAttendance.punchInTime}`);
      const punchOut = new Date(`2000-01-01T${this.todayAttendance.punchOutTime}`);
      const diffMs = punchOut.getTime() - punchIn.getTime();
      const totalHours = diffMs / (1000 * 60 * 60);
      
      if (totalHours > 0) {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        return `${hours}h ${minutes}m`;
      }
    }
    
    return '0h 0m';
  }

  getUpcomingHolidays(): any[] {
    // This would be fetched from a holiday service
    return [
      { name: 'Christmas', date: new Date('2025-12-25') },
      { name: 'New Year', date: new Date('2026-01-01') },
      { name: 'Republic Day', date: new Date('2025-01-26') }
    ];
  }

  getSpecialMessages(): any[] {
    const messages = [];
    const today = new Date();
    
    // Check for birthday
    if (this.currentUser?.dateOfBirth) {
      const birthDate = new Date(this.currentUser.dateOfBirth);
      if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
        messages.push({
          type: 'birthday',
          title: 'Happy Birthday! 🎉',
          message: `Wishing you a fantastic birthday, ${this.currentUser.firstName}!`
        });
      }
    }
    
    // Check for work anniversary
    if (this.currentUser?.dateOfJoining) {
      const joiningDate = new Date(this.currentUser.dateOfJoining);
      if (joiningDate.getMonth() === today.getMonth() && joiningDate.getDate() === today.getDate()) {
        const years = today.getFullYear() - joiningDate.getFullYear();
        messages.push({
          type: 'anniversary',
          title: 'Work Anniversary! 🎊',
          message: `Congratulations on ${years} year${years > 1 ? 's' : ''} with us!`
        });
      }
    }
    
    return messages;
  }

  // Navigation Methods
  navigateToAttendance(): void {
    this.router.navigate(['/attendance']);
  }

  navigateToLeave(): void {
    // Navigate to leave management with query parameter to open request modal
    this.router.navigate(['/leaves'], { queryParams: { openRequest: 'true' } });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile'], { queryParams: { edit: 'true' } });
  }

  navigateToPayroll(): void {
    this.router.navigate(['/payroll']);
  }

  // Admin/Manager Navigation Methods
  navigateToEmployees(): void {
    // Navigate to employee directory with query parameter to open add employee modal
    this.router.navigate(['/employees'], { queryParams: { openAddModal: 'true' } });
  }

  navigateToLeaveManagement(): void {
    this.router.navigate(['/leaves']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }
} 