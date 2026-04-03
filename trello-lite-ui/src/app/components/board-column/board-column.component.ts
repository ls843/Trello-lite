import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, TaskCardComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.css'
})
export class BoardColumnComponent {
  @Input() title!: string;
  @Input() tasks: Task[] = [];
  @Input() status!: 'TODO' | 'IN_PROGRESS' | 'DONE';
  @Input() connectedTo: string[] = [];

  @Output() dropTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<any>();

  drop(event: any) {
    this.dropTask.emit({ event, status: this.status });
  }
}