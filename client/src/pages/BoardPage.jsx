import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Board from '../components/Board';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmModal from '../components/ConfirmModal';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { CheckCircle2, Clock, Circle, Sparkles, RotateCcw, LogOut } from 'lucide-react';
import '../styles/Board.css';

export default function BoardPage() {
  const { user, logout } = useContext(AuthContext);
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

  // Fetch tasks from Express REST API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTasks({ search: searchTerm, priority: priorityFilter });
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks from API', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, priorityFilter]);

  // Handlers for Add / Edit Modal
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
    try {
      if (editingTask) {
        // Update via API
        const updated = await apiService.updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        // Create via API
        const created = await apiService.createTask(taskData);
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

  // Quick Status change from card select or move arrows
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await apiService.updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Reset/Refresh tasks handler
  const handleRefreshData = () => {
    fetchTasks();
  };

  // Calculate metrics
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const doingCount = tasks.filter((t) => t.status === 'doing').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="board-page-container">
      <Navbar
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
            <h2 className="summary-heading">Team Project Canvas</h2>
            <p className="summary-subtext">
              Manage tasks, move cards across columns, and track team velocity via Express REST API.
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
              title="Refresh tasks from Express REST API"
            >
              <RotateCcw size={14} />
              <span>Refresh API</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading tasks from Express REST API...</div>
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
    </div>
  );
}
