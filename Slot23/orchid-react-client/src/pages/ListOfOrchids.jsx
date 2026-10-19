import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { deleteOrchid, getAllOrchids } from "../api/orchidApi";
import OrchidForm from "../components/OrchidForm";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadOrchids() {
    try {
      setLoading(true);
      setError("");
      const response = await getAllOrchids();
      // Handle both raw array or { content: [...] }
      const data = Array.isArray(response.data) ? response.data : (response.data?.content ?? []);
      setOrchids(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Cannot load orchids");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrchids();
  }, []);

  async function handleDelete(orchid) {
    const id = orchid.orchidID || orchid.id;
    const name = orchid.orchidName || orchid.name;
    const confirmed = window.confirm(`Delete orchid "${name}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      await deleteOrchid(id);
      await loadOrchids();
    } catch (err) {
      setError(err.response?.data?.message ?? "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Loading orchids...</div>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">🌸 Orchids</h2>
          <div className="text-muted small">Course Baseline - Orchid Management System</div>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          ➕ Create Orchid
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th style={{ width: 100 }} className="text-center">Natural</th>
                <th style={{ width: 110 }} className="text-center">Attractive</th>
                <th style={{ width: 170 }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orchids.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No orchids found.
                  </td>
                </tr>
              ) : (
                orchids.map((o) => {
                  const id = o.orchidID ?? o.id;
                  return (
                    <tr key={id}>
                      <td className="fw-bold">#{id}</td>
                      <td className="fw-semibold">{o.orchidName ?? o.name}</td>
                      <td>{o.orchidCategory ?? o.category}</td>
                      <td className="text-center">
                        {o.isNatural ? <Badge bg="success">Yes</Badge> : <Badge bg="secondary">No</Badge>}
                      </td>
                      <td className="text-center">
                        {o.isAttractive ? <Badge bg="info">Yes</Badge> : <Badge bg="secondary">No</Badge>}
                      </td>
                      <td className="text-center">
                        <Button
                          as={Link}
                          to={`/orchids/${id}/edit`}
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={deletingId === id}
                          onClick={() => handleDelete(o)}
                        >
                          {deletingId === id ? "Deleting..." : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <OrchidForm
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onCreated={loadOrchids}
      />
    </Container>
  );
}
