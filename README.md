# SyncBoard / CollabBoard — Team Task Board (Assignment 02 - Milestone 2)

SyncBoard (CollabBoard) is a full-stack collaborative Kanban-style task management web application designed for software development teams to organize, track, and manage project tasks efficiently.

This repository represents **Assignment 02 (Milestone 2: Working REST APIs Integrated with Frontend)**.

---

## 🚀 Key Features (Assignment 02)

- **Full-Stack Architecture**: React Frontend (`client/`) integrated live with Express REST API Backend (`server/`).
- **JWT Authentication**: User registration, login authentication, and JWT bearer token profile verification (`/api/auth`).
- **Task CRUD Endpoints**: Express REST API endpoints for fetching, creating, updating, and deleting tasks (`/api/tasks`).
- **Kanban Workflow Columns**: To Do, Doing, and Done workflow columns with dynamic task counters and completion percentage.
- **Glassmorphic UI**: Responsive dark mode design system with priority badges, status selectors, search bar, and priority filters.
- **Postman API Collection**: Included in `server/postman/SyncBoard_API_Collection.json`.

---

## 📁 Project Structure

```text
collabboard/
├── client/                     # React Frontend Client (Port 5173)
│   ├── src/
│   │   ├── services/api.js    # REST API Integration Service
│   │   ├── context/           # AuthContext (JWT Token State Manager)
│   │   ├── pages/             # LoginPage.jsx, RegisterPage.jsx, BoardPage.jsx
│   │   ├── components/        # Navbar, Board, Column, TaskCard, Modal, TaskForm
│   │   └── styles/
│   └── package.json
│
└── server/                     # Node.js & Express REST API Server (Port 5000)
    ├── src/
    │   ├── controllers/       # authController.js, taskController.js
    │   ├── middleware/        # authMiddleware.js (JWT Bearer Guard)
    │   ├── models/            # userModel.js, taskModel.js (Data Store)
    │   ├── routes/            # authRoutes.js, taskRoutes.js
    │   └── server.js          # Express Server Entry Point
    ├── postman/               # Postman Collection JSON
    └── package.json
```

---

## 🛠️ Setup & Running Locally

### 1. Start Express REST API Backend
```bash
cd server
npm install
npm start
```
*Backend Server runs at `http://localhost:5000/api`*

### 2. Start React Frontend Client
```bash
cd client
npm install
npm run dev
```
*Client opens at `http://localhost:5173/`*

---

## 🔑 Demo Accounts

- **Team Lead**: `sandeepa@example.com` / `password123`
- **UI Designer**: `amara@example.com` / `password123`
- **Developer**: `kasun@example.com` / `password123`

---

## 🏷️ Assignment 02 Release Tag

- **Git Tag**: `v2.0.0-m2`
- **Tag Title**: `Assignment 02 - Working REST APIs (with mock data) Integrated with Frontend`
