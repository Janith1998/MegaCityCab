import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const handleAvatarClick = () => {
    // Navigate to the user's dashboard based on their role
    if (userRole === 'Admin') navigate('/admin/dashboard');
    else if (userRole === 'Driver') navigate('/driver/dashboard');
    else if (userRole === 'Customer') navigate('/customer/dashboard');
  };

  return (
    <nav className="mcc-navbar">
      <div className="mcc-navbar-container">
        {/* Brand Logo and Name */}
        <a className="mcc-navbar-brand" href="#">
          <img src={logo} alt="Mega City Cab Logo" className="mcc-logo" />
          <span className="mcc-brand-name">Mega City Cab</span>
        </a>

        {/* Middle Links: Home, About, Services */}
        <div className="mcc-navbar-middle">
          <ul className="mcc-navbar-nav-middle">
            <li className="mcc-nav-item">
              <a className="mcc-nav-link" href="#">
                Home
              </a>
            </li>
            <li className="mcc-nav-item">
              <a className="mcc-nav-link" href="#">
                About
              </a>
            </li>
            <li className="mcc-nav-item">
              <a className="mcc-nav-link" href="#">
                Services
              </a>
            </li>
          </ul>
        </div>

        {/* Right-side Links: Avatar or Sign In/Sign Up */}
        <div className="mcc-navbar-links">
          <ul className="mcc-navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="mcc-nav-item">
                  <div className="mcc-nav-link mcc-user-avatar" onClick={handleAvatarClick}>
                    <img
                      src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png"
                      alt="Avatar"
                      className="mcc-avatar-img"
                    />
                    <span className="mcc-username">Welcome, {userName}</span>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="mcc-nav-item">
                  <button className="mcc-nav-link mcc-btn-signin" onClick={() => navigate('/LoginPage')}>
                    Sign In
                  </button>
                </li>
                <li className="mcc-nav-item">
                  <button className="mcc-nav-link mcc-btn-signup" onClick={() => navigate('/register')}>
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;