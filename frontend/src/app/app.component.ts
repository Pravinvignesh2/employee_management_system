import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './services/auth.service';
import { UserResponse } from './models/user.model';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container" [attr.data-theme]="currentTheme">
      <!-- Loading Spinner -->
      <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
      
      <!-- Login Page -->
      <div *ngIf="!(isAuthenticated$ | async)" class="auth-container">
        <router-outlet></router-outlet>
      </div>
      
      <!-- Main Application -->
      <div *ngIf="isAuthenticated$ | async" class="main-container">
        <!-- Header -->
        <app-header 
          [currentUser]="currentUser$ | async"
          [isDarkTheme]="isDarkTheme"
          (themeToggle)="toggleTheme()"
          (logout)="onLogout()">
        </app-header>
        
        <!-- Sidebar and Main Content -->
        <div class="content-container">
          <app-sidebar 
            [currentUser]="currentUser$ | async"
            [isCollapsed]="sidebarCollapsed"
            (toggleSidebar)="toggleSidebar()">
          </app-sidebar>
          
          <main class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: var(--background-color);
      color: var(--text-primary);
      transition: background-color var(--transition-normal), color var(--transition-normal);
    }
    
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    }
    
    .main-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
    }
    
    .content-container {
      flex: 1;
      display: flex;
      min-height: calc(100vh - 64px); /* Subtract header height */
    }
    
    .main-content {
      flex: 1;
      padding: var(--spacing-lg);
      transition: margin-left var(--transition-normal);
      overflow-x: hidden;
      background-color: var(--background-color);
    }
    
    .main-content.sidebar-collapsed {
      margin-left: 80px; /* Match collapsed sidebar width */
    }
    
    @media (max-width: 768px) {
      .content-container {
        min-height: calc(100vh - 64px);
      }
      
      .main-content {
        padding: var(--spacing-md);
        margin-left: 0 !important;
      }
    }
    
    @media (max-width: 480px) {
      .main-content {
        padding: var(--spacing-sm);
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<UserResponse | null>;
  isLoading = false;
  isDarkTheme = false;
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.initializeTheme();
    this.checkAuthentication();
  }

  /**
   * Initialize theme from localStorage or environment
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark' || 
                      (!savedTheme && environment.features.darkMode);
    this.updateTheme();
  }

  /**
   * Check authentication status on app start
   */
  private checkAuthentication(): void {
    this.isLoading = true;
    
    // Check if user is authenticated
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // Validate token
        this.authService.validateToken().subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  /**
   * Update theme on document
   */
  private updateTheme(): void {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Toggle sidebar collapse state
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /**
   * Handle logout
   */
  onLogout(): void {
    this.authService.logout();
  }

  /**
   * Get current theme name
   */
  get currentTheme(): string {
    return this.isDarkTheme ? 'dark' : 'light';
  }
} 