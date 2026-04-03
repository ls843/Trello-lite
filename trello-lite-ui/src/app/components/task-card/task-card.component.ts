import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task!: Task;

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<{ task: Task; event: MouseEvent }>();

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit({ task: this.task, event });
  }

  getPriorityClass(priority?: string) {
    if (priority === 'HIGH') return 'high';
    if (priority === 'LOW') return 'low';
    return 'medium';
  }

  isOverdue(): boolean {
    if (!this.task.deadline) return false;
    return new Date(this.task.deadline) < new Date();
  }

  isDueSoon(): boolean {
    if (!this.task.deadline) return false;
    const diff =
      (new Date(this.task.deadline).getTime() - Date.now()) /
      (1000 * 3600 * 24);
    return diff >= 0 && diff <= 2;
  }

  getDueText(): string {
    if (!this.task.deadline) return '';

    const today = new Date();
    const deadline = new Date(this.task.deadline);

    const diff = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (diff < 0) return `Overdue by ${Math.abs(diff)} day(s)`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `Due in ${diff} days`;
  }
}