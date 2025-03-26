// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import DataTable from 'react-data-table-component';
// // import { MdCancel, MdVisibility, MdEdit } from 'react-icons/md'; // Import icons
// // import BookRide from './BookRide'; // Import the BookRide component
// // import '../customer/CustomerDashboard.css';

// // function CustomerDashboard() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { car } = location.state || {}; // Retrieve car data from navigation state
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [showBookRide, setShowBookRide] = useState(!!car); // Automatically show BookRide if car data is present
// //   const [bookings, setBookings] = useState([]); // State to store bookings

// //   // Fetch bookings from the backend
// //   useEffect(() => {
// //     const fetchBookings = async () => {
// //       const userId = localStorage.getItem('userId');
// //       console.log('User ID from localStorage:', userId);
// //       if (!userId) {
// //         console.error('User ID not found. Redirecting to login...');
// //         // navigate('/login');
// //         return;
// //       }

// //       try {
// //         const response = await fetch(`http://localhost:8080/bookings/user/${userId}`);
// //         if (!response.ok) {
// //           throw new Error('Failed to fetch bookings');
// //         }
// //         const data = await response.json();
// //         setBookings(data); // Set the fetched bookings to state
// //       } catch (error) {
// //         console.error('Error fetching bookings:', error);
// //       }
// //     };

// //     fetchBookings();
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('isLoggedIn');
// //     localStorage.removeItem('userRole');
// //     localStorage.removeItem('userEmail');
// //     localStorage.removeItem('userName');
// //     localStorage.removeItem('userId');
// //     navigate('/'); // Redirect to homepage after logout
// //   };

// //   const handleBookRideClick = () => {
// //     setShowBookRide(true); // Show the BookRide component
// //   };

// //   const handleDashboardClick = () => {
// //     setShowBookRide(false); // Show the default dashboard content
// //   };

// //   // Handle view booking action
// //   const handleViewBooking = (bookingId) => {
// //     navigate(`/booking/${bookingId}`); // Navigate to booking details page
// //   };

// //   // Handle update booking action
// //   const handleUpdateBooking = (bookingId) => {
// //     navigate(`/booking/update/${bookingId}`); // Navigate to update booking page
// //   };

// //   // Handle delete booking action
// //   const handleDeleteBooking = async (bookingId) => {
// //     try {
// //       const response = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
// //         method: 'DELETE',
// //       });
// //       if (!response.ok) {
// //         throw new Error('Failed to delete booking');
// //       }
// //       // Remove the deleted booking from the state
// //       setBookings(bookings.filter((booking) => booking.id !== bookingId));
// //       alert('Booking deleted successfully');
// //     } catch (error) {
// //       console.error('Error deleting booking:', error);
// //       alert('Failed to delete booking');
// //     }
// //   };

// //   const columns = [
// //     {
// //       name: 'Booking ID',
// //       selector: row => row.bookingId,
// //       sortable: true,
// //     },
// //     {
// //       name: 'Pickup Location',
// //       selector: row => row.pickupLocation,
// //       sortable: true,
// //     },
// //     {
// //       name: 'Dropoff Location',
// //       selector: row => row.dropoffLocation,
// //       sortable: true,
// //     },
// //     {
// //       name: 'Price',
// //       selector: row => `Rs ${row.price.toFixed(2)}`,
// //       sortable: true,
// //     },
// //     {
// //       name: 'Status',
// //       selector: row => row.status,
// //       sortable: true,
// //       cell: row => (
// //         <span className={`badge bg-${row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}`}>
// //           {row.status}
// //         </span>
// //       ),
// //     },
// //     {
// //       name: 'Actions',
// //       cell: row => (
// //         <div className="d-flex gap-2">
// //           <MdVisibility
// //             className="text-primary cursor-pointer"
// //             size={20}
// //             title="View"
// //             onClick={() => handleViewBooking(row.id)}
// //           />
// //           <MdEdit
// //             className="text-warning cursor-pointer"
// //             size={20}
// //             title="Update"
// //             onClick={() => handleUpdateBooking(row.id)}
// //           />
// //           <MdCancel
// //             className="text-danger cursor-pointer"
// //             size={20}
// //             title="Delete"
// //             onClick={() => handleDeleteBooking(row.id)}
// //           />
// //         </div>
// //       ),
// //       ignoreRowClick: true,
// //       allowOverflow: true,
// //       button: true,
// //     },
// //   ];

// //   return (
// //     <div className="container-fluid">
// //       <div className="row">
// //         {/* Sidebar */}
// //         <div className={`col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100 ${isSidebarOpen ? 'open' : ''}`}>
// //           <div className="d-flex flex-column align-items-start p-3">
// //             <h3 className="text-white mb-4">MegaCity Cab</h3>
// //             <button
// //               className="navbar-toggler d-md-none text-white mb-3"
// //               type="button"
// //               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //             >
// //               <i className={`bi bi-${isSidebarOpen ? 'x' : 'list'}`}></i>
// //             </button>
// //             <ul className="nav flex-column w-100">
// //               <li className="nav-item">
// //                 <button
// //                   className={`nav-link text-white btn btn-link p-0 text-start ${!showBookRide ? 'active' : ''}`}
// //                   onClick={handleDashboardClick}
// //                 >
// //                   Dashboard
// //                 </button>
// //               </li>
// //               <li className="nav-item">
// //                 <button
// //                   className={`nav-link text-white btn btn-link p-0 text-start ${showBookRide ? 'active' : ''}`}
// //                   onClick={handleBookRideClick}
// //                 >
// //                   Book a Ride
// //                 </button>
// //               </li>
// //               <li className="nav-item">
// //                 <button className="nav-link text-white btn btn-link p-0 text-start">
// //                   Booking History
// //                 </button>
// //               </li>
// //               <li className="nav-item">
// //                 <button className="nav-link text-white btn btn-link p-0 text-start">
// //                   Profile
// //                 </button>
// //               </li>
// //               <li className="nav-item">
// //                 <button
// //                   className="nav-link text-white btn btn-link p-0 text-start"
// //                   onClick={handleLogout}
// //                 >
// //                   Logout
// //                 </button>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="col-md-9 col-lg-10 p-4">
// //           <div className="container-fluid">
// //             {/* Welcome Section */}
// //             <div className="row mb-4">
// //               <div className="col-12">
// //                 <div className="card bg-primary text-white">
// //                   <div className="card-body">
// //                     <h4 className="card-title">Welcome Back, {localStorage.getItem('userName')}!</h4>
// //                     <p className="card-text">Here's what's happening with your account today.</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Conditional Rendering */}
// //             {showBookRide ? (
// //               // Show BookRide component with car data
// //               <BookRide car={car} />
// //             ) : (
// //               // Show Default Dashboard Content
// //               <>
// //                 {/* Quick Actions */}
// //                 <div className="row mb-4">
// //                   <div className="col-md-4">
// //                     <div className="card text-white bg-success mb-3">
// //                       <div className="card-body">
// //                         <h5 className="card-title">Book a Ride</h5>
// //                         <p className="card-text">Quickly book a ride to your destination.</p>
// //                         <button
// //                           className="btn btn-light"
// //                           onClick={handleBookRideClick}
// //                         >
// //                           Book Now
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card text-white bg-warning mb-3">
// //                       <div className="card-body">
// //                         <h5 className="card-title">View History</h5>
// //                         <p className="card-text">Check your past bookings and receipts.</p>
// //                         <button className="btn btn-light">View History</button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="col-md-4">
// //                     <div className="card text-white bg-info mb-3">
// //                       <div className="card-body">
// //                         <h5 className="card-title">Update Profile</h5>
// //                         <p className="card-text">Manage your account details and preferences.</p>
// //                         <button className="btn btn-light">Update Profile</button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Recent Bookings */}
// //                 <div className="row">
// //                   <div className="col-12">
// //                     <div className="card">
// //                       <div className="card-header bg-secondary text-white">
// //                         <h5>Recent Bookings</h5>
// //                       </div>
// //                       <div className="card-body" style={{ overflowX: 'auto' }}>
// //                         <DataTable
// //                           columns={columns}
// //                           data={bookings}
// //                           pagination
// //                           responsive
// //                           highlightOnHover
// //                           striped
// //                           noHeader
// //                           fixedHeader
// //                           fixedHeaderScrollHeight="400px"
// //                           customStyles={{
// //                             table: {
// //                               style: {
// //                                 width: '100%',
// //                               },
// //                             },
// //                             headRow: {
// //                               style: {
// //                                 backgroundColor: '#f8f9fa',
// //                                 borderBottom: '1px solid #dee2e6',
// //                               },
// //                             },
// //                             headCells: {
// //                               style: {
// //                                 color: '#495057',
// //                                 fontWeight: 'bold',
// //                                 padding: '12px',
// //                               },
// //                             },
// //                             cells: {
// //                               style: {
// //                                 padding: '12px',
// //                               },
// //                             },
// //                           }}
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //         {/* Footer */}
// //         <footer className="footer">
// //         <div className="footer-overlay"></div>
// //         <div className="footer-content">
// //           <div className="footer-info">
// //             <p>Mega City Cab</p>
// //             <p>123 Main Street, City, Country</p>
// //             <p>Email: info@megacitycab.com</p>
// //             <p>Phone: +123 456 7890</p>
// //           </div>
// //           <div className="footer-logo">
// //             <img src="path-to-your-logo.png" alt="Company Logo" />
// //           </div>
// //         </div>
// //       </footer>
// //       </div>
      
// //     </div>
// //   );
// // }

// // export default CustomerDashboard;

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import BookRide from './BookRide'; // Import the BookRide component
// import '../customer/CustomerDashboard.css';

// function CustomerDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { car } = location.state || {}; // Retrieve car data from navigation state
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showBookRide, setShowBookRide] = useState(!!car); // Automatically show BookRide if car data is present

//   const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userName');
//     navigate('/'); // Redirect to homepage after logout
//   };

//   const handleBookRideClick = () => {
//     setShowBookRide(true); // Show the BookRide component
//   };

//   const handleDashboardClick = () => {
//     setShowBookRide(false); // Show the default dashboard content
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* Sidebar */}
//         <div className={`col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100 ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="d-flex flex-column align-items-start p-3">
//             <h3 className="text-white mb-4">MegaCity Cab</h3>
//             <button
//               className="navbar-toggler d-md-none text-white mb-3"
//               type="button"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//               <i className={`bi bi-${isSidebarOpen ? 'x' : 'list'}`}></i>
//             </button>
//             <ul className="nav flex-column w-100">
//               <li className="nav-item">
//                 <button
//                   className={`nav-link text-white btn btn-link p-0 text-start ${!showBookRide ? 'active' : ''}`}
//                   onClick={handleDashboardClick}
//                 >
//                   Dashboard
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className={`nav-link text-white btn btn-link p-0 text-start ${showBookRide ? 'active' : ''}`}
//                   onClick={handleBookRideClick}
//                 >
//                   Book a Ride
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link text-white btn btn-link p-0 text-start">
//                   Booking History
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link text-white btn btn-link p-0 text-start">
//                   Profile
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className="nav-link text-white btn btn-link p-0 text-start"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="col-md-9 col-lg-10 p-4">
//           <div className="container-fluid">
//             {/* Welcome Section */}
//             <div className="row mb-4">
//               <div className="col-12">
//                 <div className="card bg-primary text-white">
//                   <div className="card-body">
//                     <h4 className="card-title">Welcome Back, {localStorage.getItem('userName')}!</h4>
//                     <p className="card-text">Here's what's happening with your account today.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Conditional Rendering */}
//             {showBookRide ? (
//               // Show BookRide component with car data
//               <BookRide car={car} />
//             ) : (
//               // Show Default Dashboard Content
//               <>
//                 {/* Quick Actions */}
//                 <div className="row mb-4">
//                   <div className="col-md-4">
//                     <div className="card text-white bg-success mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">Book a Ride</h5>
//                         <p className="card-text">Quickly book a ride to your destination.</p>
//                         <button
//                           className="btn btn-light"
//                           onClick={handleBookRideClick}
//                         >
//                           Book Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="card text-white bg-warning mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">View History</h5>
//                         <p className="card-text">Check your past bookings and receipts.</p>
//                         <button className="btn btn-light">View History</button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="card text-white bg-info mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">Update Profile</h5>
//                         <p className="card-text">Manage your account details and preferences.</p>
//                         <button className="btn btn-light">Update Profile</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent Bookings */}
//                 <div className="row">
//                   <div className="col-12">
//                     <div className="card">
//                       <div className="card-header bg-secondary text-white">
//                         <h5>Recent Bookings</h5>
//                       </div>
//                       <div className="card-body">
//                         <table className="table table-striped">
//                           <thead>
//                             <tr>
//                               <th>Booking ID</th>
//                               <th>Date</th>
//                               <th>Pickup Location</th>
//                               <th>Dropoff Location</th>
//                               <th>Status</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <tr>
//                               <td>#12345</td>
//                               <td>2023-10-01</td>
//                               <td>Colombo</td>
//                               <td>Kandy</td>
//                               <td><span className="badge bg-success">Completed</span></td>
//                             </tr>
//                             <tr>
//                               <td>#12346</td>
//                               <td>2023-10-05</td>
//                               <td>Galle</td>
//                               <td>Colombo</td>
//                               <td><span className="badge bg-warning">In Progress</span></td>
//                             </tr>
//                             <tr>
//                               <td>#12347</td>
//                               <td>2023-10-10</td>
//                               <td>Negombo</td>
//                               <td>Colombo</td>
//                               <td><span className="badge bg-danger">Cancelled</span></td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerDashboard;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { MdCancel, MdVisibility, MdEdit } from 'react-icons/md';
// import BookRide from './BookRide';
// import '../customer/CustomerDashboard.css';

// function CustomerDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { car } = location.state || {};
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showBookRide, setShowBookRide] = useState(!!car);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch bookings from the backend
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//           setError('User not logged in');
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(`http://localhost:8080/bookings/user/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch bookings');
//         }
//         const data = await response.json();
//         setBookings(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userId');
//     navigate('/');
//   };

//   const handleBookRideClick = () => {
//     setShowBookRide(true);
//   };

//   const handleDashboardClick = () => {
//     setShowBookRide(false);
//   };

//   // Handle view booking action
//   const handleViewBooking = (bookingId) => {
//     navigate(`/booking/${bookingId}`);
//   };

//   // Handle update booking action
//   const handleUpdateBooking = (bookingId) => {
//     navigate(`/booking/update/${bookingId}`);
//   };

//   // Handle delete booking action
//   const handleDeleteBooking = async (bookingId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete booking');
//       }
//       setBookings(bookings.filter(booking => booking.id !== bookingId));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Format time for display
//   const formatTime = (dateString) => {
//     const options = { hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleTimeString(undefined, options);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* Sidebar */}
//         <div className={`col-md-3 col-lg-2 p-0 bg-dark text-white min-vh-100 ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="d-flex flex-column align-items-start p-3">
//             <h3 className="text-white mb-4">MegaCity Cab</h3>
//             <button
//               className="navbar-toggler d-md-none text-white mb-3"
//               type="button"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//               <i className={`bi bi-${isSidebarOpen ? 'x' : 'list'}`}></i>
//             </button>
//             <ul className="nav flex-column w-100">
//               <li className="nav-item">
//                 <button
//                   className={`nav-link text-white btn btn-link p-0 text-start ${!showBookRide ? 'active' : ''}`}
//                   onClick={handleDashboardClick}
//                 >
//                   Dashboard
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className={`nav-link text-white btn btn-link p-0 text-start ${showBookRide ? 'active' : ''}`}
//                   onClick={handleBookRideClick}
//                 >
//                   Book a Ride
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link text-white btn btn-link p-0 text-start">
//                   Booking History
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link text-white btn btn-link p-0 text-start">
//                   Profile
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   className="nav-link text-white btn btn-link p-0 text-start"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="col-md-9 col-lg-10 p-4">
//           <div className="container-fluid">
//             {/* Welcome Section */}
//             <div className="row mb-4">
//               <div className="col-12">
//                 <div className="card bg-primary text-white">
//                   <div className="card-body">
//                     <h4 className="card-title">Welcome Back, {localStorage.getItem('userName')}!</h4>
//                     <p className="card-text">Here's what's happening with your account today.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Conditional Rendering */}
//             {showBookRide ? (
//               <BookRide car={car} />
//             ) : (
//               <>
//                 {/* Quick Actions */}
//                 <div className="row mb-4">
//                   <div className="col-md-4">
//                     <div className="card text-white bg-success mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">Book a Ride</h5>
//                         <p className="card-text">Quickly book a ride to your destination.</p>
//                         <button
//                           className="btn btn-light"
//                           onClick={handleBookRideClick}
//                         >
//                           Book Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="card text-white bg-warning mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">View History</h5>
//                         <p className="card-text">Check your past bookings and receipts.</p>
//                         <button className="btn btn-light">View History</button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="card text-white bg-info mb-3">
//                       <div className="card-body">
//                         <h5 className="card-title">Update Profile</h5>
//                         <p className="card-text">Manage your account details and preferences.</p>
//                         <button className="btn btn-light">Update Profile</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent Bookings */}
//                 <div className="row">
//                   <div className="col-12">
//                     <div className="card">
//                       <div className="card-header bg-secondary text-white">
//                         <h5>Your Bookings</h5>
//                       </div>
//                       <div className="card-body">
//                         {loading ? (
//                           <div className="text-center">
//                             <div className="spinner-border text-primary" role="status">
//                               <span className="visually-hidden">Loading...</span>
//                             </div>
//                             <p>Loading your bookings...</p>
//                           </div>
//                         ) : error ? (
//                           <div className="alert alert-danger">
//                             Error loading bookings: {error}
//                           </div>
//                         ) : bookings.length === 0 ? (
//                           <div className="alert alert-info">
//                             You don't have any bookings yet.
//                           </div>
//                         ) : (
//                           <div className="table-responsive">
//                             <table className="table table-striped table-hover">
//                               <thead>
//                                 <tr>
//                                   <th>Booking ID</th>
//                                   <th>Date & Time</th>
//                                   <th>Pickup Location</th>
//                                   <th>Dropoff Location</th>
//                                   <th>Price</th>
//                                   <th>Status</th>
//                                   <th>Actions</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {bookings.map((booking) => (
//                                   <tr key={booking.id}>
//                                     <td>{booking.bookingId}</td>
//                                     <td>
//                                       {formatDate(booking.pickupTime)}<br />
//                                       {formatTime(booking.pickupTime)}
//                                     </td>
//                                     <td>{booking.pickupLocation}</td>
//                                     <td>{booking.dropoffLocation}</td>
//                                     <td>Rs {booking.price?.toFixed(2) || '0.00'}</td>
//                                     <td>
//                                       <span className={`badge bg-${
//                                         booking.status === 'Completed' ? 'success' :
//                                         booking.status === 'Confirmed' ? 'primary' :
//                                         booking.status === 'Pending' ? 'warning' : 'danger'
//                                       }`}>
//                                         {booking.status}
//                                       </span>
//                                     </td>
//                                     <td>
//                                       <div className="d-flex gap-2">
//                                         <MdVisibility
//                                           className="text-primary cursor-pointer"
//                                           size={20}
//                                           title="View"
//                                           onClick={() => handleViewBooking(booking.id)}
//                                         />
//                                         <MdEdit
//                                           className="text-warning cursor-pointer"
//                                           size={20}
//                                           title="Update"
//                                           onClick={() => handleUpdateBooking(booking.id)}
//                                         />
//                                         <MdCancel
//                                           className="text-danger cursor-pointer"
//                                           size={20}
//                                           title="Delete"
//                                           onClick={() => handleDeleteBooking(booking.id)}
//                                         />
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerDashboard;






import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCancel, MdVisibility, MdEdit } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import BookRide from './BookRide';
import '../customer/CustomerDashboard.css';
import BookingHistory from './BookingHistory';

function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { car } = location.state || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookRide, setShowBookRide] = useState(!!car);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch bookings from the backend
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

        const filteredBookings = data.filter(booking => 
          booking.status === 'Pending' || 
          booking.status === 'Assigned' || 
          booking.status === 'Confirmed'
        );

        setBookings(filteredBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(bookings.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentBookings = bookings.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleBookingHistoryClick = () => {
    setShowBookingHistory(true);
    setShowBookRide(false);
  };

  const handleBookRideClick = () => {
    setShowBookRide(true);
    setShowBookingHistory(false);
  };

  const handleDashboardClick = () => {
    setShowBookRide(false);
    setShowBookingHistory(false);
  };

  // Handle view booking action
  const handleViewBooking = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  // Handle update booking action
  const handleUpdateBooking = (bookingId) => {
    navigate(`/booking/update/${bookingId}`);
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
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setError(err.message);
    }
  };

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
                <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${showBookingHistory ? 'active' : ''}`}
                onClick={handleBookingHistoryClick}
                >
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
                    <p className="card-text">Here's what's happend with your account.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Rendering */}
            {showBookRide ? (
              <BookRide car={car} />
            ) : showBookingHistory ?  (
              <BookingHistory />
            ):(
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
                      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Your Bookings</h5>
                        <span className="badge bg-light text-dark">
                          Total: {bookings.length}
                        </span>
                      </div>
                      <div className="card-body">
                        {loading ? (
                          <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading your bookings...</p>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger">
                            Error loading bookings: {error}
                          </div>
                        ) : bookings.length === 0 ? (
                          <div className="alert alert-info">
                            You don't have any bookings yet.
                          </div>
                        ) : (
                          <>
                            <div className="table-container" style={{ overflowX: 'auto' }}>
                              <table className="table table-striped table-hover mb-0">
                                <thead>
                                  <tr>
                                    <th>Booking ID</th>
                                    <th>Date & Time</th>
                                    <th>Pickup Location</th>
                                    <th>Dropoff Location</th>
                                    <th>Price (Rs)</th>
                                    <th>Passengers</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentBookings.map((booking) => (
                                    <tr key={booking.id}>
                                      <td>{booking.bookingId}</td>
                                      <td>
                                        <div>{formatDate(booking.pickupTime)}</div>
                                        <small className="text-muted">{formatTime(booking.pickupTime)}</small>
                                      </td>
                                      <td>{booking.pickupLocation}</td>
                                      <td>{booking.dropoffLocation}</td>
                                      <td>{booking.price?.toFixed(2) || '0.00'}</td>
                                      <td>{booking.passengers}</td>
                                      <td>
                                        <span className={`badge rounded-pill bg-${
                                          booking.status === 'Completed' ? 'success' :
                                          booking.status === 'Confirmed' ? 'primary' :
                                          booking.status === 'Pending' ? 'warning' : 
                                          booking.status === 'Cancelled' ? 'danger' : 'secondary'
                                        }`}>
                                          {booking.status}
                                        </span>
                                      </td>
                                      <td>
                                      <div className="d-flex gap-2">
                                        <button 
                                          className="btn btn-icon"
                                          onClick={() => handleViewBooking(booking.id)}
                                          title="View"
                                        >
                                          <MdVisibility className="text-primary" />
                                        </button>
                                        <button 
                                          className="btn btn-icon"
                                          onClick={() => handleUpdateBooking(booking.id)}
                                          title="Edit"
                                        >
                                          <MdEdit className="text-warning" />
                                        </button>
                                        <button 
                                          className="btn btn-icon"
                                          onClick={() => handleDeleteBooking(booking.id)}
                                          title="Delete"
                                        >
                                          <MdCancel className="text-danger" />
                                        </button>
                                      </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div className="text-muted">
                                Showing {offset + 1} to {Math.min(offset + itemsPerPage, bookings.length)} of {bookings.length} bookings
                              </div>
                              <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                                previousClassName={'page-item'}
                                nextClassName={'page-item'}
                                pageClassName={'page-item'}
                                breakClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                                pageLinkClassName={'page-link'}
                                breakLinkClassName={'page-link'}
                              />
                            </div>
                          </>
                        )}
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