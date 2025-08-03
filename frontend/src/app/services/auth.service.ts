import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { 
  User, 
  UserResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  ValidateTokenRequest,
  ValidateTokenResponse 
} from '../models/user.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getCurrentUserFromStorage();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Login user
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setCurrentUser(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Register new user
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setCurrentUser(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setCurrentUser(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Validate current token
   */
  validateToken(): Observable<ValidateTokenResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const request: ValidateTokenRequest = { token };
    return this.http.post<ValidateTokenResponse>(`${this.API_URL}/validate`, request)
      .pipe(
        tap(response => {
          if (!response.valid) {
            this.logout();
          }
        }),
        catchError(error => {
          console.error('Token validation error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current user info
   */
  getCurrentUserInfo(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/me`)
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Get current user error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Call logout endpoint
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      error: (error) => console.error('Logout error:', error)
    });

    // Clear local storage and state
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Check if user is manager
   */
  isManager(): boolean {
    return this.hasRole('MANAGER');
  }

  /**
   * Check if user is employee
   */
  isEmployee(): boolean {
    return this.hasRole('EMPLOYEE');
  }

  /**
   * Check if user is IT support
   */
  isItSupport(): boolean {
    return this.hasRole('IT_SUPPORT');
  }

  /**
   * Get current user from subject
   */
  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(environment.auth.tokenKey);
  }

  /**
   * Set authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(environment.auth.tokenKey, token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(environment.auth.refreshTokenKey);
  }

  /**
   * Set refresh token
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem(environment.auth.refreshTokenKey, token);
  }

  /**
   * Set current user in localStorage
   */
  private setCurrentUser(user: UserResponse): void {
    localStorage.setItem(environment.auth.userKey, JSON.stringify(user));
  }

  /**
   * Get current user from localStorage
   */
  private getCurrentUserFromStorage(): UserResponse | null {
    const userStr = localStorage.getItem(environment.auth.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(environment.auth.tokenKey);
    localStorage.removeItem(environment.auth.refreshTokenKey);
    localStorage.removeItem(environment.auth.userKey);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true;
    }
  }

  /**
   * Auto refresh token if needed
   */
  autoRefreshToken(): Observable<boolean> {
    if (this.isTokenExpired()) {
      return this.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Token refresh failed'));
        })
      );
    }
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }
} 