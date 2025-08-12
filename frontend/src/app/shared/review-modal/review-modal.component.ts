import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-modal',
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Create Performance Review</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
          <div class="form-group">
            <label for="title">Review Title *</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              placeholder="e.g., Annual Performance Review 2024"
              class="form-control">
            <div class="error-message" *ngIf="reviewForm.get('title')?.invalid && reviewForm.get('title')?.touched">
              Review title is required
            </div>
          </div>

          <div class="form-group">
            <label for="rating">Overall Rating *</label>
            <div class="rating-input">
              <div class="stars">
                <span 
                  *ngFor="let star of [1,2,3,4,5]" 
                  class="star" 
                  [class.filled]="star <= reviewForm.get('rating')?.value"
                  (click)="setRating(star)">
                  ★
                </span>
              </div>
              <span class="rating-text">{{ reviewForm.get('rating')?.value || 0 }}/5</span>
            </div>
            <div class="error-message" *ngIf="reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched">
              Please select a rating
            </div>
          </div>

          <div class="form-group">
            <label for="summary">Review Summary *</label>
            <textarea 
              id="summary" 
              formControlName="summary" 
              placeholder="Provide a detailed summary of the employee's performance..."
              rows="4"
              class="form-control"></textarea>
            <div class="error-message" *ngIf="reviewForm.get('summary')?.invalid && reviewForm.get('summary')?.touched">
              Review summary is required
            </div>
          </div>

          <div class="form-group">
            <label for="strengths">Key Strengths</label>
            <textarea 
              id="strengths" 
              formControlName="strengths" 
              placeholder="List the employee's key strengths and achievements..."
              rows="3"
              class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label for="improvements">Areas for Improvement</label>
            <textarea 
              id="improvements" 
              formControlName="improvements" 
              placeholder="Suggest areas where the employee can improve..."
              rows="3"
              class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label for="goals">Goals for Next Period</label>
            <textarea 
              id="goals" 
              formControlName="goals" 
              placeholder="Set specific goals and objectives for the next review period..."
              rows="3"
              class="form-control"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="reviewForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">Create Review</span>
              <span *ngIf="isSubmitting">Creating...</span>
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
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
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
      color: #1f2937;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #6b7280;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #374151;
    }

    .review-form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stars {
      display: flex;
      gap: 4px;
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

    .rating-text {
      font-weight: 500;
      color: #374151;
    }

    .error-message {
      color: #dc2626;
      font-size: 12px;
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

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background-color: #6366f1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5855eb;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
    }
  `]
})
export class ReviewModalComponent {
  @Input() isOpen = false;
  @Input() employeeId: number | null = null;
  @Input() employeeName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>();

  reviewForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      title: ['', [Validators.required]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      summary: ['', [Validators.required]],
      strengths: [''],
      improvements: [''],
      goals: ['']
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.reviewForm.valid && this.employeeId) {
      this.isSubmitting = true;
      
      const reviewData = {
        ...this.reviewForm.value,
        employeeId: this.employeeId,
        employeeName: this.employeeName
      };

      this.create.emit(reviewData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reviewForm.controls).forEach(key => {
      const control = this.reviewForm.get(key);
      control?.markAsTouched();
    });
  }
}
