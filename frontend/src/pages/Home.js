import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../pages/Home.css';

import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';

function Home() {
    const navigate = useNavigate();
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Mega City Cab</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contact</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-primary ms-2" onClick={() => navigate('/LoginPage')}>Sign In</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>Sign Up</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={slide1} className="d-block w-100" alt="Cab 1" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Safe & Fast Rides</h5>
              <p>Get to your destination on time with Mega City Cab.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={slide2} className="d-block w-100" alt="Cab 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Ride in Comfort</h5>
              <p>Comfortable vehicles for a smooth ride experience.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={slide2} className="d-block w-100" alt="Cab 3" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Easy Booking</h5>
              <p>Book your ride in just a few clicks.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Booking Form */}
      <div className="booking-form-container">
        <h3>Book a Ride</h3>
        <form>
          <div className="mb-3 row">
            <div className="col-md-6">
              <label htmlFor="pickup-location" className="form-label">Pickup Location</label>
              <input type="text" className="form-control" id="pickup-location" placeholder="Enter pickup location" />
            </div>
            <div className="col-md-6">
              <label htmlFor="dropoff-location" className="form-label">Dropoff Location</label>
              <input type="text" className="form-control" id="dropoff-location" placeholder="Enter dropoff location" />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-md-6">
              <label className="form-label">Pick-up Date & Time</label>
              <input type="datetime-local" className="form-control" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="no-of-passengers" className="form-label">No. of Passengers</label>
              <input type="number" className="form-control" id="no-of-passengers" placeholder="Enter number of passengers" min="1" required />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-md-12">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" placeholder="Enter any additional information" rows="3"></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Book Now</button>
        </form>
      </div>

      {/* Services Section */}
      <section id="services" className="container text-center py-5">
        <h2 className="mb-4">Our Services</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Service 1" />
              <div className="card-body">
                <h5 className="card-title">City Rides</h5>
                <p className="card-text">Comfortable city rides at affordable rates.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Service 2" />
              <div className="card-body">
                <h5 className="card-title">Airport Transfers</h5>
                <p className="card-text">Reliable and timely airport transfers.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Service 3" />
              <div className="card-body">
                <h5 className="card-title">Luxury Cars</h5>
                <p className="card-text">Travel in style with our premium cars.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-light py-5">
        <div className="container text-center">
          <h2>About Mega City Cab</h2>
          <p>We are dedicated to providing safe, reliable, and efficient transportation services to our customers in Colombo City. Thousands of customers trust Mega City Cab every month for their commuting needs.</p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="container py-5">
        <h2 className="text-center mb-4">What Our Customers Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">"The best cab service in Colombo! Reliable and fast." - John D.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">"I love the easy booking system. Always on time." - Sarah W.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">"Comfortable rides with excellent drivers. Highly recommend!" - Mark T.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2025 Mega City Cab. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
