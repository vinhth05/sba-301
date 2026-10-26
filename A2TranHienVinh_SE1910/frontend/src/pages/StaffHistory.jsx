import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { newsApi } from '../api/newsApi';

const StaffHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (user && user.accountID) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await newsApi.getByStaffHistory(user.accountID);
      setHistory(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your news history.');
    } finally {
      setLoading(false);
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
        hour: '2-digit',
        minute: '2-digit',
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
            <i className="bi bi-clock-history text-info me-2"></i> My News History
          </h2>
          <p className="text-muted small mb-0">
            Staff role: Review all news articles published and created by you ({user?.accountName}).
          </p>
        </div>
        <Badge bg="info" className="px-3 py-2 text-dark fs-6">
          Total Contributed: {history.length}
        </Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="info" />
              <div className="mt-2 text-muted">Loading your created articles...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-journal-check display-4"></i>
              <h5 className="mt-2 fw-semibold">No articles created yet</h5>
              <p className="small">Go to News Management to author your first article.</p>
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
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Modified At</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((art) => (
                    <tr key={art.newsArticleID}>
                      <td className="ps-4" style={{ width: '80px' }}>
                        <img
                          src={`/images/${art.imageUrl || 'hodiep.jpg'}`}
                          alt="Cover"
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
                        <div className="fw-bold text-dark text-truncate">{art.newsTitle || art.headline}</div>
                        <div className="text-muted small text-truncate">{art.headline}</div>
                      </td>
                      <td>
                        <Badge bg="info" text="dark">
                          {art.categoryName || 'General'}
                        </Badge>
                      </td>
                      <td>
                        {art.newsStatus ? (
                          <Badge bg="success" pill>Active</Badge>
                        ) : (
                          <Badge bg="secondary" pill>Inactive</Badge>
                        )}
                      </td>
                      <td className="small text-muted">{formatDate(art.createdDate)}</td>
                      <td className="small text-muted">{formatDate(art.modifiedDate)}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="rounded-3"
                          onClick={() => setSelectedArticle(art)}
                        >
                          <i className="bi bi-eye me-1"></i> View
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

      {/* Detail Modal */}
      <Modal show={!!selectedArticle} onHide={() => setSelectedArticle(null)} size="lg" centered scrollable>
        {selectedArticle && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold fs-5">
                <Badge bg="info" text="dark" className="me-2">{selectedArticle.categoryName}</Badge>
                {selectedArticle.newsTitle || selectedArticle.headline}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="rounded-3 overflow-hidden mb-3" style={{ maxHeight: '280px' }}>
                <img
                  src={`/images/${selectedArticle.imageUrl || 'hodiep.jpg'}`}
                  alt="Thumb"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="alert alert-light border mb-3">
                <strong>Headline:</strong> {selectedArticle.headline}
              </div>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                {selectedArticle.newsContent || 'No full content available.'}
              </p>
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  <span className="text-muted small fw-semibold me-2">Tags:</span>
                  {selectedArticle.tags.map((t) => (
                    <Badge key={t.tagID} bg="secondary" className="me-1">
                      #{t.tagName}
                    </Badge>
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedArticle(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default StaffHistory;
