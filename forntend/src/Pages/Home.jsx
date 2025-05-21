import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Button, Form, Card, Carousel } from 'react-bootstrap';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="#" className="logo">JobListing</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#how-it-works">How it Works</Nav.Link>
              <Nav.Link href="#find-jobs">Find Jobs</Nav.Link>
              <Nav.Link href="#for-employers">For Employers</Nav.Link>
            </Nav>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-success me-2">Log In</Link>
              <Link to="/signup" className="btn btn-success">Sign Up</Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold text-success mb-4">Find the perfect job for your skills</h1>
              <p className="lead mb-4">Connect with top employers and get hired for remote, contract, or full-time positions</p>
              
              <Form className="mb-3">
                <Row>
                  <Col xs={12} md={8} className="mb-2 mb-md-0">
                    <Form.Control 
                      size="lg"
                      type="text" 
                      placeholder="Search for jobs (e.g. Web Developer, Designer)" 
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <Button variant="success" size="lg" className="w-100">Search</Button>
                  </Col>
                </Row>
              </Form>
              
              <div className="popular-searches">
                <span className="text-muted me-2">Popular:</span>
                <a href="#web-dev" className="text-success me-3">Web Development</a>
                <a href="#design" className="text-success me-3">Design</a>
                <a href="#marketing" className="text-success me-3">Marketing</a>
                <a href="#data-science" className="text-success">Data Science</a>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img src="/images/landing.svg" alt="Job seekers" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5" id="how-it-works">
        <Container>
          <h2 className="display-5 text-center mb-5">How JobListing Works</h2>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm step-card">
                <Card.Body className="text-center p-4">
                  <div className="step-icon mb-4 mx-auto">1</div>
                  <Card.Title className="mb-3">Create your profile</Card.Title>
                  <Card.Text className="text-muted">
                    Sign up and showcase your skills, experience, and portfolio
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm step-card">
                <Card.Body className="text-center p-4">
                  <div className="step-icon mb-4 mx-auto">2</div>
                  <Card.Title className="mb-3">Find relevant jobs</Card.Title>
                  <Card.Text className="text-muted">
                    Browse jobs that match your skills and preferences
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm step-card">
                <Card.Body className="text-center p-4">
                  <div className="step-icon mb-4 mx-auto">3</div>
                  <Card.Title className="mb-3">Apply with ease</Card.Title>
                  <Card.Text className="text-muted">
                    Submit applications and track your progress
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm step-card">
                <Card.Body className="text-center p-4">
                  <div className="step-icon mb-4 mx-auto">4</div>
                  <Card.Title className="mb-3">Get hired</Card.Title>
                  <Card.Text className="text-muted">
                    Connect with employers and start working
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Job Categories Section */}
      <section className="py-5 bg-light" id="find-jobs">
        <Container>
          <h2 className="display-5 text-center mb-5">Explore Job Categories</h2>
          <Row>
            {[
              { icon: '/images/web.svg', title: 'Web Development', count: '1,234' },
              { icon: '/images/design.svg', title: 'Design', count: '867' },
              { icon: '/images/marketing.svg', title: 'Marketing', count: '543' },
              { icon: '/images/mobile.svg', title: 'Mobile Development', count: '432' },
              { icon: '/images/data.svg', title: 'Data Science', count: '321' },
              { icon: '/images/content.svg', title: 'Content Writing', count: '654' }
            ].map((category, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm category-card">
                  <Card.Body className="text-center p-4">
                    <div className="category-icon mb-3"><img src={category.icon} alt={category.title} width="80" height="80" /></div>
                    <Card.Title className="mb-2">{category.title}</Card.Title>
                    <Card.Text className="text-success">{category.count} jobs available</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* For Employers Section */}
      <section className="py-5" id="for-employers">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h2 className="display-5 mb-4">For Employers</h2>
              <p className="lead mb-4">Find the perfect talent for your projects and positions</p>
              <ul className="list-unstyled mb-5">
                {[
                  'Access a global pool of skilled professionals',
                  'Post jobs and receive applications quickly',
                  'Review detailed profiles and portfolios',
                  'Hire with confidence using our platform tools'
                ].map((benefit, index) => (
                  <li key={index} className="mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button variant="success" size="lg">Post a Job</Button>
            </Col>
            <Col lg={6} className="text-center">
              <img src="/images/employer.svg" alt="Employers hiring" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="display-5 text-center mb-5">What People Say About Us</h2>
          <Carousel variant="dark" indicators={false} className="testimonial-carousel">
            <Carousel.Item>
              <Row className="justify-content-center">
                <Col lg={8} md={10}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-5 text-center">
                      <p className="lead fst-italic mb-4">"I found my dream job within a week of signing up. The platform is intuitive and the job matches were spot on!"</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <img src="/images/woman1.jpeg" alt="User avatar" className="rounded-circle me-3" width="60" height="60" />
                        <div className="text-start">
                          <h5 className="mb-1">Sarah Johnson</h5>
                          <p className="text-muted mb-0">Web Developer</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
            <Carousel.Item>
              <Row className="justify-content-center">
                <Col lg={8} md={10}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-5 text-center">
                      <p className="lead fst-italic mb-4">"As an employer, I've been able to find qualified candidates quickly. The filtering options make it easy to find the right fit."</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <img src="/images/man1.jpeg" alt="User avatar" className="rounded-circle me-3 image-fluid" width="60" height="60" />
                        <div className="text-start">
                          <h5 className="mb-1">Michael Chen</h5>
                          <p className="text-muted mb-0">Tech Startup Founder</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
            <Carousel.Item>
              <Row className="justify-content-center">
                <Col lg={8} md={10}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-5 text-center">
                      <p className="lead fst-italic mb-4">"The platform's user experience is excellent. I especially love how easy it is to track my job applications."</p>
                      <div className="d-flex align-items-center justify-content-center">
                        <img src="/images/woman2.jpeg" alt="User avatar" className="rounded-circle me-3" width="60" height="60" />
                        <div className="text-start">
                          <h5 className="mb-1">Jessica Williams</h5>
                          <p className="text-muted mb-0">UX Designer</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-success text-white text-center">
        <Container>
          <h2 className="display-5 mb-3">Ready to find your next opportunity?</h2>
          <p className="lead mb-5">Join thousands of professionals who have found their ideal jobs through JobListing</p>
          <Row className="justify-content-center">
            <Col md={6} lg={4} xl={3} className="mb-3 mb-md-0">
              <Link to="/signup" className="btn btn-light btn-lg w-100 fw-bold text-success">Create an Account</Link>
            </Col>
            <Col md={6} lg={4} xl={3}>
              <Link to="/browse-jobs" className="btn btn-outline-light btn-lg w-100">Browse Jobs</Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
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
            <p>&copy; {new Date().getFullYear()} JobListing. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

