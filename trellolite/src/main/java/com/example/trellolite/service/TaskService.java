package com.example.trellolite.service;

import com.example.trellolite.dto.TaskRequestDTO;
import com.example.trellolite.dto.TaskResponseDTO;
import com.example.trellolite.model.*;
import com.example.trellolite.repository.BoardRepository;
import com.example.trellolite.repository.NotificationRepository;
import com.example.trellolite.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;
    private final NotificationRepository notificationRepository;
    private final WebSocketNotificationService webSocketNotificationService;

    public TaskService(TaskRepository taskRepository, BoardRepository boardRepository, NotificationRepository notificationRepository, WebSocketNotificationService webSocketNotificationService) {
        this.taskRepository = taskRepository;
        this.boardRepository = boardRepository;
        this.notificationRepository = notificationRepository;
        this.webSocketNotificationService = webSocketNotificationService;
    }

    public TaskResponseDTO createTask(TaskRequestDTO dto, Long boardId) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setAssignedTo(dto.getAssignedTo());
        task.setDeadline(dto.getDeadline());
        try {
            task.setPriority(
                    dto.getPriority() != null
                            ? Priority.valueOf(dto.getPriority())
                            : Priority.MEDIUM
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid priority value");
        }
        task.setStatus(TaskStatus.TODO);
        task.setBoard(board);

        Task saved = taskRepository.save(task);

        notify("Task '" + task.getTitle() + "' created");

        return mapToResponse(saved);
    }

    public TaskResponseDTO updateTask(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setAssignedTo(dto.getAssignedTo());
        task.setDeadline(dto.getDeadline());

        if (dto.getPriority() != null) {
            try {
                task.setPriority(Priority.valueOf(dto.getPriority()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid priority value");
            }
        }

        Task updated = taskRepository.save(task);
        notify("Task '" + task.getTitle() + "' updated");

        return mapToResponse(updated);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
        notify("Task '" + task.getTitle() + "' deleted");
    }

    public List<TaskResponseDTO> getTasksByBoard(Long boardId) {
        return taskRepository.findByBoard_Id(boardId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponseDTO moveTask(Long taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(newStatus);
        Task updated = taskRepository.save(task);

        notify(
                "Task '" + task.getTitle() + "' moved to " + newStatus
        );

        return mapToResponse(updated);
    }

    private void notify(String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notificationRepository.save(notification);

        webSocketNotificationService.send(message);
    }

    private TaskResponseDTO mapToResponse(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().name());
        dto.setAssignedTo(task.getAssignedTo());
        dto.setDeadline(task.getDeadline());
        dto.setPriority(task.getPriority().name());
        dto.setBoardId(task.getBoard().getId());
        dto.setCreatedAt(task.getCreatedAt());

        return dto;
    }
}
