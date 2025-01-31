import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100">
          <div className="d-flex flex-column align-items-start p-3">
            <h3 className="text-white mb-4">MegaCity Cab</h3>
            <ul className="nav flex-column w-100">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link text-white">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/manage-drivers" className="nav-link text-white">Manage Drivers</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/manage-customers" className="nav-link text-white">Manage Customers</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/reports" className="nav-link text-white">Manage Cars</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/settings" className="nav-link text-white">Settings</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h4>Welcome to the Admin Dashboard</h4>
                  </div>
                  <div className="card-body">
                    <p>Manage drivers, customers, view reports, and more.</p>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="card text-white bg-success mb-3">
                          <div className="card-body">
                            <h5 className="card-title">Active Drivers</h5>
                            <p className="card-text">View and manage all active drivers.</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="card text-white bg-warning mb-3">
                          <div className="card-body">
                            <h5 className="card-title">Active Customers</h5>
                            <p className="card-text">View and manage all active customers.</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="card text-white bg-info mb-3">
                          <div className="card-body">
                            <h5 className="card-title">Pending Bookings</h5>
                            <p className="card-text">View and manage all pending bookings.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
