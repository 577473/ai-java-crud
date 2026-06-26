import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserListComponent } from '../user-list/user-list';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent],
  template: `
    <div class="admin-container">
      <h2>User Management</h2>
      <button class="create-btn" (click)="openCreate()">Create User</button>

      <app-user-list
        [users]="users"
        [protectedUserIds]="protectedUserIds"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)">
      </app-user-list>

      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h3>{{ editingUser ? 'Edit User' : 'Create User' }}</h3>
          <form (ngSubmit)="onSave()" #userForm="ngForm">
            <div class="form-group">
              <label>Username</label>
              <input name="username" [(ngModel)]="formData.username" required />
            </div>
            <div class="form-group">
              <label>First Name</label>
              <input name="firstName" [(ngModel)]="formData.firstName" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input name="lastName" [(ngModel)]="formData.lastName" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input name="email" type="email" [(ngModel)]="formData.email" required />
            </div>
            <div class="form-group" *ngIf="!editingUser">
              <label>Password</label>
              <input name="password" type="password" [(ngModel)]="formData.password" required />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select name="role" [(ngModel)]="formData.role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="error" *ngIf="error">{{ error }}</div>
            <button type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
            <button type="button" class="cancel" (click)="closeModal()">Cancel</button>
          </form>
        </div>
      </div>

      <div class="modal" *ngIf="showDeleteConfirm">
        <div class="modal-content delete-confirm">
          <p>Delete user <strong>{{ deletingUser?.username }}</strong>?</p>
          <button class="delete-btn" (click)="onDelete()" [disabled]="saving">
            {{ saving ? 'Deleting...' : 'Delete' }}
          </button>
          <button class="cancel" (click)="cancelDelete()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; color: #fff; }
    .admin-container h2 { color: #00ffff; }
    .create-btn { margin-bottom: 1rem; padding: 0.5rem 1rem; background: #00ffff; color: #0a0a0f; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: #1a1a2e; padding: 2rem; border-radius: 8px; width: 100%; max-width: 500px; }
    .modal-content h3 { color: #00ffff; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; }
    .form-group input, .form-group select { width: 100%; padding: 0.5rem; border: 1px solid #333; border-radius: 4px; background: #0a0a0f; color: #fff; box-sizing: border-box; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #00ffff; }
    .form-group select option { background: #1a1a2e; }
    button { padding: 0.5rem 1rem; background: #00ffff; color: #0a0a0f; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 0.5rem; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .cancel { background: #555; color: #fff; }
    .delete-btn { background: #ff00ff; color: #fff; }
    .error { color: #ff00ff; margin-bottom: 1rem; }
    .delete-confirm p { margin-bottom: 1rem; }
  `]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingUser: User | null = null;
  deletingUser: User | null = null;
  saving = false;
  error = '';
  formData: any = {};
  currentUserId: number = 0;
  protectedUserIds: Set<number> = new Set();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.currentUserId = currentUser.id;
        this.userService.getUsers().subscribe({
          next: (u) => {
            this.users = u;
            this.computeProtectedIds();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.error = err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load users. Is the backend running?';
            console.error('Admin load error:', err);
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {}
    });
  }

  private computeProtectedIds(): void {
    const adminCount = this.users.filter(u => u.role === 'admin').length;
    this.protectedUserIds = new Set(
      this.users
        .filter(u => u.id === this.currentUserId || (u.role === 'admin' && adminCount <= 1))
        .map(u => u.id)
    );
  }

  openCreate(): void {
    this.editingUser = null;
    this.formData = { username: '', firstName: '', lastName: '', email: '', password: '', role: 'user' };
    this.showModal = true;
    this.error = '';
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.formData = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    this.showModal = true;
    this.error = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  onSave(): void {
    this.saving = true;
    this.error = '';
    const obs = this.editingUser
      ? this.userService.updateUser(this.editingUser.id, this.formData)
      : this.userService.createUser(this.formData);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadUsers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.error || 'Save failed';
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(user: User): void {
    if (this.protectedUserIds.has(user.id)) return;
    this.deletingUser = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingUser = null;
  }

  onDelete(): void {
    if (!this.deletingUser) return;
    this.saving = true;
    this.userService.deleteUser(this.deletingUser.id).subscribe({
      next: () => {
        this.saving = false;
        this.showDeleteConfirm = false;
        this.deletingUser = null;
        this.loadUsers();
        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
