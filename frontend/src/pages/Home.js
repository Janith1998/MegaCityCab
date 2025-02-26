import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce } from 'lodash';

import MapComponent from '../../src/MapComponent';
import '../pages/Home.css';
import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';

function Home() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState([6.9271, 79.8612]); // Default: Colombo
  const [dropoffCoords, setDropoffCoords] = useState([6.9271, 79.8612]);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  const provider = new OpenStreetMapProvider();

  const handleLocationChange = useCallback(
    debounce(async (e, isPickup) => {
      const query = e.target.value;
      if (!query) return;

      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query });

      if (!results || results.length === 0) return;

      const suggestions = results.map((result) => result.label);

      if (isPickup) {
        setPickupSuggestions(suggestions);
        setPickupLocation(query);
      } else {
        setDropoffSuggestions(suggestions);
        setDropoffLocation(query);
      }
    }, 500),
    []
  );

  const handleSuggestionClick = async (suggestion, isPickup) => {
    const results = await provider.search({ query: suggestion });

    if (results[0]) {
      const { x, y } = results[0];
      const coords = [y, x];

      if (isPickup) {
        setPickupLocation(suggestion);
        setPickupCoords(coords);
        setPickupSuggestions([]);
      } else {
        setDropoffLocation(suggestion);
        setDropoffCoords(coords);
        setDropoffSuggestions([]);
      }
    }
  };

  const MapUpdater = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
  };

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
              <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
              <li className="nav-item"><a className="nav-link" href="#">About</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
              <li className="nav-item"><button className="btn btn-primary ms-2" onClick={() => navigate('/LoginPage')}>Sign In</button></li>
              <li className="nav-item"><button className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>Sign Up</button></li>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-4">
        <div className="row">
          {/* Form Section (Left Side) */}
          <div className="col-md-6">
            <div className="card p-4">
              <h3>Book a Ride</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="pickup-location" className="form-label">Pickup Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pickup-location"
                    value={pickupLocation}
                    placeholder="Enter pickup location"
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      handleLocationChange(e, true);
                    }}
                  />
                  {pickupSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {pickupSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion, true)}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="dropoff-location" className="form-label">Dropoff Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dropoff-location"
                    value={dropoffLocation}
                    placeholder="Enter dropoff location"
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      handleLocationChange(e, false);
                    }}
                  />
                  {dropoffSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {dropoffSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion, false)}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Book Now</button>
              </form>
            </div>
          </div>

          {/* Map Section (Right Side) */}
          <div className="col-md-6">
            <h3 className="text-center my-4">Our Service Area</h3>
            <MapContainer center={pickupCoords} zoom={12} style={{ height: "400px", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={pickupCoords}>
                <Popup>Pickup Location</Popup>
              </Marker>
              <Marker position={dropoffCoords}>
                <Popup>Dropoff Location</Popup>
              </Marker>
              <MapUpdater coords={pickupCoords} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
