// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand href="/" className="logo">JobListing</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/#how-it-works">How it Works</Nav.Link>
            <Nav.Link href="/#find-jobs">Find Jobs</Nav.Link>
            <Nav.Link href="/#for-employers">For Employers</Nav.Link>
          </Nav>
          <div className="d-flex">
            <Link to="/login" className="btn btn-outline-success me-2">Log In</Link>
            <Link to="/signup" className="btn btn-success">Sign Up</Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;