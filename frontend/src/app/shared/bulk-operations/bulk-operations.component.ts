import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Leave, LeaveStatus } from '../../models/leave.model';

@Component({
  selector: 'app-bulk-operations',
  template: `
    <div class="bulk-operations" *ngIf="selectedLeaves.length > 0">
      <div class="bulk-header">
        <div class="selection-info">
          <i class="fas fa-check-square"></i>
          <span>{{ selectedLeaves.length }} leave request{{ selectedLeaves.length > 1 ? 's' : '' }} selected</span>
        </div>
        
        <div class="bulk-actions">
          <button 
            class="btn-bulk-approve" 
            (click)="bulkApprove()"
            [disabled]="!canBulkApprove()">
            <i class="fas fa-check"></i>
            Approve All
          </button>
          
          <button 
            class="btn-bulk-reject" 
            (click)="bulkReject()"
            [disabled]="!canBulkReject()">
            <i class="fas fa-times"></i>
            Reject All
          </button>
          
          <button 
            class="btn-bulk-cancel" 
            (click)="bulkCancel()"
            [disabled]="!canBulkCancel()">
            <i class="fas fa-ban"></i>
            Cancel All
          </button>
          
          <button 
            class="btn-bulk-delete" 
            (click)="bulkDelete()"
            [disabled]="!canBulkDelete()">
            <i class="fas fa-trash"></i>
            Delete All
          </button>
          
          <button class="btn-clear-selection" (click)="clearSelection()">
            <i class="fas fa-times"></i>
            Clear
          </button>
        </div>
      </div>

      <!-- Selection Summary -->
      <div class="selection-summary">
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Pending:</span>
            <span class="stat-value pending">{{ getCountByStatus(LeaveStatus.PENDING) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Approved:</span>
            <span class="stat-value approved">{{ getCountByStatus(LeaveStatus.APPROVED) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Rejected:</span>
            <span class="stat-value rejected">{{ getCountByStatus(LeaveStatus.REJECTED) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Cancelled:</span>
            <span class="stat-value cancelled">{{ getCountByStatus(LeaveStatus.CANCELLED) }}</span>
          </div>
            </div>

        <div class="summary-details">
          <div class="detail-item">
            <span class="detail-label">Total Days:</span>
            <span class="detail-value">{{ getTotalDays() }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Departments:</span>
            <span class="detail-value">{{ getUniqueDepartments().join(', ') }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Leave Types:</span>
            <span class="detail-value">{{ getUniqueLeaveTypes().join(', ') }}</span>
          </div>
                  </div>
                </div>

      <!-- Selected Items Preview -->
      <div class="selected-items">
        <h4>Selected Leave Requests</h4>
        <div class="items-grid">
          <div 
            *ngFor="let leave of selectedLeaves" 
            class="leave-item"
            [class]="leave.status.toLowerCase()">
            
            <div class="item-header">
              <div class="employee-info">
                <div class="employee-name">{{ leave.employeeName }}</div>
                <div class="employee-id">{{ leave.employeeId }}</div>
              </div>
              <div class="item-status">
                <span class="status-badge" [class]="leave.status.toLowerCase()">
                  {{ leave.status }}
                </span>
              </div>
            </div>

            <div class="item-details">
              <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">{{ leave.leaveType }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ leave.startDate | date:'shortDate' }} - {{ leave.endDate | date:'shortDate' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Days:</span>
                <span class="value">{{ leave.totalDays || calculateDays(leave.startDate, leave.endDate) }}</span>
              </div>
            </div>
            
            <div class="item-actions">
              <button class="btn-remove" (click)="removeFromSelection(leave)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

    <!-- Bulk Action Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showConfirmationModal" (click)="closeConfirmationModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
          <h3>{{ getConfirmationTitle() }}</h3>
          <button class="btn-close" (click)="closeConfirmationModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
          <div class="confirmation-message">
            <i class="fas" [class]="getConfirmationIcon()"></i>
            <p>{{ getConfirmationMessage() }}</p>
            </div>

          <div class="affected-items">
            <h4>Affected Leave Requests:</h4>
            <ul>
              <li *ngFor="let leave of getAffectedLeaves()">
                {{ leave.employeeName }} - {{ leave.leaveType }} ({{ leave.totalDays || calculateDays(leave.startDate, leave.endDate) }} days)
              </li>
            </ul>
            </div>

          <div class="form-group" *ngIf="bulkAction === 'reject'">
            <label for="rejectionReason">Rejection Reason (Optional):</label>
                <textarea 
                  id="rejectionReason" 
              [(ngModel)]="rejectionReason" 
                  class="form-control" 
              rows="3"
              placeholder="Provide a reason for rejection..."></textarea>
                </div>
              </div>

        <div class="modal-actions">
          <button class="btn-secondary" (click)="closeConfirmationModal()">
                  Cancel
                </button>
          <button 
            class="btn-confirm" 
            [class]="getConfirmButtonClass()"
            (click)="confirmBulkAction()"
            [disabled]="isProcessing">
            <i class="fas fa-spinner fa-spin" *ngIf="isProcessing"></i>
            {{ isProcessing ? 'Processing...' : getConfirmButtonText() }}
                </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bulk-operations {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }

    .bulk-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .selection-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4a5568;
      font-weight: 600;
    }

    .selection-info i {
      color: #48bb78;
    }

    .bulk-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-bulk-approve, .btn-bulk-reject, .btn-bulk-cancel, .btn-bulk-delete, .btn-clear-selection {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .btn-bulk-approve {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }

    .btn-bulk-approve:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }

    .btn-bulk-reject {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
    }

    .btn-bulk-reject:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
    }

    .btn-bulk-cancel {
      background: linear-gradient(135deg, #a0aec0, #718096);
      color: white;
    }

    .btn-bulk-cancel:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(160, 174, 192, 0.3);
    }

    .btn-bulk-delete {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
      color: white;
    }

    .btn-bulk-delete:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
    }

    .btn-clear-selection {
      background: #e2e8f0;
      color: #4a5568;
    }

    .btn-clear-selection:hover {
      background: #cbd5e0;
    }

    .btn-bulk-approve:disabled, .btn-bulk-reject:disabled, .btn-bulk-cancel:disabled, .btn-bulk-delete:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .selection-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f7fafc;
      border-radius: 12px;
    }

    .summary-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-label {
      color: #4a5568;
      font-weight: 500;
    }

    .stat-value {
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .stat-value.pending { background: #fef5e7; color: #744210; }
    .stat-value.approved { background: #f0fff4; color: #22543d; }
    .stat-value.rejected { background: #fed7d7; color: #742a2a; }
    .stat-value.cancelled { background: #e2e8f0; color: #4a5568; }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      color: #4a5568;
      font-weight: 500;
    }

    .detail-value {
      color: #2d3748;
      font-weight: 600;
    }

    .selected-items h4 {
      margin: 0 0 16px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .leave-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      position: relative;
    }

    .leave-item.pending { border-left: 4px solid #ed8936; }
    .leave-item.approved { border-left: 4px solid #48bb78; }
    .leave-item.rejected { border-left: 4px solid #f56565; }
    .leave-item.cancelled { border-left: 4px solid #a0aec0; }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .employee-name {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .employee-id {
      font-size: 12px;
      color: #718096;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.pending { background: #fef5e7; color: #744210; }
    .status-badge.approved { background: #f0fff4; color: #22543d; }
    .status-badge.rejected { background: #fed7d7; color: #742a2a; }
    .status-badge.cancelled { background: #e2e8f0; color: #4a5568; }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-row .label {
      color: #718096;
      font-size: 12px;
    }

    .detail-row .value {
      color: #2d3748;
      font-weight: 500;
      font-size: 12px;
    }

    .item-actions {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .btn-remove {
      background: none;
      border: none;
      color: #f56565;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .btn-remove:hover {
      background: #fed7d7;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;
    }

    .modal-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 20px;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 20px;
      color: #718096;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }

    .modal-body {
      padding: 24px;
    }

    .confirmation-message {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .confirmation-message i {
      font-size: 24px;
    }

    .confirmation-message.approve i { color: #48bb78; }
    .confirmation-message.reject i { color: #f56565; }
    .confirmation-message.cancel i { color: #a0aec0; }
    .confirmation-message.delete i { color: #ed8936; }

    .affected-items {
      margin-bottom: 20px;
    }

    .affected-items h4 {
      margin: 0 0 12px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
    }

    .affected-items ul {
      margin: 0;
      padding-left: 20px;
      color: #4a5568;
    }

    .affected-items li {
      margin-bottom: 4px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      resize: vertical;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-confirm {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-confirm.approve {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }

    .btn-confirm.reject {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
    }

    .btn-confirm.cancel {
      background: linear-gradient(135deg, #a0aec0, #718096);
      color: white;
    }

    .btn-confirm.delete {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
      color: white;
    }

    .btn-confirm:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .bulk-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .bulk-actions {
        justify-content: center;
      }

      .selection-summary {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .items-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        margin: 20px;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class BulkOperationsComponent implements OnInit {
  @Input() selectedLeaves: Leave[] = [];
  @Output() bulkActionPerformed = new EventEmitter<{action: string, leaves: Leave[], reason?: string}>();
  @Output() selectionCleared = new EventEmitter<void>();

  // Make LeaveStatus available in template
  LeaveStatus = LeaveStatus;

  showConfirmationModal = false;
  bulkAction = '';
  rejectionReason = '';
  isProcessing = false;

  ngOnInit(): void {}

  canBulkApprove(): boolean {
    return this.selectedLeaves.some(leave => leave.status === LeaveStatus.PENDING);
  }

  canBulkReject(): boolean {
    return this.selectedLeaves.some(leave => leave.status === LeaveStatus.PENDING);
  }

  canBulkCancel(): boolean {
    return this.selectedLeaves.some(leave => 
      leave.status === LeaveStatus.PENDING || leave.status === LeaveStatus.APPROVED
    );
  }

  canBulkDelete(): boolean {
    return this.selectedLeaves.some(leave => leave.status === LeaveStatus.PENDING);
  }

  getCountByStatus(status: LeaveStatus): number {
    return this.selectedLeaves.filter(leave => leave.status === status).length;
  }

  getTotalDays(): number {
    return this.selectedLeaves.reduce((total, leave) => {
      return total + (leave.totalDays || this.calculateDays(leave.startDate, leave.endDate));
    }, 0);
  }

  getUniqueDepartments(): string[] {
    const departments = this.selectedLeaves.map(leave => leave.employeeName?.split(' ').pop() || 'Unknown');
    return [...new Set(departments)];
  }

  getUniqueLeaveTypes(): string[] {
    const types = this.selectedLeaves.map(leave => leave.leaveType);
    return [...new Set(types)];
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  removeFromSelection(leave: Leave): void {
    const index = this.selectedLeaves.findIndex(l => l.id === leave.id);
    if (index > -1) {
      this.selectedLeaves.splice(index, 1);
    }
  }

  clearSelection(): void {
    this.selectedLeaves = [];
    this.selectionCleared.emit();
  }

  bulkApprove(): void {
    this.bulkAction = 'approve';
    this.showConfirmationModal = true;
  }

  bulkReject(): void {
    this.bulkAction = 'reject';
    this.showConfirmationModal = true;
  }

  bulkCancel(): void {
    this.bulkAction = 'cancel';
    this.showConfirmationModal = true;
  }

  bulkDelete(): void {
    this.bulkAction = 'delete';
    this.showConfirmationModal = true;
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.rejectionReason = '';
  }

  getConfirmationTitle(): string {
    switch (this.bulkAction) {
      case 'approve': return 'Confirm Bulk Approval';
      case 'reject': return 'Confirm Bulk Rejection';
      case 'cancel': return 'Confirm Bulk Cancellation';
      case 'delete': return 'Confirm Bulk Deletion';
      default: return 'Confirm Action';
    }
  }

  getConfirmationMessage(): string {
    switch (this.bulkAction) {
      case 'approve': return `Are you sure you want to approve ${this.getAffectedLeaves().length} leave request(s)?`;
      case 'reject': return `Are you sure you want to reject ${this.getAffectedLeaves().length} leave request(s)?`;
      case 'cancel': return `Are you sure you want to cancel ${this.getAffectedLeaves().length} leave request(s)?`;
      case 'delete': return `Are you sure you want to delete ${this.getAffectedLeaves().length} leave request(s)? This action cannot be undone.`;
      default: return 'Are you sure you want to perform this action?';
    }
  }

  getConfirmationIcon(): string {
    switch (this.bulkAction) {
      case 'approve': return 'fa-check-circle';
      case 'reject': return 'fa-times-circle';
      case 'cancel': return 'fa-ban';
      case 'delete': return 'fa-trash';
      default: return 'fa-question-circle';
    }
  }

  getAffectedLeaves(): Leave[] {
    switch (this.bulkAction) {
      case 'approve':
      case 'reject':
        return this.selectedLeaves.filter(leave => leave.status === LeaveStatus.PENDING);
      case 'cancel':
        return this.selectedLeaves.filter(leave => 
          leave.status === LeaveStatus.PENDING || leave.status === LeaveStatus.APPROVED
        );
      case 'delete':
        return this.selectedLeaves.filter(leave => leave.status === LeaveStatus.PENDING);
      default:
        return this.selectedLeaves;
    }
  }

  getConfirmButtonClass(): string {
    return this.bulkAction;
  }

  getConfirmButtonText(): string {
    switch (this.bulkAction) {
      case 'approve': return 'Approve All';
      case 'reject': return 'Reject All';
      case 'cancel': return 'Cancel All';
      case 'delete': return 'Delete All';
      default: return 'Confirm';
    }
  }

  confirmBulkAction(): void {
    this.isProcessing = true;
    
    const affectedLeaves = this.getAffectedLeaves();
    const payload: any = {
      action: this.bulkAction,
      leaves: affectedLeaves
    };

    if (this.bulkAction === 'reject' && this.rejectionReason) {
      payload.reason = this.rejectionReason;
    }

    this.bulkActionPerformed.emit(payload);
    
    // Simulate processing time
    setTimeout(() => {
      this.isProcessing = false;
      this.closeConfirmationModal();
      this.clearSelection();
    }, 2000);
  }
} 