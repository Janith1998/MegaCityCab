import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Login.css'; // Add this if you want to style the loader

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoader, setShowLoader] = useState(false); // Track loader state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true); // Show loader when the form is submitted

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/login',
        `email=${email}&password=${password}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log(response.data);
      if (response.data?.message === 'Login successful!') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', response.data.name);

        // Simulate a delay for the loader before navigating
        setTimeout(() => {
          if (response.data?.role === 'Admin') navigate('/admin/dashboard');
          else if (response.data?.role === 'Driver') navigate('/driver/dashboard');
          else if (response.data?.role === 'Customer') navigate('/customer/dashboard');
        }, 2000); // 2 seconds loader duration
      }
    } catch (error) {
      setShowLoader(false); // Hide loader on error
      setErrorMessage(error.response ? 'Invalid email or password.' : 'An error occurred. Please try again later.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Loader */}
      {showLoader && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <Card className="shadow-lg p-4" style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Mega City Cab Login</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={showLoader}>
              {showLoader ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Button variant="link" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;