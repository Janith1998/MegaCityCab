// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();  // This hook provides the navigate function

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Sending a POST request with form data
//       const response = await axios.post('http://localhost:8080/auth/login', 
//         `email=${email}&password=${password}`, 
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded', // Set correct content type
//           },
//         }
//       );

//       // Handle the successful login response
//       console.log(response.data);
//       console.log(response.data.role); 
     

//       // Assuming the response contains a success message and role
//       if (response.data?.message === 'Login successful!') {
//         // Check the role of the user and navigate accordingly
//         if (response.data?.role === 'Admin') {
//           navigate('/admin/dashboard');
//         } else if (response.data?.role === 'Driver') {
//           navigate('/driver/dashboard');
//         } else if (response.data?.role === 'Customer') {
//           navigate('/customer/dashboard');
//         }
//       }
//     } catch (error) {
//       // Handle any error from the backend
//       if (error.response) {
//         setErrorMessage('Invalid email or password.');
//       } else {
//         setErrorMessage('An error occurred. Please try again later.');
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login to Mega City Cab</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             type="text"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {errorMessage && <div className="error">{errorMessage}</div>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', 
        `email=${email}&password=${password}`, 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      console.log(response.data);
      if (response.data?.message === 'Login successful!') {
        if (response.data?.role === 'Admin') navigate('/admin/dashboard');
        else if (response.data?.role === 'Driver') navigate('/driver/dashboard');
        else if (response.data?.role === 'Customer') navigate('/customer/dashboard');
      }
    } catch (error) {
      setErrorMessage(error.response ? 'Invalid email or password.' : 'An error occurred. Please try again later.');
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

            <Button variant="primary" type="submit" className="w-100">Login</Button>
          </Form>
          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Button variant="link" onClick={() => navigate('/register')}>Register here</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
