import { User } from './user.model';

export interface Leave {
  id?: number;
  userId: number;
  employeeName?: string;
  employeeId?: string;
  department?: string; // Add department field
  userRole?: string; // Add user role field
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays?: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  PERSONAL = 'PERSONAL',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  BEREAVEMENT = 'BEREAVEMENT',
  UNPAID = 'UNPAID'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface LeaveStatistics {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  cancelledLeaves: number;
  approvalRate: number;
}

export interface UserLeaveStatistics {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  cancelledLeaves: number;
  remainingLeaves: number;
  approvalRate: number;
}

export interface LeaveRequest {
  userId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveApproval {
  id: number;
  approvedBy: number;
  approvalComments?: string;
}

export interface LeaveRejection {
  id: number;
  rejectedBy: number;
  rejectionReason: string;
}

export interface LeaveFilters {
  userId?: number;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface PaginatedLeaveResponse {
  content: Leave[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface LeaveNotification {
  id: number;
  type: 'APPROVED' | 'REJECTED' | 'PENDING' | 'CANCELLED';
  message: string;
  leaveId: number;
  employeeName: string;
  leaveType: string;
  createdAt: string;
  isRead: boolean;
}

export interface LeaveBalance {
  userId: number;
  employeeName: string;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  pendingLeaves: number;
  leaveType: LeaveType;
}

// Helper functions
export function getLeaveTypeDisplay(type: LeaveType): string {
  switch (type) {
    case LeaveType.ANNUAL:
      return 'Annual Leave';
    case LeaveType.SICK:
      return 'Sick Leave';
    case LeaveType.PERSONAL:
      return 'Personal Leave';
    case LeaveType.MATERNITY:
      return 'Maternity Leave';
    case LeaveType.PATERNITY:
      return 'Paternity Leave';
    case LeaveType.BEREAVEMENT:
      return 'Bereavement Leave';
    case LeaveType.UNPAID:
      return 'Unpaid Leave';
    default:
      return type;
  }
}

export function getLeaveTypeColor(type: LeaveType): string {
  switch (type) {
    case LeaveType.ANNUAL:
      return 'primary';
    case LeaveType.SICK:
      return 'danger';
    case LeaveType.PERSONAL:
      return 'info';
    case LeaveType.MATERNITY:
      return 'success';
    case LeaveType.PATERNITY:
      return 'success';
    case LeaveType.BEREAVEMENT:
      return 'secondary';
    case LeaveType.UNPAID:
      return 'warning';
    default:
      return 'secondary';
  }
}

export function getLeaveStatusDisplay(status: LeaveStatus): string {
  switch (status) {
    case LeaveStatus.PENDING:
      return 'Pending';
    case LeaveStatus.APPROVED:
      return 'Approved';
    case LeaveStatus.REJECTED:
      return 'Rejected';
    case LeaveStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
}

export function getLeaveStatusColor(status: LeaveStatus): string {
  switch (status) {
    case LeaveStatus.PENDING:
      return 'warning';
    case LeaveStatus.APPROVED:
      return 'success';
    case LeaveStatus.REJECTED:
      return 'danger';
    case LeaveStatus.CANCELLED:
      return 'secondary';
    default:
      return 'secondary';
  }
}

export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}

export function isLeaveOverlapping(
  startDate: string, 
  endDate: string, 
  existingLeaves: Leave[]
): boolean {
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);
  
  return existingLeaves.some(leave => {
    if (leave.status === LeaveStatus.REJECTED || leave.status === LeaveStatus.CANCELLED) {
      return false;
    }
    
    const existingStart = new Date(leave.startDate);
    const existingEnd = new Date(leave.endDate);
    
    return (
      (newStart >= existingStart && newStart <= existingEnd) ||
      (newEnd >= existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}

export function canApproveLeave(leave: Leave, currentUserId: number): boolean {
  return leave.status === LeaveStatus.PENDING && 
         leave.userId !== currentUserId;
}

export function canCancelLeave(leave: Leave, currentUserId: number): boolean {
  return (leave.status === LeaveStatus.PENDING || leave.status === LeaveStatus.APPROVED) &&
         (leave.userId === currentUserId || currentUserId === 1); // User can cancel their own or admin can cancel any
}

export function canEditLeave(leave: Leave, currentUserId: number): boolean {
  return leave.status === LeaveStatus.PENDING && 
         leave.userId === currentUserId;
}

export function canDeleteLeave(leave: Leave, currentUserId: number): boolean {
  return leave.status === LeaveStatus.PENDING && 
         (leave.userId === currentUserId || currentUserId === 1); // User can delete their own pending or admin can delete any pending
} 