import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { Leave, LeaveType, LeaveRequest } from '../../models/leave.model';

@Component({
  selector: 'app-leave-request-modal',
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Leave Request' : 'Request Leave' }}</h3>
          <button class="btn-close" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form [formGroup]="leaveForm" (ngSubmit)="submit()">
            <div class="form-group">
              <label for="leaveType">Leave Type *</label>
              <select id="leaveType" formControlName="leaveType" class="form-control">
                <option value="">Select Leave Type</option>
                <option *ngFor="let type of leaveTypes" [value]="type.value">
                  {{ type.label }}
                </option>
              </select>
              <div class="error-message" *ngIf="leaveForm.get('leaveType')?.invalid && leaveForm.get('leaveType')?.touched">
                Please select a leave type
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Start Date *</label>
                <input 
                  type="date" 
                  id="startDate" 
                  formControlName="startDate" 
                  class="form-control"
                  [min]="today">
                <div class="error-message" *ngIf="leaveForm.get('startDate')?.invalid && leaveForm.get('startDate')?.touched">
                  Please select a valid start date
                </div>
              </div>
              
              <div class="form-group">
                <label for="endDate">End Date *</label>
                <input 
                  type="date" 
                  id="endDate" 
                  formControlName="endDate" 
                  class="form-control"
                  [min]="today">
                <div class="error-message" *ngIf="leaveForm.get('endDate')?.invalid && leaveForm.get('endDate')?.touched">
                  Please select a valid end date
                </div>
              </div>
            </div>

            <div class="form-group" *ngIf="totalDays > 0">
              <div class="days-info">
                <span class="days-label">Total Days:</span>
                <span class="days-value">{{ totalDays }} {{ totalDays === 1 ? 'day' : 'days' }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="reason">Reason *</label>
              <textarea 
                id="reason" 
                formControlName="reason" 
                class="form-control" 
                rows="4"
                placeholder="Please provide a detailed reason for your leave request..."></textarea>
              <div class="error-message" *ngIf="leaveForm.get('reason')?.invalid && leaveForm.get('reason')?.touched">
                Reason must be at least 10 characters long
              </div>
              <div class="char-count">
                {{ leaveForm.get('reason')?.value?.length || 0 }}/500 characters
              </div>
            </div>

            <div class="form-group" *ngIf="overlappingLeaves.length > 0">
              <div class="warning-message">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Warning:</strong> You have overlapping leave requests:
                <ul>
                  <li *ngFor="let leave of overlappingLeaves">
                    {{ leave.leaveType }} from {{ leave.startDate | date:'shortDate' }} to {{ leave.endDate | date:'shortDate' }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="close()">
                Cancel
              </button>
              <button type="submit" class="btn-primary" [disabled]="!leaveForm.valid || isSubmitting">
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? 'Submitting...' : (isEditing ? 'Update Request' : 'Submit Request') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: #f7fafc;
      color: #4a5568;
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 500;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.invalid {
      border-color: #f56565;
    }

    .error-message {
      color: #f56565;
      font-size: 12px;
      margin-top: 4px;
    }

    .char-count {
      text-align: right;
      font-size: 12px;
      color: #718096;
      margin-top: 4px;
    }

    .days-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f7fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .days-label {
      color: #4a5568;
      font-weight: 500;
    }

    .days-value {
      color: #2d3748;
      font-weight: 600;
      font-size: 16px;
    }

    .warning-message {
      background: #fef5e7;
      border: 1px solid #ed8936;
      border-radius: 8px;
      padding: 12px;
      color: #744210;
      font-size: 14px;
    }

    .warning-message i {
      margin-right: 8px;
      color: #ed8936;
    }

    .warning-message ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .warning-message li {
      margin-bottom: 4px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 16px;
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
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
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
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-secondary, .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class LeaveRequestModalComponent implements OnInit {
  @Input() leave: Leave | null = null;
  @Input() existingLeaves: Leave[] = [];
  @Output() submitted = new EventEmitter<Leave>();
  @Output() cancelled = new EventEmitter<void>();

  leaveForm: FormGroup;
  isSubmitting = false;
  isEditing = false;
  today = new Date().toISOString().split('T')[0];
  totalDays = 0;
  overlappingLeaves: Leave[] = [];

  leaveTypes = [
    { value: LeaveType.ANNUAL, label: 'Annual Leave' },
    { value: LeaveType.SICK, label: 'Sick Leave' },
    { value: LeaveType.PERSONAL, label: 'Personal Leave' },
    { value: LeaveType.MATERNITY, label: 'Maternity Leave' },
    { value: LeaveType.PATERNITY, label: 'Paternity Leave' },
    { value: LeaveType.BEREAVEMENT, label: 'Bereavement Leave' },
    { value: LeaveType.UNPAID, label: 'Unpaid Leave' }
  ];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.isEditing = !!this.leave;
    
    if (this.leave) {
      this.leaveForm.patchValue({
        leaveType: this.leave.leaveType,
        startDate: this.leave.startDate,
        endDate: this.leave.endDate,
        reason: this.leave.reason
      });
    }

    // Watch for date changes to calculate total days
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());
  }

  calculateDays(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      this.totalDays = this.leaveService.calculateLeaveDays(startDate, endDate);
      this.checkOverlappingLeaves();
    } else {
      this.totalDays = 0;
      this.overlappingLeaves = [];
    }
  }

  checkOverlappingLeaves(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      this.overlappingLeaves = this.existingLeaves.filter(leave => {
        if (leave.status === 'REJECTED' || leave.status === 'CANCELLED') {
          return false;
        }
        
        const existingStart = new Date(leave.startDate);
        const existingEnd = new Date(leave.endDate);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        
        return (
          (newStart >= existingStart && newStart <= existingEnd) ||
          (newEnd >= existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      });
    }
  }

  submit(): void {
    if (this.leaveForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.leaveForm.value;
      const leaveRequest: LeaveRequest = {
        userId: 0, // Will be set by the service
        leaveType: formValue.leaveType,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        reason: formValue.reason
      };

      if (this.isEditing && this.leave) {
        this.leaveService.updateLeave(this.leave.id!, leaveRequest).subscribe(
          leave => {
            this.isSubmitting = false;
            this.submitted.emit(leave);
          },
          error => {
            this.isSubmitting = false;
            console.error('Error updating leave request:', error);
          }
        );
      } else {
        this.leaveService.createLeaveForCurrentUser(leaveRequest).subscribe(
          leave => {
            this.isSubmitting = false;
            this.submitted.emit(leave);
          },
          error => {
            this.isSubmitting = false;
            console.error('Error creating leave request:', error);
          }
        );
      }
    }
  }

  close(): void {
    this.cancelled.emit();
  }
} 