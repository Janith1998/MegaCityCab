import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    nicNumber: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("contactNumber", formData.contactNumber);
      formDataObj.append("nicNumber", formData.nicNumber);
      formDataObj.append("password", formData.password);
  
      const response = await axios.post(
        "http://localhost:8080/users/customers",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure it's sent as form data
          },
        }
      );
      console.log("Registration successful", response.data);
      navigate("/LoginPage"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">NIC Number</label>
            <input type="text" className="form-control" name="nicNumber" value={formData.nicNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
