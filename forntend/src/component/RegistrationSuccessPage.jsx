import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import './RegistrationSuccess.css';
import Footer from './Footer.jsx';
import CustomNavbar from './Navbar.jsx';
import { Alert, Button } from 'react-bootstrap';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const verified = searchParams.get('verified') === 'true';
  const [resendStatus, setResendStatus] = useState(null);

  // Redirect if directly accessed without email
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleResendVerification = async () => {
    try {
      setResendStatus('sending');
      const response = await axios.post('https://joblisting-backend-m2wa.onrender.com/api/auth/resend-verification', { email });
      setResendStatus('success');
    } catch (error) {
      setResendStatus('error');
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="success-container">
        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h2>Account Created Successfully!</h2>
          
          <p>Your account {email && `with email ${email}`} has been created.</p>

          {!verified && (
            <>
              <div className="verification-alert">
                <FaEnvelope className="verification-icon" />
                <p>
                  We've sent a verification email to <strong>{email}</strong>.
                  Please check your inbox and click the verification link.
                </p>
              </div>

              <div className="verification-footer">
                <p>Didn't receive the email?</p>
                <Button
                  variant="outline-primary"
                  onClick={handleResendVerification}
                  disabled={resendStatus === 'sending'}
                >
                  {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
                </Button>

                {resendStatus === 'success' && (
                  <Alert variant="success" className="mt-2">
                    Verification email resent successfully!
                  </Alert>
                )}
                {resendStatus === 'error' && (
                  <Alert variant="danger" className="mt-2">
                    Failed to resend verification email. Please try again later.
                  </Alert>
                )}
              </div>
            </>
          )}

          <Button 
            variant="primary"
            onClick={() => navigate('/login')}
            className="login-button"
          >
            Go to Login Page
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationSuccess;