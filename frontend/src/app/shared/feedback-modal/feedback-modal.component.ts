import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from '../../services/performance-management.service';

@Component({
  selector: 'app-feedback-modal',
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isRequesting ? 'Request Feedback' : 'Give Feedback' }}</h2>
          <button class="close-btn" (click)="close()">×</button>
        </div>
        
        <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group" *ngIf="isRequesting || allowDirectRecipient">
            <label for="recipient">{{ isRequesting ? 'Request Feedback From *' : 'Feedback To *' }}</label>
            <select id="recipient" formControlName="recipientId" class="form-control">
              <option value="">Select recipient</option>
              <option *ngFor="let user of availableUsers" [value]="user.id">
                {{ user.fullName }} ({{ user.role }})
              </option>
            </select>
            <div class="error-message" *ngIf="feedbackForm.get('recipientId')?.invalid && feedbackForm.get('recipientId')?.touched">
              Please select a recipient
            </div>
            <div class="help-text" *ngIf="allowDirectRecipient">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Only users in your department are shown</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="type">Feedback Type *</label>
            <select id="type" formControlName="type" class="form-control">
              <option value="">Select type</option>
              <option value="PEER">Peer Feedback</option>
              <option value="MANAGER">Manager Feedback</option>
              <option value="SELF">Self Assessment</option>
              <option value="SUBORDINATE">Subordinate Feedback</option>
            </select>
            <div class="error-message" *ngIf="feedbackForm.get('type')?.invalid && feedbackForm.get('type')?.touched">
              Please select a feedback type
            </div>
          </div>
          
          <div class="form-group" *ngIf="!isRequesting">
            <label for="rating">Rating *</label>
            <div class="rating-input">
              <span 
                *ngFor="let star of [1,2,3,4,5]" 
                class="star" 
                [class.filled]="star <= feedbackForm.get('rating')?.value"
                (click)="setRating(star)"
              >★</span>
            </div>
            <div class="error-message" *ngIf="feedbackForm.get('rating')?.invalid && feedbackForm.get('rating')?.touched">
              Please provide a rating
            </div>
          </div>
          
          <div class="form-group" *ngIf="!isRequesting">
            <label for="comment">Comments *</label>
            <textarea 
              id="comment" 
              formControlName="comment" 
              placeholder="Provide detailed feedback..."
              rows="4"
              class="form-control"
            ></textarea>
            <div class="error-message" *ngIf="feedbackForm.get('comment')?.invalid && feedbackForm.get('comment')?.touched">
              Comments are required
            </div>
          </div>
          
          <div class="form-group">
            <label for="reviewPeriod">Review Period</label>
            <select id="reviewPeriod" formControlName="reviewPeriod" class="form-control">
              <option value="">Select period</option>
              <option *ngFor="let period of getReviewPeriods()" [value]="period">{{ period }}</option>
            </select>
          </div>
          
          <div class="form-group" *ngIf="showAnonymousOption && !isRequesting">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="isAnonymous">
              Submit anonymously
            </label>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="feedbackForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Submitting...' : (isRequesting ? 'Request Feedback' : 'Submit Feedback') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    
    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .rating-input {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    
    .star {
      font-size: 24px;
      color: #d1d5db;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .star.filled {
      color: #fbbf24;
    }
    
    .star:hover {
      color: #fbbf24;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: normal;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
    
    .error-message {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 4px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }
    
    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-secondary:hover {
      background: #e5e7eb;
    }
    
    .help-text {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      font-size: 12px;
      color: #6b7280;
    }
    
    .help-text svg {
      color: #9ca3af;
      flex-shrink: 0;
    }
    
    @media (max-width: 640px) {
      .modal-content {
        width: 95%;
        margin: 20px;
      }
    }
  `]
})
export class FeedbackModalComponent implements OnInit, OnChanges {
  @Input() isRequesting = false;
  @Input() availableUsers: any[] = [];
  @Input() showAnonymousOption = true;
  @Input() allowDirectRecipient = false;
  // New: preset values for request-driven feedback
  @Input() presetRecipientId?: number;
  @Input() presetType?: 'SELF' | 'PEER' | 'MANAGER' | 'SUBORDINATE';
  @Input() presetReviewPeriod?: string;
  @Input() lockRecipientAndType = false;
  @Output() save = new EventEmitter<Feedback>();
  @Output() closeModal = new EventEmitter<void>();
  
  feedbackForm: FormGroup;
  isSubmitting = false;
  
  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      recipientId: ['', Validators.required],
      type: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      reviewPeriod: ['Q4 2024'],
      isAnonymous: [false]
    });
  }
  
  ngOnInit() {
    if (!(this.isRequesting || this.allowDirectRecipient)) {
      this.feedbackForm.get('recipientId')?.clearValidators();
      this.feedbackForm.get('recipientId')?.updateValueAndValidity();
    }
    // When requesting feedback, rating/comment/anonymous are not required
    if (this.isRequesting) {
      this.feedbackForm.get('rating')?.clearValidators();
      this.feedbackForm.get('rating')?.updateValueAndValidity();
      this.feedbackForm.get('comment')?.clearValidators();
      this.feedbackForm.get('comment')?.updateValueAndValidity();
      this.feedbackForm.patchValue({ isAnonymous: false });
    }

    // Apply preset values if provided (for responding to a request)
    const patch: any = {};
    if (this.presetRecipientId != null) patch.recipientId = this.presetRecipientId;
    if (this.presetType) patch.type = this.presetType;
    if (this.presetReviewPeriod) patch.reviewPeriod = this.presetReviewPeriod;
    if (Object.keys(patch).length) {
      this.feedbackForm.patchValue(patch);
    }

    if (this.lockRecipientAndType) {
      this.feedbackForm.get('recipientId')?.disable();
      this.feedbackForm.get('type')?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-apply presets on any input change (component is recreated by *ngIf, but handle safety)
    const patch: any = {};
    if (this.presetRecipientId != null) patch.recipientId = this.presetRecipientId;
    if (this.presetType) patch.type = this.presetType;
    if (this.presetReviewPeriod) patch.reviewPeriod = this.presetReviewPeriod;
    if (Object.keys(patch).length) {
      // Use getRawValue to allow disabled controls to be patched
      this.feedbackForm.patchValue(patch, { emitEvent: false });
    }
    if (this.lockRecipientAndType) {
      this.feedbackForm.get('recipientId')?.disable({ emitEvent: false });
      this.feedbackForm.get('type')?.disable({ emitEvent: false });
    } else {
      this.feedbackForm.get('recipientId')?.enable({ emitEvent: false });
      this.feedbackForm.get('type')?.enable({ emitEvent: false });
    }
  }
  
  setRating(rating: number) {
    this.feedbackForm.patchValue({ rating });
  }
  
  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isSubmitting = true;
      const formValue = this.feedbackForm.getRawValue();
      
      const feedbackData: Feedback = this.isRequesting
        ? {
            recipientId: formValue.recipientId,
            type: formValue.type,
            rating: 0,
            comment: '',
            reviewPeriod: formValue.reviewPeriod,
            isAnonymous: false
          }
        : {
            recipientId: formValue.recipientId,
            type: formValue.type,
            rating: formValue.rating,
            comment: formValue.comment,
            reviewPeriod: formValue.reviewPeriod,
            isAnonymous: formValue.isAnonymous
          };
      
      this.save.emit(feedbackData);
    }
  }
  
  close() {
    this.closeModal.emit();
  }

  getReviewPeriods(): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

    const periods: string[] = [];

    // Add current quarter
    const quarter = Math.floor(currentMonth / 3) + 1;
    periods.push(`Q${quarter} ${currentYear}`);

    // Add next quarter
    const nextQuarter = (Math.floor(currentMonth / 3) + 2) % 4;
    periods.push(`Q${nextQuarter} ${currentYear}`);

    // Add annual
    periods.push(`Annual ${currentYear}`);

    return periods;
  }
} 