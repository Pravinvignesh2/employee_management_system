import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Attendance, 
  AttendanceStatus, 
  AttendanceStatistics, 
  UserAttendanceStatistics, 
  DepartmentAttendanceStatistics,
  PunchInRequest,
  PunchOutRequest,
  AttendanceFilters,
  PaginatedAttendanceResponse,
  AttendanceReport,
  AttendanceSummary
} from '../models/attendance.model';
import { Department } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) { }

  // Punch In/Out Operations
  punchIn(userId: number, request: PunchInRequest): Observable<Attendance> {
    let params = new HttpParams();
    if (request.location) {
      params = params.set('location', request.location);
    }
    if (request.latitude) {
      params = params.set('latitude', request.latitude.toString());
    }
    if (request.longitude) {
      params = params.set('longitude', request.longitude.toString());
    }
    
    return this.http.post<Attendance>(`${this.apiUrl}/punch-in/${userId}`, {}, { params });
  }

  punchOut(userId: number, request: PunchOutRequest): Observable<Attendance> {
    let params = new HttpParams();
    if (request.location) {
      params = params.set('location', request.location);
    }
    if (request.latitude) {
      params = params.set('latitude', request.latitude.toString());
    }
    if (request.longitude) {
      params = params.set('longitude', request.longitude.toString());
    }
    
    return this.http.post<Attendance>(`${this.apiUrl}/punch-out/${userId}`, {}, { params });
  }

  // Status Check Operations
  hasPunchedIn(userId: number, date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-punched-in/${userId}/${date}`);
  }

  hasPunchedOut(userId: number, date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-punched-out/${userId}/${date}`);
  }

  // CRUD Operations
  createAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, attendance);
  }

  updateAttendance(id: number, attendance: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, attendance);
  }

  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAttendanceById(id: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`);
  }

  // Get Attendance Records
  getAllAttendance(page: number = 0, size: number = 10, filters?: AttendanceFilters): Observable<PaginatedAttendanceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.userId) {
        params = params.set('userId', filters.userId.toString());
      }
      if (filters.date) {
        params = params.set('date', filters.date);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.department) {
        params = params.set('department', filters.department);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.searchQuery) {
        params = params.set('query', filters.searchQuery);
      }
    }

    return this.http.get<PaginatedAttendanceResponse>(this.apiUrl, { params });
  }

  getAttendanceByUser(userId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAttendanceByUserAndDate(userId: number, date: string): Observable<Attendance | null> {
    return this.http.get<Attendance>(`${this.apiUrl}/user/${userId}/date/${date}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          // Return null when no attendance record exists (this is normal for new users)
          return of(null);
        }
        throw error;
      })
    );
  }

  getAttendanceByDate(date: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/date/${date}`);
  }

  getAttendanceByUserAndDateRange(userId: number, startDate: string, endDate: string): Observable<Attendance[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<Attendance[]>(`${this.apiUrl}/user/${userId}/range`, { params });
  }

  getAttendanceByDepartmentAndDate(department: Department, date: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/department/${encodeURIComponent(department)}/date/${date}`);
  }

  getAttendanceByStatus(status: AttendanceStatus): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/status/${status}`);
  }

  // Mark Attendance Operations
  markAbsent(userId: number, date: string, reason: string): Observable<Attendance> {
    const params = new HttpParams()
      .set('date', date)
      .set('reason', reason);
    
    return this.http.post<Attendance>(`${this.apiUrl}/mark-absent/${userId}`, {}, { params });
  }

  markHalfDay(userId: number, date: string, reason: string): Observable<Attendance> {
    const params = new HttpParams()
      .set('date', date)
      .set('reason', reason);
    
    return this.http.post<Attendance>(`${this.apiUrl}/mark-half-day/${userId}`, {}, { params });
  }

  // Statistics Operations
  getAttendanceStatistics(): Observable<AttendanceStatistics> {
    return this.http.get<AttendanceStatistics>(`${this.apiUrl}/statistics`);
  }

  getUserAttendanceStatistics(userId: number): Observable<UserAttendanceStatistics> {
    return this.http.get<UserAttendanceStatistics>(`${this.apiUrl}/statistics/user/${userId}`);
  }

  getDepartmentAttendanceStatistics(department: string): Observable<DepartmentAttendanceStatistics> {
    return this.http.get<DepartmentAttendanceStatistics>(`${this.apiUrl}/statistics/department/${department}`);
  }

  // Working Hours Operations
  getWorkingHours(userId: number, date: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/working-hours/${userId}/${date}`);
  }

  getTotalWorkingHours(userId: number, startDate: string, endDate: string): Observable<number> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<number>(`${this.apiUrl}/total-working-hours/${userId}`, { params });
  }

  // Update attendance status for a specific date
  updateAttendanceStatusForDate(date: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/update-status-for-date/${date}`, {});
  }

  // Helper Methods
  getCurrentUserAttendance(): Observable<Attendance[]> {
    const currentUserId = this.getCurrentUserId();
    return this.getAttendanceByUser(currentUserId);
  }

  getTodayAttendance(): Observable<Attendance | null> {
    const currentUserId = this.getCurrentUserId();
    const today = this.getTodayDateString();
    return this.getAttendanceByUserAndDate(currentUserId, today).pipe(
      catchError(error => {
        if (error.status === 404) {
          // Return null when no attendance record exists (this is normal for new users)
          return of(null);
        }
        throw error;
      })
    );
  }

  // Helper method to check if attendance exists for today
  hasTodayAttendance(): Observable<boolean> {
    const currentUserId = this.getCurrentUserId();
    const today = this.getTodayDateString();
    return this.hasPunchedIn(currentUserId, today);
  }

  punchInCurrentUser(request: PunchInRequest): Observable<Attendance> {
    const currentUserId = this.getCurrentUserId();
    return this.punchIn(currentUserId, request);
  }

  punchOutCurrentUser(request: PunchOutRequest): Observable<Attendance> {
    const currentUserId = this.getCurrentUserId();
    return this.punchOut(currentUserId, request);
  }

  hasCurrentUserPunchedIn(date: string): Observable<boolean> {
    const currentUserId = this.getCurrentUserId();
    return this.hasPunchedIn(currentUserId, date);
  }

  hasCurrentUserPunchedOut(date: string): Observable<boolean> {
    const currentUserId = this.getCurrentUserId();
    return this.hasPunchedOut(currentUserId, date);
  }

  // Private helper method to get current user ID
  private getCurrentUserId(): number {
    const userStr = localStorage.getItem(environment.auth.userKey);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return 0;
  }

  // Utility Methods
  getAttendanceStatusDisplay(status: AttendanceStatus): string {
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

  getAttendanceStatusColor(status: AttendanceStatus): string {
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

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // Return HH:mm format
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  // Helper method to get today's date in local timezone
  getTodayDateString(): string {
    return new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format in local timezone
  }

  calculateWorkingHours(punchInTime: string, punchOutTime: string): { hours: number; minutes: number } {
    if (!punchInTime || !punchOutTime) {
      return { hours: 0, minutes: 0 };
    }

    const punchIn = new Date(`2000-01-01T${punchInTime}`);
    const punchOut = new Date(`2000-01-01T${punchOutTime}`);
    const diffMs = punchOut.getTime() - punchIn.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours: diffHours, minutes: diffMinutes };
  }
} 
