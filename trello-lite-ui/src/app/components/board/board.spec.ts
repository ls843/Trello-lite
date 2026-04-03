import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Board } from './board.component';
import { of } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { BoardService } from '../../services/board.service';
import { NotificationService } from '../../services/notification.service';
import { WebSocketService } from '../../services/websocket.service';

describe('Board Component', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  let taskServiceMock: any;
  let boardServiceMock: any;
  let notificationServiceMock: any;
  let wsServiceMock: any;

  beforeEach(async () => {
    taskServiceMock = {
      getTasksByBoard: jasmine.createSpy().and.returnValue(of([])),
      createTask: jasmine.createSpy().and.returnValue(of({ id: 1 })),
      deleteTask: jasmine.createSpy().and.returnValue(of({})),
      moveTask: jasmine.createSpy().and.returnValue(of({})),
    };

    boardServiceMock = {
      getBoards: jasmine.createSpy().and.returnValue(of([{ id: 1, name: 'Test Board' }])),
      createBoard: jasmine.createSpy().and.returnValue(of({ id: 2, name: 'New Board' })),
      deleteBoard: jasmine.createSpy().and.returnValue(of({})),
    };

    notificationServiceMock = {
      getNotifications: jasmine.createSpy().and.returnValue(of([])),
      markNotificationAsRead: jasmine.createSpy().and.returnValue(of({})),
    };

    wsServiceMock = {
      connect: jasmine.createSpy(),
      disconnect: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: BoardService, useValue: boardServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: WebSocketService, useValue: wsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load boards on init', () => {
    expect(boardServiceMock.getBoards).toHaveBeenCalled();
    expect(component.boards.length).toBe(1);
    expect(component.selectedBoardId).toBe(1);
  });

  it('should load tasks and categorize them', () => {
    const mockTasks = [
      { id: 1, title: 'A', status: 'TODO' },
      { id: 2, title: 'B', status: 'IN_PROGRESS' },
      { id: 3, title: 'C', status: 'DONE' },
    ];

    taskServiceMock.getTasksByBoard.and.returnValue(of(mockTasks));

    component.loadTasks();

    expect(component.todo.length).toBe(1);
    expect(component.inProgress.length).toBe(1);
    expect(component.done.length).toBe(1);
  });

  it('should create task and add to TODO', () => {
    component.modalData = {
      title: 'New Task',
      description: '',
      deadline: '',
      priority: 'MEDIUM',
    };

    component.createTask();

    expect(taskServiceMock.createTask).toHaveBeenCalled();
    expect(component.todo.length).toBeGreaterThan(0);
  });

  it('should delete task from UI and call API', () => {
    const task = { id: 1, title: 'Test', status: 'TODO' } as any;
    component.todo = [task];

    component.deleteTask(task, new MouseEvent('click'));

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(1);
    expect(component.todo.length).toBe(0);
  });

  it('should move task between lists', () => {
    const task = { id: 1, title: 'Test', status: 'TODO' } as any;

    component.todo = [task];
    component.inProgress = [];

    const event: any = {
      previousContainer: { data: component.todo },
      container: { data: component.inProgress },
      previousIndex: 0,
      currentIndex: 0,
    };

    component.drop(event, 'IN_PROGRESS');

    expect(component.todo.length).toBe(0);
    expect(component.inProgress.length).toBe(1);
    expect(task.status).toBe('IN_PROGRESS');
  });

  it('should add notification and auto-remove after timeout', (done) => {
    component.showNotification('Test message');

    expect(component.notifications.length).toBe(1);

    setTimeout(() => {
      expect(component.notifications.length).toBe(0);
      done();
    }, 3100);
  });

  it('should delete board and switch to another', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.boards = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    component.selectedBoardId = 1;

    component.deleteBoard();

    expect(boardServiceMock.deleteBoard).toHaveBeenCalledWith(1);
  });
});
