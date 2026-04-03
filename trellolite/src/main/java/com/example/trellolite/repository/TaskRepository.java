package com.example.trellolite.repository;

import com.example.trellolite.model.Task;
import com.example.trellolite.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByBoard_Id(Long boardId);

    List<Task> findByStatus(TaskStatus status);
}
