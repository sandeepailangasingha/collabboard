# SyncBoard (CollabBoard) — One-Page Team Reflection

**Course Unit:** PUSL3120 — Full Stack Web Development  
**Session:** Session 5 — Real-Time Communication, DevOps & Launch  
**Repository:** [github.com/sandeepailangasingha/collabboard](https://github.com/sandeepailangasingha/collabboard)  
**Team Name:** Group Alpha (7 Contributors)  

---

## 1. What Worked Well

1. **Modular Architecture & Separation of Concerns:**  
   Adopting an Express MVC pattern on the backend alongside a component-driven React architecture on the frontend allowed all 7 members to work on separate modules concurrently without Git merge conflicts.

2. **Real-Time Synchronization with Socket.io:**  
   Implementing WebSockets over HTTP allowed tasks to move, create, and delete across all active user viewports in real time, eliminating stale data states.

3. **Resilient Cloud Persistence with Client-Side Caching:**  
   Pairing MongoDB Atlas ReplicaSet with localStorage offline caching ensured that accidental network disconnections preserved in-progress work without data loss.

4. **Containerization with Docker Compose:**  
   Dockerizing both client and server ensured a single-command deployment (`docker compose up`) that eliminates "works on my machine" inconsistencies.

5. **Green Continuous Integration (CI):**  
   The automated GitHub Actions workflow verifies lint rules, integration tests, and production builds on every push, ensuring submission stability.

---

## 2. What We Would Do Differently

1. **Earlier Integration of WebSockets:**  
   In earlier milestones, we relied purely on periodic REST polling. Transitioning to Socket.io earlier in the development lifecycle would have streamlined our local state management.

2. **Automated End-to-End (E2E) Browser Tests:**  
   While our integration test suite covers backend API endpoints and build processes thoroughly, integrating Cypress or Playwright earlier would have caught minor UI rendering edge-cases faster.

3. **Optimistic Locking for Race Conditions:**  
   Although Socket.io broadcasts live updates immediately, implementing MongoDB document versioning (`__v`) checks for simultaneous edits to the same task card would offer even stronger concurrency guarantees.

---

## 3. How the Work Was Divided

Every team member had a distinct, documented responsibility with authentic commit histories in the Git repository:

| Member Name | Role & Responsibility | Core Deliverables |
| :--- | :--- | :--- |
| **Sandeepa Ilangasingha** | Project Lead & Cloud DB | MongoDB Atlas M0 cluster setup, Mongoose db.js, seed script, PR integration, and project coordination. |
| **Chandu Meththasooriya** | Backend API & WebSockets | Express server scaffolding, Socket.io real-time engine, room management, and broadcast listeners. |
| **Nirman Jayarathna** | Backend Architecture & Tests | Automated API test suites (Node.js test runner), Postman Collection v3, and JWT auth guard middleware. |
| **Kasun Perera** | Frontend Kanban Engineer | React Kanban board layout, Column components, TaskCard interaction, and status transition workflows. |
| **Amara Fernando** | UI/UX & Design System | Glassmorphic dark aesthetic, color token variables, responsive navigation, and modal forms. |
| **Dinal Semitha** | State & Client Caching | Multi-project switching state, localStorage offline resilience (Step 6), and search/priority filtering. |
| **Yasindu Malshan** | DevOps & CI/CD Engineer | Dockerfile creation, Nginx SPA routing, root `docker-compose.yml`, and GitHub Actions CI workflow. |

---

*Verified and agreed upon by all team members for final project submission.*
