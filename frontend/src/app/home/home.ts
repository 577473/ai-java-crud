import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      @if (loading()) {
        <p class="loading">Loading...</p>
      }
      @if (loadError()) {
        <p class="error">{{ loadError() }}</p>
      }
      @if (user(); as u) {
        <h1>Welcome, {{ u.firstName }}!</h1>
      }
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
  protected readonly user = signal<User | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadError = signal('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.loading.set(false);
        this.user.set(u);
      },
      error: (err) => {
        this.loading.set(false);
        this.loadError.set(
          err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load. Is the backend running?',
        );
        console.error('Home load error:', err);
      },
    });
  }
}
