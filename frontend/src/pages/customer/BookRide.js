import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce } from 'lodash';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import {} from 'jspdf-autotable';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import redMarker from '../../assets/red-marker.png';

import './BookRide.css';

// Routing Component (unchanged)
function Routing({ pickupCoords, dropoffCoords, setRouteDetails }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);
  

  useEffect(() => {
    if (!map || !pickupCoords || !dropoffCoords) return;

    if (routingControlRef.current) {
      routingControlRef.current.remove();
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords[0], pickupCoords[1]),
        L.latLng(dropoffCoords[0], dropoffCoords[1]),
      ],
      routeWhileDragging: true,
      lineOptions: { styles: [{ color: 'blue', weight: 5 }] },
      createMarker: () => null,
      showAlternatives: false,

      routeSelected: (e) => {
        const { summary, duration, distance, name } = e.route;
        const arrivalTime = new Date();
        arrivalTime.setMinutes(arrivalTime.getMinutes() + duration / 60);
        const formattedArrivalTime = arrivalTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        });
        setRouteDetails({
          summary: summary,
          duration: (duration / 60).toFixed(2),
          distance: (distance / 1000).toFixed(2),
          name: name || 'Unnamed Route',
          estimatedArrivalTime: formattedArrivalTime
        });

        setEstimatedArrivalTime(formattedArrivalTime);
      },
    }).addTo(map);



    routingControl.on('routesfound', (event) => {
      const { routes } = event;
      if (routes && routes.length > 0) {
        const route = routes[0];
        const arrivalTime = new Date();
        arrivalTime.setMinutes(arrivalTime.getMinutes() + route.summary.totalTime / 60);
        const formattedArrivalTime = arrivalTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        });

        setRouteDetails(prev => ({
          ...prev,
          distance: (route.summary.totalDistance / 1000).toFixed(2),
          duration: (route.summary.totalTime / 60).toFixed(2),
          name: route.name || 'Unnamed Route',
          estimatedArrivalTime: formattedArrivalTime
        }));

        setRouteInfo({
          distance: route.summary.totalDistance / 1000,
          duration: route.summary.totalTime / 60,
          name: route.name || 'Unnamed Route',
        });
      }
    });

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
    };
  }, [map, pickupCoords, dropoffCoords, setRouteDetails]);

  return (
    <>
      {routeInfo && (
        <div className="route-info">
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

// Bill Component for PDF Generation and Confirmation
function BillComponent({ bookingData, onConfirm, onCancel, routeDetails }) {
  const handleDownloadBill = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Bill", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Pickup Location: ${bookingData.pickupLocation}`, 20, 40);
    doc.text(`Dropoff Location: ${bookingData.dropoffLocation}`, 20, 50);
    doc.text(`Price: Rs ${bookingData.price}`, 20, 60);
    doc.text(`Passengers: ${bookingData.passengers}`, 20, 70);
    doc.text(`Luggage: ${bookingData.luggage}`, 20, 80);
    doc.text(`Distance: ${routeDetails?.distance || 'Calculating...'} km`, 20, 90);
    doc.text(`Estimated Arrival Time: ${routeDetails?.estimatedArrivalTime || 'Calculating...'}`, 20, 100);

    doc.save("booking_bill.pdf");
  };

  return (
    <Modal show={true} onHide={onCancel} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Booking Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="bill-container">
          {/* Header Section */}
          <div className="bill-header">
            <div className="bill-title">
              <h2>Megacity Cab</h2>
              <p>Booking Invoice</p>
            </div>
            <div className="bill-contact">
              <p>Contact us: 84653864</p>
              <p>Email: info@megacity.lk</p>
              <p>Address: galeehfjddjhf</p>
            </div>
          </div>

          {/* Separator Line */}
          <hr className="bill-separator" />

          {/* Booking Details Section */}
          <div className="bill-details">
            <div className="bill-row">
              <span className="bill-label">Customer:</span>
              <span className="bill-value">{localStorage.getItem('userName')}</span>
            </div>
            <div className="bill-row">
              <span className="bill-label">Pickup Location:</span>
              <span className="bill-value">{bookingData.pickupLocation}</span>
            </div>
            <div className="bill-row">
              <span className="bill-label">Dropoff Location:</span>
              <span className="bill-value">{bookingData.dropoffLocation}</span>
            </div>
            <div className="bill-row">
              <span className="bill-label">Pickup Time:</span>
              <span className="bill-value">
                {new Date(bookingData.pickupTime).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Table for Pricing Details */}
          <table className="bill-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Distance</th>
                <th>estimatedArrivalTime</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Booking</td>
                <td>{routeDetails?.distance || 'Calculating...'} km</td>
                <td>{routeDetails?.estimatedArrivalTime || 'Calculating...'}</td>
                <td>Rs {bookingData.price}</td>
                <td>Rs {bookingData.price}</td>
              </tr>
            </tbody>
          </table>

          {/* Total Amount Section */}
          <div className="bill-total">
            <span className="bill-label">Total Amount:</span>
            <span className="bill-value">Rs {bookingData.price}</span>
          </div>

          {/* Footer Section */}
          <div className="bill-footer">
            <p>Thank you for choosing Megacity Cab!</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => { onConfirm(); handleDownloadBill(); }}>
          Confirm & Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


// Main BookRide Component
function BookRide({ car }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [routeDetails, setRouteDetails] = useState({
    distance: null,
    estimatedArrivalTime: null,
    duration: null,
    name: null
  });
  const [pickupLat, setPickupLat] = useState('');
  const [pickupLon, setPickupLon] = useState('');
  const [dropoffLat, setDropoffLat] = useState('');
  const [dropoffLon, setDropoffLon] = useState('');
  const [price, setPrice] = useState(null);
  const [asap, setAsap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBill, setShowBill] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Refs for form fields
  const pickupDateRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const passengersRef = useRef(null);
  const luggageRef = useRef(null);
  const additionalMessageRef = useRef(null);

  const provider = new OpenStreetMapProvider();

  const customIcon = new L.Icon({
    iconUrl: redMarker,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
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
        setPickupLat(y);
        setPickupLon(x);
        setPickupSuggestions([]);
      } else {
        setDropoffLocation(suggestion);
        setDropoffCoords(coords);
        setDropoffLat(y);
        setDropoffLon(x);
        setDropoffSuggestions([]);
      }
      console.log('Location:', suggestion);
      console.log('Coordinates:', coords);
    }
  };

  const handleCalculatePrice = async () => {
    if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
      console.error('Pickup or dropoff coordinates missing');
      return;
    }

    const data = {
      pickupLat: parseFloat(pickupLat),
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
      const roundedPrice = Math.round(result.price * 100) / 100;
      setPrice(roundedPrice);
      console.log('Calculated Price:', roundedPrice);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!pickupLocation) errors.pickupLocation = 'Pickup location is required.';
    if (!dropoffLocation) errors.dropoffLocation = 'Dropoff location is required.';
    if (!asap && !pickupDateRef.current.value) errors.pickupDate = 'Pickup date is required.';
    if (!asap && !pickupTimeRef.current.value) errors.pickupTime = 'Pickup time is required.';
    if (!passengersRef.current.value) errors.passengers = 'Number of passengers is required.';
    if (!luggageRef.current.value) errors.luggage = 'Luggage option is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleBookRide = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.info('Please log in to make a booking.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/LoginPage');
      }, 100);
      setIsLoading(false);
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID not found. Please log in again.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    const bookingData = {
      userId,
      carId: car.id,
      pickupLocation,
      dropoffLocation,
      pickupLat: parseFloat(pickupLat),
      pickupLon: parseFloat(pickupLon),
      dropoffLat: parseFloat(dropoffLat),
      dropoffLon: parseFloat(dropoffLon),
      price,
      pickupTime: asap
        ? new Date()
        : new Date(`${pickupDateRef.current.value}T${pickupTimeRef.current.value}`),
      passengers: parseInt(passengersRef.current.value),
      luggage: luggageRef.current.value,
      additionalMessage: additionalMessageRef.current.value,
      
    };

    setBookingData(bookingData);
    setShowBill(true);
    setIsLoading(false);
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch('http://localhost:8080/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const result = await response.json();
      console.log('Booking successful:', result);
      toast.success('Booking successful!', {
        position: 'top-center',
        autoClose: 3000,
      });

      setShowBill(false);
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleConfirmationYes = () => {
    setShowConfirmation(false);
    setShowBill(false);
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false);
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

  return (
    <div className="book-ride-container">
      {/* Toast Container */}
      <ToastContainer />

      {/* Booking Form */}
      <div className="booking-form">
        <div className="booking-form-header">
          <h3>Book a Ride</h3>
          {car ? (
            <img
              src={`data:image/jpeg;base64,${car.image}`}
              alt={car.brand}
              className="car-image"
            />
          ) : (
            <button
              className="pick-a-cab-button"
              onClick={() => navigate('/')}
            >
              Pick A Cab
            </button>
          )}
        </div>
        <form onSubmit={handleBookRide}>
          {/* Pickup Location Input */}
          <div className="mb-3">
            <label className="form-label">Pickup Location</label>
            <input
              type="text"
              className={`form-control ${validationErrors.pickupLocation ? 'is-invalid' : ''}`}
              value={pickupLocation}
              placeholder="Enter pickup location"
              onChange={(e) => {
                setPickupLocation(e.target.value);
                handleLocationChange(e, true);
              }}
            />
            {validationErrors.pickupLocation && (
              <div className="invalid-feedback">{validationErrors.pickupLocation}</div>
            )}
            {pickupSuggestions.length > 0 && (
              <ul className="list-group">
                {pickupSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="list-group-item"
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
              className={`form-control ${validationErrors.dropoffLocation ? 'is-invalid' : ''}`}
              value={dropoffLocation}
              placeholder="Enter dropoff location"
              onChange={(e) => {
                setDropoffLocation(e.target.value);
                handleLocationChange(e, false);
              }}
            />
            {validationErrors.dropoffLocation && (
              <div className="invalid-feedback">{validationErrors.dropoffLocation}</div>
            )}
            {dropoffSuggestions.length > 0 && (
              <ul className="list-group">
                {dropoffSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    onClick={() => handleSuggestionClick(suggestion, false)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Calculate Price Button */}
          <Button
            variant="primary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleCalculatePrice();
            }}
          >
            Calculate Price
          </Button>

          {/* Display Price */}
          {price !== null && <p className="price-display">Price: Rs {price}</p>}

          {/* Phone Number Input */}
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

          {/* Pickup Date and Time */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Pickup Date</Form.Label>
                <Form.Control
                  type="date"
                  disabled={asap}
                  ref={pickupDateRef}
                  className={validationErrors.pickupDate ? 'is-invalid' : ''}
                />
                {validationErrors.pickupDate && (
                  <div className="invalid-feedback">{validationErrors.pickupDate}</div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Pickup Time</Form.Label>
                <Form.Control
                  type="time"
                  disabled={asap}
                  ref={pickupTimeRef}
                  className={validationErrors.pickupTime ? 'is-invalid' : ''}
                />
                {validationErrors.pickupTime && (
                  <div className="invalid-feedback">{validationErrors.pickupTime}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Passengers Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Passengers</Form.Label>
            <Form.Control
              as="select"
              ref={passengersRef}
              defaultValue="1"
              className={validationErrors.passengers ? 'is-invalid' : ''}
            >
              {[...Array(6).keys()].map((num) => (
                <option key={num + 1}>{num + 1}</option>
              ))}
            </Form.Control>
            {validationErrors.passengers && (
              <div className="invalid-feedback">{validationErrors.passengers}</div>
            )}
          </Form.Group>

          {/* Luggage Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Luggage</Form.Label>
            <Form.Control
              as="select"
              ref={luggageRef}
              defaultValue="No Luggage"
              className={validationErrors.luggage ? 'is-invalid' : ''}
            >
              <option>No Luggage</option>
              <option>Small Bag</option>
              <option>Medium Suitcase</option>
              <option>Large Suitcase</option>
            </Form.Control>
            {validationErrors.luggage && (
              <div className="invalid-feedback">{validationErrors.luggage}</div>
            )}
          </Form.Group>

          {/* Additional Message Textarea */}
          <Form.Group className="mb-3">
            <Form.Label>Additional Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Any special requests..."
              ref={additionalMessageRef}
            />
          </Form.Group>

          {/* Loading and Error Messages */}
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" disabled={!car || isLoading}>
            Book Ride
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="map-section">
        {pickupCoords && (
          <MapContainer center={pickupCoords} zoom={9} style={{ height: '100%', width: '100%' }}>
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

      {/* Bill Component */}
      {showBill && (
        <BillComponent
          bookingData={bookingData}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
          routeDetails={routeDetails}
        />
      )}

      {/* Confirmation Dialog */}
      <Modal show={showConfirmation} onHide={handleConfirmationClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel the booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmationYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleConfirmationNo}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookRide;