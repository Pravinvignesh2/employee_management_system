import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';
import { 
  Attendance, 
  AttendanceStatus, 
  AttendanceStatistics, 
  PunchInRequest, 
  PunchOutRequest,
  AttendanceFilters,
  PaginatedAttendanceResponse
} from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  template: `
    <div class="attendance-container">
      <!-- Header -->
      <div class="header">
        <h1>Attendance Management</h1>
        <div class="current-time">{{ currentTime | date:'medium' }}</div>
      </div>

      <!-- Punch In/Out Section -->
      <div class="punch-section" *ngIf="currentUser">
        <div class="punch-card">
          <div class="punch-header">
            <h3>Today's Attendance</h3>
            <div class="date">{{ today | date:'fullDate' }}</div>
          </div>
          
          <div class="punch-status">
            <div class="status-item" [class.active]="hasPunchedIn">
              <i class="fas fa-sign-in-alt"></i>
              <span>Punch In</span>
                             <small *ngIf="todayAttendance?.punchInTime">{{ todayAttendance?.punchInTime | slice:0:5 }}</small>
            </div>
            
            <div class="status-item" [class.active]="hasPunchedOut">
              <i class="fas fa-sign-out-alt"></i>
              <span>Punch Out</span>
                             <small *ngIf="todayAttendance?.punchOutTime">{{ todayAttendance?.punchOutTime | slice:0:5 }}</small>
            </div>
          </div>

          <div class="punch-actions">
            <button 
              *ngIf="!hasPunchedIn" 
              class="btn-punch-in" 
              (click)="punchIn()"
              [disabled]="isLoading">
              <i class="fas fa-sign-in-alt"></i>
              Punch In
            </button>
            
            <button 
              *ngIf="hasPunchedIn && !hasPunchedOut" 
              class="btn-punch-out" 
              (click)="punchOut()"
              [disabled]="isLoading">
              <i class="fas fa-sign-out-alt"></i>
              Punch Out
            </button>
            
            <div *ngIf="hasPunchedIn && hasPunchedOut" class="completed-message">
              <i class="fas fa-check-circle"></i>
              Attendance completed for today
            </div>
          </div>

                     <div class="working-hours" *ngIf="todayAttendance?.workingHours !== undefined">
             <strong>Working Hours:</strong> {{ todayAttendance?.workingHours || 0 }}h {{ todayAttendance?.workingMinutes || 0 }}m
           </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="statistics-section" *ngIf="isAdminOrManager">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon present">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h4>Present Today</h4>
              <div class="stat-number">{{ statistics?.totalPresent || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon absent">
              <i class="fas fa-user-times"></i>
            </div>
            <div class="stat-content">
              <h4>Absent Today</h4>
              <div class="stat-number">{{ statistics?.totalAbsent || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon late">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <h4>Half Day</h4>
              <div class="stat-number">{{ statistics?.totalHalfDay || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon rate">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-content">
              <h4>Attendance Rate</h4>
              <div class="stat-number">{{ (statistics?.attendanceRate || 0) | number:'1.1-1' }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Records -->
      <div class="records-section">
                 <div class="section-header">
           <h3>{{ isAdminOrManager ? 'Attendance Records' : 'My Attendance Records' }}</h3>
           <div class="filters" *ngIf="isAdminOrManager">
             <input 
               type="date" 
               [(ngModel)]="selectedDate" 
               (change)="loadAttendanceRecords()"
               class="date-filter">
             <select [(ngModel)]="selectedStatus" (change)="loadAttendanceRecords()" class="status-filter">
               <option value="">All Status</option>
               <option value="PRESENT">Present</option>
               <option value="ABSENT">Absent</option>
               <option value="HALF_DAY">Half Day</option>
               <option value="LEAVE">Leave</option>
             </select>
           </div>
         </div>

        <div class="records-table">
          <table>
                         <thead>
               <tr>
                 <th *ngIf="isAdminOrManager">Employee</th>
                 <th>Date</th>
                 <th>Punch In</th>
                 <th>Punch Out</th>
                 <th>Working Hours</th>
                 <th>Status</th>
                 <th *ngIf="isAdminOrManager">Actions</th>
               </tr>
             </thead>
            <tbody>
                             <tr *ngFor="let record of attendanceRecords">
                 <td *ngIf="isAdminOrManager">
                   <div class="employee-info">
                     <div class="employee-name">{{ record.employeeName }}</div>
                     <div class="employee-id">{{ record.employeeId }}</div>
                   </div>
                 </td>
                 <td>{{ record.date | date:'shortDate' }}</td>
                 <td>{{ record.punchInTime | slice:0:5 || '-' }}</td>
                 <td>{{ record.punchOutTime | slice:0:5 || '-' }}</td>
                 <td>
                   <span *ngIf="record.workingHours">{{ record.workingHours }}h {{ record.workingMinutes }}m</span>
                   <span *ngIf="!record.workingHours">-</span>
                 </td>
                 <td>
                   <span class="status-badge" [class]="getStatusClass(record.status)">
                     {{ getStatusDisplay(record.status) }}
                   </span>
                 </td>
                 <td *ngIf="isAdminOrManager">
                   <div class="actions">
                     <button class="btn-edit" (click)="editAttendance(record)">
                       <i class="fas fa-edit"></i>
                     </button>
                     <button class="btn-delete" (click)="deleteAttendance(record.id!)">
                       <i class="fas fa-trash"></i>
                     </button>
                   </div>
                 </td>
               </tr>
                         </tbody>
           </table>
           
           <!-- Empty state message -->
           <div *ngIf="attendanceRecords.length === 0 && !isLoading" class="empty-state">
             <div class="empty-message">
               <i class="fas fa-calendar-times"></i>
               <h4>No attendance records found</h4>
               <p>{{ isAdminOrManager ? 'No attendance records match your current filters.' : 'You don\'t have any attendance records yet. Punch in to start tracking your attendance!' }}</p>
             </div>
           </div>
         </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button 
            [disabled]="currentPage === 0" 
            (click)="changePage(currentPage - 1)"
            class="btn-page">
            Previous
          </button>
          
          <span class="page-info">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </span>
          
          <button 
            [disabled]="currentPage === totalPages - 1" 
            (click)="changePage(currentPage + 1)"
            class="btn-page">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .attendance-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 32px;
      font-weight: 700;
    }

    .current-time {
      color: #718096;
      font-size: 16px;
      font-weight: 500;
    }

    .punch-section {
      margin-bottom: 32px;
    }

    .punch-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .punch-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .punch-header h3 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-size: 24px;
      font-weight: 600;
    }

    .date {
      color: #718096;
      font-size: 16px;
    }

    .punch-status {
      display: flex;
      justify-content: space-around;
      margin-bottom: 32px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      background: #f7fafc;
      min-width: 120px;
      transition: all 0.3s ease;
    }

    .status-item.active {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-item i {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .status-item span {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .status-item small {
      font-size: 14px;
      opacity: 0.8;
    }

    .punch-actions {
      text-align: center;
      margin-bottom: 24px;
    }

    .btn-punch-in, .btn-punch-out {
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-punch-in {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }

    .btn-punch-out {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
      color: white;
    }

    .btn-punch-in:hover, .btn-punch-out:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .btn-punch-in:disabled, .btn-punch-out:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .completed-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #38a169;
      font-weight: 600;
      font-size: 18px;
    }

    .working-hours {
      text-align: center;
      color: #4a5568;
      font-size: 16px;
    }

    .statistics-section {
      margin-bottom: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .stat-icon.present { background: linear-gradient(135deg, #48bb78, #38a169); }
    .stat-icon.absent { background: linear-gradient(135deg, #f56565, #e53e3e); }
    .stat-icon.late { background: linear-gradient(135deg, #ed8936, #dd6b20); }
    .stat-icon.rate { background: linear-gradient(135deg, #4299e1, #3182ce); }

    .stat-content h4 {
      margin: 0 0 4px 0;
      color: #718096;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-number {
      color: #2d3748;
      font-size: 28px;
      font-weight: 700;
    }

    .records-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 20px;
      font-weight: 600;
    }

    .filters {
      display: flex;
      gap: 12px;
    }

    .date-filter, .status-filter {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
    }

    .records-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f7fafc;
      font-weight: 600;
      color: #4a5568;
    }

    .employee-info {
      display: flex;
      flex-direction: column;
    }

    .employee-name {
      font-weight: 600;
      color: #2d3748;
    }

    .employee-id {
      font-size: 12px;
      color: #718096;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.present {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-badge.absent {
      background: #fed7d7;
      color: #742a2a;
    }

    .status-badge.half-day {
      background: #fef5e7;
      color: #744210;
    }

    .status-badge.leave {
      background: #bee3f8;
      color: #2a4365;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-edit, .btn-delete {
      padding: 6px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-edit {
      background: #bee3f8;
      color: #2a4365;
    }

    .btn-delete {
      background: #fed7d7;
      color: #742a2a;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
    }

    .btn-page {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

         .page-info {
       color: #718096;
       font-size: 14px;
     }

     .empty-state {
       text-align: center;
       padding: 40px 20px;
     }

     .empty-message {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 16px;
     }

     .empty-message i {
       font-size: 48px;
       color: #cbd5e0;
     }

     .empty-message h4 {
       margin: 0;
       color: #4a5568;
       font-size: 18px;
       font-weight: 600;
     }

     .empty-message p {
       margin: 0;
       color: #718096;
       font-size: 14px;
       max-width: 400px;
     }

    @media (max-width: 768px) {
      .attendance-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .punch-status {
        flex-direction: column;
        gap: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class AttendanceComponent implements OnInit {
  currentTime = new Date();
  today = new Date();
  currentUser: any;
  isAdminOrManager = false;
  isLoading = false;

  // Punch status
  hasPunchedIn = false;
  hasPunchedOut = false;
  todayAttendance: Attendance | null = null;

  // Statistics
  statistics: AttendanceStatistics | null = null;

  // Records
  attendanceRecords: Attendance[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;

  // Filters
  selectedDate = new Date().toISOString().split('T')[0];
  selectedStatus = '';

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {
    // Update current time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadTodayStatus();
    this.loadStatistics();
    this.loadAttendanceRecords();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdminOrManager = this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }

  loadTodayStatus(): void {
    const today = new Date().toISOString().split('T')[0];
    
    // First check if user has punched in/out for today
    this.attendanceService.hasCurrentUserPunchedIn(today).subscribe(
      hasPunchedIn => this.hasPunchedIn = hasPunchedIn
    );

    this.attendanceService.hasCurrentUserPunchedOut(today).subscribe(
      hasPunchedOut => this.hasPunchedOut = hasPunchedOut
    );

    // Try to get today's attendance record
    this.attendanceService.getTodayAttendance().subscribe(
      attendance => {
        this.todayAttendance = attendance;
        if (attendance) {
          this.hasPunchedIn = !!attendance.punchInTime;
          this.hasPunchedOut = !!attendance.punchOutTime;
        }
      },
      error => {
        // No attendance record for today - this is normal for new users or first time
        console.log('No attendance record found for today - this is normal for new users');
        this.todayAttendance = null;
        this.hasPunchedIn = false;
        this.hasPunchedOut = false;
      }
    );
  }

  loadStatistics(): void {
    if (this.isAdminOrManager) {
      this.attendanceService.getAttendanceStatistics().subscribe(
        stats => this.statistics = stats
      );
    }
  }

  loadAttendanceRecords(): void {
    this.isLoading = true;
    
    // For regular employees, show only their own attendance records
    if (!this.isAdminOrManager) {
      this.attendanceService.getCurrentUserAttendance().subscribe(
        records => {
          this.attendanceRecords = records;
          this.totalPages = 1; // Single page for user records
          this.isLoading = false;
        },
        error => {
          console.error('Error loading user attendance records:', error);
          this.isLoading = false;
        }
      );
    } else {
      // For admins and managers, show all attendance records with filters
      const filters: AttendanceFilters = {};
      if (this.selectedDate) {
        filters.date = this.selectedDate;
      }
      if (this.selectedStatus) {
        filters.status = this.selectedStatus as AttendanceStatus;
      }

      this.attendanceService.getAllAttendance(this.currentPage, this.pageSize, filters).subscribe(
        response => {
          this.attendanceRecords = response.content;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error => {
          console.error('Error loading attendance records:', error);
          this.isLoading = false;
        }
      );
    }
  }

  punchIn(): void {
    this.isLoading = true;
    
    const request: PunchInRequest = {
      location: 'Office',
      latitude: 0, // You can get actual coordinates here
      longitude: 0
    };

    this.attendanceService.punchInCurrentUser(request).subscribe(
      attendance => {
        this.hasPunchedIn = true;
        this.todayAttendance = attendance;
        this.loadTodayStatus();
        this.isLoading = false;
        console.log('Successfully punched in at:', attendance.punchInTime);
        // You can add a toast notification here
      },
      error => {
        console.error('Error punching in:', error);
        this.isLoading = false;
        // Handle specific error cases
        if (error.status === 400) {
          console.log('User has already punched in today');
        } else {
          console.log('Failed to punch in. Please try again.');
        }
      }
    );
  }

  punchOut(): void {
    this.isLoading = true;
    
    const request: PunchOutRequest = {
      location: 'Office',
      latitude: 0, // You can get actual coordinates here
      longitude: 0
    };

    this.attendanceService.punchOutCurrentUser(request).subscribe(
      attendance => {
        this.hasPunchedOut = true;
        this.todayAttendance = attendance;
        this.loadTodayStatus();
        this.isLoading = false;
        console.log('Successfully punched out at:', attendance.punchOutTime);
        // You can add a toast notification here
      },
      error => {
        console.error('Error punching out:', error);
        this.isLoading = false;
        // Handle specific error cases
        if (error.status === 400) {
          console.log('No punch-in record found for today or already punched out');
        } else {
          console.log('Failed to punch out. Please try again.');
        }
      }
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadAttendanceRecords();
  }

  editAttendance(attendance: Attendance): void {
    // Implement edit functionality
    console.log('Edit attendance:', attendance);
  }

  deleteAttendance(id: number): void {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.attendanceService.deleteAttendance(id).subscribe(
        () => {
          this.loadAttendanceRecords();
          // Show success message
        },
        error => {
          console.error('Error deleting attendance:', error);
          // Show error message
        }
      );
    }
  }

  getStatusDisplay(status: AttendanceStatus): string {
    return this.attendanceService.getAttendanceStatusDisplay(status);
  }

  getStatusClass(status: AttendanceStatus): string {
    return status.toLowerCase().replace('_', '-');
  }
} 