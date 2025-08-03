import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Payroll {
  id: number;
  userId: number;
  employeeName: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PaymentStatus;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export interface PayrollStatistics {
  totalPayroll: number;
  totalPaid: number;
  totalPending: number;
  totalProcessed: number;
  averageSalary: number;
}

export interface CreatePayrollRequest {
  userId: number;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

export interface PayrollFilters {
  userId?: number;
  month?: number;
  year?: number;
  status?: PaymentStatus;
  department?: string;
}

export interface PaginatedPayrollResponse {
  content: Payroll[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private apiUrl = `${environment.apiUrl}/payroll`;

  constructor(private http: HttpClient) { }

  // Get all payroll records with pagination and filters
  getPayroll(page: number = 0, size: number = 10, filters?: PayrollFilters): Observable<PaginatedPayrollResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.userId) {
        params = params.set('userId', filters.userId.toString());
      }
      if (filters.month) {
        params = params.set('month', filters.month.toString());
      }
      if (filters.year) {
        params = params.set('year', filters.year.toString());
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.department) {
        params = params.set('department', filters.department);
      }
    }

    return this.http.get<PaginatedPayrollResponse>(this.apiUrl, { params });
  }

  // Get payroll by ID
  getPayrollById(id: number): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.apiUrl}/${id}`);
  }

  // Get payroll by user
  getPayrollByUser(userId: number): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get payroll by month and year
  getPayrollByMonthYear(month: number, year: number): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/month/${month}/year/${year}`);
  }

  // Get payroll by status
  getPayrollByStatus(status: PaymentStatus): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/status/${status}`);
  }

  // Create payroll record
  createPayroll(payrollData: CreatePayrollRequest): Observable<Payroll> {
    return this.http.post<Payroll>(this.apiUrl, payrollData);
  }

  // Update payroll record
  updatePayroll(id: number, payrollData: Partial<Payroll>): Observable<Payroll> {
    return this.http.put<Payroll>(`${this.apiUrl}/${id}`, payrollData);
  }

  // Process payroll
  processPayroll(id: number): Observable<Payroll> {
    return this.http.patch<Payroll>(`${this.apiUrl}/${id}/process`, {});
  }

  // Mark payroll as paid
  markAsPaid(id: number): Observable<Payroll> {
    return this.http.patch<Payroll>(`${this.apiUrl}/${id}/paid`, {});
  }

  // Delete payroll record
  deletePayroll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get payroll statistics
  getPayrollStatistics(): Observable<PayrollStatistics> {
    return this.http.get<PayrollStatistics>(`${this.apiUrl}/statistics`);
  }

  // Get user payroll statistics
  getUserPayrollStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/user/${userId}`);
  }

  // Download payslip
  downloadPayslip(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/payslip`, { responseType: 'blob' });
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Helper method to get status display name
  getStatusDisplayName(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pending';
      case PaymentStatus.PROCESSED:
        return 'Processed';
      case PaymentStatus.PAID:
        return 'Paid';
      case PaymentStatus.FAILED:
        return 'Failed';
      default:
        return status;
    }
  }

  // Helper method to get status color
  getStatusColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'warning';
      case PaymentStatus.PROCESSED:
        return 'info';
      case PaymentStatus.PAID:
        return 'success';
      case PaymentStatus.FAILED:
        return 'danger';
      default:
        return 'light';
    }
  }

  // Helper method to get month name
  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  }

  // Helper method to calculate net salary
  calculateNetSalary(basicSalary: number, allowances: number, deductions: number): number {
    return basicSalary + allowances - deductions;
  }

  // Generate payroll for all employees
  generatePayroll(month: number, year: number): Observable<Payroll[]> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.post<Payroll[]>(`${this.apiUrl}/generate`, {}, { params });
  }
} 