import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { User } from '../models/user.model';

export interface LoginResponse {
  token: string;
  type: string;
  refreshToken: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(res => {
        this.tokenService.setToken(res.token);
        this.tokenService.setRefreshToken(res.refreshToken);
      }));
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(tap(res => {
        this.tokenService.setToken(res.token);
        this.tokenService.setRefreshToken(res.refreshToken);
      }));
  }

  logout(): void {
    this.tokenService.clear();
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  isAdmin(): boolean {
    const token = this.tokenService.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch {
      return false;
    }
  }
}
