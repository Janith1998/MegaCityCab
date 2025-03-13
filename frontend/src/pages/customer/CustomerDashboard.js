import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookRide from './BookRide'; // Import the BookRide component
import '../customer/CustomerDashboard.css';

function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { car } = location.state || {}; // Retrieve car data from navigation state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookRide, setShowBookRide] = useState(!!car); // Automatically show BookRide if car data is present
  const [bookings, setBookings] = useState([]); // State to store bookings

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem('userId');
      console.log('User ID from localStorage:', userId);
      if (!userId) {
        console.error('User ID not found. Redirecting to login...');
        // navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/bookings/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data); // Set the fetched bookings to state
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to homepage after logout
  };

  const handleBookRideClick = () => {
    setShowBookRide(true); // Show the BookRide component
  };

  const handleDashboardClick = () => {
    setShowBookRide(false); // Show the default dashboard content
  };

  // Handle view booking action
  const handleViewBooking = (bookingId) => {
    navigate(`/booking/${bookingId}`); // Navigate to booking details page
  };

  // Handle update booking action
  const handleUpdateBooking = (bookingId) => {
    navigate(`/booking/update/${bookingId}`); // Navigate to update booking page
  };

  // Handle delete booking action
  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }
      // Remove the deleted booking from the state
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
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
                      <div className="card-body"  style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Booking ID</th>
                              <th>Pickup Location</th>
                              <th>Dropoff Location</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id}>
                                <td>{booking.bookingId}</td> {/* Use booking.bookingId instead of booking.id */}
                                <td>{booking.pickupLocation}</td>
                                <td>{booking.dropoffLocation}</td>
                                <td>Rs {booking.price.toFixed(2)}</td>
                                <td>
                                  <span className={`badge bg-${booking.status === 'Completed' ? 'success' : booking.status === 'Pending' ? 'warning' : 'danger'}`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleViewBooking(booking.id)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleUpdateBooking(booking.id)}
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteBooking(booking.id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
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