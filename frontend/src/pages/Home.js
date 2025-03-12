import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce } from 'lodash';
import L from 'leaflet';
import 'leaflet-routing-machine';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import cab from '../assets/cab.jpg';

//components
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';


import '../pages/Home.css';

import redMarker from '../assets/red-marker.png';


function Routing({ pickupCoords, dropoffCoords, setRouteDetails , setPricing}) {
  const map = useMap();
  const routingControlRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);

  useEffect(() => {
    if (!map || !pickupCoords || !dropoffCoords) return;

    // Remove the existing routing control if it exists
    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    // Create the new routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords[0], pickupCoords[1]),
        L.latLng(dropoffCoords[0], dropoffCoords[1]),
      ],
      routeWhileDragging: true,
      lineOptions: { styles: [{ color: 'blue', weight: 5 }] },
      createMarker: () => null, // No marker
      showAlternatives: false,
      routeSelected: (e) => {
        // Update the route details when a route is selected
        const { summary, duration, distance, name } = e.route;
        setRouteDetails({
          summary: summary,
          duration: (duration / 60).toFixed(2), // in minutes
          distance: (distance / 1000).toFixed(2), // in kilometers
          name: name || 'Unnamed Route',
        });

    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + duration / 60);
    const formattedArrivalTime = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEstimatedArrivalTime(formattedArrivalTime);
   
  
  },
}).addTo(map);

    // Listen to the "routesfound" event to get the route info
    routingControl.on('routesfound', (event) => {
      const { routes } = event;
      if (routes && routes.length > 0) {
        const route = routes[0]; // The first route
        setRouteInfo({
          distance: route.summary.totalDistance / 1000, // Distance in km
          duration: route.summary.totalTime / 60, // Duration in minutes
          name: route.name || 'Unnamed Route',
        });
      }
    });

    routingControlRef.current = routingControl; 

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null; // Clear reference
      }
    };
  }, [map, pickupCoords, dropoffCoords, setRouteDetails]);

  return (
    <>
      {routeInfo && (
        <div className="route-info" style={routeInfoStyle}>
          <p>
          {routeInfo.name && <strong>{routeInfo.name}</strong>} <br />
            {`${routeInfo.distance.toFixed(1)} km, ${routeInfo.duration.toFixed(0)} min`} <br />
            {estimatedArrivalTime && <strong>Estimated Arrival Time: {estimatedArrivalTime}</strong>}

          </p>
        </div>
      )}
    </>
  );
}

const routeInfoStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '10px',
  borderRadius: '5px',
  fontSize: '14px',
  zIndex: 999,
};

function Home() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [routeDetails, setRouteDetails] = useState(null);
  const [pickupTime, setPickupTime] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [message, setMessage] = useState('');
  const [asap, setAsap] = useState(false);
  const [pickupLat, setPickupLat] = useState('');  // Store pickup latitude
  const [pickupLon, setPickupLon] = useState('');  // Store pickup longitude
  const [dropoffLat, setDropoffLat] = useState(''); // Store dropoff latitude
  const [dropoffLon, setDropoffLon] = useState(''); // Store dropoff longitude
  const [pricing, setPricing] = useState(null);     // Store the calculated price
  const [price, setPrice] = useState(null);
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  



  const provider = new OpenStreetMapProvider();
  
  const customIcon = new L.Icon({
    iconUrl: redMarker,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  

  useEffect(() => {

    fetchCars();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupCoords([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLocationChange = useCallback(
    debounce(async (e, isPickup) => {
      const query = e.target.value;
      if (!query) return;

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
        setPickupLat(y); // Store pickup latitude
        setPickupLon(x); // Store pickup longitude
        setPickupSuggestions([]);
      } else {
        setDropoffLocation(suggestion);
        setDropoffCoords(coords);
        setDropoffLat(y); // Store dropoff latitude
        setDropoffLon(x); // Store dropoff longitude
        setDropoffSuggestions([]);
      }
      console.log('Location:', suggestion);
      console.log('Coordinates:', coords);
    }
  };
  
  // Function to handle price calculation
  const handleCalculatePrice = async () => {
    if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
      console.error('Pickup or dropoff coordinates missing');
      return; // Ensure we have all coordinates before making the request
    }
  
    const data = {
      pickupLat: parseFloat(pickupLat), // Parse to float to ensure proper number format
      pickupLon: parseFloat(pickupLon),
      dropoffLat: parseFloat(dropoffLat),
      dropoffLon: parseFloat(dropoffLon),
    };
  
    try {
      const response = await fetch('http://localhost:8080/pricing/calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      const roundedPrice = Math.round(result.price * 100) / 100; // Round to two decimal places
      setPrice(roundedPrice); // Set price value from backend response
      console.log('Calculated Price:', roundedPrice); // Optional: Debugging line
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };
  


  const MapUpdater = ({ coords }) => {
    const map = useMap();

    useEffect(() => {
      if (map && coords) {
        map.setView(coords, map.getZoom());
      }
    }, [coords, map]);

    return null;
  };


  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:8080/cars/available');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

    // Calculate the cars to display on the current page
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

      // Handle pagination navigation
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
    console.log('Booking car:', car);
  };

  


  return (
    <div>
      {/* Navbar */}
      <Navbar />


      {/* Carousel */}

      <Carousel />

      
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








      {/* Main Content */}
      <div className="container my-4">
        <div className="row">
          {/* Form Section */}
          <div className="col-md-5">
            <div className="card p-4">
              <h3>Book a Ride</h3>
              <form>
                {/* Pickup Location Input */}
                <div className="mb-3">
                  <label className="form-label">Pickup Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pickupLocation}
                    placeholder="Enter pickup location"
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      handleLocationChange(e, true);
                    }}
                  />
                  {/* Pickup Suggestions Dropdown */}
                  {pickupSuggestions.length > 0 && (
                    <ul className="list-group position-absolute z-3 bg-white w-100">
                      {pickupSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSuggestionClick(suggestion, true)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dropoff Location Input */}
                <div className="mb-3">
                  <label className="form-label">Dropoff Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dropoffLocation}
                    placeholder="Enter dropoff location"
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      handleLocationChange(e, false);
                    }}
                  />
                  {/* Dropoff Suggestions Dropdown */}
                  {dropoffSuggestions.length > 0 && (
                    <ul className="list-group position-absolute z-3 bg-white w-100">
                      {dropoffSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSuggestionClick(suggestion, false)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}

          
                  
                        {/* Button to Calculate Price */}
                        <Button
                  variant="primary"
                  type="button"  // Use type="button" to avoid form submission
                  onClick={(e) => {
                    e.preventDefault();  // Prevent page refresh
                    handleCalculatePrice();
                  }}
                >
                  Calculate Price
                </Button>


              {/* Display the calculated price */}
              {price !== null && <p>Price: Rs {price}</p>}



                  {/* Phone Number */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" placeholder="Enter phone number" />
                </Form.Group>

                {/* ASAP Checkbox */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Book for Immediate Pickup (ASAP)"
                    checked={asap}
                    onChange={(e) => setAsap(e.target.checked)}
                  />
                </Form.Group>

                {/* Date & Time */}
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Pickup Date</Form.Label>
                      <Form.Control type="date" disabled={asap} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Pickup Time</Form.Label>
                      <Form.Control type="time" disabled={asap} />
                    </Form.Group>
                  </Col>
                </Row>


                {/* Passenger Count */}
              <Form.Group className="mb-3">
                <Form.Label>Passengers</Form.Label>
                <Form.Control as="select">
                  {[...Array(6).keys()].map((num) => (
                    <option key={num + 1}>{num + 1}</option>
                  ))}
                </Form.Control>
              </Form.Group>

                {/* Luggage Option */}
                <Form.Group className="mb-3">
                  <Form.Label>Luggage</Form.Label>
                  <Form.Control as="select">
                    <option>No Luggage</option>
                    <option>Small Bag</option>
                    <option>Medium Suitcase</option>
                    <option>Large Suitcase</option>
                  </Form.Control>
                </Form.Group>

                {/* Message Box */}
                <Form.Group className="mb-3">
                  <Form.Label>Additional Message</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Any special requests..." />
                </Form.Group>
                </div>
                <button type="submit" className="btn btn-primary">Book Ride</button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="col-md-7">
            {pickupCoords && (
              <MapContainer center={pickupCoords} zoom={9} style={{ height: '800px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {pickupCoords && <Marker position={pickupCoords} icon={customIcon}><Popup>Pickup Location</Popup></Marker>}
                {dropoffCoords && <Marker position={dropoffCoords} icon={customIcon}><Popup>Dropoff Location</Popup></Marker>}
                <Routing
                  pickupCoords={pickupCoords}
                  dropoffCoords={dropoffCoords}
                  setRouteDetails={setRouteDetails}
                />
                <MapUpdater coords={pickupCoords} />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
