import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

export default function TaskForm({ initialTask, onSave, onCancel, defaultStatus = 'todo' }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'medium',
    assigneeName: '',
    tags: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || defaultStatus,
        priority: initialTask.priority || 'medium',
        assigneeName: initialTask.assignee ? initialTask.assignee.name : '',
        tags: initialTask.tags ? initialTask.tags.join(', ') : '',
        dueDate: initialTask.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        assigneeName: '',
        tags: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialTask, defaultStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Helper to generate color and initials for assignee
    const getInitials = (name) => {
      if (!name) return 'U';
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return name.substring(0, 2).toUpperCase();
    };

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const processedTags = formData.tags
      ? formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : ['General'];

    const taskPayload = {
      ...(initialTask || {}),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assigneeName
        ? {
            name: formData.assigneeName.trim(),
            initials: getInitials(formData.assigneeName),
            color: initialTask?.assignee?.color || randomColor,
          }
        : { name: 'Unassigned', initials: 'UN', color: '#6b7280' },
      tags: processedTags,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      createdDate: initialTask?.createdDate || new Date().toISOString().split('T')[0],
    };

    onSave(taskPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="task-title" className="form-label required">
          Task Title
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement user login UI"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          autoFocus
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide details about what needs to be done..."
          className="form-textarea"
        />
      </div>

      <div className="form-row">
        <div className="form-group half-width">
          <label htmlFor="task-status" className="form-label">
            Status Column
          </label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group half-width">
          <label htmlFor="task-priority" className="form-label">
            Priority Level
          </label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group half-width">
          <label htmlFor="task-assignee" className="form-label">
            Assignee Name
          </label>
          <input
            id="task-assignee"
            type="text"
            name="assigneeName"
            value={formData.assigneeName}
            onChange={handleChange}
            placeholder="e.g. Kasun Perera"
            className="form-input"
          />
        </div>

        <div className="form-group half-width">
          <label htmlFor="task-duedate" className="form-label">
            Due Date
          </label>
          <input
            id="task-duedate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-tags" className="form-label">
          Tags (comma separated)
        </label>
        <input
          id="task-tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. Frontend, React, Design"
          className="form-input"
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={initialTask ? CheckCircle2 : PlusCircle}
        >
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
