import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeDirectoryComponent } from './pages/employee-directory/employee-directory.component';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LeaveManagementComponent } from './pages/leave-management/leave-management.component';
import { PayrollComponent } from './pages/payroll/payroll.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { SupportComponent } from './pages/support/support.component';

// Shared Components
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { EmployeeModalComponent } from './shared/employee-modal/employee-modal.component';
import { LeaveRequestModalComponent } from './shared/leave-request-modal/leave-request-modal.component';
import { RejectionModalComponent } from './shared/rejection-modal/rejection-modal.component';
import { LeaveCalendarComponent } from './shared/leave-calendar/leave-calendar.component';
import { LeavePoliciesComponent } from './shared/leave-policies/leave-policies.component';
import { LeaveReportsComponent } from './shared/leave-reports/leave-reports.component';
import { BulkOperationsComponent } from './shared/bulk-operations/bulk-operations.component';
import { SuccessDialogComponent } from './shared/success-dialog/success-dialog.component';
import { ProjectAssignmentModalComponent } from './shared/project-assignment-modal/project-assignment-modal.component';
import { DocumentUploadModalComponent } from './shared/document-upload-modal/document-upload-modal.component';
import { ThemeToggleComponent } from './shared/theme-toggle.component';
import { ChatbotComponent } from './shared/chatbot/chatbot.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AttendanceService } from './services/attendance.service';
import { LeaveService } from './services/leave.service';
import { PayrollService } from './services/payroll.service';
import { PerformanceService } from './services/performance.service';
import { ThemeService } from './services/theme.service';

// Routes
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EmployeeDirectoryComponent,
    EmployeeProfileComponent,
    AttendanceComponent,
    LeaveManagementComponent,
    PayrollComponent,
    PerformanceComponent,
    ProfileComponent,
    AdminComponent,
    ManagerComponent,
    SupportComponent,
    HeaderComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    EmployeeModalComponent,
    LeaveRequestModalComponent,
    RejectionModalComponent,
    LeaveCalendarComponent,
    LeavePoliciesComponent,
    LeaveReportsComponent,
    BulkOperationsComponent,
    SuccessDialogComponent,
    ThemeToggleComponent,
    ProjectAssignmentModalComponent,
    DocumentUploadModalComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    
    // Angular Material Modules
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatGridListModule
  ],
  providers: [
    AuthService,
    UserService,
    AttendanceService,
    LeaveService,
    PayrollService,
    PerformanceService,
    ThemeService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 