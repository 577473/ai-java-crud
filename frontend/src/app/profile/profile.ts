import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h2>My Profile</h2>
      <p *ngIf="loading" class="loading">Loading profile...</p>
      <p *ngIf="loadError" class="error">{{ loadError }}</p>
      <div *ngIf="!loading && !loadError && !editing && user" class="profile-details">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>First Name:</strong> {{ user.firstName }}</p>
        <p><strong>Last Name:</strong> {{ user.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
        <button (click)="startEdit()">Edit Profile</button>
      </div>

      <form *ngIf="editing" (ngSubmit)="onSave()" #profileForm="ngForm">
        <div class="form-group">
          <label>Username</label>
          <input [value]="editUser?.username" disabled class="disabled-input" />
        </div>
        <div class="form-group">
          <label>First Name</label>
          <input name="firstName" [(ngModel)]="editUser.firstName" required />
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input name="lastName" [(ngModel)]="editUser.lastName" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" [(ngModel)]="editUser.email" required />
        </div>
        <div class="form-group">
          <label>New Password (leave blank to keep current)</label>
          <input name="password" type="password" [(ngModel)]="password" />
        </div>
        <div class="error-text" *ngIf="error">{{ error }}</div>
        <div class="success" *ngIf="success">{{ success }}</div>
        <button type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
        <button type="button" class="cancel" (click)="cancelEdit()">Cancel</button>
      </form>
    </div>
  `,
  styles: [`
    .profile-container { padding: 2rem; color: #fff; max-width: 500px; }
    .profile-container h2 { color: #00ffff; }
    .profile-details p { margin: 0.5rem 0; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; }
    .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #333; border-radius: 4px; background: #0a0a0f; color: #fff; box-sizing: border-box; }
    .form-group input:focus { outline: none; border-color: #00ffff; }
    .disabled-input { opacity: 0.6; }
    button { padding: 0.5rem 1rem; background: #00ffff; color: #0a0a0f; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 0.5rem; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .cancel { background: #555; color: #fff; }
    .error { color: #ff00ff; margin-bottom: 1rem; }
    .error-text { color: #ff00ff; margin-bottom: 1rem; }
    .loading { color: #888; }
    .success { color: #00ff00; margin-bottom: 1rem; }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editUser: User = {} as User;
  password = '';
  editing = false;
  saving = false;
  loading = false;
  loadError = '';
  error = '';
  success = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.loadError = '';
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.loading = false;
        this.user = u;
        this.editUser = { ...u };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load profile. Is the backend running?';
        console.error('Profile load error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(): void {
    this.editing = true;
    this.success = '';
    this.error = '';
  }

  cancelEdit(): void {
    this.editing = false;
    this.password = '';
    this.editUser = { ...this.user! };
  }

  onSave(): void {
    this.saving = true;
    this.error = '';
    this.success = '';
    const update: any = {
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      email: this.editUser.email
    };
    if (this.password) update.password = this.password;

    this.userService.updateCurrentUser(update).subscribe({
      next: (u) => {
        this.saving = false;
        this.user = u;
        this.editUser = { ...u };
        this.password = '';
        this.success = 'Profile updated successfully';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.error || 'Update failed';
        this.cdr.detectChanges();
      }
    });
  }
}
