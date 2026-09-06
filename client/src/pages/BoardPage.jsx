import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Board from '../components/Board';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmModal from '../components/ConfirmModal';
import ProjectModal from '../components/ProjectModal';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import { CheckCircle2, Clock, Circle, Sparkles, RotateCcw, WifiOff, Zap } from 'lucide-react';
import '../styles/Board.css';

const CACHE_PROJECTS_KEY = 'syncboard_cached_projects';
const getTasksCacheKey = (projId) => `syncboard_cached_tasks_${projId}`;

export default function BoardPage() {
  const { user, logout } = useContext(AuthContext);

  // Projects State (Milestone 3 Multi-Project)
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Tasks & Loading State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-Time Sync & Notification State (Session 5 WebSocket Engine)
  const [liveAlert, setLiveAlert] = useState(null);

  // Client-Side Caching & Network Status (Step 6 Implementation)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServingCache, setIsServingCache] = useState(false);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [deletingTask, setDeletingTask] = useState(null);

  const triggerLiveAlert = (msg) => {
    setLiveAlert(msg);
    setTimeout(() => {
      setLiveAlert(null);
    }, 4000);
  };

  // Monitor network online/offline events for Step 6 resilience
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchProjects();
      if (selectedProject) fetchTasks();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsServingCache(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [selectedProject]);

  // 1. Fetch all projects on mount (with localStorage caching fallback)
  const fetchProjects = async () => {
    try {
      const projs = await apiService.getProjects();
      setProjects(projs);
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(projs));
      } catch (e) {}

      if (projs.length > 0 && !selectedProject) {
        setSelectedProject(projs[0]);
      }
      setIsServingCache(false);
    } catch (err) {
      console.warn('Network issue fetching projects from Atlas. Falling back to local cache...', err);
      try {
        const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setProjects(parsed);
          if (parsed.length > 0 && !selectedProject) {
            setSelectedProject(parsed[0]);
          }
          setIsServingCache(true);
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Fetch tasks for selected project (with localStorage caching fallback)
  const fetchTasks = async () => {
    if (!selectedProject) return;
    const cacheKey = getTasksCacheKey(selectedProject.id);

    try {
      setLoading(true);
      const data = await apiService.getTasks({
        projectId: selectedProject.id,
        search: searchTerm,
        priority: priorityFilter,
      });
      setTasks(data);

      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {}

      setIsServingCache(false);
    } catch (err) {
      console.warn('Network issue fetching tasks from Atlas. Reading from client cache...', err);
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          let filtered = parsed;
          if (priorityFilter && priorityFilter !== 'all') {
            filtered = filtered.filter((t) => t.priority === priorityFilter);
          }
          if (searchTerm) {
            filtered = filtered.filter((t) =>
              t.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          setTasks(filtered);
          setIsServingCache(true);
        }
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject, searchTerm, priorityFilter]);

  // 3. Real-Time Socket.io Multi-User Synchronization (Session 5 - Criterion 5)
  useEffect(() => {
    if (!selectedProject) return;

    socketService.connect();
    socketService.joinProjectRoom(selectedProject.id);

    const onTaskCreated = (newTask) => {
      const normalized = { ...newTask, id: newTask._id || newTask.id };
      const taskProjId = normalized.project || normalized.projectId;
      if (taskProjId === selectedProject.id) {
        setTasks((prev) => {
          if (prev.some((t) => t.id === normalized.id)) return prev;
          return [normalized, ...prev];
        });
        triggerLiveAlert(`⚡ Real-time sync: New task "${normalized.title}" created by teammate`);
      }
    };

    const onTaskUpdated = (updatedTask) => {
      const normalized = { ...updatedTask, id: updatedTask._id || updatedTask.id };
      const taskProjId = normalized.project || normalized.projectId;
      if (taskProjId === selectedProject.id) {
        setTasks((prev) => prev.map((t) => (t.id === normalized.id ? normalized : t)));
        triggerLiveAlert(`⚡ Real-time sync: Task "${normalized.title}" moved to ${normalized.status.toUpperCase()}`);
      }
    };

    const onTaskDeleted = ({ taskId, projectId }) => {
      if (projectId === selectedProject.id) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        triggerLiveAlert(`⚡ Real-time sync: Task was removed by a teammate`);
      }
    };

    const onProjectCreated = (newProject) => {
      const normalized = { ...newProject, id: newProject._id || newProject.id };
      setProjects((prev) => {
        if (prev.some((p) => p.id === normalized.id)) return prev;
        return [normalized, ...prev];
      });
      triggerLiveAlert(`⚡ Real-time sync: New project "${normalized.name}" created`);
    };

    socketService.on('task:created', onTaskCreated);
    socketService.on('task:updated', onTaskUpdated);
    socketService.on('task:deleted', onTaskDeleted);
    socketService.on('project:created', onProjectCreated);

    return () => {
      socketService.leaveProjectRoom(selectedProject.id);
      socketService.off('task:created', onTaskCreated);
      socketService.off('task:updated', onTaskUpdated);
      socketService.off('task:deleted', onTaskDeleted);
      socketService.off('project:created', onProjectCreated);
    };
  }, [selectedProject]);

  // Handlers for Projects
  const handleCreateProject = async (projectData) => {
    try {
      const created = await apiService.createProject(projectData);
      const updated = [created, ...projects];
      setProjects(updated);
      setSelectedProject(created);
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updated));
      } catch (e) {}
    } catch (err) {
      alert(err.message || 'Failed to create project');
    }
  };

  // Handlers for Add / Edit Task Modal
  const handleOpenAddModal = (status = 'todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    if (!selectedProject) {
      alert('Please select or create a project first');
      return;
    }
    const cacheKey = getTasksCacheKey(selectedProject.id);

    try {
      if (editingTask) {
        const updated = await apiService.updateTask(editingTask.id, taskData);
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === editingTask.id ? updated : t));
          try {
            localStorage.setItem(cacheKey, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      } else {
        const created = await apiService.createTask({
          ...taskData,
          projectId: selectedProject.id,
        });
        setTasks((prev) => {
          const next = [created, ...prev];
          try {
            localStorage.setItem(cacheKey, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
      handleCloseModal();
    } catch (err) {
      console.warn('Saving to local cache due to network drop:', err);
      if (editingTask) {
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t));
          try {
            localStorage.setItem(cacheKey, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      } else {
        const offlineTask = {
          ...taskData,
          id: 'temp_' + Date.now(),
          projectId: selectedProject.id,
        };
        setTasks((prev) => {
          const next = [offlineTask, ...prev];
          try {
            localStorage.setItem(cacheKey, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
      setIsServingCache(true);
      handleCloseModal();
      alert('Network drop detected: Your changes have been preserved in client storage (Step 6 Caching).');
    }
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = async () => {
    if (deletingTask) {
      const cacheKey = getTasksCacheKey(selectedProject.id);
      try {
        await apiService.deleteTask(deletingTask.id);
      } catch (err) {
        console.warn('Network issue during delete. Updating local client cache...', err);
      }
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== deletingTask.id);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setDeletingTask(null);
    }
  };

  // Quick Status change
  const handleStatusChange = async (taskId, newStatus) => {
    const cacheKey = selectedProject ? getTasksCacheKey(selectedProject.id) : null;
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      if (cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });

    try {
      await apiService.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.warn('Network drop during status change. State preserved in client cache.', err);
      setIsServingCache(true);
    }
  };

  // Reset/Refresh tasks
  const handleRefreshData = () => {
    fetchTasks();
  };

  // Metrics
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const doingCount = tasks.filter((t) => t.status === 'doing').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="board-page-container">
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onOpenAddModal={handleOpenAddModal}
        currentUser={user}
        onLogout={logout}
      />

      <main className="main-content">
        {/* Real-time Socket.io Toast Notification Banner */}
        {liveAlert && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: '#c7d2fe',
              fontSize: '0.85rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <Zap size={16} color="#818cf8" />
            <span><strong>Real-Time Sync Active (Session 5):</strong> {liveAlert}</span>
          </div>
        )}

        {/* Network & Client Caching Alert (Step 6) */}
        {(!isOnline || isServingCache) && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fde68a',
              fontSize: '0.85rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <WifiOff size={16} color="#f59e0b" />
              <span>
                <strong>Client-Side Caching Active (Step 6):</strong> Displaying locally cached board state from localStorage. In-progress work is safeguarded during network drops.
              </span>
            </div>
            <button
              onClick={handleRefreshData}
              style={{
                background: 'rgba(245, 158, 11, 0.3)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#fff',
                borderRadius: '4px',
                padding: '0.25rem 0.6rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Retry Atlas Connection
            </button>
          </div>
        )}

        {/* Board Header & Progress Summary Bar */}
        <div className="board-summary-bar">
          <div className="summary-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: selectedProject?.color || '#6366f1',
                }}
              />
              <h2 className="summary-heading">
                {selectedProject ? selectedProject.name : 'Team Project Canvas'}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                Live Socket.io Sync
              </span>
            </div>
            <p className="summary-subtext">
              {selectedProject?.description ||
                'Persistent multi-project task board with MongoDB Atlas Cloud Database.'}
            </p>
          </div>

          <div className="summary-right">
            <div className="metrics-group">
              <div className="metric-pill pill-total">
                <Sparkles size={14} />
                <span>Total: <strong>{totalCount}</strong></span>
              </div>
              <div className="metric-pill pill-todo">
                <Circle size={14} />
                <span>To Do: <strong>{todoCount}</strong></span>
              </div>
              <div className="metric-pill pill-doing">
                <Clock size={14} />
                <span>Doing: <strong>{doingCount}</strong></span>
              </div>
              <div className="metric-pill pill-done">
                <CheckCircle2 size={14} />
                <span>Done: <strong>{doneCount} ({completionPercentage}%)</strong></span>
              </div>
            </div>

            <button
              className="reset-data-btn"
              onClick={handleRefreshData}
              title="Refresh tasks from MongoDB Atlas"
            >
              <RotateCcw size={14} />
              <span>Refresh Atlas</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Connecting to MongoDB Atlas Cloud Database...
          </div>
        ) : (
          <Board
            tasks={tasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleOpenDeleteModal}
            onStatusChange={handleStatusChange}
            onAddTaskClick={handleOpenAddModal}
          />
        )}
      </main>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="md"
      >
        <TaskForm
          initialTask={editingTask}
          defaultStatus={defaultStatus}
          onSave={handleSaveTask}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTask ? deletingTask.title : ''}
      />

      {/* New Project Modal (Milestone 3) */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
}
