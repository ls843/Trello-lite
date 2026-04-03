# 🚀 TrelloLite — Task Management Board

TrelloLite is a modern task management web application inspired by Trello, built using Angular and Spring Boot. It supports real-time updates, drag-and-drop task management, and multi-board organization.

---

## ✨ Features

- 🧩 **Multi-Board Support**
  - Create, switch, and delete boards
  - Tasks are isolated per board

- 📌 **Task Management**
  - Create, edit, delete tasks
  - Add description, priority, and due date
  - Automatic categorization: TODO, IN_PROGRESS, DONE

- 🔄 **Drag & Drop**
  - Move tasks across columns instantly
  - Optimistic UI updates for smooth UX

- 🔔 **Real-Time Notifications**
  - WebSocket-based updates using STOMP
  - Instant alerts on task changes
  - Notification panel with unread tracking

- 🎨 **Modern UI/UX**
  - Trello-inspired layout
  - Smooth animations & micro-interactions
  - Priority indicators and smart due-date highlighting

---

## 🏗️ Tech Stack

### Frontend
- Angular (Standalone Components)
- Angular CDK (Drag & Drop)
- TypeScript
- CSS (custom styling + animations)

### Backend
- Spring Boot
- Spring Data JPA
- WebSocket (STOMP + SockJS)
- MySQL / H2

---

## 📂 Project Structure

frontend/
├── components/
| |── board/
│ ├── board-column/
│ ├── task-card/
├── services/
├── models/

backend/
├── controller/
├── service/
├── repository/
├── dto/
├── model/
├── config/


---

## ⚙️ Setup Instructions

### 🔹 Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run

Runs on:
http://localhost:8080

Frontend
cd frontend
npm install
ng serve

Runs on:
http://localhost:4200

---

🔌 API Endpoints (Sample)

Tasks
GET /api/tasks/board/{boardId}
POST /api/tasks?boardId=1
PUT /api/tasks/{id}
PATCH /api/tasks/{id}/move?status=TODO
DELETE /api/tasks/{id}

Boards
GET /api/boards
POST /api/boards
DELETE /api/boards/{id}

Notifications
GET /api/notifications
PATCH /api/notifications/{id}/read

⚡ WebSocket
Endpoint: /ws
Topic: /topic/notifications

Used for real-time updates when:

Task is created
Task is moved
Task is updated
Task is deleted

---

🧠 Key Design Decisions
-Component-based architecture
    Separated Board, Column, and TaskCard components
-Optimistic UI updates
    Immediate UI updates before backend confirmation
-DTO-based backend
    Clean separation between entity and API layer
-WebSocket over polling
    Efficient real-time communication

---

🧪 Testing
Component testing using Angular TestBed
Service testing using HttpClientTestingModule
WebSocket behavior mocked for unit testing

---

🚀 Future Improvements
User authentication (JWT)
Task assignment & collaboration
Labels & tags
Search & filtering
Activity logs

---
