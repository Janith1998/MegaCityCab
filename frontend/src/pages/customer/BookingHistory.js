import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { MdVisibility, MdPrint } from 'react-icons/md';
import '../customer/CustomerDashboard.css';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch completed bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/bookings/customer/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();

        // Filter only completed bookings
        const completedBookings = data.filter(booking => 
          booking.status === 'Completed'
        );

        setBookings(completedBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Columns configuration for react-data-table-component
  const columns = [
    {
      name: 'Booking ID',
      selector: row => row.bookingId,
      sortable: true,
    },
    {
      name: 'Date & Time',
      selector: row => row.pickupTime,
      format: row => (
        <div>
          <div>{formatDate(row.pickupTime)}</div>
          <small className="text-muted">{formatTime(row.pickupTime)}</small>
        </div>
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
      name: 'Price (Rs)',
      selector: row => row.price,
      format: row => row.price?.toFixed(2) || '0.00',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <span className="badge rounded-pill bg-success">
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: () => (
        <div className="d-flex gap-2">
          <button className="btn btn-icon" title="View">
            <MdVisibility className="text-primary" />
          </button>
          <button className="btn btn-icon" title="Print">
            <MdPrint className="text-secondary" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Booking History</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading your booking history...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  Error loading booking history: {error}
                </div>
              ) : bookings.length === 0 ? (
                <div className="alert alert-info">
                  You don't have any completed bookings yet.
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={bookings}
                  customStyles={customStyles}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  noHeader
                  fixedHeader
                  fixedHeaderScrollHeight="400px"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;