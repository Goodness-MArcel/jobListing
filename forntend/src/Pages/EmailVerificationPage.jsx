import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../component/Footer.jsx';
import CustomNavbar from '../component/Navbar.jsx';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <>
      <CustomNavbar />
      <Container className="my-5">
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="text-center mb-4">Email Verification</h2>
          
          {status === 'verifying' && (
            <Alert variant="info" className="text-center">
              Verifying your email address...
            </Alert>
          )}

          {status === 'success' && (
            <>
              <Alert variant="success" className="text-center">
                {message}
              </Alert>
              <div className="text-center mt-4">
                <Button 
                  variant="primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <Alert variant="danger" className="text-center">
                {message}
              </Alert>
              <div className="text-center mt-4">
                <Button 
                  variant="primary"
                  onClick={() => navigate('/resend-verification')}
                >
                  Resend Verification Email
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default EmailVerificationPage;