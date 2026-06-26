import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new Subject<Notification>();
  private counter = 0;

  notifications$ = this.notifications.asObservable();

  success(message: string): void {
    this.emit(message, 'success');
  }

  error(message: string): void {
    this.emit(message, 'error');
  }

  warning(message: string): void {
    this.emit(message, 'warning');
  }

  private emit(message: string, type: 'success' | 'error' | 'warning'): void {
    this.notifications.next({ id: ++this.counter, message, type });
  }
}
