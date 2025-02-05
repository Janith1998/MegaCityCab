import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ViewDriver = ({ show, onHide, driver }) => {
  if (!driver) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Driver Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {driver.userImage ? (
            <img
              src={`data:image/jpeg;base64,${driver.userImage}`}
              alt="Driver"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          ) : (
            <p>No Profile Image Available</p>
          )}
        </div>

        <p><strong>Name:</strong> {driver.name}</p>
        <p><strong>Email:</strong> {driver.email}</p>
        <p><strong>NIC:</strong> {driver.nicNumber}</p>
        <p><strong>Contact Number:</strong> {driver.contactNumber}</p>
        <p><strong>Contact Number 2:</strong> {driver.contactNumber2 || 'N/A'}</p>

        <h5 className="mt-3">NIC Images</h5>
    <div className="d-flex justify-content-center">
        {driver.nicImages && driver.nicImages.length > 0 ? (
        driver.nicImages.map((nicImage, index) => (
        <img
        key={index}
        src={`data:image/jpeg;base64,${nicImage}`} // FIXED: Use nicImage directly
        alt={`NIC ${index}`}
        style={{ width: '150px', height: '100px', marginRight: '10px', border: '1px solid #ddd' }}
      />
    ))
  ) : (
    <p>No NIC Images Available</p>
  )}
</div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDriver;
