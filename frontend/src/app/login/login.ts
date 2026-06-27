import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>JavaCRUD</h1>
        <form (submit)="onSubmit(); $event.preventDefault()">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" [formField]="loginForm.username" placeholder="Enter username" />
            @if (loginForm.username().touched() && loginForm.username().errors().length) {
              <div class="field-error">{{ loginForm.username().errors()[0].message }}</div>
            }
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [formField]="loginForm.password" placeholder="Enter password" />
            @if (loginForm.password().touched() && loginForm.password().errors().length) {
              <div class="field-error">{{ loginForm.password().errors()[0].message }}</div>
            }
          </div>
          @if (error()) {
            <div class="error">{{ error() }}</div>
          }
          <button type="submit" [disabled]="loginForm().invalid() || loading()">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0a0a0f;
    }
    .login-card {
      background: #1a1a2e;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
    }
    .login-card h1 {
      color: #00ffff;
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0a0a0f;
      color: #fff;
      box-sizing: border-box;
    }
    .form-group input:focus {
      outline: none;
      border-color: #00ffff;
    }
    .field-error {
      color: #ff5555;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    .error {
      color: #ff00ff;
      margin-bottom: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #00ffff;
      color: #0a0a0f;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      font-weight: bold;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  private readonly loginModel = signal({ username: '', password: '' });
  protected readonly loginForm = form(this.loginModel, (s) => {
    required(s.username, { message: 'Username is required' });
    required(s.password, { message: 'Password is required' });
  });
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    try {
      await submit(this.loginForm, async () => {
        this.loading.set(true);
        this.error.set('');
        const { username, password } = this.loginModel();
        await firstValueFrom(this.authService.login(username, password));
        this.loading.set(false);
        this.router.navigate(['/home']);
      });
    } catch {
      this.loading.set(false);
      this.error.set('Login failed');
    }
  }
}
