import React, { useState } from 'react';
import axios from 'axios';

function ManageCars() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [carImage, setCarImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  // Convert image to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCarImage(reader.result.split(',')[1]); // Remove the prefix (data:image/png;base64,)
        setPreview(URL.createObjectURL(file));
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carData = {
      brand,
      model,
      licensePlate,
      image: carImage, // Sending Base64-encoded image
    };

    try {
      const response = await axios.post('http://localhost:8080/cars/add', carData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setMessage('Car added successfully!');
        setBrand('');
        setModel('');
        setLicensePlate('');
        setCarImage(null);
        setPreview(null);
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
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">Car Brand</label>
          <input type="text" className="form-control" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="model" className="form-label">Car Model</label>
          <input type="text" className="form-control" id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="licensePlate" className="form-label">License Plate</label>
          <input type="text" className="form-control" id="licensePlate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="carImage" className="form-label">Upload Car Image (Optional)</label>
          <input type="file" className="form-control" id="carImage" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className="image-preview mt-3 p-2 border rounded" style={{ width: '150px', height: '100px', overflow: 'hidden' }}>
              <img src={preview} alt="Car Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Add Car</button>
      </form>
    </div>
  );
}

export default ManageCars;

