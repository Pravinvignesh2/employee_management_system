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
      <div class="leave-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Leave Management</h1>
            <p>Manage leave requests and approvals</p>
          </div>
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
        [leave]="selectedLeaveForEdit"
        [existingLeaves]="leaveRecords"
        (submitted)="onLeaveSubmitted($event)"
        (cancelled)="onLeaveCancelled()">
      </app-leave-request-modal>

      <!-- Leave Details Modal -->
      <div class="modal-overlay" *ngIf="showLeaveDetailsModal" (click)="closeLeaveDetailsModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Leave Details</h3>
            <button class="btn-close" (click)="closeLeaveDetailsModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body" *ngIf="selectedLeaveForDetails">
            <div class="detail-row">
              <label>Employee:</label>
              <span>{{ selectedLeaveForDetails.employeeName }}</span>
            </div>
            
            <div class="detail-row">
              <label>Leave Type:</label>
              <span class="leave-type-badge" [class]="getLeaveTypeClass(selectedLeaveForDetails.leaveType)">
                {{ getLeaveTypeDisplay(selectedLeaveForDetails.leaveType) }}
              </span>
            </div>
            
            <div class="detail-row">
              <label>Start Date:</label>
              <span>{{ selectedLeaveForDetails.startDate | date:'MMM d, y' }}</span>
            </div>
            
            <div class="detail-row">
              <label>End Date:</label>
              <span>{{ selectedLeaveForDetails.endDate | date:'MMM d, y' }}</span>
            </div>
            
            <div class="detail-row">
              <label>Days:</label>
              <span>{{ selectedLeaveForDetails.totalDays }}</span>
            </div>
            
            <div class="detail-row">
              <label>Reason:</label>
              <span>{{ selectedLeaveForDetails.reason }}</span>
            </div>
            
            <div class="detail-row">
              <label>Status:</label>
              <span class="status-badge" [class]="getStatusClass(selectedLeaveForDetails.status)">
                {{ getStatusDisplay(selectedLeaveForDetails.status) }}
              </span>
            </div>
            
            <div class="detail-row" *ngIf="selectedLeaveForDetails.approvedAt">
              <label>Approved At:</label>
              <span>{{ selectedLeaveForDetails.approvedAt | date:'MMM d, y, h:mm:ss a' }}</span>
            </div>
            
            <div class="detail-row" *ngIf="selectedLeaveForDetails.rejectionReason && selectedLeaveForDetails.status === 'REJECTED'">
              <label>Rejection Reason:</label>
              <span>{{ selectedLeaveForDetails.rejectionReason }}</span>
            </div>
            
            <div class="detail-row" *ngIf="selectedLeaveForDetails.rejectionReason && selectedLeaveForDetails.status === 'APPROVED'">
              <label>Approval Comments:</label>
              <span>{{ selectedLeaveForDetails.rejectionReason }}</span>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeLeaveDetailsModal()">Close</button>
          </div>
        </div>
      </div>

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

      <!-- Error Dialog -->
      <app-confirm-dialog
        [isOpen]="showErrorDialog"
        [title]="errorDialogData.title"
        [message]="errorDialogData.message"
        (confirm)="closeErrorDialog()"
        (cancel)="closeErrorDialog()">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .leave-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .leave-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 0;
      margin-bottom: 32px;
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

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
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

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 600px;
      max-height: 90%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      background: #f7fafc;
      border-radius: 16px 16px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 24px;
      font-weight: 700;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #718096;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .close-btn:hover {
      color: #4a5568;
    }

    .modal-body {
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #e2e8f0;
    }

    .detail-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .detail-row label {
      font-weight: 500;
      color: #4a5568;
      font-size: 14px;
      min-width: 120px;
    }

    .detail-row span {
      font-weight: 600;
      color: #2d3748;
      font-size: 16px;
      flex-grow: 1;
    }

    .modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
      border: 1px solid #e2e8f0;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  userLeaves: Leave[] | null = null; // Added for calculating balance
  leaveBalance: { [key: string]: number } = {}; // Added for calculating balance
  
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
  selectedLeaveForEdit: Leave | null = null;

  // Dialog states
  showConfirmDialog = false;
  showSuccessDialog = false;
  confirmDialogData = { title: '', message: '', action: '', leaveId: 0 };
  successDialogData = { title: '', message: '' };
  showErrorDialog = false;
  errorDialogData = { title: '', message: '' };

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
    if (this.isAdminOrManager) {
      // Load overall statistics for admin/manager
      this.leaveService.getLeaveStatistics().subscribe({
        next: (stats) => {
          this.statistics = stats;
        },
        error: (error) => {
          console.error('Error loading leave statistics:', error);
        }
      });
    } else {
      // For employees, load their leave records to calculate balance
      this.leaveService.getCurrentUserLeaves().subscribe({
        next: (leaves) => {
          this.userLeaves = leaves;
          this.calculateUserLeaveBalance();
        },
        error: (error) => {
          console.error('Error loading user leaves:', error);
        }
      });
    }
  }

  // Add method to calculate user leave balance from actual leave records
  calculateUserLeaveBalance(): void {
    if (!this.userLeaves) return;

    const currentYear = new Date().getFullYear();
    const approvedLeaves = this.userLeaves.filter(leave => 
      leave.status === 'APPROVED' && 
      new Date(leave.startDate).getFullYear() === currentYear
    );

    const pendingLeaves = this.userLeaves.filter(leave => 
      leave.status === 'PENDING' && 
      new Date(leave.startDate).getFullYear() === currentYear
    );

    // Calculate used days by leave type
    const usedByType: { [key: string]: number } = {};
    approvedLeaves.forEach(leave => {
      const type = leave.leaveType;
      const days = leave.totalDays || 1;
      usedByType[type] = (usedByType[type] || 0) + days;
    });

    // Default leave allowances (same as dashboard)
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

    // Create user statistics object
    this.userStatistics = {
      totalLeaves: this.userLeaves.length,
      pendingLeaves: pendingLeaves.length,
      approvedLeaves: approvedLeaves.length,
      rejectedLeaves: this.userLeaves.filter(leave => leave.status === 'REJECTED').length,
      cancelledLeaves: this.userLeaves.filter(leave => leave.status === 'CANCELLED').length,
      remainingLeaves: Object.values(this.leaveBalance).reduce((sum, remaining) => sum + remaining, 0),
      approvalRate: this.userLeaves.length > 0 ? (approvedLeaves.length / this.userLeaves.length) * 100 : 0
    };
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
    this.selectedLeaveForEdit = null;
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
    // Set the leave to be edited and open the modal
    this.selectedLeaveForEdit = leave;
    this.showLeaveRequestModal = true;
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
    // Allow employees to delete their own leaves in any status
    // Allow admins to delete any leave
    return (leave.userId === this.currentUser.id || this.isAdminOrManager);
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
            this.showErrorMessage('Failed to approve leave request. Please try again.');
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
            this.showErrorMessage('Failed to cancel leave request. Please try again.');
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
            this.showErrorMessage('Failed to delete leave request. Please try again.');
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

  showErrorMessage(message: string): void {
    this.errorDialogData = {
      title: 'Error',
      message: message
    };
    this.showErrorDialog = true;
  }

  closeErrorDialog(): void {
    this.showErrorDialog = false;
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
    if (!this.leaveBalance) return [];
    
    // Return calculated balance from actual leave records
    return [
      { type: 'Sick Leave', remaining: this.leaveBalance['SICK'] || 0, used: 10 - (this.leaveBalance['SICK'] || 0) },
      { type: 'Personal Leave', remaining: this.leaveBalance['PERSONAL'] || 0, used: 5 - (this.leaveBalance['PERSONAL'] || 0) },
      { type: 'Annual Leave', remaining: this.leaveBalance['ANNUAL'] || 0, used: 20 - (this.leaveBalance['ANNUAL'] || 0) },
      { type: 'Paid Leave', remaining: this.leaveBalance['UNPAID'] || 0, used: 0 }
    ];
  }
} 