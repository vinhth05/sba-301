import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Row, Col, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import { newsApi } from '../api/newsApi';
import { categoryApi } from '../api/categoryApi';
import { tagApi } from '../api/tagApi';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const AVAILABLE_IMAGES = [
  'hodiep.jpg',
  'alba.jpg',
  'damari.jpg',
  'longtu.jpg',
  'yellow.jpg',
  '3mau.jpg',
  '4n.jpg',
  'thohong.jpg',
  'yaya.jpg',
];

const NewsManagement = () => {
  const { user } = useAuth();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State for Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    newsArticleID: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryID: '',
    newsStatus: true,
    tagIds: [],
    imageUrl: 'hodiep.jpg',
  });

  // Modal State for Read Detail
  const [viewArticle, setViewArticle] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAuxiliaryData();
    fetchArticles();
  }, []);

  const loadAuxiliaryData = async () => {
    try {
      const [cats, tags] = await Promise.all([categoryApi.getAll(), tagApi.getAll()]);
      setCategories(cats || []);
      setTagsList(tags || []);
    } catch (err) {
      console.error('Error loading categories/tags:', err);
    }
  };

  const fetchArticles = async (customParams) => {
    setLoading(true);
    setError('');
    try {
      const params = customParams || {
        keyword,
        categoryId: selectedCategory ? Number(selectedCategory) : null,
        status: selectedStatus === '' ? null : selectedStatus === 'true',
      };
      const data = await newsApi.search(params);
      setArticles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch news articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedStatus('');
    fetchArticles({ keyword: '', categoryId: null, status: null });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      newsArticleID: '',
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: 'University FU',
      categoryID: categories.length > 0 ? categories[0].categoryID : '',
      newsStatus: true,
      tagIds: [],
      imageUrl: 'hodiep.jpg',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (art) => {
    setIsEditing(true);
    setFormData({
      newsArticleID: art.newsArticleID,
      newsTitle: art.newsTitle || '',
      headline: art.headline || '',
      newsContent: art.newsContent || '',
      newsSource: art.newsSource || '',
      categoryID: art.categoryID || (categories[0]?.categoryID ?? ''),
      newsStatus: art.newsStatus !== undefined ? art.newsStatus : true,
      tagIds: art.tags ? art.tags.map((t) => t.tagID) : [],
      imageUrl: art.imageUrl || 'hodiep.jpg',
    });
    setError('');
    setShowModal(true);
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      const nextTags = exists ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId];
      return { ...prev, tagIds: nextTags };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      newsArticleID: formData.newsArticleID.trim() || undefined,
      newsTitle: formData.newsTitle.trim(),
      headline: formData.headline.trim(),
      newsContent: formData.newsContent.trim(),
      newsSource: formData.newsSource.trim(),
      categoryID: Number(formData.categoryID),
      newsStatus: Boolean(formData.newsStatus),
      tagIds: formData.tagIds,
      imageUrl: formData.imageUrl,
      createdByID: user?.accountID,
      updatedByID: user?.accountID,
    };

    try {
      if (isEditing) {
        await newsApi.update(formData.newsArticleID, payload);
        setSuccess(`News article #${formData.newsArticleID} updated successfully!`);
      } else {
        await newsApi.create(payload);
        setSuccess('New news article created successfully!');
      }
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      setError(err.message || 'Failed to save news article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await newsApi.delete(deleteTarget.newsArticleID);
      setSuccess(`News article #${deleteTarget.newsArticleID} deleted successfully.`);
      setDeleteTarget(null);
      fetchArticles();
    } catch (err) {
      setError(err.message || 'Cannot delete news article.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-file-earmark-text-fill text-primary me-2"></i> News Article Management
          </h2>
          <p className="text-muted small mb-0">
            Staff role: Full CRUD operations for news articles, category assignments, tags, and images.
          </p>
        </div>
        <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-semibold" onClick={openCreateModal}>
          <i className="bi bi-plus-lg me-1"></i> Create Article
        </Button>
      </div>

      {/* Notifications */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-3 shadow-sm">
          <i className="bi bi-check-circle-fill me-2"></i> {success}
        </Alert>
      )}

      {/* Filters Bar */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Form onSubmit={handleFilterSubmit}>
            <Row className="g-2">
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-0">
                    <i className="bi bi-search text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search title or headline..."
                    className="bg-light border-0"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  className="bg-light border-0"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  className="bg-light border-0"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex gap-2">
                <Button variant="primary" type="submit" className="flex-grow-1">
                  Filter
                </Button>
                <Button variant="light" onClick={handleClearFilters} title="Reset filters">
                  <i className="bi bi-arrow-clockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Articles Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2 text-muted">Loading articles...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-journal-x display-4"></i>
              <div className="mt-2 fw-semibold">No news articles found</div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Image</th>
                    <th>ID</th>
                    <th>Title & Headline</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((art) => (
                    <tr key={art.newsArticleID}>
                      <td className="ps-4" style={{ width: '80px' }}>
                        <img
                          src={`/images/${art.imageUrl || 'hodiep.jpg'}`}
                          alt="Thumb"
                          className="rounded-3 shadow-sm"
                          style={{ width: '60px', height: '42px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/hodiep.jpg';
                          }}
                        />
                      </td>
                      <td className="fw-bold text-muted small">#{art.newsArticleID}</td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="fw-bold text-dark text-truncate" title={art.newsTitle}>
                          {art.newsTitle || art.headline}
                        </div>
                        <div className="text-muted small text-truncate" title={art.headline}>
                          {art.headline}
                        </div>
                        {art.tags && art.tags.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {art.tags.slice(0, 3).map((t) => (
                              <Badge key={t.tagID} bg="light" text="secondary" className="border small" style={{ fontSize: '0.65rem' }}>
                                #{t.tagName}
                              </Badge>
                            ))}
                            {art.tags.length > 3 && (
                              <Badge bg="light" text="muted" style={{ fontSize: '0.65rem' }}>
                                +{art.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <Badge bg="info" text="dark" className="px-2 py-1">
                          {art.categoryName || 'General'}
                        </Badge>
                      </td>
                      <td className="small text-muted">{art.createdByName || 'Staff'}</td>
                      <td>
                        {art.newsStatus ? (
                          <Badge bg="success" pill>Active</Badge>
                        ) : (
                          <Badge bg="secondary" pill>Inactive</Badge>
                        )}
                      </td>
                      <td className="small text-muted">{formatDate(art.createdDate)}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1 rounded-3"
                          title="View Details"
                          onClick={() => setViewArticle(art)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1 rounded-3"
                          title="Edit Article"
                          onClick={() => openEditModal(art)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-3"
                          title="Delete Article"
                          onClick={() => setDeleteTarget(art)}
                        >
                          <i className="bi bi-trash3"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create / Edit Popup Dialog Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {isEditing ? (
              <>
                <i className="bi bi-pencil-square text-primary me-2"></i> Edit Article #{formData.newsArticleID}
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle text-primary me-2"></i> Create News Article
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              {!isEditing && (
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Article ID (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={formData.newsArticleID}
                      onChange={(e) => setFormData({ ...formData, newsArticleID: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              )}

              <Col md={isEditing ? 12 : 8}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Article Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter catchy article title"
                    value={formData.newsTitle}
                    onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Headline (Summary) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Brief 1-2 sentence headline summary"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.categoryID}
                    onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.categoryID} value={c.categoryID}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">News Source</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Official FU Portal / Internet"
                    value={formData.newsSource}
                    onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Full Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Detailed news article body text..."
                    value={formData.newsContent}
                    onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
                  />
                </Form.Group>
              </Col>

              {/* Cover Image Selector */}
              <Col md={12}>
                <Form.Label className="fw-semibold small">
                  Cover Image <span className="text-muted">(Select thumbnail from images repository)</span>
                </Form.Label>
                <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded-3 border">
                  {AVAILABLE_IMAGES.map((imgName) => (
                    <div
                      key={imgName}
                      onClick={() => setFormData({ ...formData, imageUrl: imgName })}
                      className={`cursor-pointer rounded-3 overflow-hidden p-1 ${
                        formData.imageUrl === imgName ? 'border border-3 border-primary shadow' : 'border border-light opacity-75'
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <img
                        src={`/images/${imgName}`}
                        alt={imgName}
                        style={{ width: '60px', height: '42px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>
              </Col>

              {/* Tag Checklist */}
              {tagsList.length > 0 && (
                <Col md={12}>
                  <Form.Label className="fw-semibold small">Article Tags (Check to assign)</Form.Label>
                  <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded-3 border">
                    {tagsList.map((tag) => (
                      <Form.Check
                        key={tag.tagID}
                        type="checkbox"
                        id={`tag-${tag.tagID}`}
                        label={tag.tagName}
                        checked={formData.tagIds.includes(tag.tagID)}
                        onChange={() => handleTagToggle(tag.tagID)}
                      />
                    ))}
                  </div>
                </Col>
              )}

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="article-status-switch"
                  label="Publish Article (Active for public portal)"
                  checked={formData.newsStatus}
                  onChange={(e) => setFormData({ ...formData, newsStatus: e.target.checked })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Article'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Detail Modal */}
      <Modal show={!!viewArticle} onHide={() => setViewArticle(null)} size="lg" centered scrollable>
        {viewArticle && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold fs-5">
                <Badge bg="primary" className="me-2">{viewArticle.categoryName}</Badge>
                Article #{viewArticle.newsArticleID}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <h4 className="fw-bold mb-2">{viewArticle.newsTitle || viewArticle.headline}</h4>
              <div className="text-muted small mb-3">
                <span>By {viewArticle.createdByName || 'Staff'}</span> • <span>{formatDate(viewArticle.createdDate)}</span>
              </div>
              <div className="rounded-3 overflow-hidden mb-3" style={{ maxHeight: '280px' }}>
                <img
                  src={`/images/${viewArticle.imageUrl || 'hodiep.jpg'}`}
                  alt="Cover"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="alert alert-light border mb-3">
                <strong>Headline:</strong> {viewArticle.headline}
              </div>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                {viewArticle.newsContent || 'No body content available.'}
              </p>
              {viewArticle.tags && viewArticle.tags.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  <span className="text-muted small fw-semibold me-2">Tags:</span>
                  {viewArticle.tags.map((t) => (
                    <Badge key={t.tagID} bg="secondary" className="me-1">
                      #{t.tagName}
                    </Badge>
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setViewArticle(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete News Article"
        message={`Are you sure you want to delete news article #${deleteTarget?.newsArticleID} ("${deleteTarget?.newsTitle || deleteTarget?.headline}")?`}
        confirmText="Confirm Delete"
        loading={deleting}
      />
    </Container>
  );
};

export default NewsManagement;
