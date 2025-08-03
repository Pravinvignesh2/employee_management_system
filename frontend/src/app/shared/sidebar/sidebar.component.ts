import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserResponse } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text" *ngIf="!isCollapsed">Employee System</span>
        </div>
        <button (click)="onToggleSidebar()" class="toggle-btn" [title]="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" [title]="isCollapsed ? 'Dashboard' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Dashboard</span>
            </a>
          </li>
          <li *ngIf="isAdminOrManager()">
            <a routerLink="/employees" routerLinkActive="active" [title]="isCollapsed ? 'Employees' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Employees</span>
            </a>
          </li>
          <li>
            <a routerLink="/attendance" routerLinkActive="active" [title]="isCollapsed ? 'Attendance' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Attendance</span>
            </a>
          </li>
          <li>
            <a routerLink="/leaves" routerLinkActive="active" [title]="isCollapsed ? 'Leave Management' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Leave Management</span>
            </a>
          </li>
          <li>
            <a routerLink="/payroll" routerLinkActive="active" [title]="isCollapsed ? 'Payroll' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Payroll</span>
            </a>
          </li>

          <li>
            <a routerLink="/performance-management" routerLinkActive="active" [title]="isCollapsed ? 'Performance Management' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L14.55 13.74L16.18 20.02L12 16.77L7.82 20.02L9.45 13.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Performance Management</span>
            </a>
          </li>
          <li>
            <a routerLink="/profile" routerLinkActive="active" [title]="isCollapsed ? 'Profile' : ''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span *ngIf="!isCollapsed">Profile</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: var(--surface-color);
      color: var(--text-primary);
      height: 100%;
      min-height: calc(100vh - 64px); /* Subtract header height */
      transition: all 0.3s ease;
      border-right: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      overflow-y: auto;
      position: sticky;
      top: 0;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar-brand svg {
      color: var(--primary-color);
    }

    .brand-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .toggle-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      background: var(--surface-color-hover);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .toggle-btn:hover {
      background: var(--border-color);
      color: var(--text-primary);
    }

    .sidebar-nav {
      padding: 16px 0;
    }

    .sidebar-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-nav li {
      margin: 4px 0;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 0 8px 8px 0;
      margin-right: 8px;
    }

    .sidebar-nav a:hover {
      background: var(--surface-color-hover);
      color: var(--text-primary);
    }

    .sidebar-nav a.active {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-nav a svg {
      flex-shrink: 0;
    }

    .sidebar-nav a span {
      font-weight: 500;
      white-space: nowrap;
    }

    .sidebar.collapsed .sidebar-nav a {
      justify-content: center;
      padding: 12px;
    }

    .sidebar.collapsed .sidebar-nav a span {
      display: none;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        transform: translateX(-100%);
        height: 100vh;
        min-height: 100vh;
      }

      .sidebar.show {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() currentUser: UserResponse | null = null;
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  isAdminOrManager(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'ADMIN' || this.currentUser.role === 'MANAGER';
  }
} 