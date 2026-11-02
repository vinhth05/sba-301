import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <Container className="text-center text-md-start">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h6 className="text-warning fw-bold mb-1">FU Mini Hotel System (FUMiniHotelSystem)</h6>
            <p className="small text-secondary mb-0">
              SBA301 - Integrate Single Page Application with Spring Boot | Assignment 03
            </p>
          </div>
          <div className="col-md-6 text-md-end small text-secondary">
            <div>Sinh viên: <strong>Trần Hiển Vinh (CE190881)</strong> - Lớp: <strong>SE1910</strong></div>
            <div>Spring Boot 3 RESTful API &amp; Spring Security JWT &amp; ReactJS</div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

