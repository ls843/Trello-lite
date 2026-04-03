package com.example.trellolite.service;

import com.example.trellolite.dto.NotificationResponseDTO;
import com.example.trellolite.model.Notification;
import com.example.trellolite.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationResponseDTO> getAll() {
        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    private NotificationResponseDTO mapToResponse(Notification n) {
        NotificationResponseDTO dto = new NotificationResponseDTO();

        dto.setId(n.getId());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());

        return dto;
    }
}
