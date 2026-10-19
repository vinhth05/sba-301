import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { createOrchid } from "../api/orchidApi";

const initialForm = {
  orchidName: "",
  orchidDescription: "",
  orchidCategory: "",
  orchidURL: "",
  isNatural: false,
  isAttractive: false,
};

export default function OrchidForm({ show, onHide, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.orchidName.trim()) {
      setError("Orchid name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createOrchid(form);
      setForm(initialForm);
      onHide();
      await onCreated();
    } catch (err) {
      setError(err.response?.data?.message ?? "Create orchid failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Orchid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Orchid Name *</Form.Label>
            <Form.Control
              name="orchidName"
              value={form.orchidName}
              onChange={handleChange}
              placeholder="e.g. Purple Star"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              name="orchidCategory"
              value={form.orchidCategory}
              onChange={handleChange}
              placeholder="e.g. Cattleya, Phalaenopsis"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="orchidDescription"
              value={form.orchidDescription}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              name="orchidURL"
              value={form.orchidURL}
              onChange={handleChange}
              placeholder="https://..."
            />
          </Form.Group>
          <div className="d-flex gap-4">
            <Form.Check
              type="checkbox"
              name="isNatural"
              label="Natural"
              checked={form.isNatural}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="isAttractive"
              label="Attractive"
              checked={form.isAttractive}
              onChange={handleChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Orchid"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
