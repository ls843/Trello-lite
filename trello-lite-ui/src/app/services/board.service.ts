import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createBoard(board: { name: string }): Observable<Board> {
    return this.http.post<Board>(`${this.api}/boards`, board);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.api}/boards`);
  }

  deleteBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/boards/${boardId}`);
  }
}
