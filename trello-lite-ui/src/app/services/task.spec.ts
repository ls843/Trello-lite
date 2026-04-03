import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch tasks by board', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Test', status: 'TODO', priority: 'MEDIUM' }
    ];

    service.getTasksByBoard(1).subscribe((tasks) => {
      expect(tasks.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks/board/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create task', () => {
    const task: Partial<Task> = { title: 'New Task', priority: 'HIGH' };

    service.createTask(task, 1).subscribe((res) => {
      expect(res.title).toBe('New Task');
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks?boardId=1`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, ...task });
  });

  it('should move task', () => {
    service.moveTask(1, 'DONE').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/tasks/1/move?status=DONE`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should delete task', () => {
    service.deleteTask(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});