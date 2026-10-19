import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, InputGroup, Row, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { deleteCategory, getCategories } from "../api/categoryApi";
import CategoryForm from "../components/CategoryForm";
import PaginationBar from "../components/PaginationBar";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories({
        keyword,
        page,
        size,
        sort: "categoryName,asc",
      });

      const pageData = response.data;
      setCategories(pageData.content ?? []);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? 0);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          err.message ??
          "Cannot connect to backend API server at localhost:8080."
      );
    } finally {
      setLoading(false);
    }
  }, [keyword, page, size]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    setKeyword(keywordInput.trim());
  }

  function handleClearSearch() {
    setKeywordInput("");
    setKeyword("");
    setPage(0);
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${category.categoryName}" (ID: ${category.categoryId})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.categoryId);
      setError("");
      setSuccessMessage("");

      await deleteCategory(category.categoryId);

      setSuccessMessage(`Category "${category.categoryName}" has been successfully deleted.`);
      await loadCategories();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          err.response?.data?.message ??
            "Cannot delete this category because it is being used by one or more news articles."
        );
      } else if (err.response?.status === 404) {
        setError("Category no longer exists or was already removed.");
      } else {
        setError(
          err.response?.data?.message ??
            err.message ??
            "Delete category failed."
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Container className="pb-5">
      {/* Header section */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            📁 Category Management
          </h2>
          <div className="text-muted small">
            FUNewsManagementSystem &bull; Chapter 15 Part B FullStack CRUD Client
          </div>
        </div>

        <div className="mt-2 mt-md-0 d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={loadCategories}
            disabled={loading}
            title="Refresh list"
          >
            🔄 Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreate(true)}
            className="d-flex align-items-center gap-1 shadow-sm"
          >
            <span className="fs-6">➕</span>
            <span>Create Category</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Card */}
      <Card className="mb-4 shadow-sm border-0 bg-light">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-2 align-items-center">
              <Col md={7} lg={8}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                  <Form.Control
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Search by category name (e.g. Technology, Education)..."
                  />
                </InputGroup>
              </Col>

              <Col xs="auto">
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </Col>

              <Col xs="auto">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={handleClearSearch}
                  disabled={!keywordInput && !keyword}
                >
                  Clear
                </Button>
              </Col>

              {keyword && (
                <Col xs="12" className="mt-1">
                  <small className="text-muted">
                    Filtering by: <Badge bg="info" text="dark">{keyword}</Badge>
                  </small>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Feedback Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="shadow-sm">
          <strong>Notice: </strong> {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")} className="shadow-sm">
          <strong>Success: </strong> {successMessage}
        </Alert>
      )}

      {/* Main Table Content */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="py-5 text-center text-secondary">
              <Spinner animation="border" variant="primary" role="status" />
              <div className="mt-2 fw-semibold">Loading categories from server...</div>
              <small className="text-muted">Calling GET /api/categories</small>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom text-muted small">
                <span>
                  Showing <strong>{categories.length}</strong> of <strong>{totalElements}</strong> categories
                </span>
                <span>Sorted by: <code>categoryName,asc</code></span>
              </div>

              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th style={{ width: 80 }} className="text-center">ID</th>
                    <th style={{ minWidth: 180 }}>Category Name</th>
                    <th style={{ minWidth: 260 }}>Description</th>
                    <th style={{ width: 120 }} className="text-center">Parent ID</th>
                    <th style={{ width: 110 }} className="text-center">Status</th>
                    <th style={{ width: 180 }} className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-5">
                        <div className="fs-1 mb-2">📭</div>
                        <div className="fw-semibold">No categories found.</div>
                        <small>Try clearing the search filter or click &quot;Create Category&quot; to add one.</small>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.categoryId}>
                        <td className="text-center fw-bold text-secondary">
                          #{category.categoryId}
                        </td>

                        <td>
                          <span className="fw-semibold text-dark">
                            {category.categoryName}
                          </span>
                        </td>

                        <td className="text-secondary small">
                          {category.categoryDescription}
                        </td>

                        <td className="text-center">
                          {category.parentCategoryId != null ? (
                            <Badge bg="light" text="dark" className="border">
                              #{category.parentCategoryId}
                            </Badge>
                          ) : (
                            <span className="text-muted fst-italic">Root (None)</span>
                          )}
                        </td>

                        <td className="text-center">
                          {category.active ? (
                            <Badge bg="success" className="px-2 py-1">
                              Active
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="px-2 py-1">
                              Inactive
                            </Badge>
                          )}
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              as={Link}
                              to={`/categories/${category.categoryId}/edit`}
                              size="sm"
                              variant="outline-primary"
                              className="px-2 py-1"
                            >
                              ✏️ Edit
                            </Button>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="px-2 py-1"
                              disabled={deletingId === category.categoryId}
                              onClick={() => handleDelete(category)}
                            >
                              {deletingId === category.categoryId ? (
                                <>
                                  <Spinner size="sm" animation="border" as="span" />
                                  <span className="ms-1">Deleting...</span>
                                </>
                              ) : (
                                "🗑️ Delete"
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination controls */}
              <div className="p-3">
                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal Create Category */}
      <CategoryForm
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onCreated={async () => {
          setPage(0);
          setSuccessMessage("Category created successfully!");
          await loadCategories();
        }}
      />
    </Container>
  );
}
