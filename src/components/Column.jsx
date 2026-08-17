import React from 'react';
import TaskCard from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus, Inbox } from 'lucide-react';
import '../styles/Board.css';

export default function Column({ statusKey, title, tasks, onEditTask, onDeleteTask, onStatusChange, onAddTaskClick }) {
  const columnIcons = {
    todo: <Circle className="column-icon todo-icon" size={18} />,
    doing: <Clock className="column-icon doing-icon" size={18} />,
    done: <CheckCircle2 className="column-icon done-icon" size={18} />,
  };

  const emptyMessages = {
    todo: 'No tasks to do. Click + to add one!',
    doing: 'No tasks currently in progress.',
    done: 'No completed tasks yet. Keep pushing!',
  };

  return (
    <div className={`board-column column-${statusKey}`}>
      <div className="column-header">
        <div className="column-title-group">
          {columnIcons[statusKey]}
          <h2 className="column-title">{title}</h2>
          <span className={`task-count-badge count-${statusKey}`}>
            {tasks.length}
          </span>
        </div>

        <button
          className="column-add-btn"
          onClick={() => onAddTaskClick(statusKey)}
          title={`Add task to ${title}`}
          aria-label={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-column-state">
            <div className="empty-icon-wrapper">
              <Inbox size={32} />
            </div>
            <p className="empty-title">Empty Column</p>
            <p className="empty-subtitle">{emptyMessages[statusKey]}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
