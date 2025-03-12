import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookRide from './BookRide'; // Import the BookRide component
import '../customer/CustomerDashboard.css';

function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { car } = location.state || {}; // Retrieve car data from navigation state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookRide, setShowBookRide] = useState(!!car); // Automatically show BookRide if car data is present

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/'); // Redirect to homepage after logout
  };

  const handleBookRideClick = () => {
    setShowBookRide(true); // Show the BookRide component
  };

  const handleDashboardClick = () => {
    setShowBookRide(false); // Show the default dashboard content
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100 ${isSidebarOpen ? 'open' : ''}`}>
          <div className="d-flex flex-column align-items-start p-3">
            <h3 className="text-white mb-4">MegaCity Cab</h3>
            <button
              className="navbar-toggler d-md-none text-white mb-3"
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className={`bi bi-${isSidebarOpen ? 'x' : 'list'}`}></i>
            </button>
            <ul className="nav flex-column w-100">
              <li className="nav-item">
                <button
                  className={`nav-link text-white btn btn-link p-0 text-start ${!showBookRide ? 'active' : ''}`}
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-white btn btn-link p-0 text-start ${showBookRide ? 'active' : ''}`}
                  onClick={handleBookRideClick}
                >
                  Book a Ride
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link p-0 text-start">
                  Booking History
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link p-0 text-start">
                  Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-white btn btn-link p-0 text-start"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="container-fluid">
            {/* Welcome Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h4 className="card-title">Welcome Back, {localStorage.getItem('userName')}!</h4>
                    <p className="card-text">Here's what's happening with your account today.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Rendering */}
            {showBookRide ? (
              // Show BookRide component with car data
              <BookRide car={car} />
            ) : (
              // Show Default Dashboard Content
              <>
                {/* Quick Actions */}
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Book a Ride</h5>
                        <p className="card-text">Quickly book a ride to your destination.</p>
                        <button
                          className="btn btn-light"
                          onClick={handleBookRideClick}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                      <div className="card-body">
                        <h5 className="card-title">View History</h5>
                        <p className="card-text">Check your past bookings and receipts.</p>
                        <button className="btn btn-light">View History</button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-white bg-info mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Update Profile</h5>
                        <p className="card-text">Manage your account details and preferences.</p>
                        <button className="btn btn-light">Update Profile</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-secondary text-white">
                        <h5>Recent Bookings</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Booking ID</th>
                              <th>Date</th>
                              <th>Pickup Location</th>
                              <th>Dropoff Location</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>#12345</td>
                              <td>2023-10-01</td>
                              <td>Colombo</td>
                              <td>Kandy</td>
                              <td><span className="badge bg-success">Completed</span></td>
                            </tr>
                            <tr>
                              <td>#12346</td>
                              <td>2023-10-05</td>
                              <td>Galle</td>
                              <td>Colombo</td>
                              <td><span className="badge bg-warning">In Progress</span></td>
                            </tr>
                            <tr>
                              <td>#12347</td>
                              <td>2023-10-10</td>
                              <td>Negombo</td>
                              <td>Colombo</td>
                              <td><span className="badge bg-danger">Cancelled</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;