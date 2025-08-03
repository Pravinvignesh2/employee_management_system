import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

// Import components directly
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeDirectoryComponent } from './pages/employee-directory/employee-directory.component';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LeaveManagementComponent } from './pages/leave-management/leave-management.component';
import { PayrollComponent } from './pages/payroll/payroll.component';

import { PerformanceManagementComponent } from './pages/performance-management/performance-management.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { SupportComponent } from './pages/support/support.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  
  // Employee Directory - Accessible by Admin and Manager only
  {
    path: 'employees',
    component: EmployeeDirectoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
  },
  
  // Employee Profile - Accessible by Admin and Manager only
  {
    path: 'profile/:id',
    component: EmployeeProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
  },
  
  // Attendance - Accessible by all authenticated users
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard]
  },
  
  // Leave Management - Accessible by all authenticated users
  {
    path: 'leaves',
    component: LeaveManagementComponent,
    canActivate: [AuthGuard]
  },
  
  // Payroll - Accessible by Admin, Manager, and Employee (own data)
  {
    path: 'payroll',
    component: PayrollComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] }
  },
  

  
  // Performance Management - Accessible by Admin, Manager, and Employee (own data)
  {
    path: 'performance-management',
    component: PerformanceManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] }
  },
  
  // Profile - Accessible by all authenticated users
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  
  // Admin routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  
  // Manager routes
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
  },
  
  // IT Support routes
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.IT_SUPPORT] }
  },
  
  // Wildcard route - 404 page
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64] // Account for fixed header
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 