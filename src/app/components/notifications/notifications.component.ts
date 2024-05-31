import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.getNotifications();
    this.unreadCount$ = this.notificationService.getUnreadCount();
  }

  ngOnInit(): void {}

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification);
  }
}
