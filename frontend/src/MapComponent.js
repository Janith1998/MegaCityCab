// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "leaflet-routing-machine"; // Import Leaflet Routing Machine

// const MapComponent = ({ pickupCoords, dropoffCoords, onLocationSelect }) => {
//   const [position, setPosition] = useState(pickupCoords); // Default to pickup location
//   const [route, setRoute] = useState(null); // Store the route

//   useEffect(() => {
//     if (pickupCoords && dropoffCoords) {
//       // If we have both pickup and dropoff coordinates, calculate the route
//       const map = L.map("map").setView(pickupCoords, 13); // Initialize map centered at pickup

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

//       // Add markers for pickup and dropoff locations
//       L.marker(pickupCoords).addTo(map).bindPopup("Pickup Location").openPopup();
//       L.marker(dropoffCoords).addTo(map).bindPopup("Dropoff Location").openPopup();

//       // Calculate route using Leaflet Routing Machine
//       const routeControl = L.Routing.control({
//         waypoints: [
//           L.latLng(pickupCoords),
//           L.latLng(dropoffCoords)
//         ],
//         createMarker: () => null // Hide markers for the route points
//       }).addTo(map);

//       // Set route state to the route control
//       setRoute(routeControl);
//     }
//   }, [pickupCoords, dropoffCoords]);

//   const LocationMarker = () => {
//     useMapEvents({
//       click(e) {
//         setPosition([e.latlng.lat, e.latlng.lng]);
//         onLocationSelect([e.latlng.lat, e.latlng.lng]); // Pass selected location to parent
//       },
//     });

//     return position === null ? null : (
//       <Marker position={position}>
//         <Popup>Selected Location</Popup>
//       </Marker>
//     );
//   };

//   return (
//     <MapContainer center={position} zoom={13} className="leaflet-container" id="map">
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <LocationMarker />
//     </MapContainer>
//   );
// };

// export default MapComponent;


