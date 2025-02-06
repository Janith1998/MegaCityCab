import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function UpdateDriver({ show, handleClose, driver }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [password, setPassword] = useState(""); // New password field (optional)
  const [driverImage, setDriverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [nicImages, setNicImages] = useState([]); // New NIC images state
  const [nicImagePreviews, setNicImagePreviews] = useState([]); // NIC image previews

  useEffect(() => {
    if (driver) {
      setName(driver.name);
      setEmail(driver.email);
      setContactNumber(driver.contactNumber);
      setNicNumber(driver.nicNumber);

      // Load existing driver image preview
      if (driver.userImage) {
        setPreview(`data:image/png;base64,${driver.userImage}`);
      }

      // Load existing NIC images previews if available
      if (driver.nicImages && driver.nicImages.length > 0) {
        setNicImagePreviews(driver.nicImages.map(img => `data:image/png;base64,${img}`));
      }
    }
  }, [driver]);

  // Handle Driver Image Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDriverImage(file); // Set the File object, not the base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(URL.createObjectURL(file));
      };
    }
  };
  

  // Handle NIC Images Change
  const handleNicImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNicImages(files);

    // Generate preview URLs for newly uploaded images
    setNicImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (
      name === driver.name &&
      email === driver.email &&
      contactNumber === driver.contactNumber &&
      nicNumber === driver.nicNumber &&
      password === "" && 
      driverImage === null && 
      nicImages.length === 0 
    ) {
      console.log("No changes detected, not submitting.");
      return; 
    }
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contactNumber", contactNumber);
    formData.append("nicNumber", nicNumber);
    
    if (password) {
      formData.append("password", password); 
    }
  
    // Always append existing driver image if no new image is provided
    if (driverImage) {
      formData.append("userImage", driverImage); 
    } else if (driver.userImage) {
      formData.append("userImage", driver.userImage); 
    }
  
    // Always append existing NIC images if no new NIC images are provided
    if (nicImages.length > 0) {
      nicImages.forEach((file) => {
        formData.append("nicImages", file);   
      });
    } else if (driver.nicImages && driver.nicImages.length > 0) {
      driver.nicImages.forEach((img) => {
        formData.append("nicImages", img);
      });
    }
  
    // Log the form data before sending it
    console.log("Sending data to backend:");
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Contact Number: ", contactNumber);
    console.log("NIC Number: ", nicNumber);
    console.log("Password: ", password ? "Provided" : "Not provided");
    console.log("Driver Image: ", driverImage ? "Provided" : "Not provided");
    console.log("NIC Images: ", nicImages.length ? `${nicImages.length} images` : "No NIC images");
    
    try {
      await axios.put(`http://localhost:8080/users/${driver.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleClose();
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };
  
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>NIC Number</Form.Label>
            <Form.Control type="text" value={nicNumber} onChange={(e) => setNicNumber(e.target.value)} required />
          </Form.Group>

          {/* New Password Field */}
          <Form.Group className="mb-3">
            <Form.Label>New Password (Leave blank if unchanged)</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          {/* NIC Images Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Upload NIC Images (Multiple)</Form.Label>
            <Form.Control type="file" accept="image/*" multiple onChange={handleNicImagesChange} />
          </Form.Group>

          {/* Preview Existing NIC Images */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {nicImagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`NIC Preview ${index}`} width={100} />
            ))}
          </div>

          {/* Driver Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Driver Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>

          {/* Preview Existing/New Driver Image */}
          {preview && <img src={preview} alt="Driver Preview" width={100} className="mt-2" />}

          <Button variant="primary" type="submit">
            Update Driver
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateDriver;

