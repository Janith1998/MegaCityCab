import React, { useState } from 'react';
import axios from 'axios';

function ManageCars() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [message, setMessage] = useState('');  // To display success or error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a car object with form data
    const carData = {
      brand,
      model,
      licensePlate,  // Map registration number to licensePlate
      driverId,
    };

    try {
      // Send the car data to the backend API using axios
      const response = await axios.post('http://localhost:8080/cars/add', carData);

      if (response.status === 200) {
        setMessage('Car added successfully!');
        // Clear form after successful submission
        setBrand('');
        setModel('');
        setLicensePlate('');
        setDriverId('');
      } else {
        setMessage('Failed to add car. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while adding the car.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Manage Cars</h3>
      {/* Display success or error message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">Car Brand</label>
          <input
            type="text"
            className="form-control"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="model" className="form-label">Car Model</label>
          <input
            type="text"
            className="form-control"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="licensePlate" className="form-label">LicensePlate</label>
          <input
            type="text"
            className="form-control"
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="driverId" className="form-label">Driver ID</label>
          <input
            type="text"
            className="form-control"
            id="driverId"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Car</button>
      </form>

      
    </div>
  );
}

export default ManageCars;
