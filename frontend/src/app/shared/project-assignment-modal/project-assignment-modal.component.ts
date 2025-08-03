import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-assignment-modal',
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Assign Project</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="projectName">Project Name *</label>
            <input 
              type="text" 
              id="projectName"
              formControlName="projectName"
              placeholder="Enter project name"
              class="form-input">
            <div class="error-message" *ngIf="projectForm.get('projectName')?.invalid && projectForm.get('projectName')?.touched">
              Project name is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              formControlName="description"
              placeholder="Enter project description"
              rows="3"
              class="form-textarea"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="role">Role *</label>
              <select 
                id="role"
                formControlName="role"
                class="form-select">
                <option value="">Select role</option>
                <option value="Developer">Developer</option>
                <option value="Lead Developer">Lead Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Designer">Designer</option>
                <option value="Tester">Tester</option>
                <option value="Analyst">Analyst</option>
              </select>
              <div class="error-message" *ngIf="projectForm.get('role')?.invalid && projectForm.get('role')?.touched">
                Role is required
              </div>
            </div>

            <div class="form-group">
              <label for="status">Status *</label>
              <select 
                id="status"
                formControlName="status"
                class="form-select">
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div class="error-message" *ngIf="projectForm.get('status')?.invalid && projectForm.get('status')?.touched">
                Status is required
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Start Date *</label>
              <input 
                type="date" 
                id="startDate"
                formControlName="startDate"
                class="form-input">
              <div class="error-message" *ngIf="projectForm.get('startDate')?.invalid && projectForm.get('startDate')?.touched">
                Start date is required
              </div>
            </div>

            <div class="form-group">
              <label for="endDate">End Date</label>
              <input 
                type="date" 
                id="endDate"
                formControlName="endDate"
                class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label for="priority">Priority</label>
            <select 
              id="priority"
              formControlName="priority"
              class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div class="form-group">
            <label for="budget">Budget (USD)</label>
            <input 
              type="number" 
              id="budget"
              formControlName="budget"
              placeholder="Enter project budget"
              class="form-input">
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="projectForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">Assign Project</span>
              <span *ngIf="isSubmitting">Assigning...</span>
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
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
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
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
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
export class ProjectAssignmentModalComponent {
  @Input() isOpen: boolean = false;
  @Input() employeeId: number | null = null;
  @Input() employeeName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() assign = new EventEmitter<any>();

  projectForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      description: [''],
      role: ['', Validators.required],
      status: ['active', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      priority: ['medium'],
      budget: ['']
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      const projectData = {
        ...this.projectForm.value,
        employeeId: this.employeeId,
        employeeName: this.employeeName,
        assignedDate: new Date()
      };
      
      this.assign.emit(projectData);
      this.isSubmitting = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }
} 