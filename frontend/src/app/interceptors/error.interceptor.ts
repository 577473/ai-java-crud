import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);
const RETRY_HEADER = 'X-Refresh-Retry';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/api/auth/')) {
        return throwError(() => error);
      }

      if (req.headers.has(RETRY_HEADER)) {
        tokenService.clear();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshSubject.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((token) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${token}`, [RETRY_HEADER]: 'true' } })),
          ),
        );
      }

      isRefreshing = true;
      refreshSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((res) => {
          isRefreshing = false;
          refreshSubject.next(res.token);
          return next(
            req.clone({ setHeaders: { Authorization: `Bearer ${res.token}`, [RETRY_HEADER]: 'true' } }),
          );
        }),
        catchError(() => {
          isRefreshing = false;
          tokenService.clear();
          router.navigate(['/login']);
          return throwError(() => error);
        }),
      );
    }),
  );
};
