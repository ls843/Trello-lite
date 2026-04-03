import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createTask(task: Partial<Task>, boardId: number): Observable<Task> {
    return this.http.post<Task>(`${this.api}/tasks?boardId=${boardId}`, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.api}/tasks/${task.id}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/tasks/${taskId}`);
  }

  getTasksByBoard(boardId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.api}/tasks/board/${boardId}`);
  }

  moveTask(taskId: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Observable<Task> {
    return this.http.patch<Task>(`${this.api}/tasks/${taskId}/move?status=${status}`, {});
  }
}
