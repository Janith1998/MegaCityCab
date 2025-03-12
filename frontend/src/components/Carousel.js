import React from 'react';
import { useNavigate } from 'react-router-dom';

import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';

const Carousel = () => {
  const Carousel = useNavigate();

  return (
<div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
<div className="carousel-inner">
  <div className="carousel-item active">
    <img src={slide1} className="d-block w-100" alt="Cab 1" />
    <div className="carousel-caption d-none d-md-block">
      <h5>Book Your Ride Now</h5>
      <p>Choose from a variety of vehicles for your convenience.</p>
    </div>
  </div>
  <div className="carousel-item">
    <img src={slide2} className="d-block w-100" alt="Cab 2" />
    <div className="carousel-caption d-none d-md-block">
      <h5>Quick and Safe Rides</h5>
      <p>Reliable and professional drivers at your service.</p>
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
  );
};

export default Carousel;