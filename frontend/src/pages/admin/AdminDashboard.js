import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { MdCancel, MdVisibility, MdEdit } from 'react-icons/md'; 
import ManageCars from './forms/ManageCars';
import ViewCars from './forms/ViewCars';
import ManageDriver from './forms/ManageDriver';
import ManageCustomer from './forms/ManageCustomer';
import { ToastContainer } from 'react-toastify';

import { MdPrint } from 'react-icons/md';
import { saveAs } from 'file-saver';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function AdminDashboard() {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [bookings, setBookings] = useState([]); 
  const [drivers, setDrivers] = useState([]); 
  const [counts, setCounts] = useState({
    drivers: 0,
    customers: 0,
    pendingBookings: 0
  });
  const navigate = useNavigate();


  const downloadCustomerReport = async () => {
    try {
      // Fetch the report data
      const response = await fetch('http://localhost:8080/users/customer-report');
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const reportData = await response.json();
  
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595, 842]); // A4 size
      const { width, height } = page.getSize();
      
      // Add title and styling
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Add header with logo and title
      page.drawText('MegaCity Cab - Customer Report', {
        x: 50,
        y: height - 50,
        size: 18,
        font: titleFont,
        color: rgb(0.2, 0.4, 0.6),
      });
      
      // Add report date
      const date = new Date().toLocaleDateString();
      page.drawText(`Report generated: ${date}`, {
        x: width - 200,
        y: height - 50,
        size: 10,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Add divider line
      page.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      
      let yPosition = height - 90;
  
      // Helper function to get location summary
      const getLocationSummary = (location) => {
        if (!location) return '';
        
        const parts = location.split(',').map(part => part.trim());
        const first = parts[0];
        const last = parts[parts.length - 1];
        
        return `${first}, ${last}`;
      };
      
      // Add customer information
      for (const customer of reportData) {
        // Customer header
        page.drawText(`${customer.customerName}`, {
          x: 50,
          y: yPosition,
          size: 14,
          font: titleFont,
          color: rgb(0, 0, 0),
        });
        
        // Customer details
        page.drawText(`ID: ${customer.customerId} | Email: ${customer.email} | Contact: ${customer.contactNumber}`, {
          x: 50,
          y: yPosition - 20,
          size: 10,
          font: regularFont,
          color: rgb(0.3, 0.3, 0.3),
        });
                
        yPosition -= 55;
        
        // Bookings section
        if (customer.bookings && customer.bookings.length > 0) {
          page.drawText('Booking History:', {
            x: 50,
            y: yPosition,
            size: 12,
            font: titleFont,
            color: rgb(0.2, 0.4, 0.6),
          });
          
          yPosition -= 20;
          
          // Bookings table header
          page.drawText('Booking ID', {
            x: 50,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('From', {
            x: 150,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('To', {
            x: 300,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('Driver', {
            x: 400,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('Price', {
            x: 500,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          
          yPosition -= 15;
          
          // Bookings data
          for (const booking of customer.bookings) {
            page.drawText(booking.bookingId, {
              x: 50,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
  
            // Pickup location (shortened)
            page.drawText(getLocationSummary(booking.pickupLocation), {
              x: 150,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
            
            // Dropoff location (shortened)
            page.drawText(getLocationSummary(booking.dropoffLocation), {
              x: 300,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
            
            // Driver info
            page.drawText(booking.driverName || 'Not assigned', {
              x: 400,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
            
            // Price
            page.drawText(`Rs ${booking.price.toFixed(2)}`, {
              x: 500,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= 15;
            
            // Add booking date and status below
            const bookingDate = new Date(booking.pickupTime).toLocaleString();
            page.drawText(`${bookingDate} | ${booking.status}`, {
              x: 150,
              y: yPosition,
              size: 8,
              font: regularFont,
              color: rgb(0.4, 0.4, 0.4),
            });
            
            yPosition -= 15;
            
            // Add divider between bookings
            page.drawLine({
              start: { x: 50, y: yPosition + 5 },
              end: { x: width - 50, y: yPosition + 5 },
              thickness: 0.5,
              color: rgb(0.9, 0.9, 0.9),
            });
            
            yPosition -= 10;
          }
        } else {
          page.drawText('No bookings found', {
            x: 50,
            y: yPosition,
            size: 10,
            font: regularFont,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
        
        yPosition -= 40;
        
        // Add page break if needed
        if (yPosition < 100) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = height - 50;
        }
      }
      
      // Add footer
      const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
      lastPage.drawText('© MegaCity Cab - Confidential Report', {
        x: 50,
        y: 30,
        size: 8,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Customer_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating customer report:', error);
      alert('Failed to download customer report');
    }
  };





  const downloadDriverReport = async () => {
    try {
      // Fetch the report data
      const response = await fetch('http://localhost:8080/users/driver-report');
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const reportData = await response.json();
  
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const { width, height } = page.getSize();
      
      // Add title and styling
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Add header with logo and title
      page.drawText('MegaCity Cab - Driver Report', {
        x: 50,
        y: height - 50,
        size: 18,
        font: titleFont,
        color: rgb(0.2, 0.4, 0.6),
      });
      
      // Add report date
      const date = new Date().toLocaleDateString();
      page.drawText(`Report generated: ${date}`, {
        x: width - 200,
        y: height - 50,
        size: 10,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Add divider line
      page.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      
      let yPosition = height - 90;

      const getLocationSummary = (location) => {
        if (!location) return '';
        
        const parts = location.split(',').map(part => part.trim());
        const first = parts[0];
        const last = parts[parts.length - 1];
        
        return `${first}, ${last}`;
      };
      
      
      // Add driver information
      for (const driver of reportData) {
        // Driver header
        page.drawText(`${driver.driverName}`, {
          x: 50,
          y: yPosition,
          size: 14,
          font: titleFont,
          color: rgb(0, 0, 0),
        });
        
        // Driver details
        page.drawText(`ID: ${driver.driverId} | Contact: ${driver.contactNumber} | Car: ${driver.assignedCar || 'Not assigned'}`, {
          x: 50,
          y: yPosition - 20,
          size: 10,
          font: regularFont,
          color: rgb(0.3, 0.3, 0.3),
        });
        
        yPosition -= 40;
        
        // Bookings section
        if (driver.bookings && driver.bookings.length > 0) {
          page.drawText('Assigned Bookings:', {
            x: 50,
            y: yPosition,
            size: 12,
            font: titleFont,
            color: rgb(0.2, 0.4, 0.6),
          });
          
          yPosition -= 20;
          
          // Bookings table header
          page.drawText('Booking ID', {
            x: 50,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('Pickup', {
            x: 150,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('Dropoff', {
            x: 300,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          page.drawText('Status', {
            x: 450,
            y: yPosition,
            size: 10,
            font: titleFont,
            color: rgb(0.4, 0.4, 0.4),
          });
          
          yPosition -= 15;
          
          // Bookings data
          for (const booking of driver.bookings) {
            page.drawText(booking.bookingId, {
              x: 50,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: rgb(0, 0, 0),
            });

              // Modified to show first and last parts for pickup
              page.drawText(getLocationSummary(booking.pickupLocation), {
                x: 150,
                y: yPosition,
                size: 9,
                font: regularFont,
                color: rgb(0, 0, 0),
              });
              
              // Modified to show first and last parts for dropoff
              page.drawText(getLocationSummary(booking.dropoffLocation), {
                x: 300,
                y: yPosition,
                size: 9,
                font: regularFont,
                color: rgb(0, 0, 0),
              });


            
            // Color-code status
            const statusColor = booking.status === 'Confirmed' ? rgb(0, 0.5, 0) : rgb(0.8, 0.5, 0);
            page.drawText(booking.status, {
              x: 450,
              y: yPosition,
              size: 9,
              font: regularFont,
              color: statusColor,
            });
            
            yPosition -= 15;
          }
        } else {
          page.drawText('No bookings assigned', {
            x: 50,
            y: yPosition,
            size: 10,
            font: regularFont,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
        
        yPosition -= 40;
        
        // Add page break 
        if (yPosition < 100) {
          yPosition = height - 50;
          page = pdfDoc.addPage([595, 842]);
        }
      }
      
      // Add footer
      const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
      lastPage.drawText('© MegaCity Cab - Confidential Report', {
        x: 50,
        y: 30,
        size: 8,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Driver_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating driver report:', error);
      alert('Failed to download driver report');
    }
  };




   // Fetch counts from the backend
   useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [driversRes, customersRes, pendingRes] = await Promise.all([
          fetch('http://localhost:8080/users/count/drivers'),
          fetch('http://localhost:8080/users/count/customers'),
          fetch('http://localhost:8080/bookings/count/pending')
        ]);

        const driversCount = await driversRes.json();
        const customersCount = await customersRes.json();
        const pendingCount = await pendingRes.json();

        setCounts({
          drivers: driversCount,
          customers: customersCount,
          pendingBookings: pendingCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

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
       <ToastContainer />
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
              <Link to="/admin/forms/ManageCustomer" className="nav-link text-white" style={{ fontSize: '14px' }}>Manage Customers</Link>
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
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title" style={{ fontSize: '16px' }}>Drivers</h5>
                            <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {counts.drivers}
                            </p>
                            <p className="card-text" style={{ fontSize: '14px' }}>View and manage all active drivers.</p>
                          </div>
                          <MdPrint 
                            className="cursor-pointer" 
                            size={24} 
                            onClick={downloadDriverReport}
                            title="Download Driver Report"
                            style={{ 
                              cursor: 'pointer',
                              color: 'white',
                              transition: 'transform 0.2s',
                              ':hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="card text-white bg-warning mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title" style={{ fontSize: '16px' }}>Active Customers</h5>
                            <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              {counts.customers}
                            </p>
                            <p className="card-text" style={{ fontSize: '14px' }}>View and manage all active customers.</p>
                          </div>
                          <MdPrint 
                            className="cursor-pointer" 
                            size={24} 
                            onClick={downloadCustomerReport}
                            title="Download Customer Report"
                            style={{ 
                              cursor: 'pointer',
                              color: 'white',
                              transition: 'transform 0.2s',
                              ':hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                          <div className="col-sm-4">
                            <div className="card text-white bg-info mb-3">
                              <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '16px' }}>Pending Bookings</h5>
                                <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                  {counts.pendingBookings}
                                </p>
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
              <Route path="/forms/ManageCustomer" element={<ManageCustomer />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;