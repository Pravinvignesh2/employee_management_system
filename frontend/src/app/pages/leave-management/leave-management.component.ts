import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { 
  Leave, 
  LeaveType, 
  LeaveStatus, 
  LeaveStatistics, 
  UserLeaveStatistics,
  LeaveRequest,
  LeaveFilters,
  PaginatedLeaveResponse
} from '../../models/leave.model';

@Component({
  selector: 'app-leave-management',
  template: `
    <div class="leave-container">
      <!-- Header -->
      <div class="header">
        <h1>Leave Management</h1>
        <div class="header-actions">
          <button 
            *ngIf="!isAdminOrManager" 
            class="btn-primary" 
            (click)="openLeaveRequestModal()"
            [disabled]="isLoading">
            <i class="fas fa-plus"></i>
            Request Leave
          </button>
          <button 
            *ngIf="isAdminOrManager" 
            class="btn-primary" 
            (click)="openLeaveRequestModal()"
            [disabled]="isLoading">
            <i class="fas fa-plus"></i>
            Create Leave
          </button>
        </div>
      </div>

      <!-- Statistics Cards (Admin/Manager Only) -->
      <div class="statistics-section" *ngIf="isAdminOrManager">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-content">
              <h4>Total Leaves</h4>
              <div class="stat-number">{{ statistics?.totalLeaves || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon pending">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <h4>Pending</h4>
              <div class="stat-number">{{ statistics?.pendingLeaves || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon approved">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h4>Approved</h4>
              <div class="stat-number">{{ statistics?.approvedLeaves || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon rate">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-content">
              <h4>Approval Rate</h4>
              <div class="stat-number">{{ (statistics?.approvalRate || 0) | number:'1.1-1' }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Leave Balance (for employees) -->
      <div class="balance-section" *ngIf="!isAdminOrManager && userStatistics">
        <div class="balance-card">
          <h3>My Leave Balance</h3>
          <div class="balance-grid">
            <div class="balance-item" *ngFor="let balance of getLeaveBalanceByType()">
              <span class="balance-label">{{ balance.type }}:</span>
              <span class="balance-value remaining">{{ balance.remaining }} days</span>
              <span class="balance-used" *ngIf="balance.used > 0">(Used: {{ balance.used }})</span>
            </div>
            <div class="balance-item">
              <span class="balance-label">Pending:</span>
              <span class="balance-value pending">{{ userStatistics.pendingLeaves }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave Records -->
      <div class="records-section">
        <div class="section-header">
          <h3>{{ isAdminOrManager ? 'All Leave Requests' : 'My Leave Requests' }}</h3>
          <div class="filters" *ngIf="isAdminOrManager">
            <select [(ngModel)]="selectedStatus" (change)="loadLeaveRecords()" class="status-filter">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select [(ngModel)]="selectedLeaveType" (change)="loadLeaveRecords()" class="type-filter">
              <option value="">All Types</option>
              <option value="ANNUAL">Annual</option>
              <option value="SICK">Sick</option>
              <option value="PERSONAL">Personal</option>
              <option value="MATERNITY">Maternity</option>
              <option value="PATERNITY">Paternity</option>
              <option value="BEREAVEMENT">Bereavement</option>
              <option value="UNPAID">Unpaid</option>
            </select>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearchChange()"
              placeholder="Search by employee name..."
              class="search-filter">
          </div>
        </div>

        <div class="records-table">
          <table>
            <thead>
              <tr>
                <th *ngIf="isAdminOrManager">Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let leave of leaveRecords">
                <td *ngIf="isAdminOrManager">
                  <div class="employee-info">
                    <div class="employee-name">{{ getFullName(leave) }}</div>
                    <div class="employee-id">{{ leave.employeeId }}</div>
                  </div>
                </td>
                <td>
                  <span class="leave-type-badge" [class]="getLeaveTypeClass(leave.leaveType)">
                    {{ getLeaveTypeDisplay(leave.leaveType) }}
                  </span>
                </td>
                <td>{{ leave.startDate | date:'shortDate' }}</td>
                <td>{{ leave.endDate | date:'shortDate' }}</td>
                <td>{{ leave.totalDays || calculateDays(leave.startDate, leave.endDate) }}</td>
                <td>
                  <div class="reason-text" [title]="leave.reason">
                    {{ leave.reason | slice:0:50 }}{{ leave.reason.length > 50 ? '...' : '' }}
                  </div>
                </td>
                <td>
                  <span class="status-badge" [class]="getStatusClass(leave.status)">
                    {{ getStatusDisplay(leave.status) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <!-- View Details -->
                    <button class="btn-view" (click)="viewLeaveDetails(leave)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <!-- Edit (only for pending leaves by owner) -->
                    <button 
                      *ngIf="canEditLeave(leave)" 
                      class="btn-edit" 
                      (click)="editLeave(leave)" 
                      title="Edit Leave">
                      <i class="fas fa-edit"></i>
                    </button>
                    
                    <!-- Approve (only for admins/managers on pending leaves) -->
                    <button 
                      *ngIf="canApproveLeave(leave)" 
                      class="btn-approve" 
                      (click)="approveLeave(leave.id!)" 
                      title="Approve Leave">
                      <i class="fas fa-check"></i>
                    </button>
                    
                    <!-- Reject (only for admins/managers on pending leaves) -->
                    <button 
                      *ngIf="canApproveLeave(leave)" 
                      class="btn-reject" 
                      (click)="rejectLeave(leave.id!)" 
                      title="Reject Leave">
                      <i class="fas fa-times"></i>
                    </button>
                    
                    <!-- Cancel (for owner or admin) -->
                    <button 
                      *ngIf="canCancelLeave(leave)" 
                      class="btn-cancel" 
                      (click)="cancelLeave(leave.id!)" 
                      title="Cancel Leave">
                      <i class="fas fa-ban"></i>
                    </button>
                    
                    <!-- Delete (only for pending leaves by owner or admin) -->
                    <button 
                      *ngIf="canDeleteLeave(leave)" 
                      class="btn-delete" 
                      (click)="deleteLeave(leave.id!)" 
                      title="Delete Leave">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty state message -->
          <div *ngIf="leaveRecords.length === 0 && !isLoading" class="empty-state">
            <div class="empty-message">
              <i class="fas fa-calendar-times"></i>
              <h4>No leave requests found</h4>
                             <p *ngIf="isAdminOrManager">No leave requests match your current filters.</p>
               <p *ngIf="!isAdminOrManager">You don't have any leave requests yet. Request a leave to get started!</p>
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

      <!-- Leave Request Modal -->
      <app-leave-request-modal
        *ngIf="showLeaveRequestModal"
        [leave]="null"
        [existingLeaves]="leaveRecords"
        (submitted)="onLeaveSubmitted($event)"
        (cancelled)="onLeaveCancelled()">
      </app-leave-request-modal>

      <!-- Rejection Modal -->
      <app-rejection-modal
        *ngIf="showRejectionModal"
        [leaveInfo]="selectedLeaveForRejection"
        (submitted)="onRejectionSubmitted($event)"
        (cancelled)="onRejectionCancelled()">
      </app-rejection-modal>

      <!-- Confirm Dialog -->
      <app-confirm-dialog
        [isOpen]="showConfirmDialog"
        [title]="confirmDialogData.title"
        [message]="confirmDialogData.message"
        (confirm)="onConfirmAction()"
        (cancel)="closeConfirmDialog()">
      </app-confirm-dialog>

      <!-- Success Dialog -->
      <app-success-dialog
        [isOpen]="showSuccessDialog"
        [title]="successDialogData.title"
        [message]="successDialogData.message"
        (close)="closeSuccessDialog()">
      </app-success-dialog>
    </div>
  `,
  styles: [`
    .leave-container {
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    .stat-icon.total { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-icon.pending { background: linear-gradient(135deg, #ed8936, #dd6b20); }
    .stat-icon.approved { background: linear-gradient(135deg, #48bb78, #38a169); }
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

    .balance-section {
      margin-bottom: 32px;
    }

    .balance-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .balance-card h3 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 20px;
      font-weight: 600;
    }

    .balance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .balance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .balance-label {
      color: #4a5568;
      font-weight: 500;
    }

    .balance-value {
      font-weight: 700;
      font-size: 18px;
    }

    .balance-value.remaining { color: #38a169; }
    .balance-value.pending { color: #ed8936; }

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

    .status-filter, .type-filter, .search-filter {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
    }

    .search-filter {
      min-width: 200px;
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

    .leave-type-badge, .status-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .leave-type-badge.annual { background: #bee3f8; color: #2a4365; }
    .leave-type-badge.sick { background: #fed7d7; color: #742a2a; }
    .leave-type-badge.personal { background: #bee3f8; color: #2a4365; }
    .leave-type-badge.maternity { background: #c6f6d5; color: #22543d; }
    .leave-type-badge.paternity { background: #c6f6d5; color: #22543d; }
    .leave-type-badge.bereavement { background: #e2e8f0; color: #4a5568; }
    .leave-type-badge.unpaid { background: #fef5e7; color: #744210; }

    .status-badge.pending { background: #fef5e7; color: #744210; }
    .status-badge.approved { background: #c6f6d5; color: #22543d; }
    .status-badge.rejected { background: #fed7d7; color: #742a2a; }
    .status-badge.cancelled { background: #e2e8f0; color: #4a5568; }

    .reason-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .btn-view, .btn-edit, .btn-approve, .btn-reject, .btn-cancel, .btn-delete {
      padding: 6px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .btn-view { background: #bee3f8; color: #2a4365; }
    .btn-edit { background: #bee3f8; color: #2a4365; }
    .btn-approve { background: #c6f6d5; color: #22543d; }
    .btn-reject { background: #fed7d7; color: #742a2a; }
    .btn-cancel { background: #e2e8f0; color: #4a5568; }
    .btn-delete { background: #fed7d7; color: #742a2a; }

    .btn-view:hover, .btn-edit:hover, .btn-approve:hover, .btn-reject:hover, .btn-cancel:hover, .btn-delete:hover {
      transform: scale(1.1);
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

    @media (max-width: 768px) {
      .leave-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .balance-grid {
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
export class LeaveManagementComponent implements OnInit {
  // Data
  leaveRecords: Leave[] = [];
  statistics: LeaveStatistics | null = null;
  userStatistics: UserLeaveStatistics | null = null;
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  
  // Filters
  selectedStatus = '';
  selectedLeaveType = '';
  searchQuery = '';
  
  // Loading states
  isLoading = false;
  
  // User info
  currentUser: any;
  isAdminOrManager = false;

  // Modal states
  showLeaveRequestModal = false;
  showRejectionModal = false;
  selectedLeaveForRejection: Leave | null = null;
  showLeaveDetailsModal = false;
  selectedLeaveForDetails: Leave | null = null;

  // Dialog states
  showConfirmDialog = false;
  showSuccessDialog = false;
  confirmDialogData = { title: '', message: '', action: '', leaveId: 0 };
  successDialogData = { title: '', message: '' };

  // Cache for user names to avoid multiple API calls
  private userNamesCache: { [key: number]: string } = {};

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadStatistics();
    this.loadLeaveRecords();
    
    // Check for query parameter to open leave request modal
    this.route.queryParams.subscribe(params => {
      if (params['openRequest'] === 'true') {
        setTimeout(() => {
          this.openLeaveRequestModal();
        }, 100);
      }
    });
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdminOrManager = this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }

  loadStatistics(): void {
    // Load general statistics for admins/managers
    if (this.isAdminOrManager) {
      this.leaveService.getLeaveStatistics().subscribe(
        stats => this.statistics = stats
      );
    } else {
      // Load user-specific statistics for employees
      this.leaveService.getCurrentUserLeaveStatistics().subscribe(
        stats => this.userStatistics = stats
      );
    }
  }

  loadLeaveRecords(): void {
    this.isLoading = true;
    
    // For regular employees, show only their own leave records
    if (!this.isAdminOrManager) {
      this.leaveService.getCurrentUserLeaves().subscribe(
        records => {
          this.leaveRecords = records;
          this.totalPages = 1;
          this.isLoading = false;
        },
        error => {
          console.error('Error loading user leave records:', error);
          this.isLoading = false;
        }
      );
    } else {
      // For admins and managers, show all leave records with filters
      const filters: LeaveFilters = {};
      if (this.selectedStatus) {
        filters.status = this.selectedStatus as LeaveStatus;
      }
      if (this.selectedLeaveType) {
        filters.leaveType = this.selectedLeaveType as LeaveType;
      }
      if (this.searchQuery) {
        filters.searchQuery = this.searchQuery;
      }

      this.leaveService.getAllLeaves(this.currentPage, this.pageSize, filters).subscribe(
        response => {
          this.leaveRecords = response.content;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error => {
          console.error('Error loading leave records:', error);
          this.isLoading = false;
        }
      );
    }
  }

  // Modal Methods
  openLeaveRequestModal(): void {
    this.showLeaveRequestModal = true;
  }

  closeLeaveRequestModal(): void {
    this.showLeaveRequestModal = false;
  }

  onLeaveSubmitted(leave: Leave): void {
    this.closeLeaveRequestModal();
    this.loadLeaveRecords();
    this.loadStatistics();
  }

  onLeaveCancelled(): void {
    this.closeLeaveRequestModal();
  }

  // Action Methods
  viewLeaveDetails(leave: Leave): void {
    this.selectedLeaveForDetails = leave;
    this.showLeaveDetailsModal = true;
  }

  closeLeaveDetailsModal(): void {
    this.showLeaveDetailsModal = false;
    this.selectedLeaveForDetails = null;
  }

  editLeave(leave: Leave): void {
    console.log('Edit leave:', leave);
  }

  approveLeave(leaveId: number): void {
    this.confirmDialogData = {
      title: 'Approve Leave Request',
      message: 'Are you sure you want to approve this leave request?',
      action: 'approve',
      leaveId: leaveId
    };
    this.showConfirmDialog = true;
  }

  rejectLeave(leaveId: number): void {
    const leave = this.leaveRecords.find(l => l.id === leaveId);
    if (leave) {
      this.selectedLeaveForRejection = leave;
      this.showRejectionModal = true;
    }
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
    this.selectedLeaveForRejection = null;
  }

  onRejectionSubmitted(data: {reason: string, notifyEmployee: boolean}): void {
    if (this.selectedLeaveForRejection) {
      this.leaveService.rejectLeaveForCurrentUser(this.selectedLeaveForRejection.id!, data.reason).subscribe(
        leave => {
          this.closeRejectionModal();
          this.loadLeaveRecords();
          this.loadStatistics();
          console.log('Leave request rejected successfully');
        },
        error => {
          console.error('Error rejecting leave request:', error);
        }
      );
    }
  }

  onRejectionCancelled(): void {
    this.closeRejectionModal();
  }

  cancelLeave(leaveId: number): void {
    this.confirmDialogData = {
      title: 'Cancel Leave Request',
      message: 'Are you sure you want to cancel this leave request?',
      action: 'cancel',
      leaveId: leaveId
    };
    this.showConfirmDialog = true;
  }

  deleteLeave(leaveId: number): void {
    this.confirmDialogData = {
      title: 'Delete Leave Request',
      message: 'Are you sure you want to delete this leave request? This action cannot be undone.',
      action: 'delete',
      leaveId: leaveId
    };
    this.showConfirmDialog = true;
  }

  // Pagination
  changePage(page: number): void {
    this.currentPage = page;
    this.loadLeaveRecords();
  }

  // Search
  onSearchChange(): void {
    this.currentPage = 0;
    this.loadLeaveRecords();
  }

  // Utility Methods
  getLeaveTypeDisplay(type: LeaveType): string {
    return this.leaveService.getLeaveTypeDisplay(type);
  }

  getLeaveTypeClass(type: LeaveType): string {
    return type.toLowerCase();
  }

  getStatusDisplay(status: LeaveStatus): string {
    return this.leaveService.getLeaveStatusDisplay(status);
  }

  getStatusClass(status: LeaveStatus): string {
    return status.toLowerCase();
  }

  calculateDays(startDate: string, endDate: string): number {
    return this.leaveService.calculateLeaveDays(startDate, endDate);
  }

  // Permission Methods
  canEditLeave(leave: Leave): boolean {
    return leave.status === LeaveStatus.PENDING && 
           leave.userId === this.currentUser.id;
  }

  canApproveLeave(leave: Leave): boolean {
    return leave.status === LeaveStatus.PENDING && 
           leave.userId !== this.currentUser.id &&
           this.isAdminOrManager;
  }

  canCancelLeave(leave: Leave): boolean {
    return (leave.status === LeaveStatus.PENDING || leave.status === LeaveStatus.APPROVED) &&
           (leave.userId === this.currentUser.id || this.currentUser.id === 1);
  }

  canDeleteLeave(leave: Leave): boolean {
    return leave.status === LeaveStatus.PENDING && 
           (leave.userId === this.currentUser.id || this.currentUser.id === 1);
  }

  onConfirmAction(): void {
    const { action, leaveId } = this.confirmDialogData;
    
    switch (action) {
      case 'approve':
        this.leaveService.approveLeaveForCurrentUser(leaveId).subscribe({
          next: (leave) => {
            this.loadLeaveRecords();
            this.loadStatistics();
            this.closeConfirmDialog();
            this.showSuccessMessage('Leave request approved successfully!');
          },
          error: (error) => {
            console.error('Error approving leave request:', error);
            this.closeConfirmDialog();
            this.showSuccessMessage('Failed to approve leave request. Please try again.');
          }
        });
        break;
        
      case 'cancel':
        this.leaveService.cancelLeave(leaveId).subscribe({
          next: (leave) => {
            this.loadLeaveRecords();
            this.loadStatistics();
            this.closeConfirmDialog();
            this.showSuccessMessage('Leave request cancelled successfully!');
          },
          error: (error) => {
            console.error('Error cancelling leave request:', error);
            this.closeConfirmDialog();
            this.showSuccessMessage('Failed to cancel leave request. Please try again.');
          }
        });
        break;
        
      case 'delete':
        this.leaveService.deleteLeave(leaveId).subscribe({
          next: () => {
            this.loadLeaveRecords();
            this.loadStatistics();
            this.closeConfirmDialog();
            this.showSuccessMessage('Leave request deleted successfully!');
          },
          error: (error) => {
            console.error('Error deleting leave request:', error);
            this.closeConfirmDialog();
            this.showSuccessMessage('Failed to delete leave request. Please try again.');
          }
        });
        break;
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.confirmDialogData = { title: '', message: '', action: '', leaveId: 0 };
  }

  showSuccessMessage(message: string): void {
    this.successDialogData = {
      title: 'Success!',
      message: message
    };
    this.showSuccessDialog = true;
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
  }

  getFullName(leave: any): string {
    // If we have firstName and lastName, use them
    if (leave.firstName && leave.lastName) {
      return `${leave.firstName} ${leave.lastName}`;
    }
    
    // If we have a cached name, use it
    if (leave.userId && this.userNamesCache[leave.userId]) {
      return this.userNamesCache[leave.userId];
    }
    
    // If employeeName is not generic, use it
    if (leave.employeeName && !leave.employeeName.includes('Employee')) {
      return leave.employeeName;
    }
    
    // If we have userId, fetch the user data
    if (leave.userId && !this.userNamesCache[leave.userId]) {
      this.userService.getUserById(leave.userId).subscribe({
        next: (user: User) => {
          const fullName = `${user.firstName} ${user.lastName}`;
          this.userNamesCache[leave.userId] = fullName;
          // Trigger change detection
          this.cdr.detectChanges();
        },
        error: () => {
          // If fetch fails, cache a fallback
          this.userNamesCache[leave.userId] = leave.employeeName || 'Unknown Employee';
        }
      });
      return 'Loading...';
    }
    
    return leave.employeeName || 'Unknown Employee';
  }

  getLeaveBalanceByType(): any[] {
    if (!this.userStatistics) return [];
    
    // Calculate breakdown based on available data
    const totalLeaves = this.userStatistics.totalLeaves || 0;
    const usedLeaves = this.userStatistics.approvedLeaves || 0;
    const remainingLeaves = this.userStatistics.remainingLeaves || 0;
    
    // Create a simple breakdown - you can enhance this when backend provides detailed data
    return [
      { type: 'Sick Leave', remaining: Math.floor(remainingLeaves * 0.3), used: Math.floor(usedLeaves * 0.3) },
      { type: 'Personal Leave', remaining: Math.floor(remainingLeaves * 0.2), used: Math.floor(usedLeaves * 0.2) },
      { type: 'Annual Leave', remaining: Math.floor(remainingLeaves * 0.4), used: Math.floor(usedLeaves * 0.4) },
      { type: 'Paid Leave', remaining: Math.floor(remainingLeaves * 0.1), used: Math.floor(usedLeaves * 0.1) }
    ];
  }
} 