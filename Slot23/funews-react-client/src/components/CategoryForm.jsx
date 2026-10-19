import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { createCategory } from "../api/categoryApi";

const initialForm = {
  categoryName: "",
  categoryDescription: "",
  parentCategoryId: "",
  active: true,
};

export default function CategoryForm({ show, onHide, onCreated }) {
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

  function validate() {
    if (!form.categoryName.trim()) {
      return "Category name is required.";
    }
    if (form.categoryName.trim().length > 100) {
      return "Category name must not exceed 100 characters.";
    }
    if (!form.categoryDescription.trim()) {
      return "Description is required.";
    }
    if (form.categoryDescription.trim().length > 250) {
      return "Description must not exceed 250 characters.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const payload = {
      categoryName: form.categoryName.trim(),
      categoryDescription: form.categoryDescription.trim(),
      parentCategoryId: form.parentCategoryId === "" ? null : Number(form.parentCategoryId),
      active: form.active,
    };

    try {
      setSubmitting(true);
      setError("");

      await createCategory(payload);
      setForm(initialForm);
      onHide();
      await onCreated();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message ?? "Invalid category data. Please verify your inputs.");
      } else if (err.response?.status === 409) {
        setError(err.response?.data?.message ?? "Category name already exists. Please choose another name.");
      } else {
        setError(err.response?.data?.message ?? err.message ?? "Failed to create category. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (submitting) {
      return;
    }
    setError("");
    setForm(initialForm);
    onHide();
  }

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!submitting} className="bg-light">
          <Modal.Title className="fs-5 fw-bold text-primary">
            ➕ Create New Category
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")} className="py-2">
              <strong>Error:</strong> {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              placeholder="e.g. Technology, Education, Sports..."
              maxLength={100}
              required
              disabled={submitting}
              autoFocus
            />
            <Form.Text className="text-muted">
              Maximum 100 characters ({form.categoryName.length}/100)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="categoryDescription"
              value={form.categoryDescription}
              onChange={handleChange}
              placeholder="Detailed description of the category..."
              maxLength={250}
              required
              disabled={submitting}
            />
            <Form.Text className="text-muted">
              Maximum 250 characters ({form.categoryDescription.length}/250)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Parent Category ID
            </Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="parentCategoryId"
              value={form.parentCategoryId}
              onChange={handleChange}
              placeholder="Leave empty for root category"
              disabled={submitting}
            />
            <Form.Text className="text-muted">
              Optional. ID of the parent category if this is a subcategory.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              type="switch"
              id="category-active-switch"
              name="active"
              label={
                <span className={form.active ? "text-success fw-semibold" : "text-secondary"}>
                  {form.active ? "Status: Active" : "Status: Inactive"}
                </span>
              }
              checked={form.active}
              onChange={handleChange}
              disabled={submitting}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button type="button" variant="secondary" disabled={submitting} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting} className="d-flex align-items-center gap-2">
            {submitting && <Spinner size="sm" animation="border" />}
            {submitting ? "Saving..." : "Create Category"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
