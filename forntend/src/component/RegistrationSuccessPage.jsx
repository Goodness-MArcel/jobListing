import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './RegistrationSuccess.css'; // Create this CSS file
import Footer from './Footer.jsx'; // Import Footer component if needed
import CustomNavbar from './Navbar.jsx';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  // Optional: Redirect if directly accessed without registration
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  return (
   <>
   <CustomNavbar />
    <div className="success-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h2>Account Created Successfully!</h2>
        <p>Your account {email && `with email ${email}`} has been created.</p>
        <p>You can now log in to your account.</p>
        
        <button 
          onClick={() => navigate('/verify-email')}
          className="login-button"
        >
          Go to Login Page
        </button>
      </div>
    </div>
    <Footer />
   </>
  );
};

export default RegistrationSuccess;