import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/notifications`);
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/notifications/${id}/read`, {});
  }
}
