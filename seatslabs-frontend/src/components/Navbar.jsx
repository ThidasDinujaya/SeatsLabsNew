import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🔧</span>
          <span className="logo-text">SeatsLabs</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/booking"
              className={`navbar-link ${isActive('/booking') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Book Now
            </Link>
          </li>
          {user && (user.role === 'Manager' || user.role === 'Admin') && (
            <li>
              <Link
                to="/reports"
                className={`navbar-link ${isActive('/reports') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Reports
              </Link>
            </li>
          )}
          {user && user.role !== 'Customer' && (
            <li>
              <Link
                to="/admin"
                className={`navbar-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            </li>
          )}

          {user && user.role === 'Customer' && (
            <>
              <li>
                <Link
                  to="/my-bookings"
                  className={`navbar-link ${isActive('/my-bookings') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/my-vehicles"
                  className={`navbar-link ${isActive('/my-vehicles') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  My Vehicles
                </Link>
              </li>
            </>
          )}

          {user ? (
            <li>
              <button onClick={handleLogoutClick} className="navbar-link logout-btn">
                Logout ({user.name?.split(' ')[0] || user.firstName || 'User'} • {user.role || user.userType || 'User'})
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={`navbar-link login-link ${isActive('/login') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
