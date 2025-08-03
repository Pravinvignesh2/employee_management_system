import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { Leave, LeaveType, LeaveStatus } from '../../models/leave.model';

interface LeaveReport {
  title: string;
  data: any[];
  type: 'chart' | 'table' | 'summary';
  chartType?: 'bar' | 'pie' | 'line';
}

@Component({
  selector: 'app-leave-reports',
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <h2>Leave Reports & Analytics</h2>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" (change)="loadReports()" class="period-select">
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button class="btn-export" (click)="exportReport()">
            <i class="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon total">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="card-content">
            <h4>Total Leave Requests</h4>
            <div class="card-number">{{ summary.totalRequests }}</div>
            <div class="card-change" [class.positive]="summary.change >= 0">
              {{ summary.change >= 0 ? '+' : '' }}{{ summary.change }}% from last period
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon approved">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="card-content">
            <h4>Approval Rate</h4>
            <div class="card-number">{{ summary.approvalRate }}%</div>
            <div class="card-change" [class.positive]="summary.approvalChange >= 0">
              {{ summary.approvalChange >= 0 ? '+' : '' }}{{ summary.approvalChange }}% from last period
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-content">
            <h4>Pending Requests</h4>
            <div class="card-number">{{ summary.pendingRequests }}</div>
            <div class="card-change" [class.positive]="summary.pendingChange <= 0">
              {{ summary.pendingChange >= 0 ? '+' : '' }}{{ summary.pendingChange }}% from last period
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon average">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="card-content">
            <h4>Average Leave Duration</h4>
            <div class="card-number">{{ summary.averageDuration }} days</div>
            <div class="card-change" [class.positive]="summary.durationChange <= 0">
              {{ summary.durationChange >= 0 ? '+' : '' }}{{ summary.durationChange }}% from last period
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Grid -->
      <div class="reports-grid">
        <!-- Leave Type Distribution -->
        <div class="report-card">
          <div class="report-header">
            <h3>Leave Type Distribution</h3>
            <div class="report-actions">
              <button class="btn-chart-type" (click)="toggleChartType('leaveTypes')">
                <i class="fas" [class.fa-chart-pie]="chartTypes.leaveTypes === 'pie'" [class.fa-chart-bar]="chartTypes.leaveTypes === 'bar'"></i>
              </button>
            </div>
          </div>
          <div class="report-content">
            <div class="chart-container">
              <canvas #leaveTypesChart></canvas>
            </div>
            <div class="chart-legend">
              <div class="legend-item" *ngFor="let item of leaveTypeData">
                <div class="legend-color" [style.background]="item.color"></div>
                <span>{{ item.label }}: {{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Leave Status Trend -->
        <div class="report-card">
          <div class="report-header">
            <h3>Leave Status Trend</h3>
            <div class="report-actions">
              <button class="btn-chart-type" (click)="toggleChartType('statusTrend')">
                <i class="fas" [class.fa-chart-line]="chartTypes.statusTrend === 'line'" [class.fa-chart-bar]="chartTypes.statusTrend === 'bar'"></i>
              </button>
            </div>
          </div>
          <div class="report-content">
            <div class="chart-container">
              <canvas #statusTrendChart></canvas>
            </div>
          </div>
        </div>

        <!-- Department Leave Analysis -->
        <div class="report-card">
          <div class="report-header">
            <h3>Department Leave Analysis</h3>
          </div>
          <div class="report-content">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Requests</th>
                    <th>Approved</th>
                    <th>Pending</th>
                    <th>Rejected</th>
                    <th>Avg Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let dept of departmentData">
                    <td>{{ dept.department }}</td>
                    <td>{{ dept.total }}</td>
                    <td>{{ dept.approved }}</td>
                    <td>{{ dept.pending }}</td>
                    <td>{{ dept.rejected }}</td>
                    <td>{{ dept.avgDuration }} days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Monthly Leave Pattern -->
        <div class="report-card">
          <div class="report-header">
            <h3>Monthly Leave Pattern</h3>
          </div>
          <div class="report-content">
            <div class="chart-container">
              <canvas #monthlyPatternChart></canvas>
            </div>
          </div>
        </div>

        <!-- Top Leave Requestors -->
        <div class="report-card">
          <div class="report-header">
            <h3>Top Leave Requestors</h3>
          </div>
          <div class="report-content">
            <div class="top-requestors">
              <div class="requestor-item" *ngFor="let requestor of topRequestors; let i = index">
                <div class="rank">{{ i + 1 }}</div>
                <div class="requestor-info">
                  <div class="name">{{ requestor.name }}</div>
                  <div class="department">{{ requestor.department }}</div>
                </div>
                <div class="requestor-stats">
                  <div class="stat">
                    <span class="label">Requests:</span>
                    <span class="value">{{ requestor.requests }}</span>
                  </div>
                  <div class="stat">
                    <span class="label">Days:</span>
                    <span class="value">{{ requestor.days }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leave Approval Time -->
        <div class="report-card">
          <div class="report-header">
            <h3>Leave Approval Time</h3>
          </div>
          <div class="report-content">
            <div class="approval-stats">
              <div class="stat-item">
                <div class="stat-number">{{ approvalStats.avgTime }}</div>
                <div class="stat-label">Average Hours</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ approvalStats.fastest }}</div>
                <div class="stat-label">Fastest (Hours)</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ approvalStats.slowest }}</div>
                <div class="stat-label">Slowest (Hours)</div>
              </div>
            </div>
            <div class="chart-container">
              <canvas #approvalTimeChart></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .reports-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .reports-header h2 {
      color: #2d3748;
      font-size: 32px;
      font-weight: 700;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .period-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }

    .btn-export {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-export:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .card-icon.total { background: linear-gradient(135deg, #667eea, #764ba2); }
    .card-icon.approved { background: linear-gradient(135deg, #48bb78, #38a169); }
    .card-icon.pending { background: linear-gradient(135deg, #ed8936, #dd6b20); }
    .card-icon.average { background: linear-gradient(135deg, #4299e1, #3182ce); }

    .card-content h4 {
      margin: 0 0 8px 0;
      color: #718096;
      font-size: 14px;
      font-weight: 500;
    }

    .card-number {
      color: #2d3748;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .card-change {
      font-size: 12px;
      color: #f56565;
    }

    .card-change.positive {
      color: #48bb78;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .report-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .report-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 18px;
      font-weight: 600;
    }

    .report-actions {
      display: flex;
      gap: 8px;
    }

    .btn-chart-type {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-chart-type:hover {
      background: #edf2f7;
    }

    .chart-container {
      height: 300px;
      margin-bottom: 16px;
    }

    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #4a5568;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f7fafc;
      font-weight: 600;
      color: #4a5568;
    }

    .top-requestors {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .requestor-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .rank {
      width: 24px;
      height: 24px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .requestor-info {
      flex: 1;
    }

    .name {
      font-weight: 600;
      color: #2d3748;
    }

    .department {
      font-size: 12px;
      color: #718096;
    }

    .requestor-stats {
      display: flex;
      gap: 16px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat .label {
      font-size: 12px;
      color: #718096;
    }

    .stat .value {
      font-weight: 600;
      color: #2d3748;
    }

    .approval-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #718096;
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 16px;
      }

      .reports-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .summary-cards {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .reports-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .report-card {
        padding: 20px;
      }

      .chart-container {
        height: 250px;
      }

      .approval-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LeaveReportsComponent implements OnInit {
  selectedPeriod = 'current';
  summary = {
    totalRequests: 0,
    change: 0,
    approvalRate: 0,
    approvalChange: 0,
    pendingRequests: 0,
    pendingChange: 0,
    averageDuration: 0,
    durationChange: 0
  };

  leaveTypeData: any[] = [];
  departmentData: any[] = [];
  topRequestors: any[] = [];
  approvalStats = {
    avgTime: 0,
    fastest: 0,
    slowest: 0
  };

  chartTypes = {
    leaveTypes: 'pie',
    statusTrend: 'line'
  };

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loadSummaryData();
    this.loadLeaveTypeData();
    this.loadDepartmentData();
    this.loadTopRequestors();
    this.loadApprovalStats();
  }

  loadSummaryData(): void {
    // Mock data - replace with actual API calls
    this.summary = {
      totalRequests: 156,
      change: 12.5,
      approvalRate: 78.2,
      approvalChange: 3.1,
      pendingRequests: 23,
      pendingChange: -8.5,
      averageDuration: 4.2,
      durationChange: -2.1
    };
  }

  loadLeaveTypeData(): void {
    this.leaveTypeData = [
      { label: 'Annual Leave', value: 45, color: '#4299e1' },
      { label: 'Sick Leave', value: 32, color: '#f56565' },
      { label: 'Personal Leave', value: 18, color: '#48bb78' },
      { label: 'Maternity Leave', value: 8, color: '#ed8936' },
      { label: 'Other', value: 12, color: '#a0aec0' }
    ];
  }

  loadDepartmentData(): void {
    this.departmentData = [
      { department: 'IT', total: 35, approved: 28, pending: 5, rejected: 2, avgDuration: 3.8 },
      { department: 'HR', total: 28, approved: 22, pending: 4, rejected: 2, avgDuration: 4.2 },
      { department: 'Finance', total: 42, approved: 35, pending: 6, rejected: 1, avgDuration: 3.5 },
      { department: 'Marketing', total: 31, approved: 25, pending: 4, rejected: 2, avgDuration: 4.8 },
      { department: 'Operations', total: 20, approved: 16, pending: 3, rejected: 1, avgDuration: 3.2 }
    ];
  }

  loadTopRequestors(): void {
    this.topRequestors = [
      { name: 'John Smith', department: 'IT', requests: 8, days: 24 },
      { name: 'Sarah Johnson', department: 'HR', requests: 7, days: 21 },
      { name: 'Mike Wilson', department: 'Finance', requests: 6, days: 18 },
      { name: 'Lisa Brown', department: 'Marketing', requests: 5, days: 15 },
      { name: 'David Lee', department: 'Operations', requests: 4, days: 12 }
    ];
  }

  loadApprovalStats(): void {
    this.approvalStats = {
      avgTime: 4.2,
      fastest: 1.5,
      slowest: 12.8
    };
  }

  toggleChartType(chartName: string): void {
    if (this.chartTypes[chartName as keyof typeof this.chartTypes] === 'pie') {
      this.chartTypes[chartName as keyof typeof this.chartTypes] = 'bar';
    } else if (this.chartTypes[chartName as keyof typeof this.chartTypes] === 'bar') {
      this.chartTypes[chartName as keyof typeof this.chartTypes] = 'pie';
    } else if (this.chartTypes[chartName as keyof typeof this.chartTypes] === 'line') {
      this.chartTypes[chartName as keyof typeof this.chartTypes] = 'bar';
    }
  }

  exportReport(): void {
    // Implement export functionality
    console.log('Exporting report for period:', this.selectedPeriod);
    // Generate and download report
  }
} 