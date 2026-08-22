import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Board from '../components/Board';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmModal from '../components/ConfirmModal';
import { initialTasks } from '../data/mockTasks';
import { CheckCircle2, Clock, Circle, Sparkles, RotateCcw } from 'lucide-react';
import '../styles/Board.css';

export default function BoardPage() {
  // 1. Task State initialized from localStorage or mockTasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('collabboard_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return initialTasks;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('collabboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 2. Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null when adding
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const [deletingTask, setDeletingTask] = useState(null); // null when not confirming delete

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

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      );
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    handleCloseModal();
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setDeletingTask(null);
    }
  };

  // Quick Status change from card select or move arrows
  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Reset to initial mock data handler
  const handleResetData = () => {
    if (window.confirm('Reset board tasks to initial sample data?')) {
      setTasks(initialTasks);
      setSearchTerm('');
      setPriorityFilter('all');
    }
  };

  // Filter tasks based on search & priority dropdown
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignee && task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Calculate quick board metrics
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
      />

      <main className="main-content">
        {/* Board Header & Progress Summary Bar */}
        <div className="board-summary-bar">
          <div className="summary-left">
            <h2 className="summary-heading">Team Project Canvas</h2>
            <p className="summary-subtext">
              Manage tasks, move cards across columns, and track team velocity.
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
              onClick={handleResetData}
              title="Reset tasks to initial mock data"
            >
              <RotateCcw size={14} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <Board
          tasks={filteredTasks}
          onEditTask={handleOpenEditModal}
          onDeleteTask={handleOpenDeleteModal}
          onStatusChange={handleStatusChange}
          onAddTaskClick={handleOpenAddModal}
        />
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
