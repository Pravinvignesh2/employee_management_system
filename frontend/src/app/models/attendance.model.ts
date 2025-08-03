import { User } from './user.model';

export interface Attendance {
  id?: number;
  userId: number;
  employeeName?: string;
  employeeId?: string;
  date: string;
  punchInTime?: string;
  punchOutTime?: string;
  punchInLocation?: string;
  punchOutLocation?: string;
  punchInLatitude?: number;
  punchInLongitude?: number;
  punchOutLatitude?: number;
  punchOutLongitude?: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  workingHours?: number;
  workingMinutes?: number;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
  HOLIDAY = 'HOLIDAY',
  WEEKEND = 'WEEKEND'
}

export interface AttendanceStatistics {
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLeave: number;
  attendanceRate: number;
}

export interface UserAttendanceStatistics {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  attendanceRate: number;
  totalWorkingHours: number;
}

export interface DepartmentAttendanceStatistics {
  department: string;
  totalEmployees: number;
  presentEmployees: number;
  absentEmployees: number;
  attendanceRate: number;
}

export interface PunchInRequest {
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface PunchOutRequest {
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface AttendanceFilters {
  userId?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: AttendanceStatus;
  searchQuery?: string;
}

export interface PaginatedAttendanceResponse {
  content: Attendance[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AttendanceReport {
  userId: number;
  employeeName: string;
  employeeId: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
  attendanceRate: number;
  lateArrivals: number;
  earlyDepartures: number;
}

export interface AttendanceSummary {
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  todayOnTime: number;
  weekAverage: number;
  monthAverage: number;
  totalEmployees: number;
}

// Helper functions
export function getAttendanceStatusDisplay(status: AttendanceStatus): string {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'Present';
    case AttendanceStatus.ABSENT:
      return 'Absent';
    case AttendanceStatus.HALF_DAY:
      return 'Half Day';
    case AttendanceStatus.LEAVE:
      return 'Leave';
    case AttendanceStatus.HOLIDAY:
      return 'Holiday';
    case AttendanceStatus.WEEKEND:
      return 'Weekend';
    default:
      return status;
  }
}

export function getAttendanceStatusColor(status: AttendanceStatus): string {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'success';
    case AttendanceStatus.ABSENT:
      return 'danger';
    case AttendanceStatus.HALF_DAY:
      return 'warning';
    case AttendanceStatus.LEAVE:
      return 'info';
    case AttendanceStatus.HOLIDAY:
      return 'primary';
    case AttendanceStatus.WEEKEND:
      return 'secondary';
    default:
      return 'secondary';
  }
}

export function formatWorkingHours(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) {
    return '0h 0m';
  }
  return `${hours}h ${minutes}m`;
}

export function isLate(punchInTime: string): boolean {
  if (!punchInTime) return false;
  const punchIn = new Date(`2000-01-01T${punchInTime}`);
  const standardTime = new Date('2000-01-01T09:00:00');
  return punchIn > standardTime;
}

export function isEarlyDeparture(punchOutTime: string): boolean {
  if (!punchOutTime) return false;
  const punchOut = new Date(`2000-01-01T${punchOutTime}`);
  const standardTime = new Date('2000-01-01T17:00:00');
  return punchOut < standardTime;
} 