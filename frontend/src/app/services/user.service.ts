import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  User, 
  UserStatistics, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilters, 
  PaginatedUsersResponse,
  UserRole,
  Department,
  UserStatus
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Get all users with pagination and filters
  getUsers(page: number = 0, size: number = 10, filters?: UserFilters): Observable<PaginatedUsersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.department) {
        params = params.set('department', filters.department);
      }
      if (filters.role) {
        params = params.set('role', filters.role);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.searchQuery) {
        params = params.set('query', filters.searchQuery);
      }
    }

    return this.http.get<PaginatedUsersResponse>(this.apiUrl, { params });
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Get user by email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  // Get user by employee ID
  getUserByEmployeeId(employeeId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  // Update user
  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get users by department
  getUsersByDepartment(department: Department): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/department/${department}`);
  }

  // Get users by role
  getUsersByRole(role: UserRole): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  // Get users by status
  getUsersByStatus(status: UserStatus): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get team members for a manager
  getTeamMembers(managerId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/manager/${managerId}/team`);
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  // Update user status
  updateUserStatus(id: number, status: UserStatus): Observable<User> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  // Update user profile image
  updateProfileImage(id: number, imageUrl: string): Observable<User> {
    const params = new HttpParams().set('imageUrl', imageUrl);
    return this.http.patch<User>(`${this.apiUrl}/${id}/profile-image`, {}, { params });
  }

  // Get user statistics
  getUserStatistics(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.apiUrl}/statistics`);
  }

  // Get active users count
  getActiveUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/active`);
  }

  // Get users count by department
  getUsersCountByDepartment(department: Department): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/department/${department}`);
  }

  // Get users count by role
  getUsersCountByRole(role: UserRole): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/role/${role}`);
  }

  // Helper method to get user's full name
  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  // Helper method to get user's display name
  getDisplayName(user: User): string {
    return user.fullName || this.getFullName(user);
  }

  // Helper method to check if user is admin
  isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  }

  // Helper method to check if user is manager
  isManager(user: User): boolean {
    return user.role === UserRole.MANAGER;
  }

  // Helper method to check if user is employee
  isEmployee(user: User): boolean {
    return user.role === UserRole.EMPLOYEE;
  }

  // Helper method to check if user is IT support
  isItSupport(user: User): boolean {
    return user.role === UserRole.IT_SUPPORT;
  }

  // Helper method to check if user is active
  isActive(user: User): boolean {
    return user.status === UserStatus.ACTIVE;
  }

  // Helper method to get role display name
  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.EMPLOYEE:
        return 'Employee';
      case UserRole.IT_SUPPORT:
        return 'IT Support';
      default:
        return role;
    }
  }

  // Helper method to get department display name
  getDepartmentDisplayName(department: Department): string {
    switch (department) {
      case Department.HR:
        return 'Human Resources';
      case Department.IT:
        return 'Information Technology';
      case Department.FINANCE:
        return 'Finance';
      case Department.MARKETING:
        return 'Marketing';
      case Department.SALES:
        return 'Sales';
      case Department.OPERATIONS:
        return 'Operations';
      case Department.ENGINEERING:
        return 'Engineering';
      case Department.SUPPORT:
        return 'Support';
      default:
        return department;
    }
  }

  // Helper method to get status display name
  getStatusDisplayName(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'Active';
      case UserStatus.INACTIVE:
        return 'Inactive';
      case UserStatus.LOCKED:
        return 'Locked';
      case UserStatus.TERMINATED:
        return 'Terminated';
      default:
        return status;
    }
  }
} 