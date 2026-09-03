import React, { useState } from 'react';
import Button from './Button';
import { FolderPlus, Palette, FileText } from 'lucide-react';

const COLOR_OPTIONS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#3b82f6',
  '#8b5cf6',
  '#ef4444',
];

export default function ProjectModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSave({ name: name.trim(), description: description.trim(), color });
      setName('');
      setDescription('');
      setColor('#6366f1');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderPlus size={20} color={color} />
            <h3 className="modal-title">Create New Project</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label className="form-label required">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mobile App Sprint 2, E-Commerce Engine"
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this project board's scope and deliverables..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Theme Color</label>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: c,
                    border: color === c ? '3px solid #ffffff' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: color === c ? '0 0 10px ' + c : 'none',
                    transition: 'transform 0.15s ease',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || !name.trim()}>
              {submitting ? 'Creating Project...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
