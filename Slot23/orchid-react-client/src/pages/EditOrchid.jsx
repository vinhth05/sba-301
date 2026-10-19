import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrchidById, updateOrchid } from "../api/orchidApi";

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const response = await getOrchidById(id);
        if (!ignore) setForm(response.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message ?? "Cannot load orchid details");
      }
    }
    loadData();
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
    try {
      setSubmitting(true);
      await updateOrchid(id, form);
      navigate("/orchids");
    } catch (err) {
      setError(err.response?.data?.message ?? "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!form && !error) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Loading orchid details...</div>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 640 }} className="pb-5">
      <div className="mb-3">
        <Link to="/orchids" className="text-muted small text-decoration-none">
          &larr; Back to Orchids
        </Link>
        <h2 className="fw-bold mt-2">Edit Orchid #{id}</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {form && (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Orchid Name *</Form.Label>
                <Form.Control
                  name="orchidName"
                  value={form.orchidName ?? form.name ?? ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Control
                  name="orchidCategory"
                  value={form.orchidCategory ?? form.category ?? ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="orchidDescription"
                  value={form.orchidDescription ?? form.description ?? ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Image URL</Form.Label>
                <Form.Control
                  name="orchidURL"
                  value={form.orchidURL ?? form.url ?? ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex gap-4 mb-4">
                <Form.Check
                  type="checkbox"
                  name="isNatural"
                  label="Natural"
                  checked={!!form.isNatural}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  name="isAttractive"
                  label="Attractive"
                  checked={!!form.isAttractive}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={() => navigate("/orchids")}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
