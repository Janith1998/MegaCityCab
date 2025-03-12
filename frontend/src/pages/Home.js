import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showLoader, setShowLoader] = useState(false); // Track loader state
  const carsPerPage = 6;

  useEffect(() => {
    fetchCars();
    // Check if the user is logged in (e.g., from localStorage or context)
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:8080/cars/available');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const nextPage = () => {
    if (currentPage < Math.ceil(cars.length / carsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBookNow = (car) => {
    if (!isLoggedIn) {
      // Show a toast notification if the user is not logged in
      toast.info('Please log in to the system to make a booking.', {
        position: 'top-center',
        autoClose: 3000, // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          // Show the loader after the toast closes
          setShowLoader(true);
          // Simulate a delay for the loader before navigating
          setTimeout(() => {
            navigate('/LoginPage'); // Redirect to the login page
          }, 2000); // 2 seconds loader duration
        },
      });
    } else {
      // Navigate to Customer Dashboard with car data
      navigate('/customer/dashboard', { state: { car } });
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Carousel */}
      <Carousel />

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Loader */}
      {showLoader && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      {/* Services Section */}
      <div className="container my-4">
        <h2 className="text-center">Our Services</h2>
        <div className="row">
          {/* Dynamic Car Cards */}
          {currentCars.map((car) => (
            <div className="col-md-4 mb-4" key={car.id}>
              <div className="card">
                <img
                  src={`data:image/jpeg;base64,${car.image}`}
                  className="card-img-top"
                  alt={car.brand}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{car.brand}</h5>
                  <button
                    className="book-now-button w-100 mt-3"
                    onClick={() => handleBookNow(car)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={nextPage}
            disabled={currentPage === Math.ceil(cars.length / carsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;