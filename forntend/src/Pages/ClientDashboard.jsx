import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Client_HeaderBar from "../component/Client_HeaderBar.jsx";
import Footer from "../component/Footer.jsx";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext
import "../styles/clientdashbord.css";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalBids: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "https://joblisting-backend-m2wa.onrender.com/api/client/dashboard",
          { withCredentials: true }
        );
        setDashboardStats(response.data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate, logout]);

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

  return (
    <>
      <div className="min-vh-100 dashboardContainer mb-5" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <Suspense fallback={<Loading />}>
          <Client_HeaderBar userName={user?.firstName || "Client"} />
        </Suspense>

        <div className="container-fluid px-4 mt-4">
          <div className="row g-4">
            {/* Main Content Area */}
            <div className="col-xl-8 col-lg-7">
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
                <ClientProjectform userId={user?.id} />
              </Suspense>

              {/* My Projects Section */}
              <Suspense fallback={<Loading />}>
                <ProjectList clientId={user?.id} />
              </Suspense>
            </div>

            {/* Right Sidebar - Chat Section */}
            <div className="col-xl-4 col-lg-5">
              <Suspense fallback={<Loading />}>
                <ChatSidebar userId={user?.id} />
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