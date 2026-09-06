import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'syncboard_task_draft';

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
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || defaultStatus,
        priority: initialTask.priority || 'medium',
        assigneeName: initialTask.assignee ? (typeof initialTask.assignee === 'string' ? initialTask.assignee : initialTask.assignee.name) : '',
        tags: initialTask.tags ? initialTask.tags.join(', ') : '',
        dueDate: initialTask.dueDate || '',
      });
    } else {
      // Check for cached in-progress work in localStorage (Step 6 Caching)
      try {
        const cachedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (cachedDraft) {
          const parsed = JSON.parse(cachedDraft);
          setFormData({
            title: parsed.title || '',
            description: parsed.description || '',
            status: parsed.status || defaultStatus,
            priority: parsed.priority || 'medium',
            assigneeName: parsed.assigneeName || '',
            tags: parsed.tags || '',
            dueDate: parsed.dueDate || '',
          });
          setHasRestoredDraft(true);
          return;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }

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

  // Save in-progress draft to localStorage whenever typing for new tasks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (!initialTask) {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          // localStorage full or disabled
        }
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormData({
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      assigneeName: '',
      tags: '',
      dueDate: '',
    });
    setHasRestoredDraft(false);
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
      assignee: formData.assigneeName ? formData.assigneeName.trim() : 'Unassigned',
      tags: processedTags,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
    };

    // Clear draft cache upon successful submission
    localStorage.removeItem(DRAFT_STORAGE_KEY);

    onSave(taskPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {hasRestoredDraft && !initialTask && (
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            color: '#a5b4fc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Restored in-progress work from local client cache (Step 6 Caching)</span>
          <button
            type="button"
            onClick={handleClearDraft}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.75rem',
              textDecoration: 'underline',
            }}
          >
            Discard Draft
          </button>
        </div>
      )}

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
          className="form-input"
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
