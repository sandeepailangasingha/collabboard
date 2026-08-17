# CollabBoard — Team Task Board (Milestone 1)

CollabBoard is a collaborative Kanban-style task management web application designed for software development teams to organize, track, and manage project tasks efficiently.

This repository represents **Milestone 1 (M1 – Static Front-End Skeleton)** of the project assignment.

---

## 🚀 Features (Milestone 1)

- **Kanban Board Columns**: To Do, Doing, and Done columns displayed side-by-side on desktop with a responsive mobile layout.
- **Top Navigation Bar**: Features CollabBoard branding, board title, real-time search, priority filtering, and user avatar placeholder.
- **Task Cards**: Reusable card component displaying title, description, priority badge, tags, dates, assignee, status dropdown, move controls, edit, and delete action buttons.
- **Add & Edit Task UI**: Interactive modal form with title validation, status selection, priority, assignee, due date, and tags.
- **Delete Confirmation UI**: Confirmation modal dialog prior to deleting tasks.
- **Client-Side Persistence**: React `useState` & `useEffect` integrated with `localStorage` sync.
- **Realistic Mock Data**: Pre-loaded mock tasks stored in `src/data/mockTasks.js`.

---

## 📁 Project Structure

```text
collabboard/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Board.jsx
│   │   ├── Column.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── Button.jsx
│   ├── pages/
│   │   └── BoardPage.jsx
│   ├── data/
│   │   └── mockTasks.js
│   └── styles/
│       ├── index.css
│       ├── Navbar.css
│       ├── Board.css
│       ├── TaskCard.css
│       ├── Modal.css
│       └── Button.css
```

---

## 🛠️ Setup & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
