import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = this.getErrorMessage(error.error, 'Bad Request');
              break;
            case 401:
              errorMessage = 'Unauthorized access. Please login again.';
              break;
            case 403:
              errorMessage = 'Access denied. You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 409:
              errorMessage = this.getErrorMessage(error.error, 'Conflict - Resource already exists');
              break;
            case 422:
              errorMessage = this.getValidationErrorMessage(error.error);
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service temporarily unavailable. Please try again later.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
        }

        // Show error message to user
        this.showErrorSnackBar(errorMessage);
        
        return throwError(() => error);
      })
    );
  }

  private getErrorMessage(error: any, defaultMessage: string): string {
    if (error && error.message) {
      return error.message;
    }
    if (error && error.error) {
      return error.error;
    }
    return defaultMessage;
  }

  private getValidationErrorMessage(error: any): string {
    if (error && error.errors) {
      const validationErrors = Object.values(error.errors).flat();
      return `Validation errors: ${validationErrors.join(', ')}`;
    }
    if (error && error.message) {
      return error.message;
    }
    return 'Validation failed. Please check your input.';
  }

  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
} 