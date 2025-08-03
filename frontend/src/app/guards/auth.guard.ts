import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Check if user is authenticated
    if (!this.authService.getToken()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    }

    // Check if token is expired
    if (this.authService.isTokenExpired()) {
      // Try to refresh token
      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return of(false);
        })
      );
    }

    return of(true);
  }
} 