export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedTo?: string;
  deadline?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  boardId?: number;
  createdAt?: string;
}

