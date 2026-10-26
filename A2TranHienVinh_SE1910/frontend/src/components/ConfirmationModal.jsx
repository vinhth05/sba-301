import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-2 text-danger fs-5">
          <i className="bi bi-exclamation-triangle-fill"></i> {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3">
        <p className="mb-0 text-muted">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-trash3 me-1"></i> {confirmText}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
