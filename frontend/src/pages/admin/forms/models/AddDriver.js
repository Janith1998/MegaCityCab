import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AddDriver = ({ show, onHide, refreshDrivers }) => {
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    contactNumber: '',
    contactNumber2: '',
    nicNumber: '',
    nicImages: [],
    userImage: null, // Store Driver Image
    password: ''
  });

  // Handle changes to the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  // Handle NIC image change (multiple images)
  const handleNicImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewDriver({ ...newDriver, nicImages: files });
  };

  // Handle Driver image change
  const handleDriverImageChange = (e) => {
    const file = e.target.files[0];
    setNewDriver({ ...newDriver, userImage: file });
  };

  // Handle form submission to add a new driver
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newDriver.name);
    formData.append('email', newDriver.email);
    formData.append('contactNumber', newDriver.contactNumber);
    formData.append('contactNumber2', newDriver.contactNumber2);
    formData.append('nicNumber', newDriver.nicNumber);
    formData.append('password', newDriver.password);

    // Append the NIC images
    if (newDriver.nicImages.length > 0) {
      newDriver.nicImages.forEach((file) => {
        formData.append('nicImages', file); // Add NIC images
      });
    }

    // Append the Driver image
    if (newDriver.userImage) {
      formData.append('userImage', newDriver.userImage); // Add Driver image
    }

      // Log the data before sending
  console.log('Form Data to be saved:', {
    name: newDriver.name,
    email: newDriver.email,
    contactNumber: newDriver.contactNumber,
    contactNumber2: newDriver.contactNumber2,
    nicNumber: newDriver.nicNumber,
    nicImages: newDriver.nicImages,
    userImage: newDriver.userImage,
    password: newDriver.password
  });

    try {
      // Post the new driver data to the backend
      await axios.post('http://localhost:8080/users/drivers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh the drivers list
      refreshDrivers();

      // Close the modal
      onHide();

      // Reset form fields
      setNewDriver({
        name: '',
        email: '',
        contactNumber: '',
        contactNumber2: '',
        nicNumber: '',
        nicImages: [],
        userImage: null,
        password: ''
      });
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  // Render the NIC image previews in a row
  const renderNicImagesPreview = () => {
    return newDriver.nicImages.map((image, index) => (
      <div key={index} style={{ marginRight: '10px' }}>
        <img
          src={URL.createObjectURL(image)}
          alt={`NIC Preview ${index}`}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
      </div>
    ));
  };

  // Render the Driver image preview
  const renderDriverImagePreview = () => {
    if (newDriver.userImage) {
      return (
        <div style={{ marginTop: '10px' }}>
          <img
            src={URL.createObjectURL(newDriver.userImage)}
            alt="Driver Preview"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter driver's name"
              value={newDriver.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter driver's email"
              value={newDriver.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contactNumber"
              placeholder="Enter contact number"
              value={newDriver.contactNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formContactNumber2">
            <Form.Label>Contact Number 2</Form.Label>
            <Form.Control
              type="text"
              name="contactNumber2"
              placeholder="Enter contact number 2"
              value={newDriver.contactNumber2}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formNicNumber">
            <Form.Label>NIC Number</Form.Label>
            <Form.Control
              type="text"
              name="nicNumber"
              placeholder="Enter NIC number"
              value={newDriver.nicNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* NIC Images Upload */}
          <Form.Group controlId="formNicImages">
            <Form.Label>Upload NIC Images (Multiple)</Form.Label>
            <Form.Control
              type="file"
              name="nicImages"
              onChange={handleNicImagesChange}
              accept="image/*"
              multiple
              required
            />
          </Form.Group>

          {/* Preview selected NIC images */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {renderNicImagesPreview()}
          </div>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={newDriver.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Driver Image Upload */}
          <Form.Group controlId="formDriverImage">
            <Form.Label>Upload Driver Image</Form.Label>
            <Form.Control
              type="file"
              name="driverImage"
              onChange={handleDriverImageChange}
              accept="image/*"
              required
            />
          </Form.Group>

          {/* Preview Driver Image */}
          {renderDriverImagePreview()}

          <Button variant="primary" type="submit" className="mt-3">
            Save Driver
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDriver;





