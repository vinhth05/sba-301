import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../api/categoryApi";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const response = await getCategoryById(id);

        if (!ignore) {
          const category = response.data;
          setForm({
            categoryName: category.categoryName ?? "",
            categoryDescription: category.categoryDescription ?? "",
            parentCategoryId: category.parentCategoryId != null ? String(category.parentCategoryId) : "",
            active: category.active ?? true,
          });
        }
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 404) {
            setError(`Category #${id} was not found on the server.`);
          } else {
            setError(
              err.response?.data?.message ??
                err.message ??
                "Cannot load category detail."
            );
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      ignore = true;
    };
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    if (form.categoryName.trim().length > 100) {
      setError("Category name must not exceed 100 characters.");
      return;
    }

    if (!form.categoryDescription.trim()) {
      setError("Description is required.");
      return;
    }
    if (form.categoryDescription.trim().length > 250) {
      setError("Description must not exceed 250 characters.");
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

      await updateCategory(id, payload);

      navigate("/categories", {
        state: { message: `Category #${id} has been updated successfully.` },
      });
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message ?? "Invalid category data. Please verify your inputs.");
      } else if (err.response?.status === 404) {
        setError(`Category #${id} not found.`);
      } else if (err.response?.status === 409) {
        setError(err.response?.data?.message ?? "Category update conflicts with existing data (e.g. duplicate name).");
      } else {
        setError(err.response?.data?.message ?? err.message ?? "Update category failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 640 }}>
        <Spinner animation="border" variant="primary" />
        <div className="mt-3 fw-semibold text-secondary">
          Loading category #{id}...
        </div>
        <small className="text-muted">Fetching GET /api/categories/{id}</small>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 720 }} className="pb-5">
      <div className="mb-4">
        <Link to="/categories" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 mb-2">
          &larr; Back to Category List
        </Link>
        <h2 className="fw-bold text-dark mb-1">
          ✏️ Edit Category #{id}
        </h2>
        <div className="text-muted small">
          FUNewsManagementSystem &bull; Update existing category information
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="shadow-sm mb-4">
          <strong>Notice: </strong> {error}
        </Alert>
      )}

      {form ? (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light py-3 border-bottom">
            <span className="fw-semibold text-primary">Category Details</span>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Category Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  disabled={submitting}
                />
                <Form.Text className="text-muted">
                  Max 100 characters ({form.categoryName.length}/100)
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="categoryDescription"
                  value={form.categoryDescription}
                  onChange={handleChange}
                  maxLength={250}
                  required
                  disabled={submitting}
                />
                <Form.Text className="text-muted">
                  Max 250 characters ({form.categoryDescription.length}/250)
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
                  ID of the parent category. Leave empty if root.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="edit-category-active"
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

              <div className="d-flex gap-2 justify-content-end pt-3 border-top">
                <Button
                  type="button"
                  variant="outline-secondary"
                  disabled={submitting}
                  onClick={() => navigate("/categories")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="d-flex align-items-center gap-2"
                >
                  {submitting && <Spinner size="sm" animation="border" />}
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="text-center p-5 border-0 shadow-sm">
          <div className="fs-1 mb-2">🔍</div>
          <h5>Cannot display category details</h5>
          <p className="text-muted">The requested category could not be loaded from the backend.</p>
          <div>
            <Button variant="primary" onClick={() => navigate("/categories")}>
              Return to Category List
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}
