import { Suspense , lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Client_HeaderBar from '../component/Client_HeaderBar.jsx';
const ProjectList = lazy(() => import('../component/Project_list.jsx'));
const  ClientProjectform = lazy(()=> import('../component/Client_ProjectForm.jsx'))
const ChatSidebar = lazy(()=>import('../component/ChatSidebar.jsx'))
import '../styles/clientdashbord.css'; 

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
const ClientDashboard = () => {
  return (
    <div className="min-vh-100 dashboardContainer" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
     
      <Suspense fallback={<Loading />}>
         <Client_HeaderBar userName="John Doe" />
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
                    <h4 className="fw-bold text-dark">12</h4>
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
                    <h4 className="fw-bold text-dark">8</h4>
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
                    <h4 className="fw-bold text-dark">24</h4>
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
                    <h4 className="fw-bold text-dark">$15.2K</h4>
                    <small className="text-muted">Total Spent</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Post New Project Section */}
            <Suspense fallback={<Loading />}>
              <ClientProjectform />
            </Suspense>
          
            
            {/* My Projects Section */}
            
            <Suspense fallback={<Loading />}>
             <ProjectList />
            </Suspense>
          </div>

          {/* Right Sidebar - Chat Section */}
          <div className="col-xl-4 col-lg-5">
            <Suspense fallback={<Loading />}>
              <ChatSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
