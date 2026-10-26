import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { newsApi } from '../api/newsApi';
import { categoryApi } from '../api/categoryApi';
import { accountApi } from '../api/accountApi';
import { tagApi } from '../api/tagApi';

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const [stats, setStats] = useState({
    articlesCount: 0,
    categoriesCount: 0,
    accountsCount: 0,
    tagsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [news, cats, tags] = await Promise.all([
          newsApi.search({}),
          categoryApi.getAll(),
          tagApi.getAll(),
        ]);

        let accs = [];
        if (isAdmin) {
          accs = await accountApi.getAll();
        }

        setStats({
          articlesCount: news ? news.length : 0,
          categoriesCount: cats ? cats.length : 0,
          accountsCount: accs ? accs.length : 5,
          tagsCount: tags ? tags.length : 0,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  return (
    <Container className="py-4">
      {/* Welcome Banner */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <Card.Body className="p-4 p-md-5">
          <Row className="align-items-center">
            <Col md={8}>
              <Badge bg={isAdmin ? 'danger' : 'primary'} className="px-3 py-2 mb-2">
                Logged in as {user?.roleName}
              </Badge>
              <h2 className="display-6 fw-bold mb-2">Welcome back, {user?.accountName}!</h2>
              <p className="text-light-50 mb-0" style={{ color: '#cbd5e1' }}>
                FUNews Management System - Assignment 02 SBA301 Full-Stack RESTful API & React client.
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button as={Link} to="/" variant="outline-light" className="rounded-pill px-4">
                <i className="bi bi-box-arrow-up-right me-1"></i> View Public Portal
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="g-4 mb-5">
            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 border-start border-4 border-primary">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted fw-semibold small text-uppercase">News Articles</span>
                    <div className="rounded-circle p-2 bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-file-earmark-text-fill fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1">{stats.articlesCount}</h3>
                  <small className="text-success"><i className="bi bi-check-circle me-1"></i>Live published items</small>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 border-start border-4 border-success">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted fw-semibold small text-uppercase">Categories</span>
                    <div className="rounded-circle p-2 bg-success bg-opacity-10 text-success">
                      <i className="bi bi-tags-fill fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1">{stats.categoriesCount}</h3>
                  <small className="text-muted">News category taxonomy</small>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 border-start border-4 border-warning">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted fw-semibold small text-uppercase">System Accounts</span>
                    <div className="rounded-circle p-2 bg-warning bg-opacity-10 text-warning">
                      <i className="bi bi-people-fill fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1">{stats.accountsCount}</h3>
                  <small className="text-muted">Admins and staff members</small>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-4 h-100 border-start border-4 border-info">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted fw-semibold small text-uppercase">Tags Available</span>
                    <div className="rounded-circle p-2 bg-info bg-opacity-10 text-info">
                      <i className="bi bi-hash fs-5"></i>
                    </div>
                  </div>
                  <h3 className="fw-bold mb-1">{stats.tagsCount}</h3>
                  <small className="text-muted">Keyword hashtags</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Action Navigation */}
          <h4 className="fw-bold mb-3">Quick Navigation</h4>
          <Row className="g-4">
            {isAdmin && (
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4 p-4 h-100 hover-shadow">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-3 p-3 bg-danger text-white">
                      <i className="bi bi-person-gear fs-4"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">System Account Management</h5>
                      <small className="text-muted">Admin Only feature</small>
                    </div>
                  </div>
                  <p className="text-muted mb-4">
                    Create, update, search, and delete staff & admin accounts. Protected by business rule preventing deletion of accounts with articles.
                  </p>
                  <Button as={Link} to="/admin/accounts" variant="danger" className="mt-auto rounded-pill px-4 align-self-start">
                    Go to Accounts <i className="bi bi-arrow-right ms-1"></i>
                  </Button>
                </Card>
              </Col>
            )}

            {isStaff && (
              <>
                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 h-100 hover-shadow">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 p-3 bg-primary text-white">
                        <i className="bi bi-newspaper fs-4"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">News Article Management</h5>
                        <small className="text-muted">Staff CRUD operations</small>
                      </div>
                    </div>
                    <p className="text-muted mb-4">
                      Create, update, search, and manage news articles, tags, status, and custom thumbnails from the images repository.
                    </p>
                    <Button as={Link} to="/staff/news" variant="primary" className="mt-auto rounded-pill px-4 align-self-start">
                      Manage Articles <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 h-100 hover-shadow">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 p-3 bg-success text-white">
                        <i className="bi bi-folder2-open fs-4"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">Category Management</h5>
                        <small className="text-muted">Taxonomy and Hierarchy</small>
                      </div>
                    </div>
                    <p className="text-muted mb-4">
                      Organize news into categories and sub-categories. Safeguarded by business rules against deleting categories with articles.
                    </p>
                    <Button as={Link} to="/staff/categories" variant="success" className="mt-auto rounded-pill px-4 align-self-start">
                      Manage Categories <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 h-100 hover-shadow">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 p-3 bg-info text-white">
                        <i className="bi bi-clock-history fs-4"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">My News History</h5>
                        <small className="text-muted">Personal contributions</small>
                      </div>
                    </div>
                    <p className="text-muted mb-4">
                      Review all articles authored specifically by your staff account ({user?.accountName}).
                    </p>
                    <Button as={Link} to="/staff/my-history" variant="info" className="mt-auto rounded-pill px-4 align-self-start text-white">
                      View My History <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
