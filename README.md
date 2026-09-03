# SyncBoard / CollabBoard — Team Task Board (Milestone 3 - MongoDB Atlas & Multi-Project)

SyncBoard (working title: CollabBoard) is a production-ready, full-stack collaborative Kanban-style task management web application designed for software development teams to organize, track, and manage complex multi-project workflows efficiently.

This repository represents **Milestone 3 (M3 — Cloud Database Persistence with MongoDB Atlas & Multi-Project Kanban Support)**.

---

## 🚀 Key Features (Milestone 3)

- **Multiple Projects Support**: Create and manage multiple project boards simultaneously (e.g. *Project Alpha*, *Mobile App*, *E-Commerce Engine*) with dedicated task scopes.
- **Dynamic Project Switcher**: Interactive project dropdown in Navbar with real-time project switching and custom project color coding.
- **Persistent Cloud Database**: Fully integrated with **MongoDB Atlas Cloud Cluster** via **Mongoose ODM** with schemas for `User`, `Project`, and `Task`.
- **JWT Authentication & Profile Management**: Secure registration, login authentication, password hashing, and role-based user profiles stored in MongoDB Atlas.
- **RESTful API Architecture**: Complete set of CRUD endpoints for Auth (`/api/auth`), Projects (`/api/projects`), and Tasks (`/api/tasks`).
- **Real-Time Kanban Interaction**: Move tasks smoothly across columns (`To Do`, `Doing`, `Done`), with instant progress calculation and metrics.
- **Postman Collection v3 Export**: Full collection with pre-configured requests, environment variables, and authentication tokens (`server/postman/SyncBoard_API_Collection_v3.json`).

---

## 🛠️ Tech Stack Details

| Layer | Technologies |
| :--- | :--- |
| **Frontend Client** | React 19, Vite 8, Vanilla CSS (Glassmorphic Dark Theme), Lucide Icons |
| **Backend Server** | Node.js (ES Modules), Express.js REST API |
| **Database & ODM** | MongoDB Atlas (Free Tier M0 ReplicaSet), Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), Bearer Token Middleware, CORS, Dotenv |
| **API Testing & Docs** | Postman Collection v3 JSON |

---

## 📋 Prerequisites

Before running this project, ensure you have:
- **Node.js** v18.0.0 or higher (`node -v`)
- **npm** v9.0.0 or higher (`npm -v`)
- Active internet connection (to connect to the remote MongoDB Atlas cluster)

---

## ⚙️ Environment Configuration

The backend requires environment variables defined in `server/.env`:

```env
PORT=5000
JWT_SECRET=syncboard_jwt_secret_2026_collabboard
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.4820k0e.mongodb.net/syncboard?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

---

## 💻 How to Run the Application (Step-by-Step)

### Step 1: Start Express Backend Server (Terminal 1)
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# (Optional) Seed demo users, projects, and tasks into MongoDB Atlas
npm run seed

# Start the server
npm start
```
*Backend server runs at: `http://localhost:5000/api`*  
*Terminal displays: `MongoDB Atlas Connected: ac-j496tuj-shard-00-01.4820k0e.mongodb.net`*

### Step 2: Start React Frontend Client (Terminal 2)
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend opens at: `http://localhost:5173/`*

---

## 🔑 Demo Login Accounts

All accounts are pre-seeded in the MongoDB Atlas database:

| Name | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Sandeepa Ilangasingha** | Team Lead & Full-Stack Dev | `sandeepa@example.com` | `password123` |
| **Amara Fernando** | UI/UX Designer | `amara@example.com` | `password123` |
| **Kasun Perera** | Frontend Engineer | `kasun@example.com` | `password123` |
| **Nirman Jayarathna** | Backend Architect | `nirman@example.com` | `password123` |

*(You can also use the **Register** page to create your own account dynamically stored in MongoDB Atlas).*

---

## 📁 Full-Stack Project Structure

```text
collabboard/
├── client/                          # React Frontend Client (Port 5173)
│   ├── src/
│   │   ├── components/             # Navbar, Board, Column, TaskCard, Modal, ProjectModal
│   │   ├── context/                # AuthContext (JWT State Management)
│   │   ├── pages/                  # LoginPage, RegisterPage, BoardPage
│   │   ├── services/               # api.js (REST API integration service)
│   │   └── styles/                 # Glassmorphic CSS design system
│   └── package.json
│
└── server/                          # Node.js Express REST API (Port 5000)
    ├── src/
    │   ├── config/                 # db.js (Atlas connection with DNS fallback), env.js
    │   ├── controllers/            # authController.js, projectController.js, taskController.js
    │   ├── middleware/             # authMiddleware.js (JWT Bearer Guard)
    │   ├── models/                 # User.js, Project.js, Task.js (Mongoose Schemas)
    │   ├── routes/                 # authRoutes.js, projectRoutes.js, taskRoutes.js
    │   ├── seed.js                 # Database Seeder script
    │   └── server.js               # Express application entry point
    ├── postman/                    # SyncBoard_API_Collection_v3.json
    ├── .env                        # Atlas connection & JWT configuration
    └── package.json
```

---

## 🏷️ Release Tags
- `v1.0.0-m1`: Milestone 1 — Static Front-End Skeleton
- `v2.0.0-m2`: Milestone 2 — Working REST APIs Integrated with Frontend
- `v3.0.0-m3`: Milestone 3 — MongoDB Atlas Cloud Persistence & Multiple Projects
