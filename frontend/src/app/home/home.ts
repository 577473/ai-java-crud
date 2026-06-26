import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <p *ngIf="loading" class="loading">Loading...</p>
      <p *ngIf="loadError" class="error">{{ loadError }}</p>
      <h1 *ngIf="user">Welcome, {{ user.firstName }}!</h1>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      color: #fff;
    }
    .home-container h1 {
      color: #00ffff;
    }
    .loading { color: #888; }
    .error { color: #ff00ff; }
  `]
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  loading = false;
  loadError = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.loading = false;
        this.user = u;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load. Is the backend running?';
        console.error('Home load error:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
