import { Component, OnInit, signal, computed } from '@angular/core';
import { form, FormField, required, email, hidden, readonly, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserListComponent } from '../user-list/user-list';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormField, UserListComponent],
  template: `
    <div class="admin-container">
      <h2>User Management</h2>
      <button class="create-btn" (click)="openCreate()">Create User</button>

      <app-user-list
        [users]="users()"
        [protectedUserIds]="protectedIds()"
        (edit)="openEdit($event)"
        (delete)="confirmDelete($event)"
      />

      @if (showModal()) {
        <div class="modal">
          <div class="modal-content">
            <h3>{{ editingUser() ? 'Edit User' : 'Create User' }}</h3>
            <form (submit)="onSave(); $event.preventDefault()">
              <div class="form-group">
                <label>Username</label>
                <input [formField]="adminForm.username" />
                @if (adminForm.username().touched() && adminForm.username().errors().length) {
                  <div class="field-error">{{ adminForm.username().errors()[0].message }}</div>
                }
              </div>
              <div class="form-group">
                <label>First Name</label>
                <input [formField]="adminForm.firstName" />
                @if (adminForm.firstName().touched() && adminForm.firstName().errors().length) {
                  <div class="field-error">{{ adminForm.firstName().errors()[0].message }}</div>
                }
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input [formField]="adminForm.lastName" />
                @if (adminForm.lastName().touched() && adminForm.lastName().errors().length) {
                  <div class="field-error">{{ adminForm.lastName().errors()[0].message }}</div>
                }
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [formField]="adminForm.email" />
                @if (adminForm.email().touched() && adminForm.email().errors().length) {
                  <div class="field-error">{{ adminForm.email().errors()[0].message }}</div>
                }
              </div>
              <div class="form-group">
                <label>Role</label>
                <select [formField]="adminForm.role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              @if (!adminForm.password().hidden()) {
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" [formField]="adminForm.password" />
                  @if (adminForm.password().touched() && adminForm.password().errors().length) {
                    <div class="field-error">{{ adminForm.password().errors()[0].message }}</div>
                  }
                </div>
              }
              @if (error()) {
                <div class="error">{{ error() }}</div>
              }
              <button type="submit" [disabled]="adminForm().invalid() || saving()">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" class="cancel" (click)="closeModal()">Cancel</button>
            </form>
          </div>
        </div>
      }

      @if (showDeleteConfirm()) {
        <div class="modal">
          <div class="modal-content delete-confirm">
            <p>Delete user <strong>{{ deletingUser?.username }}</strong>?</p>
            <button class="delete-btn" (click)="onDelete()" [disabled]="saving()">
              {{ saving() ? 'Deleting...' : 'Delete' }}
            </button>
            <button class="cancel" (click)="cancelDelete()">Cancel</button>
          </div>
        </div>
      }
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
    .field-error { color: #ff5555; font-size: 0.8rem; margin-top: 0.25rem; }
    button { padding: 0.5rem 1rem; background: #00ffff; color: #0a0a0f; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 0.5rem; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .cancel { background: #555; color: #fff; }
    .delete-btn { background: #ff00ff; color: #fff; }
    .error { color: #ff00ff; margin-bottom: 1rem; }
    .delete-confirm p { margin-bottom: 1rem; }
  `]
})
export class AdminComponent implements OnInit {
  protected readonly users = signal<User[]>([]);
  protected readonly showModal = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly editingUser = signal<User | null>(null);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  private readonly currentUserId = signal(0);
  protected readonly adminModel = signal({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });
  protected readonly adminForm = form(this.adminModel, (s) => {
    required(s.username, { message: 'Username is required' });
    required(s.firstName, { message: 'First name is required' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });
    required(s.role, { message: 'Role is required' });
    readonly(s.username, { when: () => !!this.editingUser() });
    hidden(s.password, { when: () => !!this.editingUser() });
    required(s.password, { message: 'Password is required', when: () => !this.editingUser() });
  });
  protected readonly protectedIds = computed(() => {
    const uid = this.currentUserId();
    const all = this.users();
    const adminCount = all.filter((u) => u.role === 'admin').length;
    return new Set(
      all.filter((u) => u.id === uid || (u.role === 'admin' && adminCount <= 1)).map((u) => u.id),
    );
  });

  protected deletingUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.currentUserId.set(currentUser.id);
        this.userService.getUsers().subscribe({
          next: (u) => {
            this.users.set(u);
          },
          error: (err) => {
            this.error.set(
              err.status ? `Error ${err.status}: ${err.statusText}` : 'Failed to load users. Is the backend running?',
            );
            console.error('Admin load error:', err);
          },
        });
      },
      error: () => {},
    });
  }

  openCreate(): void {
    this.editingUser.set(null);
    this.adminModel.set({ username: '', firstName: '', lastName: '', email: '', password: '', role: 'user' });
    this.showModal.set(true);
    this.error.set('');
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.adminModel.set({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
    });
    this.showModal.set(true);
    this.error.set('');
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
  }

  async onSave(): Promise<void> {
    await submit(this.adminForm, async () => {
      this.saving.set(true);
      this.error.set('');
      try {
        const data = this.adminModel();
        const editUser = this.editingUser();
        if (editUser) {
          await firstValueFrom(this.userService.updateUser(editUser.id, data));
        } else {
          await firstValueFrom(this.userService.createUser(data));
        }
        this.saving.set(false);
        this.closeModal();
        this.loadUsers();
      } catch (err: any) {
        this.saving.set(false);
        this.error.set(err.error?.error || 'Save failed');
        throw err;
      }
    });
  }

  confirmDelete(user: User): void {
    if (this.protectedIds().has(user.id)) return;
    this.deletingUser = user;
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingUser = null;
  }

  async onDelete(): Promise<void> {
    if (!this.deletingUser) return;
    this.saving.set(true);
    try {
      await firstValueFrom(this.userService.deleteUser(this.deletingUser.id));
      this.saving.set(false);
      this.showDeleteConfirm.set(false);
      this.deletingUser = null;
      this.loadUsers();
    } catch {
      this.saving.set(false);
    }
  }
}
