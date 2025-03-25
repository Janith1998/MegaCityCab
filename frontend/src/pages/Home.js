import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showLoader, setShowLoader] = useState(false); 
  const carsPerPage = 6;

  useEffect(() => {
    fetchCars();
   
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
      
      toast.info('Please log in to the system to make a booking.', {
        position: 'top-center',
        autoClose: 3000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
         
          setShowLoader(true);
         
          setTimeout(() => {
            navigate('/LoginPage'); 
          }, 2000); 
        },
      });
    } else {
     
      navigate('/customer/dashboard', { state: { car } });
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Carousel */}
      <section className="hero-section">
        <Carousel />
      </section>

      {/* Services Section */}
      <section className="services-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">Our Fleet</h2>
          <div className="row g-4">
            {currentCars.map((car) => (
              <div className="col-md-4" key={car.id}>
                <div className="car-card card h-100 border-0 shadow-sm">
                  <img
                    src={`data:image/jpeg;base64,${car.image}`}
                    className="card-img-top car-image"
                    alt={car.brand}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{car.brand}</h5>
                    <p className="card-text text-muted">Model: {car.model}</p>
                    <button
                      className="btn btn-primary w-100 mt-3 book-now-btn"
                      onClick={() => handleBookNow(car)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-5">
            <button
              className="btn btn-outline-primary me-2"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={nextPage}
              disabled={currentPage === Math.ceil(cars.length / carsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title mb-4">About MegaCity Cab</h2>
              <p className="lead">
                Your reliable transportation partner in Sri Lanka
              </p>
              <p>
                MegaCity Cab has been serving customers with premium taxi services 
                since 2010. We pride ourselves on punctuality, safety, and 
                exceptional customer service.
              </p>
              <ul className="about-features">
                <li>24/7 customer support</li>
                <li>Professional certified drivers</li>
                <li>Fully insured vehicles</li>
                <li>Competitive pricing</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7" 
                alt="About us" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">What Our Customers Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="testimonial-card card h-100 p-4 shadow-sm">
                <div className="d-flex mb-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="60"
                  />
                  <div>
                    <h5 className="mb-0">John Smith</h5>
                    <p className="text-muted mb-0">Colombo</p>
                  </div>
                </div>
                <p className="mb-0">
                  "The best cab service I've used in Sri Lanka. Always on time and the drivers are very professional."
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="testimonial-card card h-100 p-4 shadow-sm">
                <div className="d-flex mb-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="60"
                  />
                  <div>
                    <h5 className="mb-0">Sarah Johnson</h5>
                    <p className="text-muted mb-0">Kandy</p>
                  </div>
                </div>
                <p className="mb-0">
                  "As a solo female traveler, I always feel safe with MegaCity Cab. Highly recommend their services."
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="testimonial-card card h-100 p-4 shadow-sm">
                <div className="d-flex mb-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/75.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="60"
                  />
                  <div>
                    <h5 className="mb-0">David Wilson</h5>
                    <p className="text-muted mb-0">Galle</p>
                  </div>
                </div>
                <p className="mb-0">
                  "Clean vehicles, polite drivers, and reasonable prices. Will definitely use them again."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">Contact Us</h2>
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="contact-info">
                <div className="contact-item mb-4">
                  <h5 className="mb-2">
                    <i className="bi bi-geo-alt-fill me-2"></i> Address</h5>
                  <p>123 Main Street, Colombo 01, Sri Lanka</p>
                </div>
                <div className="contact-item mb-4">
                  <h5 className="mb-2"><i className="bi bi-telephone-fill me-2"></i> Phone</h5>
                  <p>+94 112 345 678</p>
                </div>
                <div className="contact-item mb-4">
                  <h5 className="mb-2"><i className="bi bi-envelope-fill me-2"></i> Email</h5>
                  <p>info@megacitycab.lk</p>
                </div>
                <div className="contact-item">
                  <h5 className="mb-2"><i className="bi bi-clock-fill me-2"></i> Hours</h5>
                  <p>24/7 Service Available</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-form card p-4 shadow-sm">
                <h5 className="mb-4">Send us a message</h5>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Your Email" />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Subject" />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows="4" placeholder="Your Message"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="mb-3">MegaCity Cab</h5>
              <p>
                Your trusted transportation partner in Sri Lanka, providing safe and reliable taxi services.
              </p>
            </div>
            <div className="col-md-2 mb-4 mb-md-0">
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
            </div>
            <div className="col-md-3">
              <h5 className="mb-3">Connect With Us</h5>
              <div className="social-links">
                <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white me-3"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} MegaCity Cab. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
    </div>
  );
};

export default Home;