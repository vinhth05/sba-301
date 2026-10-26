import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { newsApi } from '../api/newsApi';
import { categoryApi } from '../api/categoryApi';

const PublicNews = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected article for reading detail popup dialog
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      const [articlesData, categoriesData] = await Promise.all([
        newsApi.getActive(),
        categoryApi.getAll(),
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load news articles from server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchCat = selectedCategory === '' || String(art.categoryID) === String(selectedCategory);
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      (art.newsTitle && art.newsTitle.toLowerCase().includes(term)) ||
      (art.headline && art.headline.toLowerCase().includes(term)) ||
      (art.newsContent && art.newsContent.toLowerCase().includes(term));
    return matchCat && matchSearch;
  });

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
    <div>
      {/* Hero Header Section */}
      <div
        className="text-white py-5 mb-5 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <Badge bg="warning" text="dark" className="px-3 py-2 mb-3 fw-bold">
                <i className="bi bi-broadcast me-1"></i> Public News Portal
              </Badge>
              <h1 className="display-5 fw-bold mb-3">FU News & Article Hub</h1>
              <p className="lead text-light-50 mb-0" style={{ color: '#cbd5e1' }}>
                Explore official announcements, research initiatives, alumni milestones, and campus life stories from University FU.
              </p>
            </Col>
            <Col lg={4} className="mt-4 mt-lg-0 text-lg-end">
              <div className="p-3 rounded-4 bg-white bg-opacity-10 backdrop-blur d-inline-block text-start">
                <div className="small text-warning fw-semibold">GUEST ACCESS</div>
                <div className="fs-6 text-light">No login required to view published articles</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mb-5">
        {/* Search & Filter Bar */}
        <Card className="border-0 shadow-sm rounded-4 mb-4" style={{ marginTop: '-45px' }}>
          <Card.Body className="p-4">
            <Row className="g-3">
              <Col md={7}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-0">
                    <i className="bi bi-search text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search news by title, headline, or keywords..."
                    className="bg-light border-0 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button variant="light" onClick={() => setSearchTerm('')} className="border-0">
                      <i className="bi bi-x-circle text-muted"></i>
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={5}>
                <Form.Select
                  className="bg-light border-0 py-2"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories ({categories.length})</option>
                  {categories.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="rounded-3 shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
            </div>
            <Button variant="outline-danger" size="sm" onClick={fetchInitialData}>
              Retry
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-3 text-muted">Loading latest news articles...</div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4 shadow-sm my-4">
            <i className="bi bi-newspaper display-3 text-muted"></i>
            <h4 className="mt-3 fw-bold">No active news found</h4>
            <p className="text-muted">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search criteria or filter to see more results.'
                : 'There are currently no active news articles available.'}
            </p>
            {(searchTerm || selectedCategory) && (
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <Row className="g-4">
            {filteredArticles.map((article) => {
              const imgFile = article.imageUrl || 'hodiep.jpg';
              return (
                <Col md={6} lg={4} key={article.newsArticleID}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column transition-hover">
                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                      <img
                        src={`/images/${imgFile}`}
                        alt={article.newsTitle || 'News'}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/hodiep.jpg';
                        }}
                      />
                      <Badge
                        bg="dark"
                        className="position-absolute top-0 start-0 m-3 px-3 py-2 bg-opacity-75 backdrop-blur rounded-pill"
                      >
                        {article.categoryName || 'General'}
                      </Badge>
                      <Badge
                        bg="success"
                        className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill"
                      >
                        Active
                      </Badge>
                    </div>

                    <Card.Body className="d-flex flex-column p-4 flex-grow-1">
                      <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                        <span>
                          <i className="bi bi-calendar3 me-1"></i> {formatDate(article.createdDate)}
                        </span>
                        <span>•</span>
                        <span>
                          <i className="bi bi-person-circle me-1"></i> {article.createdByName || 'Staff'}
                        </span>
                      </div>

                      <h5 className="fw-bold mb-2 text-dark line-clamp-2" title={article.newsTitle}>
                        {article.newsTitle || article.headline}
                      </h5>

                      <p className="text-muted small line-clamp-3 mb-3 flex-grow-1">
                        {article.headline}
                      </p>

                      {article.tags && article.tags.length > 0 && (
                        <div className="mb-3 d-flex flex-wrap gap-1">
                          {article.tags.map((t) => (
                            <Badge key={t.tagID} bg="light" text="dark" className="border">
                              #{t.tagName}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Source: <span className="fw-semibold">{article.newsSource || 'FU Official'}</span>
                        </small>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-3 fw-semibold"
                          onClick={() => setSelectedArticle(article)}
                        >
                          Read Article <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* Article Detail Popup Dialog (Modal) */}
      <Modal
        show={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        size="lg"
        centered
        scrollable
      >
        {selectedArticle && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Badge bg="primary" className="mb-2 px-3 py-2">
                {selectedArticle.categoryName}
              </Badge>
            </Modal.Header>
            <Modal.Body className="pt-2 px-4 pb-4">
              <h3 className="fw-bold text-dark mb-3">{selectedArticle.newsTitle || selectedArticle.headline}</h3>

              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-4 pb-3 border-bottom">
                <span>
                  <i className="bi bi-calendar3 me-1"></i> Published: {formatDate(selectedArticle.createdDate)}
                </span>
                <span>
                  <i className="bi bi-person-circle me-1"></i> Author: <strong>{selectedArticle.createdByName || 'Staff'}</strong>
                </span>
                {selectedArticle.newsSource && (
                  <span>
                    <i className="bi bi-link-45deg me-1"></i> Source: {selectedArticle.newsSource}
                  </span>
                )}
                {selectedArticle.modifiedDate && (
                  <span>
                    <i className="bi bi-pencil-square me-1"></i> Modified: {formatDate(selectedArticle.modifiedDate)}
                  </span>
                )}
              </div>

              {/* Cover Image */}
              <div className="mb-4 rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '380px' }}>
                <img
                  src={`/images/${selectedArticle.imageUrl || 'hodiep.jpg'}`}
                  alt={selectedArticle.newsTitle}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hodiep.jpg';
                  }}
                />
              </div>

              <div className="p-3 bg-light rounded-3 mb-4 border-start border-4 border-primary">
                <div className="fw-semibold text-secondary small text-uppercase mb-1">Headline</div>
                <div className="fs-6 text-dark fw-medium">{selectedArticle.headline}</div>
              </div>

              <div className="text-dark fs-6" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                {selectedArticle.newsContent || 'No full content available for this article.'}
              </div>

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <div className="fw-bold small text-muted text-uppercase mb-2">Related Tags:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedArticle.tags.map((t) => (
                      <Badge key={t.tagID} bg="secondary" className="px-3 py-2 rounded-pill">
                        #{t.tagName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button variant="secondary" onClick={() => setSelectedArticle(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PublicNews;
