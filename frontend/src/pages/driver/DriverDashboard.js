// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DataTable from 'react-data-table-component';
// import { FaUserCircle, FaSignOutAlt, FaCalendarAlt, FaClock } from 'react-icons/fa'; 
// import { MdCancel, MdCheckCircle } from 'react-icons/md'; 
// import notificationIcon from '../../assets/notify.png';
// import { toast } from 'react-toastify';
// import userIcon from '../../assets/user.png';
// import './DriverDashboard.css'; 

// function DriverDashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [todayBookingsCount, setTodayBookingsCount] = useState(0);
//   const [assignedBookingsCount, setAssignedBookingsCount] = useState(0);
//   const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
//   const [currentDateTime, setCurrentDateTime] = useState('');
//   const navigate = useNavigate();
//   const [loggedInUser, setLoggedInUser] = useState({
//     name: localStorage.getItem('userName') || 'John Doe', // Use dynamic data from localStorage
//     avatar: userIcon, // Replace with dynamic avatar URL
//   });

//   // Fetch assigned bookings for the driver
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const userId = localStorage.getItem('userId'); // Assuming you store the driver's ID in localStorage
//         if (!userId) {
//           throw new Error('Driver ID not found');
//         }

//         const response = await fetch(`http://localhost:8080/bookings/assign-driver/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch bookings');
//         }
//         const data = await response.json();
//         setBookings(data);

//         // Calculate counts
//         const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
//         const todayBookings = data.filter((booking) => booking.date === today);
//         const assignedBookings = data.filter((booking) => booking.status === 'Assigned');
//         const confirmedBookings = data.filter((booking) => booking.status === 'Confirmed');

//         setTodayBookingsCount(todayBookings.length);
//         setAssignedBookingsCount(assignedBookings.length);
//         setConfirmedBookingsCount(confirmedBookings.length);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleConfirmBooking = async (bookingId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/bookings/${bookingId}/confirm`, {
//         method: 'PUT',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to confirm booking');
//       }
//       const updatedBooking = await response.json();
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
//         )
//       );
//       toast.success('Booking confirmed successfully!');
//     } catch (error) {
//       console.error('Error confirming booking:', error);
//       toast.error('Failed to confirm booking');
//     }
//   };

//   const handleCancelBooking = async (bookingId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/bookings/${bookingId}/cancel`, {
//         method: 'PUT',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to cancel booking');
//       }
//       const updatedBooking = await response.json();
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.bookingId === bookingId ? { ...booking, status: 'Pending' } : booking
//         )
//       );
//       toast.success('Booking cancelled successfully!');
//     } catch (error) {
//       console.error('Error cancelling booking:', error);
//       toast.error('Failed to cancel booking');
//     }
//   };

//   // Update current date and time (Sri Lanka time)
//   useEffect(() => {
//     const updateDateTime = () => {
//       const now = new Date();
//       const options = {
//         timeZone: 'Asia/Colombo',
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//       };
//       const formattedDateTime = now.toLocaleString('en-US', options);
//       setCurrentDateTime(formattedDateTime);
//     };

//     updateDateTime();
//     const interval = setInterval(updateDateTime, 1000); // Update every second
//     return () => clearInterval(interval);
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('userId');
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userName');
//     navigate('/');
//   };

//   // Table columns
//   const columns = [
//     {
//       name: 'Booking ID',
//       selector: (row) => row.bookingId,
//       sortable: true,
//     },
//     {
//       name: 'Pickup Location',
//       selector: (row) => row.pickupLocation,
//       sortable: true,
//     },
//     {
//       name: 'Dropoff Location',
//       selector: (row) => row.dropoffLocation,
//       sortable: true,
//     },
//     {
//       name: 'Status',
//       selector: (row) => row.status,
//       sortable: true,
//       cell: (row) => (
//         <span
//           className={`badge ${
//             row.status === 'Completed'
//               ? 'bg-success'
//               : row.status === 'Pending'
//               ? 'bg-warning'
//               : 'bg-danger'
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <div className="d-flex gap-2">
//           <MdCheckCircle
//             className="text-success cursor-pointer"
//             size={20}
//             title="Confirm"
//             onClick={() => handleConfirmBooking(row.bookingId)}
//           />
//           <MdCancel
//             className="text-danger cursor-pointer"
//             size={20}
//             title="Cancel"
//             onClick={() => handleCancelBooking(row.bookingId)}
//           />
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//     },
//   ];



//   return (
//     <div className="driver-dashboard">
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             Mega City Cab
//           </a>
//           <div className="d-flex align-items-center">
//             {/* Current Date and Time */}
//             <div className="date-time me-3">
//               <FaCalendarAlt className="me-2" />
//               <FaClock className="me-2" />
//               <span>{currentDateTime}</span>
//             </div>

//             {/* Notification Icon */}
//             <div className="notification-icon me-3">
//               <img
//                 src={notificationIcon}
//                 alt="Notifications"
//                 className="notification-icon-img"
//               />
//               <span className="badge bg-danger">3</span> {/* Notification count */}
//             </div>



//             {/* User Avatar and Name */}
//             <div className="user-info me-3">
//               <img
//                 src={loggedInUser.avatar}
//                 alt="User Avatar"l
//                 className="avatar"
//               />
//               <span className="user-name">{loggedInUser.name}</span>
//             </div>

//             {/* Logout Button */}
//             <button className="btn btn-outline-light" onClick={handleLogout}>
//               <FaSignOutAlt /> Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container-fluid mt-4">
//         {/* Cards Section */}
//         <div className="row mb-4">
//           <div className="col-md-4">
//             <div className="card card-custom">
//               <div className="card-body">
//                 <h5 className="card-title">Today's Bookings</h5>
//                 <p className="card-text">{todayBookingsCount}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="card card-custom">
//               <div className="card-body">
//                 <h5 className="card-title">Assigned Bookings</h5>
//                 <p className="card-text">{assignedBookingsCount}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="card card-custom">
//               <div className="card-body">
//                 <h5 className="card-title">Confirmed Bookings</h5>
//                 <p className="card-text">{confirmedBookingsCount}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="row">
//           <div className="col-12">
//             <div className="card shadow-sm">
//               <div className="card-header  text-white">
//                 <h4>Assigned Bookings</h4>
//               </div>
//               <div className="card-body">
//                 <DataTable
//                   columns={columns}
//                   data={bookings}
//                   pagination
//                   responsive
//                   highlightOnHover
//                   striped
//                   noHeader
//                   fixedHeader
//                   fixedHeaderScrollHeight="400px"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-overlay"></div>
//         <div className="footer-content">
//           <div className="footer-info">
//             <p>Mega City Cab</p>
//             <p>123 Main Street, City, Country</p>
//             <p>Email: info@megacitycab.com</p>
//             <p>Phone: +123 456 7890</p>
//           </div>
//           <div className="footer-logo">
//             <img src="path-to-your-logo.png" alt="Company Logo" />
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default DriverDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FaUserCircle, FaSignOutAlt, FaCalendarAlt, FaClock } from 'react-icons/fa'; 
import { MdCancel, MdCheckCircle } from 'react-icons/md'; 
import notificationIcon from '../../assets/notify.png';
import { toast } from 'react-toastify';
import userIcon from '../../assets/user.png';
import './DriverDashboard.css'; 

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [todayBookingsCount, setTodayBookingsCount] = useState(0);
  const [assignedBookingsCount, setAssignedBookingsCount] = useState(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState({
    name: localStorage.getItem('userName') || 'John Doe', // Use dynamic data from localStorage
    avatar: userIcon, // Replace with dynamic avatar URL
  });

  // Fetch assigned bookings for the driver
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming you store the driver's ID in localStorage
        if (!userId) {
          throw new Error('Driver ID not found');
        }

        const response = await fetch(`http://localhost:8080/bookings/assign-driver/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);

        // Calculate counts
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const todayBookings = data.filter((booking) => booking.date === today);
        const assignedBookings = data.filter((booking) => booking.status === 'Assigned');
        const confirmedBookings = data.filter((booking) => booking.status === 'Confirmed');

        setTodayBookingsCount(todayBookings.length);
        setAssignedBookingsCount(assignedBookings.length);
        setConfirmedBookingsCount(confirmedBookings.length);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      console.log("Confirming booking with ID:", bookingId); // Log the booking ID
      const response = await fetch(`http://localhost:8080/bookings/confirm/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }
      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
        )
      );
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      console.log("Canceling booking with ID:", bookingId); // Log the booking ID
      const response = await fetch(`http://localhost:8080/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: 'Cancelled' } : booking
        )
      );
      toast.success('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };



  // Update current date and time (Sri Lanka time)
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const formattedDateTime = now.toLocaleString('en-US', options);
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // Table columns
  const columns = [
    {
      name: 'Booking ID',
      selector: (row) => row.bookingId,
      sortable: true,
    },
    {
      name: 'Pickup Location',
      selector: (row) => row.pickupLocation,
      sortable: true,
    },
    {
      name: 'Dropoff Location',
      selector: (row) => row.dropoffLocation,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.status === 'Completed'
              ? 'bg-success'
              : row.status === 'Pending'
              ? 'bg-warning'
              : 'bg-danger'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <MdCheckCircle
            className="text-success cursor-pointer"
            size={20}
            title="Confirm"
            onClick={() => handleConfirmBooking(row.bookingId)}
          />
          <MdCancel
            className="text-danger cursor-pointer"
            size={20}
            title="Cancel"
            onClick={() => handleCancelBooking(row.bookingId)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="driver-dashboard">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Mega City Cab
          </a>
          <div className="d-flex align-items-center">
            {/* Current Date and Time */}
            <div className="date-time me-3">
              <FaCalendarAlt className="me-2" />
              <FaClock className="me-2" />
              <span>{currentDateTime}</span>
            </div>

            {/* Notification Icon */}
            <div className="notification-icon me-3">
              <img
                src={notificationIcon}
                alt="Notifications"
                className="notification-icon-img"
              />
              <span className="badge bg-danger">3</span> {/* Notification count */}
            </div>

            {/* User Avatar and Name */}
            <div className="user-info me-3">
              <img
                src={loggedInUser.avatar}
                alt="User Avatar"
                className="avatar"
              />
              <span className="user-name">{loggedInUser.name}</span>
            </div>

            {/* Logout Button */}
            <button className="btn btn-outline-light" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-4">
        {/* Cards Section */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card card-custom">
              <div className="card-body">
                <h5 className="card-title">Today's Bookings</h5>
                <p className="card-text">{todayBookingsCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom">
              <div className="card-body">
                <h5 className="card-title">Assigned Bookings</h5>
                <p className="card-text">{assignedBookingsCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom">
              <div className="card-body">
                <h5 className="card-title">Confirmed Bookings</h5>
                <p className="card-text">{confirmedBookingsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header  text-white">
                <h4>Assigned Bookings</h4>
              </div>
              <div className="card-body">
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-overlay"></div>
        <div className="footer-content">
          <div className="footer-info">
            <p>Mega City Cab</p>
            <p>123 Main Street, City, Country</p>
            <p>Email: info@megacitycab.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div className="footer-logo">
            <img src="path-to-your-logo.png" alt="Company Logo" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DriverDashboard;