import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole, Department, UserStatus } from '../../models/user.model';

@Component({
  selector: 'app-employee-modal',
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                id="email"
                type="email" 
                formControlName="email"
                placeholder="Enter email address"
                [readonly]="isEditMode">
              <div class="error-message" *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
                Valid email is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input 
                id="firstName"
                type="text" 
                formControlName="firstName"
                placeholder="Enter first name">
              <div class="error-message" *ngIf="employeeForm.get('firstName')?.invalid && employeeForm.get('firstName')?.touched">
                First name is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input 
                id="lastName"
                type="text" 
                formControlName="lastName"
                placeholder="Enter last name">
              <div class="error-message" *ngIf="employeeForm.get('lastName')?.invalid && employeeForm.get('lastName')?.touched">
                Last name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="phoneNumber">Phone Number *</label>
              <input 
                id="phoneNumber"
                type="tel" 
                formControlName="phoneNumber"
                placeholder="Enter phone number">
              <div class="error-message" *ngIf="employeeForm.get('phoneNumber')?.invalid && employeeForm.get('phoneNumber')?.touched">
                Phone number is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="role">Role *</label>
              <select id="role" formControlName="role">
                <option value="">Select role</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="IT_SUPPORT">IT Support</option>
              </select>
              <div class="error-message" *ngIf="employeeForm.get('role')?.invalid && employeeForm.get('role')?.touched">
                Role is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="department">Department *</label>
              <select id="department" formControlName="department">
                <option value="">Select department</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="FINANCE">Finance</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="OPERATIONS">Operations</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="SUPPORT">Support</option>
              </select>
              <div class="error-message" *ngIf="employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched">
                Department is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="LOCKED">Locked</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="address">Address</label>
            <textarea 
              id="address"
              formControlName="address"
              placeholder="Enter address"
              rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label for="emergencyContact">Emergency Contact</label>
            <input 
              id="emergencyContact"
              type="text" 
              formControlName="emergencyContact"
              placeholder="Enter emergency contact">
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="employeeForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Add Employee') }}
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
      border-radius: 16px;
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
      font-weight: 700;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      background: white;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input[readonly] {
      background: #f9fafb;
      color: #6b7280;
    }

    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary,
    .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a67d8;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
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
    }
  `]
})
export class EmployeeModalComponent implements OnInit {
  @Input() employee: User | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  employeeForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required]],
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      status: ['ACTIVE'],
      address: [''],
      emergencyContact: ['']
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.employee) {
      this.employeeForm.patchValue({
        email: this.employee.email,
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        phoneNumber: this.employee.phoneNumber,
        role: this.employee.role,
        department: this.employee.department,
        status: this.employee.status,
        address: this.employee.address,
        emergencyContact: this.employee.emergencyContact
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      const formValue = this.employeeForm.value;
      
      // Create a partial user object without timestamps for updates
      const employeeData = {
        id: this.employee?.id || 0,
        employeeId: this.employee?.employeeId || '', // Will be generated by backend
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phoneNumber: formValue.phoneNumber,
        role: formValue.role,
        department: formValue.department,
        status: formValue.status,
        address: formValue.address,
        emergencyContact: formValue.emergencyContact
      };

      this.save.emit(employeeData as User);
    }
  }

  onClose(): void {
    this.close.emit();
  }
} 