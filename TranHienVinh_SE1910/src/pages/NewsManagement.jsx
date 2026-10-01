import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Modal, InputGroup, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { dataService } from '../services/dataService';
import ConfirmDialog from '../components/ConfirmDialog';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNews, setCurrentNews] = useState({ id: '', title: '', content: '', categoryId: '', createdBy: 'Admin', status: 1, tags: '' });
  const [formError, setFormError] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setNews(dataService.getNews());
    setCategories(dataService.getCategories());
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) || 
    (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase().trim()))
  );

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  const openAddModal = () => {
    setCurrentNews({ id: '', title: '', content: '', categoryId: categories[0]?.id || '', createdBy: dataService.getCurrentUser()?.username || 'Admin', status: 1, tags: '' });
    setIsEditMode(false);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setCurrentNews({ ...item });
    setIsEditMode(true);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!currentNews.title.trim() || !currentNews.categoryId) {
      setFormError('Title and Category are required');
      return;
    }
    if (isEditMode) {
      dataService.updateNews(currentNews.id, currentNews);
    } else {
      const newId = 'n' + Date.now();
      dataService.addNews({ ...currentNews, id: newId });
    }
    setShowModal(false);
    loadData();
  };

  const confirmDelete = (id) => {
    setNewsToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    dataService.deleteNews(newsToDelete);
    setShowConfirm(false);
    loadData();
  };

  return (
    <div>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">News Management</h4>
            <Button variant="primary" onClick={openAddModal} className="rounded-3">
              <FaPlus className="me-2" /> Add News
            </Button>
          </div>

          <InputGroup className="mb-4 w-50">
            <InputGroup.Text className="bg-white"><FaSearch className="text-muted"/></InputGroup.Text>
            <Form.Control
              placeholder="Search news by title or content..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-start-0 ps-0"
            />
          </InputGroup>

          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map(item => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.title}</td>
                    <td>{getCategoryName(item.categoryId)}</td>
                    <td className="text-muted">{item.createdBy}</td>
                    <td>
                      <Badge bg={item.status === 1 ? 'success' : 'secondary'} pill>
                        {item.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" className="me-2 rounded-circle" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => confirmDelete(item.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No news articles found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit News Article' : 'Add News Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="text-danger mb-3 small">{formError}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={currentNews.title} 
                onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={currentNews.categoryId} 
                    onChange={(e) => setCurrentNews({...currentNews, categoryId: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={currentNews.status} 
                    onChange={(e) => setCurrentNews({...currentNews, status: parseInt(e.target.value)})}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. tech, new"
                value={currentNews.tags} 
                onChange={(e) => setCurrentNews({...currentNews, tags: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5}
                value={currentNews.content} 
                onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog 
        show={showConfirm} 
        onHide={() => setShowConfirm(false)} 
        onConfirm={handleDelete}
        title="Delete News Article"
        body="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
};

export default NewsManagement;
