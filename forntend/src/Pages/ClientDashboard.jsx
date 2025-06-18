import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Client_HeaderBar from "../component/Client_HeaderBar.jsx";
import Footer from "../component/Footer.jsx";
import "../styles/clientdashbord.css";
// import {useSocket} from '../context/SocketContext.jsx';

// Lazy-loaded components
const ProjectList = lazy(() => import("../component/Project_list.jsx"));
const ClientProjectform = lazy(() => import("../component/Client_ProjectForm.jsx"));
const ChatSidebar = lazy(() => import("../component/ChatSidebar.jsx"));

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user: contextUser } = useOutletContext() || {};
  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalBids: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //  const { joinClientRoom, connected } = useSocket();

  // useEffect(() => {
  //   // Join client-specific room when dashboard loads
  //   const clientId = localStorage.getItem("client_id") || sessionStorage.getItem("client_id");
  //   if (clientId && connected) {
  //     joinClientRoom(clientId);
  //   }
  // }, [connected, joinClientRoom]);

  useEffect(() => {
    // Get user data from context or localStorage
    let userData = null;
    
    if (contextUser) {
      userData = contextUser;
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (err) {
          console.error('Error parsing stored user data:', err);
          localStorage.removeItem('user');
          navigate("/login");
          return;
        }
      }
    }

    if (!userData) {
      navigate("/login");
      return;
    }

    // Check if user is a client
    if (userData.role !== "client") {
      navigate("/login");
      return;
    }

    setUser(userData);
  }, [contextUser, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch dashboard stats from your API
        // For now, we'll use mock data since the endpoint might not exist yet
        const response = await axios.get(
          "http://localhost:3000/api/auth/client/dashboard",
          { withCredentials: true }
        );
        
        if (response.data.status === 'success') {
          setDashboardStats(response.data.stats || dashboardStats);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        
        // If the endpoint doesn't exist, use mock data for now
        if (err.response?.status === 404) {
          console.log("Dashboard endpoint not found, using mock data");
          setDashboardStats({
            activeProjects: 3,
            completedProjects: 12,
            totalBids: 45,
            totalSpent: 15750
          });
        } else {
          setError("Failed to load dashboard data");
          
          if (err.response?.status === 401) {
            localStorage.removeItem('user');
            navigate("/login");
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and redirect regardless of API response
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        {error}
        <button className="btn btn-link" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <div className="min-vh-100 dashboardContainer mb-5" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <Suspense fallback={<Loading />}>
          <Client_HeaderBar 
            userName={`${user.firstName} ${user.lastName}`} 
            userEmail={user.email}
            onLogout={handleLogout}
          />
        </Suspense>

        <div className="container-fluid px-4 mt-4">
          <div className="row g-4">
            {/* Main Content Area */}
            <div className="col-xl-8 col-lg-7">
              {/* Welcome Section */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h2 className="card-title text-dark mb-3">
                    Welcome back, {user.firstName}! 👋
                  </h2>
                  <p className="text-muted mb-0">
                    Manage your projects, review bids, and connect with talented freelancers.
                  </p>
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-primary mb-2">
                        <i className="fas fa-project-diagram fa-2x"></i>
                      </div>
                      <h4 className="fw-bold text-dark">{dashboardStats.activeProjects}</h4>
                      <small className="text-muted">Active Projects</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-success mb-2">
                        <i className="fas fa-check-circle fa-2x"></i>
                      </div>
                      <h4 className="fw-bold text-dark">{dashboardStats.completedProjects}</h4>
                      <small className="text-muted">Completed</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-warning mb-2">
                        <i className="fas fa-users fa-2x"></i>
                      </div>
                      <h4 className="fw-bold text-dark">{dashboardStats.totalBids}</h4>
                      <small className="text-muted">Total Bids</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="text-info mb-2">
                        <i className="fas fa-dollar-sign fa-2x"></i>
                      </div>
                      <h4 className="fw-bold text-dark">${dashboardStats.totalSpent.toLocaleString()}</h4>
                      <small className="text-muted">Total Spent</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post New Project Section */}
              <Suspense fallback={<Loading />}>
                <ClientProjectform 
                  userId={user.id} 
                  userName={`${user.firstName} ${user.lastName}`}
                />
              </Suspense>

              {/* My Projects Section */}
              <Suspense fallback={<Loading />}>
                <ProjectList 
                  clientId={user.id} 
                  clientName={`${user.firstName} ${user.lastName}`}
                />
              </Suspense>
            </div>

            {/* Right Sidebar - Chat Section */}
            <div className="col-xl-4 col-lg-5">
              {/* User Info Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-user me-2"></i>
                    Account Info
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-white fw-bold fs-5">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col">
                      <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning'}`}>
                        {user.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Sidebar */}
              <Suspense fallback={<Loading />}>
                <ChatSidebar 
                  userId={user.id} 
                  userName={`${user.firstName} ${user.lastName}`}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClientDashboard;
