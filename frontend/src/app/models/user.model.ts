export interface User {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department: Department;
  status: UserStatus;
  profileImage?: string;
  dateOfBirth?: Date;
  dateOfJoining?: Date;
  address?: string;
  emergencyContact?: string;
  managerId?: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  IT_SUPPORT = 'IT_SUPPORT'
}

export enum Department {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  OPERATIONS = 'OPERATIONS',
  ENGINEERING = 'ENGINEERING',
  SUPPORT = 'SUPPORT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  TERMINATED = 'TERMINATED'
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newHiresThisMonth: number;
  pendingApprovals: number;
}

export interface CreateUserRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department: Department;
  profileImage?: string;
  dateOfBirth?: Date;
  dateOfJoining?: Date;
  address?: string;
  emergencyContact?: string;
  managerId?: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  department: Department;
  profileImage?: string;
  dateOfBirth?: Date | null;
  dateOfJoining?: Date;
  address?: string;
  emergencyContact?: string;
  managerId?: number;
}

export interface UserSearchRequest {
  query: string;
  department?: Department;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  department?: Department;
  role?: UserRole;
  status?: UserStatus;
  searchQuery?: string;
}

export interface PaginatedUsersResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface UserResponse {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department: Department;
  status: UserStatus;
  profileImage?: string;
  dateOfBirth?: Date;
  dateOfJoining?: Date;
  address?: string;
  emergencyContact?: string;
  lastLoginAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  department: Department;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: UserResponse;
} 