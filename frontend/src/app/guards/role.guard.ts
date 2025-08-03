import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    }

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.includes(currentUser.role);
    
    if (!hasRequiredRole) {
      // Redirect to dashboard or show access denied
      this.router.navigate(['/dashboard']);
      return of(false);
    }

    return of(true);
  }

  /**
   * Check if user can access specific resource
   */
  canAccessResource(resourceType: string, resourceId?: number): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return false;
    }

    // Admin has access to everything
    if (currentUser.role === UserRole.ADMIN) {
      return true;
    }

    // Manager has access to their team members
    if (currentUser.role === UserRole.MANAGER) {
      // This would need to be implemented based on team structure
      return true;
    }

    // Employee can only access their own data
    if (currentUser.role === UserRole.EMPLOYEE) {
      // Check if the resource belongs to the current user
      return resourceId === currentUser.id;
    }

    // IT Support has limited access
    if (currentUser.role === UserRole.IT_SUPPORT) {
      // IT Support can access technical/maintenance related resources
      return ['system', 'logs', 'maintenance'].includes(resourceType);
    }

    return false;
  }

  /**
   * Check if user can perform specific action
   */
  canPerformAction(action: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return false;
    }

    // Admin can perform all actions
    if (currentUser.role === UserRole.ADMIN) {
      return true;
    }

    // Define role-based permissions
    const rolePermissions: { [key: string]: string[] } = {
      [UserRole.MANAGER]: [
        'view_employees',
        'edit_employees',
        'approve_leaves',
        'view_attendance',
        'view_payroll',
        'view_performance',
        'create_reports'
      ],
      [UserRole.EMPLOYEE]: [
        'view_own_profile',
        'edit_own_profile',
        'view_own_attendance',
        'view_own_leaves',
        'request_leave',
        'view_own_payroll',
        'view_own_performance'
      ],
      [UserRole.IT_SUPPORT]: [
        'view_system_logs',
        'view_maintenance',
        'view_technical_reports',
        'access_support_tools'
      ]
    };

    const permissions = rolePermissions[currentUser.role] || [];
    return permissions.includes(action);
  }
} 