import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { MdCancel, MdVisibility, MdEdit } from 'react-icons/md'; // Import icons
import ManageCars from './forms/ManageCars';
import ViewCars from './forms/ViewCars';
import ManageDriver from './forms/ManageDriver';

function AdminDashboard() {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [bookings, setBookings] = useState([]); // State to store all bookings
  const [drivers, setDrivers] = useState([]); // State to store all drivers
  const navigate = useNavigate();

  // Fetch all bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/bookings');
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

  // Fetch all users with role = "Driver" from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/drivers');
        if (!response.ok) {
          throw new Error('Failed to fetch drivers');
        }
        const data = await response.json();
        setDrivers(data); // Set the fetched drivers to state
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };


    const handleToggleCollapse = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };


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

  // Handle assigning a driver to a booking
  const handleAssignDriver = async (bookingId, userId) => {
    try {
      const response = await fetch(`http://localhost:8080/bookings/${bookingId}/assign-driver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign driver');
      }

      // Update the booking in the state
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, userId, status: 'Assigned' } : booking
      );
      setBookings(updatedBookings);

      alert('Driver assigned successfully!');
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver');
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: 'Booking ID',
      selector: row => row.bookingId,
      sortable: true,
    },
    {
      name: 'Driver',
      cell: row => (
        <select
          className="form-select"
          style={{ width: '150px', fontSize: '14px', padding: '5px' }}
          value={row.userId || ''}
          onChange={(e) => handleAssignDriver(row.id, e.target.value)}
        >
          <option value="">Select Driver</option>
          {drivers.map((driver) => (
            <option key={driver.userId} value={driver.userId}>
              {driver.name} ({driver.userId})
            </option>
          ))}
        </select>
      ),
      sortable: true,
    },
    {
      name: 'Pickup Location',
      selector: row => row.pickupLocation,
      sortable: true,
    },
    {
      name: 'Dropoff Location',
      selector: row => row.dropoffLocation,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => `Rs ${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span className={`badge bg-${row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <MdVisibility
            className="text-primary cursor-pointer"
            size={20}
            title="View"
            onClick={() => handleViewBooking(row.id)}
          />
          <MdEdit
            className="text-warning cursor-pointer"
            size={20}
            title="Update"
            onClick={() => handleUpdateBooking(row.id)}
          />
          <MdCancel
            className="text-danger cursor-pointer"
            size={20}
            title="Delete"
            onClick={() => handleDeleteBooking(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
      //allowOverflow: true,
      //button: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100">
          <div className="d-flex flex-column align-items-start p-3">
            <h3 className="text-white mb-4" style={{ fontSize: '24px' }}>MegaCity Cab</h3>
            <ul className="nav flex-column w-100">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link text-white" style={{ fontSize: '14px' }}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/forms/ManageDriver" className="nav-link text-white" style={{ fontSize: '14px' }}>Manage Drivers</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/manage-customers" className="nav-link text-white" style={{ fontSize: '14px' }}>Manage Customers</Link>
              </li>
              <li className="nav-item" onClick={handleToggleCollapse}>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/admin/forms" className="nav-link text-white" style={{ fontSize: '14px' }}>Manage Cars</Link>
                  <i className={`bi bi-chevron-${isCollapseOpen ? 'up' : 'down'} text-white`}></i>
                </div>
              </li>
              {isCollapseOpen && (
                <div className="collapse show" id="collapseExample">
                  <li className="nav-item">
                    <Link to="/admin/forms/viewCar" className="nav-link text-white" style={{ fontSize: '14px' }}>All Cars</Link>
                  </li>
                </div>
              )}
              <li className="nav-item">
                <Link to="/admin/settings" className="nav-link text-white" style={{ fontSize: '14px' }}>Settings</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link text-white" onClick={handleLogout} style={{ cursor: 'pointer', fontSize: '14px' }}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="container">
            <Routes>
              {/* Route for Dashboard (Default Main Content) */}
              <Route path="/dashboard" element={
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-primary text-white">
                        <h4 style={{ fontSize: '20px' }}>Welcome to the Admin Dashboard</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="card text-white bg-success mb-3">
                              <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '16px' }}>Active Drivers</h5>
                                <p className="card-text" style={{ fontSize: '14px' }}>View and manage all active drivers.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card text-white bg-warning mb-3">
                              <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '16px' }}>Active Customers</h5>
                                <p className="card-text" style={{ fontSize: '14px' }}>View and manage all active customers.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="card text-white bg-info mb-3">
                              <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '16px' }}>Pending Bookings</h5>
                                <p className="card-text" style={{ fontSize: '14px' }}>View and manage all pending bookings.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bookings Table */}
                        <div className="row mt-4">
                          <div className="col-12">
                            <div className="card">
                              <div className="card-header bg-secondary text-white">
                                <h5 style={{ fontSize: '18px' }}>Bookings</h5>
                              </div>
                              <div className="card-body" style={{ overflowX: 'auto' }}>
                                <DataTable
                                  columns={columns}
                                  data={bookings}
                                  pagination
                                  responsive
                                  highlightOnHover
                                  striped
                                  noHeader
                                  fixedHeader
                                  fixedHeaderScrollHeight="400px"
                                  customStyles={{
                                    table: {
                                      style: {
                                        width: '100%',
                                      },
                                    },
                                    headRow: {
                                      style: {
                                        backgroundColor: '#f8f9fa',
                                        borderBottom: '1px solid #dee2e6',
                                      },
                                    },
                                    headCells: {
                                      style: {
                                        color: '#495057',
                                        fontWeight: 'bold',
                                        padding: '12px',
                                        fontSize: '14px',
                                      },
                                    },
                                    cells: {
                                      style: {
                                        padding: '12px',
                                        fontSize: '14px',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />

              {/* Route for Manage Cars */}
              <Route path="/forms" element={<ManageCars />} />
              <Route path="/forms/viewCar" element={<ViewCars />} />
              <Route path="/forms/ManageDriver" element={<ManageDriver />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;