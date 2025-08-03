import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Leave, LeaveStatus } from '../../models/leave.model';

@Component({
  selector: 'app-leave-calendar',
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="btn-nav" (click)="previousMonth()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h3 class="month-year">{{ currentMonthName }} {{ currentYear }}</h3>
        <button class="btn-nav" (click)="nextMonth()">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="calendar-grid">
        <!-- Day headers -->
        <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
        
        <!-- Calendar days -->
        <div 
          *ngFor="let day of calendarDays" 
          class="calendar-day"
          [class.other-month]="!day.isCurrentMonth"
          [class.today]="day.isToday"
          [class.has-leaves]="day.leaves.length > 0"
          (click)="selectDay(day)">
          
          <div class="day-number">{{ day.dayNumber }}</div>
          
          <!-- Leave indicators -->
          <div class="leave-indicators" *ngIf="day.leaves.length > 0">
            <div 
              *ngFor="let leave of day.leaves.slice(0, 3)" 
              class="leave-indicator"
              [class]="getLeaveStatusClass(leave.status)"
              [title]="getLeaveTooltip(leave)">
              <i class="fas fa-circle"></i>
            </div>
            <div 
              *ngIf="day.leaves.length > 3" 
              class="more-indicator"
              [title]="day.leaves.length - 3 + ' more leaves'">
              +{{ day.leaves.length - 3 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="calendar-legend">
        <div class="legend-item">
          <div class="legend-color pending"></div>
          <span>Pending</span>
        </div>
        <div class="legend-item">
          <div class="legend-color approved"></div>
          <span>Approved</span>
        </div>
        <div class="legend-item">
          <div class="legend-color rejected"></div>
          <span>Rejected</span>
        </div>
        <div class="legend-item">
          <div class="legend-color cancelled"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .btn-nav {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-nav:hover {
      background: #edf2f7;
    }

    .month-year {
      margin: 0;
      color: #2d3748;
      font-size: 20px;
      font-weight: 600;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .day-header {
      background: #f7fafc;
      padding: 12px;
      text-align: center;
      font-weight: 600;
      color: #4a5568;
      font-size: 14px;
    }

    .calendar-day {
      background: white;
      min-height: 80px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .calendar-day:hover {
      background: #f7fafc;
    }

    .calendar-day.other-month {
      background: #fafafa;
      color: #a0aec0;
    }

    .calendar-day.today {
      background: #ebf8ff;
      border: 2px solid #4299e1;
    }

    .calendar-day.has-leaves {
      background: #f0fff4;
    }

    .day-number {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .leave-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      margin-top: 4px;
    }

    .leave-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .leave-indicator.pending {
      background: #ed8936;
    }

    .leave-indicator.approved {
      background: #48bb78;
    }

    .leave-indicator.rejected {
      background: #f56565;
    }

    .leave-indicator.cancelled {
      background: #a0aec0;
    }

    .more-indicator {
      font-size: 10px;
      color: #718096;
      font-weight: 600;
    }

    .calendar-legend {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
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
      border-radius: 50%;
    }

    .legend-color.pending {
      background: #ed8936;
    }

    .legend-color.approved {
      background: #48bb78;
    }

    .legend-color.rejected {
      background: #f56565;
    }

    .legend-color.cancelled {
      background: #a0aec0;
    }

    @media (max-width: 768px) {
      .calendar-container {
        padding: 16px;
      }

      .calendar-day {
        min-height: 60px;
        padding: 4px;
      }

      .day-number {
        font-size: 12px;
      }

      .leave-indicator {
        width: 6px;
        height: 6px;
      }

      .calendar-legend {
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  `]
})
export class LeaveCalendarComponent implements OnInit {
  @Input() leaves: Leave[] = [];
  @Input() currentDate: Date = new Date();
  @Output() daySelected = new EventEmitter<{date: Date, leaves: Leave[]}>();

  calendarDays: any[] = [];
  currentMonth: number = 0;
  currentYear: number = 2024;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }

  get currentMonthName(): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[this.currentMonth];
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayLeaves = this.getLeavesForDate(date);
      
      this.calendarDays.push({
        date: date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: this.isSameDate(date, today),
        leaves: dayLeaves
      });
    }
  }

  getLeavesForDate(date: Date): Leave[] {
    return this.leaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return date >= startDate && date <= endDate;
    });
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDay(day: any): void {
    this.daySelected.emit({
      date: day.date,
      leaves: day.leaves
    });
  }

  getLeaveStatusClass(status: LeaveStatus): string {
    return status.toLowerCase();
  }

  getLeaveTooltip(leave: Leave): string {
    return `${leave.employeeName} - ${leave.leaveType} (${leave.status})`;
  }
} 