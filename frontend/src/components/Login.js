import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // This hook provides the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending a POST request with form data
      const response = await axios.post('http://localhost:8080/auth/login', 
        `email=${email}&password=${password}`, 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Set correct content type
          },
        }
      );

      // Handle the successful login response
      console.log(response.data);
      console.log(response.data.role); 
     

      // Assuming the response contains a success message and role
      if (response.data?.message === 'Login successful!') {
        // Check the role of the user and navigate accordingly
        if (response.data?.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (response.data?.role === 'Driver') {
          navigate('/driver/dashboard');
        } else if (response.data?.role === 'Customer') {
          navigate('/customer/dashboard');
        }
      }
    } catch (error) {
      // Handle any error from the backend
      if (error.response) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Mega City Cab</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;


