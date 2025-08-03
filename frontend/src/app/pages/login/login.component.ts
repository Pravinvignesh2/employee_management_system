import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="login-card">
          <div class="login-header">
            <div class="logo">
              <div class="logo-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#667eea"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#667eea"/>
                </svg>
              </div>
              <h1>Employee Management</h1>
              <p>Welcome back! Please sign in to your account</p>
            </div>
          </div>
          
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  [(ngModel)]="email" 
                  required 
                  email
                  placeholder="Enter your email address"
                  class="form-control">
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  [(ngModel)]="password" 
                  required
                  placeholder="Enter your password"
                  class="form-control">
              </div>
            </div>
            
            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              [disabled]="!loginForm.valid || isLoading" 
              class="btn-login"
              [class.loading]="isLoading">
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="loading-spinner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </form>
          
          <div *ngIf="error" class="error-message">
            <svg class="error-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ error }}
          </div>
          
          <div class="login-footer">
            <p>Don't have an account? <a href="#" class="signup-link">Contact Admin</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    .login-background {
      width: 100%;
      max-width: 420px;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 48px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      margin-bottom: 24px;
    }
    
    .logo-icon {
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      color: #1a202c;
      margin-bottom: 8px;
      letter-spacing: -0.025em;
    }
    
    .logo p {
      margin: 0;
      color: #718096;
      font-size: 16px;
      font-weight: 500;
    }
    
    .login-form {
      margin-bottom: 24px;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2d3748;
      font-size: 14px;
      letter-spacing: 0.025em;
    }
    
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      left: 16px;
      color: #a0aec0;
      z-index: 1;
    }
    
    .form-control {
      width: 100%;
      padding: 16px 16px 16px 48px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #2d3748;
      transition: all 0.2s ease;
      background: #ffffff;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: #ffffff;
    }
    
    .form-control::placeholder {
      color: #a0aec0;
      font-weight: 400;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .checkbox-wrapper {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #4a5568;
      font-weight: 500;
    }
    
    .checkbox-wrapper input[type="checkbox"] {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      accent-color: #667eea;
    }
    
    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: color 0.2s ease;
    }
    
    .forgot-password:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
    
    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.025em;
    }
    
    .btn-login:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .btn-login:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    .btn-login.loading {
      background: #a0aec0;
    }
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      background: #fed7d7;
      border: 1px solid #feb2b2;
      color: #c53030;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
    }
    
    .error-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .login-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    
    .login-footer p {
      margin: 0;
      color: #718096;
      font-size: 14px;
      font-weight: 500;
    }
    
    .signup-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }
    
    .signup-link:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
    
    @media (max-width: 480px) {
      .login-card {
        padding: 32px 24px;
        margin: 16px;
      }
      
      .logo h1 {
        font-size: 28px;
      }
      
      .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `],
  host: {
    'style': 'display: block; width: 100%; height: 100vh;'
  }
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.isLoading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Login failed. Please check your credentials and try again.';
      }
    });
  }
} 