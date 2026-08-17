import React from 'react';
import { Calendar, Edit3, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import '../styles/TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { id, title, description, status, priority, assignee, createdDate, dueDate, tags } = task;

  const priorityColors = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  const statusLabels = {
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done',
  };

  const handleNextStatus = () => {
    if (status === 'todo') onStatusChange(id, 'doing');
    else if (status === 'doing') onStatusChange(id, 'done');
  };

  const handlePrevStatus = () => {
    if (status === 'done') onStatusChange(id, 'doing');
    else if (status === 'doing') onStatusChange(id, 'todo');
  };

  return (
    <div className={`task-card status-border-${status}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`priority-badge ${priorityColors[priority] || ''}`}>
            {priority.toUpperCase()}
          </span>
          {tags && tags.map((tag, idx) => (
            <span key={idx} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>

        <div className="task-card-actions">
          <button
            className="card-action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="card-action-btn delete-btn"
            onClick={() => onDelete(task)}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{title}</h3>
      <p className="task-description">{description}</p>

      <div className="task-meta">
        {createdDate && (
          <div className="task-date" title={`Created on ${createdDate}`}>
            <Calendar size={13} />
            <span>{createdDate}</span>
          </div>
        )}
        {assignee && (
          <div className="task-assignee" title={`Assigned to ${assignee.name}`}>
            <div
              className="assignee-avatar"
              style={{ backgroundColor: assignee.color || '#6366f1' }}
            >
              {assignee.initials || assignee.name.charAt(0)}
            </div>
            <span className="assignee-name">{assignee.name}</span>
          </div>
        )}
      </div>

      <div className="task-card-footer">
        <div className="status-selector-wrapper">
          <span className="status-label">Status:</span>
          <select
            className={`status-select select-${status}`}
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="move-buttons">
          {status !== 'todo' && (
            <button
              className="move-btn"
              onClick={handlePrevStatus}
              title={`Move to ${status === 'done' ? 'Doing' : 'To Do'}`}
            >
              <ArrowLeft size={13} />
            </button>
          )}
          {status !== 'done' && (
            <button
              className="move-btn"
              onClick={handleNextStatus}
              title={`Move to ${status === 'todo' ? 'Doing' : 'Done'}`}
            >
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
