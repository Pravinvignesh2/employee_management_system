import { Component, OnInit } from '@angular/core';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {
  payrollRecords: any[] = [];
  loading = true;
  error = '';
  selectedPayPeriod = 'current';
  selectedStatus = '';
  selectedDepartment = '';
  totalPayroll = 125000;
  processedCount = 45;
  pendingCount = 3;
  averageSalary = 4500;
  isGenerating = false;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.loadPayrollData();
  }

  loadPayrollData(): void {
    this.loading = true;
    this.error = '';

    this.payrollService.getPayroll().subscribe({
      next: (response: any) => {
        this.payrollRecords = response.content || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading payroll data:', error);
        this.error = 'Failed to load payroll data';
        this.loading = false;
      }
    });
  }

  onPayPeriodChange(): void {
    // Handle pay period change
  }

  onStatusChange(): void {
    // Handle status filter change
  }

  onDepartmentChange(): void {
    // Handle department filter change
  }

  getTotalAllowances(payroll: any): number {
    return (payroll.houseRentAllowance || 0) + 
           (payroll.dearnessAllowance || 0) + 
           (payroll.conveyanceAllowance || 0) + 
           (payroll.medicalAllowance || 0) + 
           (payroll.specialAllowance || 0);
  }

  getTotalDeductions(payroll: any): number {
    return (payroll.providentFund || 0) + 
           (payroll.incomeTax || 0) + 
           (payroll.professionalTax || 0);
  }

  generatePayroll(): void {
    this.isGenerating = true;
    
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const year = currentDate.getFullYear();
    
    this.payrollService.generatePayroll(month, year).subscribe({
      next: (response: any) => {
        this.isGenerating = false;
        this.loadPayrollData();
        alert(`Payroll generated successfully for ${month}/${year}! ${response.length} payroll records created.`);
      },
      error: (error: any) => {
        this.isGenerating = false;
        console.error('Error generating payroll:', error);
        alert('Failed to generate payroll. Please try again.');
      }
    });
  }
} 