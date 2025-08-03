import { Component, OnInit } from '@angular/core';
import { PayrollService } from '../../services/payroll.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payroll',
  template: `
    <div class="payroll-container">
      <!-- Header -->
      <div class="payroll-header">
        <div class="header-content">
          <div class="header-left">
            <h1>Payroll Management</h1>
            <p>Manage salary, benefits, and compensation</p>
          </div>
          <div class="header-actions">
            <div class="period-selector">
              <label for="payrollPeriod">Payroll Period:</label>
              <select id="payrollPeriod" [(ngModel)]="selectedPeriod" (change)="onPeriodChange()" class="period-select">
                <option value="current">Current Month</option>
                <option value="previous">Previous Month</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
            <button class="btn-primary" (click)="generatePayroll()" [disabled]="isGenerating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ isGenerating ? 'Generating...' : 'Generate Payroll' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Payroll Content -->
      <div class="payroll-content">
        <!-- Summary Cards -->
        <div class="summary-section">
          <div class="summary-grid">
            <div class="summary-card">
              <div class="card-icon gross">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Gross Salary</h3>
                <div class="amount">{{ payrollData.grossSalary | currency:'INR':'symbol':'1.0-0' }}</div>
                <div class="change" [class.positive]="payrollData.grossChange > 0" [class.negative]="payrollData.grossChange < 0">
                  {{ payrollData.grossChange > 0 ? '+' : '' }}{{ payrollData.grossChange | currency:'INR':'symbol':'1.0-0' }} from last month
                </div>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon net">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Net Pay</h3>
                <div class="amount">{{ payrollData.netPay | currency:'INR':'symbol':'1.0-0' }}</div>
                <div class="change" [class.positive]="payrollData.netChange > 0" [class.negative]="payrollData.netChange < 0">
                  {{ payrollData.netChange > 0 ? '+' : '' }}{{ payrollData.netChange | currency:'INR':'symbol':'1.0-0' }} from last month
                </div>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon deductions">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13L12 8L17 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Total Deductions</h3>
                <div class="amount">{{ payrollData.totalDeductions | currency:'INR':'symbol':'1.0-0' }}</div>
                <div class="percentage">{{ (payrollData.totalDeductions / payrollData.grossSalary * 100) | number:'1.1-1' }}% of gross</div>
              </div>
            </div>

            <div class="summary-card">
              <div class="card-icon ytd">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5M16 2V5M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>YTD Earnings</h3>
                <div class="amount">{{ payrollData.ytdEarnings | currency:'INR':'symbol':'1.0-0' }}</div>
                <div class="percentage">{{ payrollData.ytdMonths }} months</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Breakdown -->
        <div class="breakdown-section">
          <div class="breakdown-grid">
            <!-- Salary Breakdown -->
            <div class="breakdown-card">
              <div class="card-header">
                <h3>Salary Breakdown</h3>
                <button class="btn-secondary" (click)="downloadPayslip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Download Payslip
                </button>
              </div>
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="label">Basic Salary</span>
                  <span class="value">{{ payrollData.basicSalary | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Housing Allowance</span>
                  <span class="value">{{ payrollData.housingAllowance | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Transport Allowance</span>
                  <span class="value">{{ payrollData.transportAllowance | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Meal Allowance</span>
                  <span class="value">{{ payrollData.mealAllowance | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item total">
                  <span class="label">Gross Salary</span>
                  <span class="value">{{ payrollData.grossSalary | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>

            <!-- Deductions -->
            <div class="breakdown-card">
              <div class="card-header">
                <h3>Deductions & Taxes</h3>
              </div>
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="label">Income Tax</span>
                  <span class="value deduction">{{ payrollData.incomeTax | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Social Security</span>
                  <span class="value deduction">{{ payrollData.socialSecurity | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Health Insurance</span>
                  <span class="value deduction">{{ payrollData.healthInsurance | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Pension Fund</span>
                  <span class="value deduction">{{ payrollData.pensionFund | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Other Deductions</span>
                  <span class="value deduction">{{ payrollData.otherDeductions | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item total">
                  <span class="label">Total Deductions</span>
                  <span class="value deduction">{{ payrollData.totalDeductions | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>

            <!-- Bonuses & Benefits -->
            <div class="breakdown-card">
              <div class="card-header">
                <h3>Bonuses & Benefits</h3>
              </div>
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="label">Performance Bonus</span>
                  <span class="value bonus">{{ payrollData.performanceBonus | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Overtime Pay</span>
                  <span class="value bonus">{{ payrollData.overtimePay | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Holiday Pay</span>
                  <span class="value bonus">{{ payrollData.holidayPay | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="label">Reimbursements</span>
                  <span class="value bonus">{{ payrollData.reimbursements | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="breakdown-item total">
                  <span class="label">Total Benefits</span>
                  <span class="value bonus">{{ payrollData.totalBenefits | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payroll History -->
        <div class="history-section">
          <div class="section-header">
            <h3>Payroll History</h3>
            <div class="history-filters">
              <input type="month" [(ngModel)]="historyMonth" (change)="loadPayrollHistory()" class="month-picker">
            </div>
          </div>
          <div class="history-table">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of payrollHistory">
                  <td>{{ record.period }}</td>
                  <td>{{ record.grossSalary | currency:'INR':'symbol':'1.0-0' }}</td>
                  <td>{{ record.deductions | currency:'INR':'symbol':'1.0-0' }}</td>
                  <td>{{ record.netPay | currency:'INR':'symbol':'1.0-0' }}</td>
                  <td>
                    <span class="status-badge" [class]="record.status">
                      {{ record.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon" (click)="downloadPayslip(record)" title="Download Payslip">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button class="btn-icon" (click)="viewPayrollDetails(record)" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading payroll data...</p>
      </div>
    </div>
  `,
  styles: [`
    .payroll-container {
      min-height: 100vh;
      background-color: var(--background-color);
      color: var(--text-primary);
    }

    .payroll-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .header-left h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .header-left p {
      margin: 0;
      color: white;
      opacity: 0.95;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .period-selector {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .period-selector label {
      font-weight: 500;
    }

    .period-select {
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 14px;
    }

    .period-select option {
      background: var(--primary-dark);
      color: white;
    }

    .payroll-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .summary-section {
      margin-bottom: 32px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-icon.gross {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .card-icon.net {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .card-icon.deductions {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .card-icon.ytd {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .card-content h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .amount {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .change {
      font-size: 14px;
      font-weight: 500;
    }

    .change.positive {
      color: #10b981;
    }

    .change.negative {
      color: #ef4444;
    }

    .percentage {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .breakdown-section {
      margin-bottom: 32px;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .breakdown-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .breakdown-item:last-child {
      border-bottom: none;
    }

    .breakdown-item.total {
      font-weight: 600;
      border-top: 2px solid var(--border-color);
      padding-top: 12px;
      margin-top: 8px;
    }

    .label {
      color: var(--text-secondary);
    }

    .value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .value.deduction {
      color: #ef4444;
    }

    .value.bonus {
      color: #10b981;
    }

    .external-systems {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .system-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: var(--background-color);
      border-radius: 8px;
    }

    .system-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .system-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .system-status {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .system-status.connected {
      color: #10b981;
    }

    .system-status.disconnected {
      color: #ef4444;
    }

    .system-status.syncing {
      color: #f59e0b;
    }

    .system-actions {
      display: flex;
      gap: 8px;
    }

    .history-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .month-picker {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 14px;
    }

    .history-table {
      overflow-x: auto;
    }

    .history-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .history-table th,
    .history-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .history-table th {
      background: var(--background-color);
      font-weight: 600;
      color: var(--text-secondary);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.paid {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.processing {
      background: #dbeafe;
      color: #1e40af;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-dark);
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary:disabled {
      background: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-icon:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      text-align: center;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .header-actions {
        flex-direction: column;
        gap: 12px;
      }

      .payroll-content {
        padding: 16px;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }

      .breakdown-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class PayrollComponent implements OnInit {
  loading = true;
  isGenerating = false;
  isSyncing = false;
  selectedPeriod = 'current';
  historyMonth = new Date().toISOString().slice(0, 7);

  payrollData = {
    grossSalary: 7500,
    netPay: 5800,
    totalDeductions: 1700,
    ytdEarnings: 45000,
    ytdMonths: 6,
    grossChange: 500,
    netChange: 380,
    basicSalary: 6000,
    housingAllowance: 800,
    transportAllowance: 400,
    mealAllowance: 300,
    incomeTax: 1200,
    socialSecurity: 300,
    healthInsurance: 150,
    pensionFund: 200,
    otherDeductions: 50,
    performanceBonus: 800,
    overtimePay: 200,
    holidayPay: 150,
    reimbursements: 100,
    totalBenefits: 1250
  };

  externalSystems = [
    { name: 'ADP Payroll', status: 'connected', lastSync: '2024-01-15' },
    { name: 'QuickBooks', status: 'connected', lastSync: '2024-01-14' },
    { name: 'Tax System', status: 'syncing', lastSync: '2024-01-15' },
    { name: 'Benefits Portal', status: 'disconnected', lastSync: '2024-01-10' }
  ];

  payrollHistory = [
    { period: 'January 2024', grossSalary: 7500, deductions: 1700, netPay: 5800, status: 'paid' },
    { period: 'December 2023', grossSalary: 7000, deductions: 1600, netPay: 5400, status: 'paid' },
    { period: 'November 2023', grossSalary: 7000, deductions: 1600, netPay: 5400, status: 'paid' },
    { period: 'October 2023', grossSalary: 7000, deductions: 1600, netPay: 5400, status: 'paid' }
  ];

  constructor(
    private payrollService: PayrollService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPayrollData();
    this.loadPayrollHistory();
  }

  loadPayrollData(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
        this.loading = false;
    }, 1000);
  }

  loadPayrollHistory(): void {
    // Load payroll history based on selected month
    console.log('Loading payroll history for:', this.historyMonth);
  }

  onPeriodChange(): void {
    this.loadPayrollData();
  }

  generatePayroll(): void {
    this.isGenerating = true;
    // Simulate payroll generation
    setTimeout(() => {
      this.isGenerating = false;
      console.log('Payroll generated successfully');
    }, 2000);
  }

  downloadPayslip(record?: any): void {
    const period = record ? record.period : 'Current Month';
    console.log('Downloading payslip for:', period);
    
    // Create payslip content as HTML
    const payslipContent = this.generatePayslipContent(record);
    
    // Convert HTML to PDF using jsPDF
    this.convertHtmlToPdf(payslipContent, `payslip-${period.replace(' ', '-').toLowerCase()}.pdf`);
  }

  private convertHtmlToPdf(htmlContent: string, filename: string): void {
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px'; // Set fixed width
    tempDiv.style.backgroundColor = '#ffffff';
    document.body.appendChild(tempDiv);
    
    // Use html2canvas to capture the rendered HTML
    import('html2canvas').then(html2canvas => {
      html2canvas.default(tempDiv, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0
      }).then((canvas: any) => {
        // Convert canvas to PDF using jsPDF
        import('jspdf').then(jsPDF => {
          const pdf = new jsPDF.default('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          // If content is too tall, split into multiple pages
          const maxHeight = pdf.internal.pageSize.getHeight();
          let heightLeft = pdfHeight;
          let position = 0;
          
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= maxHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= maxHeight;
          }
          
          pdf.save(filename);
          
          // Cleanup
          document.body.removeChild(tempDiv);
          console.log('Payslip downloaded as PDF successfully');
        });
      });
    }).catch(error => {
      console.error('Error generating PDF:', error);
      // Fallback to HTML download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.pdf', '.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      document.body.removeChild(tempDiv);
    });
  }

  private generatePayslipHTML(record: any): string {
    const currentUser = this.authService.getCurrentUser();
    const period = record ? record.period : 'Current Month';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Payslip - ${period}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 40px; 
      line-height: 1.6; 
      color: #333;
      background-color: white;
    }
    .payslip { 
      max-width: 800px; 
      margin: 0 auto; 
      border: 1px solid #ddd;
      padding: 30px;
      background-color: white;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #333; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .header h1 {
      color: #333;
      margin: 0;
    }
    .section { 
      margin-bottom: 30px; 
    }
    .section h3 { 
      color: #333; 
      border-bottom: 1px solid #ccc; 
      padding-bottom: 5px; 
      margin-top: 0;
    }
    .row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 10px; 
      padding: 5px 0;
    }
    .label { 
      font-weight: bold; 
      color: #333;
    }
    .amount { 
      font-family: monospace; 
      font-weight: bold;
      color: #333;
    }
    .total { 
      font-weight: bold; 
      font-size: 1.1em; 
      border-top: 1px solid #ccc; 
      padding-top: 10px; 
      background-color: #f9f9f9;
      padding: 10px;
      margin-top: 10px;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      color: #666; 
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    .company-info {
      text-align: center;
      margin-bottom: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="payslip">
    <div class="company-info">
      <h2>Vibe Coding Solutions</h2>
      <p>123 Business Street, City, State 12345</p>
    </div>
    
    <div class="header">
      <h1>PAYSLIP</h1>
      <p><strong>${period}</strong></p>
    </div>
    
    <div class="section">
      <h3>Employee Details</h3>
      <div class="row">
        <span class="label">Name:</span>
        <span>${currentUser?.firstName} ${currentUser?.lastName}</span>
      </div>
      <div class="row">
        <span class="label">Employee ID:</span>
        <span>${currentUser?.employeeId}</span>
      </div>
      <div class="row">
        <span class="label">Department:</span>
        <span>${currentUser?.department}</span>
      </div>
      <div class="row">
        <span class="label">Position:</span>
        <span>${currentUser?.role}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Salary Summary</h3>
      <div class="row">
        <span class="label">Gross Salary:</span>
        <span class="amount">₹${record?.grossSalary || this.payrollData.grossSalary}</span>
      </div>
      <div class="row">
        <span class="label">Total Deductions:</span>
        <span class="amount">₹${record?.deductions || this.payrollData.totalDeductions}</span>
      </div>
      <div class="row total">
        <span class="label">Net Pay:</span>
        <span class="amount">₹${record?.netPay || this.payrollData.netPay}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Detailed Breakdown</h3>
      <div class="row">
        <span class="label">Basic Salary:</span>
        <span class="amount">₹${this.payrollData.basicSalary}</span>
      </div>
      <div class="row">
        <span class="label">Housing Allowance:</span>
        <span class="amount">₹${this.payrollData.housingAllowance}</span>
      </div>
      <div class="row">
        <span class="label">Transport Allowance:</span>
        <span class="amount">₹${this.payrollData.transportAllowance}</span>
      </div>
      <div class="row">
        <span class="label">Meal Allowance:</span>
        <span class="amount">₹${this.payrollData.mealAllowance}</span>
      </div>
      <div class="row">
        <span class="label">Performance Bonus:</span>
        <span class="amount">₹${this.payrollData.performanceBonus}</span>
      </div>
      <div class="row">
        <span class="label">Overtime Pay:</span>
        <span class="amount">₹${this.payrollData.overtimePay}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Deductions</h3>
      <div class="row">
        <span class="label">Income Tax:</span>
        <span class="amount">₹${this.payrollData.incomeTax}</span>
      </div>
      <div class="row">
        <span class="label">Social Security:</span>
        <span class="amount">₹${this.payrollData.socialSecurity}</span>
      </div>
      <div class="row">
        <span class="label">Health Insurance:</span>
        <span class="amount">₹${this.payrollData.healthInsurance}</span>
      </div>
      <div class="row">
        <span class="label">Pension Fund:</span>
        <span class="amount">₹${this.payrollData.pensionFund}</span>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      <p>This is a computer generated document</p>
      <p>For any queries, please contact HR Department</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generatePayslipContent(record: any): string {
    const currentUser = this.authService.getCurrentUser();
    const period = record ? record.period : 'Current Month';
    
    // Generate HTML content that matches the view format
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Payslip - ${period}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 40px; 
      line-height: 1.6; 
      color: #333;
      background: white;
    }
    .payslip { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white;
      padding: 20px;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #333; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #7f8c8d;
      margin: 10px 0 0 0;
      font-size: 16px;
    }
    .section { 
      margin-bottom: 30px; 
    }
    .section h3 { 
      color: #2c3e50; 
      border-bottom: 1px solid #bdc3c7; 
      padding-bottom: 5px; 
      margin-bottom: 15px;
      font-size: 18px;
    }
    .row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 10px; 
      padding: 5px 0;
    }
    .label { 
      font-weight: bold; 
      color: #34495e;
    }
    .amount { 
      font-family: monospace; 
      font-weight: bold;
      color: #27ae60;
    }
    .total { 
      font-weight: bold; 
      font-size: 1.1em; 
      border-top: 2px solid #bdc3c7; 
      padding-top: 10px; 
      margin-top: 10px;
      color: #2c3e50;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      color: #7f8c8d; 
      font-size: 12px;
      border-top: 1px solid #ecf0f1;
      padding-top: 20px;
    }
    .negative {
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <div class="payslip">
    <div class="header">
      <h1>VIBE CODING SOLUTIONS</h1>
      <p>PAYSLIP</p>
      <p>${period}</p>
    </div>
    
    <div class="section">
      <h3>Employee Details</h3>
      <div class="row">
        <span class="label">Name:</span>
        <span>${currentUser?.firstName} ${currentUser?.lastName}</span>
      </div>
      <div class="row">
        <span class="label">Employee ID:</span>
        <span>${currentUser?.employeeId}</span>
      </div>
      <div class="row">
        <span class="label">Department:</span>
        <span>${currentUser?.department}</span>
      </div>
      <div class="row">
        <span class="label">Period:</span>
        <span>${period}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Salary Breakdown</h3>
      <div class="row">
        <span class="label">Gross Salary:</span>
        <span class="amount">₹${record?.grossSalary || this.payrollData.grossSalary}</span>
      </div>
      <div class="row">
        <span class="label">Deductions:</span>
        <span class="amount negative">-₹${record?.deductions || this.payrollData.totalDeductions}</span>
      </div>
      <div class="row total">
        <span class="label">Net Pay:</span>
        <span class="amount">₹${record?.netPay || this.payrollData.netPay}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Detailed Breakdown</h3>
      <div class="row">
        <span class="label">Basic Salary:</span>
        <span class="amount">₹${this.payrollData.basicSalary}</span>
      </div>
      <div class="row">
        <span class="label">Housing Allowance:</span>
        <span class="amount">₹${this.payrollData.housingAllowance}</span>
      </div>
      <div class="row">
        <span class="label">Transport Allowance:</span>
        <span class="amount">₹${this.payrollData.transportAllowance}</span>
      </div>
      <div class="row">
        <span class="label">Meal Allowance:</span>
        <span class="amount">₹${this.payrollData.mealAllowance}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Deductions</h3>
      <div class="row">
        <span class="label">Income Tax:</span>
        <span class="amount negative">-₹${this.payrollData.incomeTax}</span>
      </div>
      <div class="row">
        <span class="label">Social Security:</span>
        <span class="amount negative">-₹${this.payrollData.socialSecurity}</span>
      </div>
      <div class="row">
        <span class="label">Health Insurance:</span>
        <span class="amount negative">-₹${this.payrollData.healthInsurance}</span>
      </div>
      <div class="row">
        <span class="label">Pension Fund:</span>
        <span class="amount negative">-₹${this.payrollData.pensionFund}</span>
      </div>
    </div>
    
    <div class="section">
      <h3>Additional Earnings</h3>
      <div class="row">
        <span class="label">Performance Bonus:</span>
        <span class="amount">₹${this.payrollData.performanceBonus}</span>
      </div>
      <div class="row">
        <span class="label">Overtime Pay:</span>
        <span class="amount">₹${this.payrollData.overtimePay}</span>
      </div>
      <div class="row">
        <span class="label">Holiday Pay:</span>
        <span class="amount">₹${this.payrollData.holidayPay}</span>
      </div>
      <div class="row">
        <span class="label">Reimbursements:</span>
        <span class="amount">₹${this.payrollData.reimbursements}</span>
      </div>
    </div>
    
    <div class="footer">
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <p>This is an official payslip from Vibe Coding Solutions</p>
    </div>
  </div>
</body>
</html>`;
    
    return htmlContent;
  }

  syncExternalSystems(): void {
    this.isSyncing = true;
    // Simulate sync process
    setTimeout(() => {
      this.isSyncing = false;
      console.log('External systems synced successfully');
    }, 3000);
  }

  viewSystemDetails(system: any): void {
    console.log('Viewing details for:', system.name);
  }

  syncSystem(system: any): void {
    system.status = 'syncing';
    // Simulate individual system sync
    setTimeout(() => {
      system.status = 'connected';
      console.log('Synced:', system.name);
    }, 2000);
  }

  viewPayrollDetails(record: any): void {
    console.log('Viewing payroll details for:', record.period);
    
    // Create detailed payslip content for viewing
    const payslipContent = this.generatePayslipContent(record);
    
    // Open in new window for viewing
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payslip - ${record.period}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .payslip { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-weight: bold; }
            .amount { font-family: monospace; }
            .total { font-weight: bold; font-size: 1.1em; border-top: 1px solid #ccc; padding-top: 10px; }
            .footer { text-align: center; margin-top: 40px; color: #666; }
          </style>
        </head>
        <body>
          <div class="payslip">
            <div class="header">
              <h1>PAYSLIP</h1>
              <p>${record.period}</p>
            </div>
            
            <div class="section">
              <h3>Employee Details</h3>
              <div class="row">
                <span class="label">Name:</span>
                <span>${this.authService.getCurrentUser()?.firstName} ${this.authService.getCurrentUser()?.lastName}</span>
              </div>
              <div class="row">
                <span class="label">Employee ID:</span>
                <span>${this.authService.getCurrentUser()?.employeeId}</span>
              </div>
              <div class="row">
                <span class="label">Department:</span>
                <span>${this.authService.getCurrentUser()?.department}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>Salary Summary</h3>
              <div class="row">
                <span class="label">Gross Salary:</span>
                <span class="amount">₹${record.grossSalary}</span>
              </div>
              <div class="row">
                <span class="label">Total Deductions:</span>
                <span class="amount">₹${record.deductions}</span>
              </div>
              <div class="row total">
                <span class="label">Net Pay:</span>
                <span class="amount">₹${record.netPay}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>Detailed Breakdown</h3>
              <div class="row">
                <span class="label">Basic Salary:</span>
                <span class="amount">₹${this.payrollData.basicSalary}</span>
              </div>
              <div class="row">
                <span class="label">Housing Allowance:</span>
                <span class="amount">₹${this.payrollData.housingAllowance}</span>
              </div>
              <div class="row">
                <span class="label">Transport Allowance:</span>
                <span class="amount">₹${this.payrollData.transportAllowance}</span>
              </div>
              <div class="row">
                <span class="label">Meal Allowance:</span>
                <span class="amount">₹${this.payrollData.mealAllowance}</span>
              </div>
              <div class="row">
                <span class="label">Performance Bonus:</span>
                <span class="amount">₹${this.payrollData.performanceBonus}</span>
              </div>
              <div class="row">
                <span class="label">Overtime Pay:</span>
                <span class="amount">₹${this.payrollData.overtimePay}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>Deductions</h3>
              <div class="row">
                <span class="label">Income Tax:</span>
                <span class="amount">₹${this.payrollData.incomeTax}</span>
              </div>
              <div class="row">
                <span class="label">Social Security:</span>
                <span class="amount">₹${this.payrollData.socialSecurity}</span>
              </div>
              <div class="row">
                <span class="label">Health Insurance:</span>
                <span class="amount">₹${this.payrollData.healthInsurance}</span>
              </div>
              <div class="row">
                <span class="label">Pension Fund:</span>
                <span class="amount">₹${this.payrollData.pensionFund}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>This is a computer generated document</p>
            </div>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  }
} 