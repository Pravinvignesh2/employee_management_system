import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerformanceGoal } from '../../services/performance-management.service';

@Component({
  selector: 'app-goal-modal',
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Goal' : 'Add New Goal' }}</h2>
          <button class="close-btn" (click)="close()">×</button>
        </div>
        
        <form [formGroup]="goalForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="title">Goal Title *</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              placeholder="Enter goal title"
              class="form-control"
            >
            <div class="error-message" *ngIf="goalForm.get('title')?.invalid && goalForm.get('title')?.touched">
              Title is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description" 
              formControlName="description" 
              placeholder="Enter goal description"
              rows="3"
              class="form-control"
            ></textarea>
            <div class="error-message" *ngIf="goalForm.get('description')?.invalid && goalForm.get('description')?.touched">
              Description is required
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="target">Target *</label>
              <input 
                type="text" 
                id="target" 
                formControlName="target" 
                placeholder="e.g., 100%"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="current">Current Progress *</label>
              <input 
                type="number" 
                id="current" 
                formControlName="current" 
                placeholder="0-100"
                min="0"
                max="100"
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type">Goal Type *</label>
              <select id="type" formControlName="type" class="form-control">
                <option value="">Select type</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUAL">Annual</option>
                <option value="PROJECT_BASED">Project Based</option>
                <option value="SKILL_DEVELOPMENT">Skill Development</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                formControlName="dueDate" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="goalForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Goal' : 'Create Goal') }}
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
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        width: 95%;
        margin: 20px;
      }
    }
  `]
})
export class GoalModalComponent implements OnInit {
  @Input() goal?: PerformanceGoal;
  @Output() save = new EventEmitter<PerformanceGoal>();
  @Output() closeModal = new EventEmitter<void>();
  
  goalForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  
  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      target: ['100', Validators.required],
      current: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      type: ['', Validators.required],
      dueDate: ['']
    });
  }
  
  ngOnInit() {
    if (this.goal) {
      this.isEditing = true;
      this.goalForm.patchValue({
        title: this.goal.title,
        description: this.goal.description,
        target: this.goal.target,
        current: this.goal.progress,
        type: this.goal.type,
        dueDate: this.goal.dueDate ? this.formatDateForInput(this.goal.dueDate) : ''
      });
    }
  }
  
  onSubmit() {
    if (this.goalForm.valid) {
      this.isSubmitting = true;
      const formValue = this.goalForm.value;
      
      const goalData: PerformanceGoal = {
        userId: this.goal?.userId || 0,
        title: formValue.title,
        description: formValue.description,
        target: formValue.target,
        current: formValue.current.toString(),
        progress: formValue.current,
        type: formValue.type,
        status: this.goal?.status || 'ON_TRACK',
        dueDate: formValue.dueDate ? this.formatDateForOutput(formValue.dueDate) : undefined
      };
      
      this.save.emit(goalData);
    }
  }
  
  close() {
    this.closeModal.emit();
  }
  
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  private formatDateForOutput(dateString: string): string {
    return new Date(dateString).toISOString();
  }
} 