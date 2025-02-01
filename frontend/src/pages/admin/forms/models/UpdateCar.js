import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";


function UpdateCar({ show, handleClose, car }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [carImage, setCarImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (car) {
      setBrand(car.brand);
      setModel(car.model);
      setLicensePlate(car.licensePlate);
      if (car.image) {
        setPreview(`data:image/png;base64,${car.image}`);
      }
    }
  }, [car]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCarImage(reader.result.split(",")[1]);
        setPreview(URL.createObjectURL(file));
      };
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedCar = {
      brand,
      model,
      licensePlate,
      image: carImage || car.image, // Retain old image if no new one is uploaded
    };
    try {
      await axios.put(`http://localhost:8080/cars/${car.id}`, updatedCar, {
        headers: { "Content-Type": "application/json" },
      });
      handleClose();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Car</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>License Plate</Form.Label>
            <Form.Control type="text" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Car Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" width={100} className="mt-2" />}
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Car
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateCar;
