import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-directory',
  template: `
    <div class="directory-container">
      <!-- Header -->
      <div class="directory-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Employee Directory</h1>
            <p>Find and manage your team members</p>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search employees..."
                [(ngModel)]="searchTerm"
                (input)="onSearch()"
                class="search-input">
            </div>
            <button class="add-employee-btn" (click)="openAddEmployeeModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-content">
          <div class="filter-group">
            <label>Department</label>
            <select [(ngModel)]="selectedDepartment" (change)="onFilter()" class="filter-select">
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="FINANCE">Finance</option>
              <option value="MARKETING">Marketing</option>
              <option value="SALES">Sales</option>
              <option value="OPERATIONS">Operations</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status</label>
            <select [(ngModel)]="selectedStatus" (change)="onFilter()" class="filter-select">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="LOCKED">Locked</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Role</label>
            <select [(ngModel)]="selectedRole" (change)="onFilter()" class="filter-select">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="IT_SUPPORT">IT Support</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>Loading employees...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error-container">
        <div class="error-card">
          <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="error-content">
            <h3>Error Loading Employees</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" (click)="loadEmployees()">Try Again</button>
          </div>
        </div>
      </div>

      <!-- Employee Grid -->
      <div *ngIf="!loading && !error" class="directory-content">
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-number">{{ filteredEmployees.length }}</span>
            <span class="stat-label">Total Employees</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getActiveCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getNewHiresCount() }}</span>
            <span class="stat-label">New This Month</span>
          </div>
        </div>

        <div class="employees-grid">
          <div *ngFor="let employee of filteredEmployees" class="employee-card">
            <div class="employee-avatar">
              <div class="avatar-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="status-indicator" [ngClass]="'status-' + employee.status.toLowerCase()"></div>
            </div>
            <div class="employee-info">
              <h3 class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</h3>
              <p class="employee-role">{{ employee.role }}</p>
              <p class="employee-department">{{ employee.department }}</p>
              <p class="employee-email">{{ employee.email }}</p>
            </div>
            <div class="employee-actions">
              <button class="action-btn view-btn" title="View Profile" (click)="viewEmployee(employee)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="action-btn edit-btn" title="Edit Employee" (click)="editEmployee(employee)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="action-btn delete-btn" title="Delete Employee" (click)="deleteEmployee(employee)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredEmployees.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>

      <!-- Employee Modal -->
      <app-employee-modal
        *ngIf="showModal"
        [employee]="selectedEmployee"
        [isEditMode]="isEditMode"
        (save)="onSaveEmployee($event)"
        (close)="closeModal()">
      </app-employee-modal>
    </div>
  `,
  styles: [`
    .directory-container {
      min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .directory-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 40px;
      color: white;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-left h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .header-left p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: none;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.9);
      color: #1f2937;
      font-size: 16px;
      font-weight: 500;
    }

    .search-input::placeholder {
      color: #6b7280;
    }

    .search-input:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }

    .add-employee-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .add-employee-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .filters-section {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 24px 40px;
    }

    .filters-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 24px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #1f2937;
      font-size: 14px;
      min-width: 150px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }

    .error-card {
      background: white;
      border: 1px solid #fecaca;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 500px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
      color: #ef4444;
      flex-shrink: 0;
    }

    .error-content h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .error-content p {
      margin: 0 0 16px 0;
      color: #6b7280;
    }

    .retry-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .retry-btn:hover {
      background: #5a67d8;
    }

    .directory-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .stats-bar {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 800;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .employees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .employee-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
      position: relative;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .employee-avatar {
      position: relative;
      margin-bottom: 16px;
    }

    .avatar-placeholder {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
    }

    .status-active {
      background: #10b981;
    }

    .status-inactive {
      background: #6b7280;
    }

    .status-locked {
      background: #f59e0b;
    }

    .status-terminated {
      background: #ef4444;
    }

    .employee-info {
      margin-bottom: 16px;
    }

    .employee-name {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .employee-role {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
      text-transform: capitalize;
    }

    .employee-department {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #6b7280;
      text-transform: capitalize;
    }

    .employee-email {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    .employee-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn {
      background: #f3f4f6;
      color: #6b7280;
    }

    .view-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .edit-btn {
      background: #667eea;
      color: white;
    }

    .edit-btn:hover {
      background: #5a67d8;
    }

    .delete-btn {
      background: #ef4444;
      color: white;
    }

    .delete-btn:hover {
      background: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #6b7280;
    }

    .empty-state h3 {
      margin: 16px 0 8px 0;
      color: #374151;
      font-size: 20px;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .directory-header {
        padding: 24px 20px;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      .filters-section {
        padding: 20px;
      }

      .filters-content {
        flex-direction: column;
        gap: 16px;
      }

      .filter-select {
        min-width: auto;
      }

      .directory-content {
        padding: 24px 16px;
      }

      .stats-bar {
        flex-direction: column;
        gap: 16px;
      }

      .employees-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: User[] = [];
  filteredEmployees: User[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';
  selectedRole = '';
  showModal = false;
  selectedEmployee: User | null = null;
  isEditMode = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.employees = response.content || [];
        this.filteredEmployees = response.content || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error('Error loading employees:', error);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesDepartment = !this.selectedDepartment || 
        employee.department === this.selectedDepartment;

      const matchesStatus = !this.selectedStatus || 
        employee.status === this.selectedStatus;

      const matchesRole = !this.selectedRole || 
        employee.role === this.selectedRole;

      return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
    });
  }

  getActiveCount(): number {
    return this.employees.filter(emp => emp.status === 'ACTIVE').length;
  }

  getNewHiresCount(): number {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return this.employees.filter(emp => {
      if (!emp.dateOfJoining) return false;
      const joiningDate = new Date(emp.dateOfJoining);
      return joiningDate.getMonth() === currentMonth && 
             joiningDate.getFullYear() === currentYear;
    }).length;
  }

  openAddEmployeeModal(): void {
    this.selectedEmployee = null;
    this.isEditMode = false;
    this.showModal = true;
  }

  viewEmployee(employee: User): void {
    this.router.navigate(['/profile', employee.id]);
  }

  editEmployee(employee: User): void {
    this.selectedEmployee = employee;
    this.isEditMode = true;
    this.showModal = true;
  }

  deleteEmployee(employee: User): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.userService.deleteUser(employee.id).subscribe({
        next: () => {
          this.loadEmployees();
          this.showSuccessDialog('Employee deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.showErrorDialog('Failed to delete employee. Please try again.');
        }
      });
    }
  }

  onSaveEmployee(employeeData: User): void {
    if (this.isEditMode) {
      // Update existing employee
      this.userService.updateUser(employeeData.id, employeeData).subscribe({
        next: (updatedEmployee) => {
          this.loadEmployees();
          this.closeModal();
          this.showSuccessDialog('Employee updated successfully!');
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.showErrorDialog('Failed to update employee. Please try again.');
        }
      });
    } else {
      // Create new employee
      this.userService.createUser(employeeData).subscribe({
        next: (newEmployee) => {
          this.loadEmployees();
          this.closeModal();
          this.showSuccessDialog('Employee added successfully!');
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.showErrorDialog('Failed to add employee. Please try again.');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEmployee = null;
    this.isEditMode = false;
  }

  showSuccessDialog(message: string): void {
    if (confirm(message)) {
      // User clicked OK, do nothing
    }
  }

  showErrorDialog(message: string): void {
    alert(message); // Keep alert for errors as they need immediate attention
  }
} 