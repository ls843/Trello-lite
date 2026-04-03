import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { BoardService } from '../../services/board.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { BoardColumnComponent } from '../board-column/board-column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, BoardColumnComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class Board implements OnInit {
  showBoardModal = false;
  newBoardName = '';

  boards: any[] = [];
  selectedBoardId = 1;

  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  notifications: { id: number; message: string }[] = [];

  showNotificationPanel = false;

  notificationHistory: {
    id: number;
    message: string;
    read: boolean;
  }[] = [];

  unreadCount = 0;

  constructor(
    private taskService: TaskService,
    private boardService: BoardService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private wsService: WebSocketService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadBoards();

    this.wsService.connect((msg: string) => {
      this.ngZone.run(() => {
        this.showNotification(msg);
        this.loadTasks();
        this.loadNotifications();
      });
    });
  }

  ngOnDestroy(): void {
    this.wsService.disconnect?.();
  }

  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (data) => {
        this.boards = data;

        if (data.length > 0) {
          this.selectedBoardId = data[0].id;
          this.loadTasks();
        }
      },
    });
  }

  onBoardChange() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasksByBoard(this.selectedBoardId).subscribe({
      next: (tasks) => {
        this.todo = tasks.filter((t) => t.status === 'TODO');
        this.inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS');
        this.done = tasks.filter((t) => t.status === 'DONE');

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tasks', err);
      },
    });
  }

  drop(event: CdkDragDrop<Task[]>, target: 'TODO' | 'IN_PROGRESS' | 'DONE'): void {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    if (event.previousContainer === event.container) {
      const movedTask = prevList.splice(event.previousIndex, 1)[0];
      prevList.splice(event.currentIndex, 0, movedTask);
      return;
    }

    const task = prevList[event.previousIndex];

    prevList.splice(event.previousIndex, 1);

    task.status = target;

    currList.splice(event.currentIndex, 0, task);

    this.taskService.moveTask(task.id, target).subscribe({
      error: () => {
        console.error('Failed to update backend, reverting...');
        this.loadTasks();
      },
    });
  }

  replaceTempTask(tempId: number, realTask: Task) {
    const replace = (list: Task[]) => {
      const index = list.findIndex((t) => t.id === tempId);
      if (index !== -1) list[index] = realTask;
    };

    replace(this.todo);
    replace(this.inProgress);
    replace(this.done);
  }

  showModal = false;

  modalData: {
    title: string;
    description: string;
    deadline: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  } = {
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedTask = null;

    this.modalData = {
      title: '',
      description: '',
      deadline: '',
      priority: 'MEDIUM',
    };
  }

  createTask() {
    const title = this.modalData.title.trim();
    if (!title) return;

    const newTaskObj: Partial<Task> = {
      title,
      description: this.modalData.description,
      deadline: this.modalData.deadline,
      priority: this.modalData.priority,
      status: 'TODO',
    };

    const tempTask: Task = {
      id: Date.now(),
      title,
      description: this.modalData.description,
      deadline: this.modalData.deadline,
      priority: this.modalData.priority,
      status: 'TODO',
    };

    this.todo.push(tempTask);

    this.taskService.createTask(newTaskObj, this.selectedBoardId).subscribe({
      next: (savedTask) => {
        this.replaceTempTask(tempTask.id, savedTask);
      },
      error: () => {
        console.error('Failed to create task');
        this.loadTasks();
      },
    });

    this.closeModal();
  }

  isEditMode = false;
  selectedTask: Task | null = null;

  openEditModal(task: Task) {
    this.isEditMode = true;
    this.showModal = true;
    this.selectedTask = task;

    this.modalData = {
      title: task.title,
      description: task.description || '',
      deadline: task.deadline || '',
      priority: task.priority || 'MEDIUM',
    };
  }

  saveTask() {
    const title = this.modalData.title.trim();
    if (!title) return;

    if (this.isEditMode && this.selectedTask) {
      const originalTask = { ...this.selectedTask };

      this.selectedTask.title = title;
      this.selectedTask.description = this.modalData.description;
      this.selectedTask.deadline = this.modalData.deadline;
      this.selectedTask.priority = this.modalData.priority;

      this.taskService.updateTask(this.selectedTask).subscribe({
        error: () => {
          console.error('Failed to update task');
          // Object.assign(this.selectedTask, originalTask);
          this.loadTasks();
        },
      });
    } else {
      this.createTask();
      return;
    }

    this.closeModal();
  }

  deleteTask(task: Task, event: MouseEvent) {
    event.stopPropagation();

    const remove = (list: Task[]) => {
      const index = list.findIndex((t) => t.id === task.id);
      if (index !== -1) list.splice(index, 1);
    };

    remove(this.todo);
    remove(this.inProgress);
    remove(this.done);

    this.taskService.deleteTask(task.id).subscribe({
      error: () => {
        console.error('Delete failed, restoring...');
        this.loadTasks();
      },
    });
  }

  showNotification(message: string) {
    const id = Date.now();

    this.notifications.unshift({ id, message });

    if (this.notifications.length > 3) {
      this.notifications.pop();
    }

    setTimeout(() => {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    }, 3000);
  }

  toggleNotificationPanel() {
    this.showNotificationPanel = !this.showNotificationPanel;

    if (this.showNotificationPanel) {
      this.notificationHistory.forEach((n) => (n.read = true));
      this.unreadCount = 0;
    }
  }

  markAsRead(notification: any) {
    if (!notification.read) {
      notification.read = true;
      this.unreadCount--;

      this.notificationService.markNotificationAsRead(notification.id).subscribe({
        error: () => {
          console.error('Failed to update notification');
        },
      });
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe((data) => {
      this.notificationHistory = data.map((n) => ({
        id: n.id,
        message: n.message,
        read: n.read ?? false,
      }));

      this.unreadCount = this.notificationHistory.filter((n) => !n.read).length;
    });
  }

  openBoardModal() {
    this.showBoardModal = true;
  }

  closeBoardModal() {
    this.showBoardModal = false;
    this.newBoardName = '';
  }

  createBoard() {
    const name = this.newBoardName.trim();
    if (!name) return;

    this.boardService.createBoard({ name }).subscribe({
      next: (newBoard) => {
        this.boards.push(newBoard);

        this.selectedBoardId = newBoard.id;

        this.loadTasks();
        this.closeBoardModal();
      },
      error: () => {
        console.error('Failed to create board');
      },
    });
  }

  deleteBoard() {
    if (!confirm('Delete this board? All tasks will be lost.')) return;

    const boardId = this.selectedBoardId;

    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        this.boards = this.boards.filter((b) => b.id !== boardId);

        if (this.boards.length > 0) {
          this.selectedBoardId = this.boards[0].id;
          this.loadTasks();
        } else {
          this.todo = [];
          this.inProgress = [];
          this.done = [];
        }
      },
      error: () => {
        console.error('Failed to delete board');
      },
    });
  }

  handleDrop({ event, status }: { event: any; status: any }) {
    this.drop(event, status);
  }
}
