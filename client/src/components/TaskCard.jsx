import React from 'react';
import { Calendar, Edit3, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import '../styles/TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { id, title, description, status, priority, assignee, createdDate, dueDate, tags, createdAt } = task;

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

  const assigneeName = typeof assignee === 'object' && assignee !== null 
    ? (assignee.name || 'Unassigned') 
    : (assignee || '');

  const assigneeInitials = typeof assignee === 'object' && assignee !== null 
    ? (assignee.initials || (assignee.name ? assignee.name.charAt(0).toUpperCase() : 'U'))
    : (assignee ? assignee.slice(0, 2).toUpperCase() : 'U');

  const assigneeColor = (typeof assignee === 'object' && assignee?.color) ? assignee.color : '#6366f1';

  const displayDate = dueDate || createdDate || (createdAt ? new Date(createdAt).toLocaleDateString() : '');

  return (
    <div className={`task-card status-border-${status}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`priority-badge ${priorityColors[priority] || ''}`}>
            {(priority || 'medium').toUpperCase()}
          </span>
          {Array.isArray(tags) && tags.map((tag, idx) => (
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
      {description && <p className="task-description">{description}</p>}

      <div className="task-meta">
        {displayDate && (
          <div className="task-date" title={`Date: ${displayDate}`}>
            <Calendar size={13} />
            <span>{displayDate}</span>
          </div>
        )}
        {assigneeName && (
          <div className="task-assignee" title={`Assigned to ${assigneeName}`}>
            <div
              className="assignee-avatar"
              style={{ backgroundColor: assigneeColor }}
            >
              {assigneeInitials}
            </div>
            <span className="assignee-name">{assigneeName}</span>
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
