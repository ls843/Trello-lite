package com.example.trellolite.controller;

import com.example.trellolite.dto.TaskRequestDTO;
import com.example.trellolite.dto.TaskResponseDTO;
import com.example.trellolite.model.TaskStatus;
import com.example.trellolite.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskResponseDTO createTask(
            @Valid @RequestBody TaskRequestDTO dto,
            @RequestParam Long boardId
    ) {
        return taskService.createTask(dto, boardId);
    }

    @GetMapping("/board/{boardId}")
    public List<TaskResponseDTO> getTasksByBoard(@PathVariable Long boardId) {
        return taskService.getTasksByBoard(boardId);
    }

    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO dto
    ) {
        return taskService.updateTask(id, dto);
    }

    @PatchMapping("/{id}/move")
    public TaskResponseDTO moveTask(@PathVariable Long id, @RequestParam TaskStatus status) {
        return taskService.moveTask(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
