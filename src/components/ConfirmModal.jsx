import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, taskTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Task Deletion" size="sm">
      <div className="confirm-modal-content">
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="confirm-icon" />
        </div>
        <p className="confirm-message">
          Are you sure you want to delete <strong>"{taskTitle}"</strong>?
        </p>
        <p className="confirm-subtext">This action will remove the task from your board.</p>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
