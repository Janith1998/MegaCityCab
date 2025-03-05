            {/* <MapContainer
              center={pickupCoords || [6.927079, 79.861244]} 
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <MapUpdater coords={pickupCoords} />
              {pickupCoords && (
                <Marker position={pickupCoords} icon={customIcon}>
                  <Popup>Pickup Location</Popup>
                </Marker>
              )}
              {dropoffCoords && (
                <Marker position={dropoffCoords} icon={customIcon}>
                  <Popup>Dropoff Location</Popup>
                </Marker>
              )}
            </MapContainer> */}












            ////
//             import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { OpenStreetMapProvider } from 'leaflet-geosearch';
// import { debounce } from 'lodash';
// import L from 'leaflet';
// import 'leaflet-routing-machine';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import '../pages/Home.css';
// import slide1 from '../assets/slide1.jpg';
// import slide2 from '../assets/slide2.jpg';
// import redMarker from '../assets/red-marker.png';

// function Routing({ pickupCoords, dropoffCoords }) {
//   const map = useMap();
//   const routingControlRef = useRef(null);  // Reference to routing control

// useEffect(() => {
//   if (!map || !pickupCoords || !dropoffCoords) return;

//   // Ensure routing control is removed only if it exists
//   if (routingControlRef.current) {
//     map.removeControl(routingControlRef.current);
//     routingControlRef.current = null;  // Clear the reference after removal
//   }

//   // Create a new routing control
//   const routingControl = L.Routing.control({
//     waypoints: [
//       L.latLng(pickupCoords[0], pickupCoords[1]),
//       L.latLng(dropoffCoords[0], dropoffCoords[1]),
//     ],
//     routeWhileDragging: true,
//     lineOptions: { styles: [{ color: 'blue', weight: 5 }] },
//     createMarker: () => null, // Hide default markers
//   }).addTo(map);

//   routingControlRef.current = routingControl;

//   // Cleanup function to remove the routing control when component unmounts or dependencies change
//   return () => {
//     if (routingControlRef.current) {
//       map.removeControl(routingControlRef.current);
//       routingControlRef.current = null;  // Clear the reference after removal
//     }
//   };
// }, [map, pickupCoords, dropoffCoords]);


// console.log(map, routingControlRef.current);


//   return null;
// }

// function Home() {
//   const navigate = useNavigate();
//   const [pickupLocation, setPickupLocation] = useState('');
//   const [dropoffLocation, setDropoffLocation] = useState('');
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [dropoffCoords, setDropoffCoords] = useState(null);
//   const [pickupSuggestions, setPickupSuggestions] = useState([]);
//   const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

//   const provider = new OpenStreetMapProvider();
  
//   const customIcon = new L.Icon({
//     iconUrl: redMarker,
//     shadowUrl: markerShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
//   });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setPickupCoords([latitude, longitude]);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//         }
//       );
//     }
//   }, []);

//   const handleLocationChange = useCallback(
//     debounce(async (e, isPickup) => {
//       const query = e.target.value;
//       if (!query) return;

//       const results = await provider.search({ query });

//       if (!results || results.length === 0) return;

//       const suggestions = results.map((result) => result.label);

//       if (isPickup) {
//         setPickupSuggestions(suggestions);
//         setPickupLocation(query);
//       } else {
//         setDropoffSuggestions(suggestions);
//         setDropoffLocation(query);
//       }
//     }, 500),
//     []
//   );

//   const handleSuggestionClick = async (suggestion, isPickup) => {
//     const results = await provider.search({ query: suggestion });

//     if (results[0]) {
//       const { x, y } = results[0];
//       const coords = [y, x];

//       if (isPickup) {
//         setPickupLocation(suggestion);
//         setPickupCoords(coords);
//         setPickupSuggestions([]);
//       } else {
//         setDropoffLocation(suggestion);
//         setDropoffCoords(coords);
//         setDropoffSuggestions([]);
//       }
      
//       console.log('Location:', suggestion);
//       console.log('Coordinates:', coords);
//     }
//   };

//   const MapUpdater = ({ coords }) => {
//     const map = useMap();

//     useEffect(() => {
//       if (map && coords) {
//         map.setView(coords, map.getZoom());
//       }
//     }, [coords, map]);

//     return null;
//   };

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg sticky-top">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">Mega City Cab</a>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
//               <li className="nav-item"><button className="btn btn-primary ms-2" onClick={() => navigate('/LoginPage')}>Sign In</button></li>
//               <li className="nav-item"><button className="btn btn-secondary ms-2" onClick={() => navigate('/register')}>Sign Up</button></li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Carousel */}
//       <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
//         <div className="carousel-inner">
//           <div className="carousel-item active">
//             <img src={slide1} className="d-block w-100" alt="Cab 1" />
//           </div>
//           <div className="carousel-item">
//             <img src={slide2} className="d-block w-100" alt="Cab 2" />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container my-4">
//         <div className="row">
//           {/* Form Section */}
//           <div className="col-md-6">
//             <div className="card p-4">
//               <h3>Book a Ride</h3>
//               <form>
//                  {/* Pickup Location Input */}
//                 <div className="mb-3">
//                   <label className="form-label">Pickup Location</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={pickupLocation}
//                     placeholder="Enter pickup location"
//                     onChange={(e) => {
//                       setPickupLocation(e.target.value);
//                       handleLocationChange(e, true);
//                     }}
//                   />
//                   {/* Pickup Suggestions Dropdown */}
//                 {pickupSuggestions.length > 0 && (
//                   <ul className="list-group position-absolute z-3 bg-white w-100">
//                     {pickupSuggestions.map((suggestion, index) => (
//                       <li
//                         key={index}
//                         className="list-group-item list-group-item-action"
//                         onClick={() => handleSuggestionClick(suggestion, true)}
//                       >
//                         {suggestion}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 </div>

//                 {/* Dropoff Location Input */}
//                 <div className="mb-3">
//                   <label className="form-label">Dropoff Location</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={dropoffLocation}
//                     placeholder="Enter dropoff location"
//                     onChange={(e) => {
//                       setDropoffLocation(e.target.value);
//                       handleLocationChange(e, false);
//                     }}
//                   />
//                   {/* Dropoff Suggestions Dropdown */}
//                 {dropoffSuggestions.length > 0 && (
//                   <ul className="list-group position-absolute z-3 bg-white w-100">
//                     {dropoffSuggestions.map((suggestion, index) => (
//                       <li
//                         key={index}
//                         className="list-group-item list-group-item-action"
//                         onClick={() => handleSuggestionClick(suggestion, false)}
//                       >
//                         {suggestion}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 </div>
//                 <button type="submit" className="btn btn-primary">Book Ride</button>
//               </form>
//             </div>
//           </div>

//           {/* Map Section */}
//           <div className="col-md-6">
//             {pickupCoords && (
//               <MapContainer center={pickupCoords} zoom={13} style={{ height: '400px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {pickupCoords && <Marker position={pickupCoords} icon={customIcon}><Popup>Pickup Location</Popup></Marker>}
//                 {dropoffCoords && <Marker position={dropoffCoords} icon={customIcon}><Popup>Dropoff Location</Popup></Marker>}
//                 <MapUpdater coords={pickupCoords} />
//                 {pickupCoords && dropoffCoords && <Routing pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />}
//               </MapContainer>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
