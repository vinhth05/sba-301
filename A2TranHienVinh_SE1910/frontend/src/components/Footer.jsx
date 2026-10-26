import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 text-secondary" style={{ backgroundColor: '#0b1120', borderTop: '1px solid #1e293b' }}>
      <Container>
        <Row className="align-items-center text-center text-md-start gy-3">
          <Col md={6}>
            <div className="fw-bold text-light">FUNews Management System</div>
            <div className="small">Assignment 02 • SBA301 - Full-Stack RESTful API & ReactJS</div>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="text-light fw-semibold">Sinh viên: Trần Hiển Vinh (CE190881)</div>
            <div className="small">Lớp: SE1910 • Database: <code className="text-info">A2TranHienVinh_SE1910</code></div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
