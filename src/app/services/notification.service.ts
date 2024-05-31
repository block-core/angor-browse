import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    this.updateUnreadCount();
  }

  markAsRead(notification: Notification) {
    const updatedNotifications = this.notificationsSubject.value.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
}
