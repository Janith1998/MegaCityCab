// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const ViewDriver = ({ show, onHide, driver }) => {
//   if (!driver) return null;

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Driver Details</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="text-center">
//           {driver.userImage ? (
//             <img
//               src={`data:image/jpeg;base64,${driver.userImage}`}
//               alt="Driver"
//               style={{ width: '100px', height: '100px', borderRadius: '50%' }}
//             />
//           ) : (
//             <p>No Profile Image Available</p>
//           )}
//         </div>

//         <p><strong>Name:</strong> {driver.name}</p>
//         <p><strong>Email:</strong> {driver.email}</p>
//         <p><strong>NIC:</strong> {driver.nicNumber}</p>
//         <p><strong>Contact Number:</strong> {driver.contactNumber}</p>
//         <p><strong>Contact Number 2:</strong> {driver.contactNumber2 || 'N/A'}</p>
//         <p><strong>Assigned Car :</strong> {driver.assignedCarLicensePlate}</p>

//         <h5 className="mt-3">License Images</h5>
//     <div className="d-flex justify-content-center">
//         {driver.nicImages && driver.nicImages.length > 0 ? (
//         driver.nicImages.map((nicImage, index) => (
//         <img
//         key={index}
//         src={`data:image/jpeg;base64,${nicImage}`} // FIXED: Use nicImage directly
//         alt={`NIC ${index}`}
//         style={{ width: '150px', height: '100px', marginRight: '10px', border: '1px solid #ddd' }}
//       />
//     ))
//   ) : (
//     <p>No NIC Images Available</p>
//   )}
// </div>

//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ViewDriver;




import React from "react";
import { Modal, Button } from "react-bootstrap";

const ViewDriver = ({ show, onHide, driver }) => {
  if (!driver) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-dark">Driver Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Profile Section */}
        <div className="d-flex flex-column align-items-center">
          {driver.userImage ? (
            <img
              src={`data:image/jpeg;base64,${driver.userImage}`}
              alt="Driver"
              className="rounded-circle shadow-lg"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "4px solid #007bff",
              }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center bg-light border rounded-circle"
              style={{ width: "120px", height: "120px" }}
            >
              <p className="text-muted">No Profile Image</p>
            </div>
          )}
          <h5 className="mt-3 fw-semibold">{driver.name}</h5>
          <p className="text-muted mb-2">{driver.email}</p>
        </div>

        {/* Driver Details */}
        <div className="bg-light p-3 rounded shadow-sm mt-4">
          <p className="mb-2">
            <strong className="text-primary">NIC:</strong> {driver.nicNumber}
          </p>
          <p className="mb-2">
            <strong className="text-primary">Contact 1:</strong>{" "}
            {driver.contactNumber}
          </p>
          <p className="mb-2">
            <strong className="text-primary">Contact 2:</strong>{" "}
            {driver.contactNumber2 || "N/A"}
          </p>
          <p className="mb-2">
            <strong className="text-primary">Assigned Car:</strong>{" "}
            {driver.assignedCarLicensePlate || "Not Assigned"}
          </p>
        </div>

        {/* License Images */}
        <h5 className="text-center text-secondary mt-4 mb-3">License Images</h5>
        <div className="d-flex flex-wrap justify-content-center">
          {driver.nicImages && driver.nicImages.length > 0 ? (
            driver.nicImages.map((nicImage, index) => (
              <div
                key={index}
                className="p-2 bg-white rounded shadow-sm m-2"
                style={{
                  width: "150px",
                  height: "100px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #ddd",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${nicImage}`}
                  alt={`NIC ${index}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No NIC Images Available</p>
          )}
        </div>
      </Modal.Body>
      
      {/* Footer */}
      <Modal.Footer className="border-0 d-flex justify-content-center">
        <Button
          variant="outline-dark"
          onClick={onHide}
          className="px-4 py-2 shadow-sm"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDriver;
