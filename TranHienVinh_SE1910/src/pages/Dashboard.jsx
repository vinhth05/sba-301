import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { dataService } from '../services/dataService';
import { FaList, FaNewspaper, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const categories = dataService.getCategories();
  const news = dataService.getNews();
  const users = dataService.getUsers();

  const stats = [
    { title: 'Total Categories', value: categories.length, icon: <FaList size={30} className="text-primary"/>, bg: 'bg-primary-subtle' },
    { title: 'Total News Articles', value: news.length, icon: <FaNewspaper size={30} className="text-success"/>, bg: 'bg-success-subtle' },
    { title: 'Total Users', value: users.length, icon: <FaUsers size={30} className="text-warning"/>, bg: 'bg-warning-subtle' },
  ];

  return (
    <div>
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      <Row>
        {stats.map((stat, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className={`border-0 shadow-sm h-100 ${stat.bg} rounded-4`}>
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <h6 className="text-muted text-uppercase mb-2">{stat.title}</h6>
                  <h2 className="fw-bold mb-0">{stat.value}</h2>
                </div>
                <div className="p-3 bg-white rounded-circle shadow-sm">
                  {stat.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
