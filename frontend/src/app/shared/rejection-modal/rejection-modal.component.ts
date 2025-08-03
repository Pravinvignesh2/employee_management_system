import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rejection-modal',
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Reject Leave Request</h3>
          <button class="btn-close" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="leave-info" *ngIf="leaveInfo">
            <div class="info-row">
              <span class="label">Employee:</span>
              <span class="value">{{ leaveInfo.employeeName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Leave Type:</span>
              <span class="value">{{ leaveInfo.leaveType }}</span>
            </div>
            <div class="info-row">
              <span class="label">Duration:</span>
              <span class="value">{{ leaveInfo.startDate | date:'shortDate' }} - {{ leaveInfo.endDate | date:'shortDate' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Days:</span>
              <span class="value">{{ leaveInfo.totalDays }} {{ leaveInfo.totalDays === 1 ? 'day' : 'days' }}</span>
            </div>
          </div>

          <form [formGroup]="rejectionForm" (ngSubmit)="submit()">
            <div class="form-group">
              <label for="rejectionReason">Rejection Reason *</label>
              <textarea 
                id="rejectionReason" 
                formControlName="rejectionReason" 
                class="form-control" 
                rows="4"
                placeholder="Please provide a detailed reason for rejecting this leave request..."></textarea>
              <div class="error-message" *ngIf="rejectionForm.get('rejectionReason')?.invalid && rejectionForm.get('rejectionReason')?.touched">
                Rejection reason must be at least 10 characters long
              </div>
              <div class="char-count">
                {{ rejectionForm.get('rejectionReason')?.value?.length || 0 }}/500 characters
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="notifyEmployee">
                <span class="checkmark"></span>
                Send notification to employee
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="close()">
                Cancel
              </button>
              <button type="submit" class="btn-danger" [disabled]="!rejectionForm.valid || isSubmitting">
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? 'Rejecting...' : 'Reject Request' }}
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
      max-width: 500px;
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

    .leave-info {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #4a5568;
      font-weight: 500;
      font-size: 14px;
    }

    .value {
      color: #2d3748;
      font-weight: 600;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
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
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #f56565;
      box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
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

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #4a5568;
    }

    .checkbox-label input[type="checkbox"] {
      margin-right: 8px;
      width: 16px;
      height: 16px;
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

    .btn-danger {
      background: linear-gradient(135deg, #f56565, #e53e3e);
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

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
    }

    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 20px;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-secondary, .btn-danger {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class RejectionModalComponent {
  @Input() leaveInfo: any = null;
  @Output() submitted = new EventEmitter<{reason: string, notifyEmployee: boolean}>();
  @Output() cancelled = new EventEmitter<void>();

  rejectionForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.rejectionForm = this.fb.group({
      rejectionReason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      notifyEmployee: [true]
    });
  }

  submit(): void {
    if (this.rejectionForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.rejectionForm.value;
      this.submitted.emit({
        reason: formValue.rejectionReason,
        notifyEmployee: formValue.notifyEmployee
      });
    }
  }

  close(): void {
    this.cancelled.emit();
  }
} 