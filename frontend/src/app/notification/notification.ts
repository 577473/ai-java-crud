import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div class="notification-container">
      @for (n of activeNotifications(); track n.id) {
        <div class="notification" [class.success]="n.type === 'success'" [class.error]="n.type === 'error'" [class.warning]="n.type === 'warning'">
          {{ n.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .notification {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      color: #fff;
      min-width: 200px;
      animation: slideIn 0.3s ease;
    }
    .success { background: #00cc00; }
    .error { background: #ff00ff; }
    .warning { background: #ffaa00; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  protected readonly activeNotifications = signal<Notification[]>([]);
  private sub?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.sub = this.notificationService.notifications$.subscribe((n) => {
      this.activeNotifications.update((list) => [...list, n]);
      setTimeout(() => {
        this.activeNotifications.update((list) => list.filter((x) => x.id !== n.id));
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
