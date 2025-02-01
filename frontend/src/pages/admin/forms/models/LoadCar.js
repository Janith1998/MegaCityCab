import React from "react";
import { Modal, Button } from "react-bootstrap";

function LoadCar({ show, handleClose, car }) {
  if (!car) return null; // Prevent rendering if no car is selected

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Car Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Brand:</strong> {car.brand}</p>
        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>License Plate:</strong> {car.licensePlate}</p>
        <p><strong>Availability:</strong> {car.available ? "Available" : "Not Available"}</p>
        {car.image && (
          <div>
            <p><strong>Image:</strong></p>
            <img src={`data:image/png;base64,${car.image}`} alt="Car" style={{ width: "100%", borderRadius: "8px" }} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoadCar;
