import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

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

      if (response.data?.message === 'Login successful!') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userId', response.data.userId);

        // Show success toast
        toast.success('Login successful! Redirecting...');
        
        // Navigate after short delay
        setTimeout(() => {
          if (response.data?.role === 'Admin') navigate('/admin/dashboard');
          else if (response.data?.role === 'Driver') navigate('/driver/dashboard');
          else if (response.data?.role === 'Customer') navigate('/customer/dashboard');
        }, 1500);
      } else {
        // Handle unexpected successful response without proper data
        setErrorMessage('Login failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const serverMessage = error.response?.data?.message;
      
      if (serverMessage) {
        setErrorMessage(serverMessage);
        toast.error(serverMessage);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
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

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Logging in...
                </>
              ) : 'Login'}
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