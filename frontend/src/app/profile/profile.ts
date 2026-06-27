import { Component, OnInit, signal } from '@angular/core';
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="profile-container">
      <h2>My Profile</h2>
      @if (loading()) {
        <p class="loading">Loading profile...</p>
      }
      @if (loadError()) {
        <p class="error">{{ loadError() }}</p>
      }
      @if (!loading() && !loadError() && !editing() && user(); as u) {
        <div class="profile-details">
          <p><strong>Username:</strong> {{ u.username }}</p>
          <p><strong>First Name:</strong> {{ u.firstName }}</p>
          <p><strong>Last Name:</strong> {{ u.lastName }}</p>
          <p><strong>Email:</strong> {{ u.email }}</p>
          <p><strong>Role:</strong> {{ u.role }}</p>
          <button (click)="startEdit()">Edit Profile</button>
        </div>
      }
      @if (editing()) {
        <form (submit)="onSave(); $event.preventDefault()">
          <div class="form-group">
            <label>Username</label>
            <input disabled class="disabled-input" [value]="user()?.username" />
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input [formField]="profileForm.firstName" />
            @if (profileForm.firstName().touched() && profileForm.firstName().errors().length) {
              <div class="field-error">{{ profileForm.firstName().errors()[0].message }}</div>
            }
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input [formField]="profileForm.lastName" />
            @if (profileForm.lastName().touched() && profileForm.lastName().errors().length) {
              <div class="field-error">{{ profileForm.lastName().errors()[0].message }}</div>
            }
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [formField]="profileForm.email" />
            @if (profileForm.email().touched() && profileForm.email().errors().length) {
              <div class="field-error">{{ profileForm.email().errors()[0].message }}</div>
            }
          </div>
          <div class="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" [formField]="profileForm.password" />
          </div>
          @if (error()) {
            <div class="error-text">{{ error() }}</div>
          }
          @if (success()) {
            <div class="success">{{ success() }}</div>
          }
          <button type="submit" [disabled]="profileForm().invalid() || saving()">
            {{ saving() ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="cancel" (click)="cancelEdit()">Cancel</button>
        </form>
      }
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
    .field-error { color: #ff5555; font-size: 0.8rem; margin-top: 0.25rem; }
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
  protected readonly user = signal<User | null>(null);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly loading = signal(false);
  protected readonly loadError = signal('');
  protected readonly error = signal('');
  protected readonly success = signal('');

  private readonly profileModel = signal({ firstName: '', lastName: '', email: '', password: '' });
  protected readonly profileForm = form(this.profileModel, (s) => {
    required(s.firstName, { message: 'First name is required' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.loadError.set('');
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.loading.set(false);
        this.user.set(u);
        this.profileModel.set({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '' });
      },
      error: (err) => {
        this.loading.set(false);
        this.loadError.set(
          err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load profile. Is the backend running?',
        );
        console.error('Profile load error:', err);
      },
    });
  }

  startEdit(): void {
    this.editing.set(true);
    this.success.set('');
    this.error.set('');
  }

  cancelEdit(): void {
    this.editing.set(false);
    const u = this.user();
    if (u) {
      this.profileModel.set({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '' });
    }
  }

  async onSave(): Promise<void> {
    await submit(this.profileForm, async () => {
      this.saving.set(true);
      this.error.set('');
      this.success.set('');
      try {
        const { password, ...rest } = this.profileModel();
        const update: Record<string, string> = { ...rest };
        if (password) update['password'] = password;
        const u = await firstValueFrom(this.userService.updateCurrentUser(update));
        this.user.set(u);
        this.profileModel.set({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '' });
        this.success.set('Profile updated successfully');
        this.saving.set(false);
      } catch (err: any) {
        this.saving.set(false);
        this.error.set(err.error?.error || 'Update failed');
        throw err;
      }
    });
  }
}
