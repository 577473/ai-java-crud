import { Component, input, output } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (user of users(); track user.id) {
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="actions">
              <button class="edit-btn" (click)="edit.emit(user)">Edit</button>
              @if (!isProtected(user)) {
                <button class="delete-btn" (click)="delete.emit(user)">Delete</button>
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="7" class="empty">No users found</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .user-table { width: 100%; border-collapse: collapse; color: #fff; }
    .user-table th, .user-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #333; }
    .user-table th { color: #00ffff; }
    .actions button { padding: 0.25rem 0.5rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem; font-size: 0.8rem; }
    .edit-btn { background: #00ffff; color: #0a0a0f; }
    .delete-btn { background: #ff00ff; color: #fff; }
    .empty { text-align: center; color: #888; padding: 2rem; }
  `]
})
export class UserListComponent {
  readonly users = input<User[]>([]);
  readonly protectedUserIds = input<Set<number>>(new Set());
  readonly edit = output<User>();
  readonly delete = output<User>();

  isProtected(user: User): boolean {
    return this.protectedUserIds().has(user.id);
  }
}
