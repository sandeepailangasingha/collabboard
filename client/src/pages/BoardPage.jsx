import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Board from '../components/Board';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmModal from '../components/ConfirmModal';
import ProjectModal from '../components/ProjectModal';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { CheckCircle2, Clock, Circle, Sparkles, RotateCcw } from 'lucide-react';
import '../styles/Board.css';

export default function BoardPage() {
  const { user, logout } = useContext(AuthContext);

  // Projects State (Milestone 3 Multi-Project)
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Tasks & Loading State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [deletingTask, setDeletingTask] = useState(null);

  // 1. Fetch all projects on mount
  const fetchProjects = async () => {
    try {
      const projs = await apiService.getProjects();
      setProjects(projs);
      if (projs.length > 0 && !selectedProject) {
        setSelectedProject(projs[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects from MongoDB Atlas', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Fetch tasks for selected project
  const fetchTasks = async () => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      const data = await apiService.getTasks({
        projectId: selectedProject.id,
        search: searchTerm,
        priority: priorityFilter,
      });
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks from MongoDB Atlas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject, searchTerm, priorityFilter]);

  // Handlers for Projects
  const handleCreateProject = async (projectData) => {
    try {
      const created = await apiService.createProject(projectData);
      setProjects((prev) => [created, ...prev]);
      setSelectedProject(created);
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
    try {
      if (editingTask) {
        // Update via MongoDB Atlas API
        const updated = await apiService.updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        // Create via MongoDB Atlas API
        const created = await apiService.createTask({
          ...taskData,
          projectId: selectedProject.id,
        });
        setTasks((prev) => [created, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'Failed to save task');
    }
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = async () => {
    if (deletingTask) {
      try {
        await apiService.deleteTask(deletingTask.id);
        setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
        setDeletingTask(null);
      } catch (err) {
        alert(err.message || 'Failed to delete task');
      }
    }
  };

  // Quick Status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await apiService.updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('Failed to update status in MongoDB Atlas', err);
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
