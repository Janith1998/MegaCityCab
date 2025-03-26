import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

import slide1 from '../assets/slide5.jpg';
import slide2 from '../assets/slide6.jpg';

const Carousel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize carousel animation
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach((item, index) => {
      item.dataset.index = index;
    });
  }, []);

  return (
    <div id="modernCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={slide1} className="d-block w-100" alt="Cab 1" />
          <div className="carousel-caption">
            <div className="caption-container">
              <h5 className="slide-in-top">Book Your Ride Now</h5>
              <p className="slide-in-bottom">Choose from a variety of vehicles for your convenience.</p>
              <button className="cta-button slide-in-bottom">Get Started</button>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src={slide2} className="d-block w-100" alt="Cab 2" />
          <div className="carousel-caption">
            <div className="caption-container">
              <h5 className="slide-in-top">Quick and Safe Rides</h5>
              <p className="slide-in-bottom">Reliable and professional drivers at your service.</p>
              <button className="cta-button slide-in-bottom">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;