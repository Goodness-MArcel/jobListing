import react from 'react';
import { Container , Row, Col } from 'react-bootstrap';

function Footer() {
    return (
         <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="mb-4">JobListing</h5>
              <p>Connecting talent with opportunity</p>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="text-white social-icon">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-white social-icon">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-white social-icon">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-white social-icon">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="mb-4">For Job Seekers</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Browse Jobs</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Career Advice</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Resume Tips</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Find Remote Jobs</a></li>
              </ul>
            </Col>
                        <Col lg={3} md={6}>
              <h5 className="mb-4">Company</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Contact Us</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Terms of Service</a></li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center text-white-50">
            <p>&copy; {new Date().getFullYear()} JobListing. All rights reserved Goodness.</p>
          </div>
        </Container>
      </footer>
    )
}

export default Footer;